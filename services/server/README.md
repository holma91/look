### Start app, step by step

1. `docker compose up -d --build`
2. `docker compose exec web aerich init -t app.db.TORTOISE_ORM`
3. `docker compose exec web aerich init-db`

### Poetry

add a dep: `poetry add <package name>`
add a dev dep: `poetry add [--dev] <package name>`

run command inside the virtual environment: `poetry run <command>`
to activate the virtual environment: `poetry shell`, to exit: `exit`

### Docker

Connect to database: `docker compose exec web-db psql -U postgres`
Build containers: `docker compose up -d --build`
Bring down containers and volumes: `docker compose down -v`

### Tortoise

using tortoise with raw sql: https://stackoverflow.com/questions/69401708/how-do-i-execute-native-sql-with-tortoise-orm

### Aerich

https://tortoise.github.io/migration.html#quick-start
init aerich: `docker compose exec web aerich init -t app.db.TORTOISE_ORM`
init database with aerich: `docker compose exec web aerich init-db`
upgrade: `docker compose exec web aerich upgrade`

### HTTPie

http --json POST http://localhost:8004/summaries/ url=http://testdriven.io

## API Design

/users, /users/id, /users/id/favorites, users/id/likes,

## Tests

```zsh
docker-compose exec web python -m pytest
docker-compose exec web python -m pytest path/to/test_file.py::test_function_name

```

```zsh
docker-compose exec web python -m pytest tests/test_products.py::test_get_products_match
```
