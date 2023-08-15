## Establishing Connectivity - the Engine

The engine object acts as a central source of connections to a particular db. Provides both a "factory" and a "holding space" for the connection pool. When using the ORM, the Engine is managed by another object called the Session.

## Working with Transactions and the DBAPI

The Session is the ORMs facade for the Engine's primary interactive endpoints, the Connection and Result. We can get a Connection by doing `engine.connect() as conn` and then a Result by doing `conn.execute()`. It's recommended that the Result object is dealed within the connect block scope. If we use `engine.begin()` instead of `engine.connect()`, we'll get autocommitting queries.

Result is an iterable object of result rows. We can iterate over the rows, use result.all() etc. The Row objects themselves are intended to act like Python named tuples.

Use the following syntax to send parameters to a query:
`result = conn.execute(text("SELECT x, y FROM some_table WHERE y > :y"), {"y": 2})`.

For statements such as “INSERT”, “UPDATE” and “DELETE”, we can send multiple parameter sets to the Connection.execute method.

When using the ORM, Session.execute() behaves similarily to Connection.execute(). The Session doesn’t actually hold onto the Connection object after it ends a transaction. It gets a new Connection from the Engine the next time it needs to execute SQL against the database.

## Working with Database Metadata

The central element of sqlalchemy is the SQL expression language which allows for construction of SQL queries. The foundation for these queries are python objects that represents database concepts like tables and columns. These object are known as **database metadata**.

The **MetaData object** is a facade around a python dict that stores a series of Table objects keyed to their string name. Usually an application has a single MetaData object. When the metadata object has a serie of tables, we can use `metadata_obj.create_all(engine)` to execute CREATE TABLE queries for all the tables. A schema management tool like alembic should probably be used instead for real applications.

When using the ORM we don't use the Table object directly, we instead use a Table declaration process referred towards as **Declarative Table**. This process give us ORM mapped classes.

The **Declarative Base** refers to a metadata collection, but also to a collection called **registry**, which is the central “mapper configuration” unit in the SQLAlchemy ORM. ORM mapped classes will coordinate with each other via this registry.

Using Column objects and declarative_base is the 1.4 way of doing things. The 2.0 way is using DeclarativeBase and mapped columns, like this for example:

```py
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class User(DeclarativeBase):
    __tablename__ = "user_account"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    fullname: Mapped[Optional[str]]

    addresses: Mapped[List["Address"]] = relationship(back_populates="user")
```

The reason for these new constructs is first and foremost to integrate smoothly with PEP 484 tools, including IDEs such as VSCode and type checkers such as Mypy and Pyright. How to go from the old way to the new way: https://docs.sqlalchemy.org/en/20/changelog/whatsnew_20.html#whatsnew-20-orm-declarative-typing.

## Working with Data

We can create statements and compile them like this:

```py
from sqlalchemy import insert
stmt = insert(user_table).values(name="spongebob", fullname="Spongebob Squarepants")
```

The stmt variable is now an object that represents a sql statement, that we can execute whenever we want. A two-column INSERT statement with list a of parameters at once:

```py
with engine.connect() as conn:
    result = conn.execute(
        insert(user_table),
        [
            {"name": "sandy", "fullname": "Sandy Cheeks"},
            {"name": "patrick", "fullname": "Patrick Star"},
        ],
    )
    conn.commit()
```

Select statements with session:

```py
# stmt = select(user_table).where(user_table.c.name == "spongebob") w/ engine
stmt = select(User).where(User.name == "spongebob")
with Session(engine) as session:
    for row in session.execute(stmt):
        print(row)
```

While the SQL generated in these examples looks the same whether we invoke select(user_table) or select(User), in the more general case they do not necessarily render the same thing, as an ORM-mapped class may be mapped to other kinds of “selectables” besides tables. The select() that’s against an ORM entity also indicates that ORM-mapped instances should be returned in a result, which is not the case when SELECTing from a Table object.

some ways to do joins:

```py
print(
    select(user_table.c.name, address_table.c.email_address).join_from(
        user_table, address_table
    )
)
print(select(address_table.c.email_address).select_from(user_table).join(address_table))
print(
    select(address_table.c.email_address)
    .select_from(user_table)
    .join(address_table, user_table.c.id == address_table.c.user_id)
)
```

When using the ORM, we take advantage of the relationship() construct when doing joins.

## Data Manipulation with the ORM

The Session object is responsible for constructing Insert constructs and emitting them as INSERT statements within the ongoing transaction. The way we instruct the Session to do so is by adding object entries to it; the Session then makes sure these new entries will be emitted to the database when they are needed, using a process known as a flush. The overall process used by the Session to persist objects is known as the unit of work pattern.

When creating an object like this `squidward = User(name="squidward", fullname="Squidward Tentacles")`, the object is said to be in "transient state", it's not yet associated with a database state nor a Session object. After doing `session.add(squidward)`, the object is in the "pending state". We can view the pending objects by calling `session.new`. We can then use `session.flush()` to insert the pending objects (we should most often use autoflush though).

If we load an object into memory and changes something on it, it will get put into the session.dirty set. When the Session next emits a flush, an UPDATE will be emitted that updates this value in the database. A flush occurs automatically before we emit any SELECT, using a behavior known as autoflush.

An individual ORM object may be marked for deletion within the unit of work process by using the Session.delete() method. For stuff like large bulk inserts, we don't need this whole thing with ORM-persisted objects, so we can just use ORM-enabled statements instead (looks similar to if we would use Core directly).

## Working with ORM Related Objects

relationship() defines a linkage between two different mapped classes, or from a mapped class to itself, the latter of which is called a self-referential relationship. E.g:

```py
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "user_account"

    # ... mapped_column() mappings
    addresses: Mapped[List["Address"]] = relationship(back_populates="user")


class Address(Base):
    __tablename__ = "address"

    # ... mapped_column() mappings
    user: Mapped["User"] = relationship(back_populates="addresses")
```

As the Table object representing the address table has a ForeignKeyConstraint which refers to the user_account table, the relationship() can determine unambiguously that there is a one to many relationship from the User class to the Address class.

In the User class, addresses will be lazy loaded. If we don't access the addresses property, I don't think the sql query for getting the addresses will be run?

We will now introduce the behavior of relationship() as it applies to class level behavior of a mapped class, where it serves in several ways to help automate the construction of SQL queries.

The presence of an ORM relationship() on a mapping is not used by Select.join() or Select.join_from() to infer the ON clause if we don’t specify it. This means, if we join from User to Address without an ON clause, it works because of the ForeignKeyConstraint between the two mapped Table objects, not because of the relationship() objects on the User and Address classes: `print(select(Address.email_address).join_from(User, Address))`.

The first step in using ORM lazy loading effectively is to test the application, turn on SQL echoing, and watch the SQL that is emitted. If there seem to be lots of redundant SELECT statements that look very much like they could be rolled into one much more efficiently, if there are loads occurring inappropriately for objects that have been detached from their Session, that’s when to look into using loader strategies. The most prominently used loader strategies are:

- Selectin Load
  Ensures that a particular collection for a full series of objects are loaded up front using a single query. Can be used like this `stmt = select(User).options(selectinload(User.addresses)).order_by(User.id)`, and the query will then get the addresses directly. Does not use joins.

- Joined load
  Augments the SELECT statement that’s being passed to the database with a JOIN (which may be an outer or an inner join depending on options), which can then load in related objects. Is best suited towards loading related many-to-one object. E.g `stmt = select(Address).options(joinedload(Address.user, innerjoin=True))`. joinedload() also works for collections, meaning one-to-many relationships, however it has the effect of multiplying out primary rows per related item in a recursive way that grows the amount of data sent for a result set by orders of magnitude for nested collections and/or larger collections, so its use vs. another option such as selectinload() should be evaluated on a per-case basis. It’s also important to note that many-to-one eager loads are often not necessary, as the “N plus one” problem is much less prevalent in the common case.

- Explicit Join + Eager load
- Raiseload
  This option is used to completely block an application from having the N plus one problem at all by causing what would normally be a lazy load to raise an error instead

### Glossary

**Connection pool**: A standard way to maintain a pool of active database connections in memory which are reused across requests.

**Table reflection**: Refers to the process of generating Table and related objects by reading the current state of a database.

**Unit of work**: An architecture where a persistence system such as an object relational mapper maintains a list of changes made to a series of objects, and periodically flushes all those pending changes out to the database.

**DML**: An acronym for Data Manipulation Language.
