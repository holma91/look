to start:
`uvicorn app.main:app --reload`

### Alembic

to generate a revision: `alembic revision -m "create account table"`

to run a migration:
`alembic upgrade head` or `alembic upgrade <revision>`

to downgrade:
`alembic downgrade base` or `alembic downgrade -1`
