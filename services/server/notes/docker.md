Docker uses containerization, which is a lightweight form of virtualization. A Docker container is similar to a virtual machine, but more efficient because it doesn't include a full operating system. It includes only the application and its dependencies, and it relies on the underlying system's kernel.

### Container Image

A container is run from a container image.

A container image is a static version of all the files, environment variables, and the default command/program that should be present in a container. Static here means that the container image is not running, it's not being executed, it's only the packaged files and metadata.

### Container

The container itself is the actual running instance of the image.

You run multiple containers with different things, like a database in one, a python application in another etc. You connect them together via their internal network.

### Build a docker image for FastAPI

You need to have the package requirements for your application in some file, e.g requirements.txt.

**with poetry**:

## Docker Compose

A tool that is used to define and manage multi-container Docker applications.

## Deploying

After having a Container (Docker) Image there are several ways to deploy it. For example:

- With Docker Compose in a single server
- With a Kubernetes cluster
- With a Docker Swarm Mode cluster
- With another tool like Nomad
- With a cloud service that takes your container image and deploys it
