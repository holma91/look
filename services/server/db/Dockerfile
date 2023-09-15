# pull official base image
FROM postgres:15

# run create.sql on init
ADD 01_create.sql /docker-entrypoint-initdb.d
ADD 02_init_tables.sql /docker-entrypoint-initdb.d
ADD 03_insert.sql /docker-entrypoint-initdb.d