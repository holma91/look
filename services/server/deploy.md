1. a place for the DB
   CloudSQL later, maybe supabase now when testing?
2. a place to run the fastapi container
   Google Cloud Run

### TODO

- play around with cloud run
- check out the stuff at testdriven (set up github ci/cd)

### Notes

In dev, we use docker-compose to spin up two containers, one for the app and one for the db.
In prod, we just spin up the app container, and use a managed DB.
