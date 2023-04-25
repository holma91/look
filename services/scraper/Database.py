from sqlalchemy import create_engine, text


db_urls = {
    "dev": "postgresql://lapuerta@localhost:5432/hasse",
    "prod": "",
}

class Database:
    
    def __init__(self, env: str):
        self.environment = env
        self.engine = create_engine(db_urls[env])

    def add(self, item):
        with self.engine.begin() as conn:
          result = conn.execute(text("SELECT x, y FROM some_table WHERE y > :y"), {"y": 2})
          for row in result:
              print(f"x: {row.x}  y: {row.y}")
        