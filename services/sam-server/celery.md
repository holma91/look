### Task Queues

Task queues are used as a mechanism to distribute work across threads or machines. A task queue’s input is a unit of work called a task. Dedicated worker processes constantly monitor task queues for new work to perform.

# Celery

Celery is an async task queue that is used to manage background work outside the typical request/response cycle.

Celery communicates via messages, usually using a broker to mediate between clients and workers. To initiate a task the client adds a message to the queue, the broker then delivers that message to a worker. The broker could for example be RabbitMQ or Redis.

We should always strive for response time of a particular endpoint to be lower than 500ms. When it starts to take around that time for generating a response, we should look into tools like Celery.

CPU/GPU/whateverPU intensive tasks should often be moved to Celery.

The Celery client is the producer which adds a new task to the queue via the message broker. Celery workers then consume new tasks from the queue, again, via the message broker. Once processed, results are then stored in the result backend.

### Commands

To start a celery worker:
`celery -A main.celery worker --loglevel=info`

To start flower:
`celery -A main.celery flower --port=5555`

### Terminology

**Message broker**:
An intermediary program used as the transport for producing or consuming tasks.

**Result backend**:
Used to store the result of a Celery task.

### Notes

I do not recommend pydantic BaseSettings here because it might cause Celery to raise [ERROR/MainProcess] pidbox command error: KeyError('**signature**') error when we launch Flower.
