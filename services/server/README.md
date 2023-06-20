### Poetry

add a dep: `poetry add <package name>`
add a dev dep: `poetry add [--dev] <package name>`

run command inside the virtual environment: `poetry run <command>`
to activate the virtual environment: `poetry shell`, to exit: `exit`

### Docker

Connect to database: `docker compose exec web-db psql -U postgres`
Build containers: `docker compose up -d --build`
Bring down containers and volumes: `docker compose down -v`

### Aerich

https://tortoise.github.io/migration.html#quick-start
init aerich: `docker compose exec web aerich init -t app.db.TORTOISE_ORM`
init database with aerich: `docker compose exec web aerich init-db`
upgrade: `docker compose exec web aerich upgrade`

### HTTPie

http --json POST http://localhost:8004/summaries/ url=http://testdriven.io
