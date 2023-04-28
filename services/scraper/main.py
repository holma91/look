from sqlalchemy import create_engine, text

from Scraper import Scraper
from Database import Database
from models import Gucci, Hucci
starters = ['gucci', 'tomford', 'moncler', 'loropiana','burberry']

# SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
SQLALCHEMY_DATABASE_URL = "postgresql://lapuerta@localhost:5432/hasse"



def connect_db():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    print("engine:", engine)
    # engine.begin to autocommit
    # executemany style will be helpful
    with engine.connect() as conn:
        result = conn.execute(text("SELECT x, y FROM some_table WHERE y > :y"), {"y": 2})
        for row in result:
            print(f"x: {row.x}  y: {row.y}")

def main():
    scraper = Scraper()
    database = Database("dev")
    model = Hucci(country='us', scraper=scraper, database=database)
    print("model:", model)
    model.start()

if __name__ == '__main__':
    main()