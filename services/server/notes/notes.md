Uvicorn is the web server. FastAPI is the web framework.

### ASGI: Asynchronous Server Gateway Interface

At a very high-level, ASGI is a communication interface between apps and servers. ASGI consists of

- a protocol server
- an application
  lives inside the protocol server

ASGI relies on the following mental model: when the client connects to the server, we instanciate an application. We then feed incoming bytes into the app and send back whatever bytes come out. "Feed into the app" here really means call the app as if it were a function, i.e. something that takes some input, and returns an output.

### Dependency injection

It means that there is a way for your code (in this case, your path operation functions) to declare things that it requires to work and use: "dependencies". FastAPI will then "inject" the dependencies.

The Depends function is a dependency that declares another dependency, get_settings. Put another way, Depends depends on the result of get_settings. The value returned, Settings, is then assigned to the settings parameter.

### Using raw sql

```py
import fastapi import FastAPI
import asyncpg

app = FastAPI()

#Create DB connection
@app.on_event('startup')
async def startup_event():
    app.db = await asyncpg.connect(<your db url>)

@app.on_event('shutdown')
async def shutdown_event():
    await app.db.close()
```

### Syncing clerk and our DB

every time someone signs up -> create user in DB
every time someone removes their account -> remove user in DB

Keep in sync by using Clerk webhooks. This is what the payload looks like for user.created:

```
{
   "object": "event",
   "type": "user.created",
   "data": {
      // user object
  }
}
```
