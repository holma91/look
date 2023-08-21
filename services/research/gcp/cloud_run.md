On Cloud Run, your code can either run continuously as a service or as a job. For our API, we want to it to run as a service. For our machine learning, jobs may be a good fit? Array jobs is when you do many jobs in parallel.

**Request-based pricing vs instance-based**:
If an instance is not processing requests, the CPU is not allocated and you're not charged. Additionally, you pay a per-request fee. You're charged for the entire lifetime of an instance and the CPU is always allocated. There's no per-request fee.

## Cloud Run Services

The service is the main resource of Cloud Run. Each service is located in a specific Google Cloud region. For redundancy and failover, services are automatically replicated across multiple zones in the region they are in. Each service exposes a unique endpoint and automatically scales the underlying infrastructure to handle incoming requests.

## Cloud Run Revisions

Each deployment to a service creates a revision. A revision consists of one or more container images, along with environment settings such as environment variables, memory limits, or concurrency value.
