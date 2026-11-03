# Docker Learning — Node.js Application

A hands-on Docker learning project documenting my journey from Docker fundamentals to containerizing a Node.js application with custom images, containers, bind mounts, volumes, and live reloading using Nodemon.

This project serves as a practical reference for Docker concepts, commands, configurations, and troubleshooting.

## Table of Contents

- [1. Introduction to Docker](#1-introduction-to-docker)
- [2. Understanding Docker Architecture](#2-understanding-docker-architecture)
- [3. Essential Docker Commands](#3-essential-docker-commands)
- [4. Running Your First Container](#4-running-your-first-container)
- [5. Port Mapping](#5-port-mapping)
- [6. Building a Custom Docker Image](#6-building-a-custom-docker-image)
- [7. Dockerfile Explained](#7-dockerfile-explained)
- [8. Docker Image Layers and Build Cache](#8-docker-image-layers-and-build-cache)
- [9. Working with Containers](#9-working-with-containers)
- [10. Docker Volumes and Bind Mounts](#10-docker-volumes-and-bind-mounts)
- [11. Nodemon and Live Reloading](#11-nodemon-and-live-reloading)
- [12. Useful Docker Commands](#12-useful-docker-commands)
- [13. Common Issues and Solutions](#13-common-issues-and-solutions)
- [14. Key Takeaways](#14-key-takeaways)
- [15. What's Next?](#15-whats-next)

---

## 1. Introduction to Docker

Docker is an open-source platform that allows developers to package applications and their dependencies into standardized units called **containers**.

Containers make applications easier to develop, deploy, distribute, and run consistently across different environments.

### Why Docker?

Without Docker, applications can behave differently across development, testing, and production environments because of differences in:

- Operating systems
- Programming language versions
- Installed dependencies
- System configurations
- Environment variables

Docker helps solve these problems by packaging an application and its required dependencies into a consistent environment.

### Important Docker Terminology

| Term             | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| Docker           | Platform for building, distributing, and running containers |
| Docker Engine    | Technology responsible for creating and running containers  |
| Docker Image     | Read-only template used to create containers                |
| Docker Container | Running or stopped instance of an image                     |
| Dockerfile       | Instructions used to build a Docker image                   |
| Docker Hub       | Public registry for storing and distributing Docker images  |
| Docker Registry  | Storage and distribution system for Docker images           |
| Volume           | Docker-managed persistent storage                           |
| Bind Mount       | Connects a host file or directory to a container            |
| Docker Compose   | Tool for defining and running multi-container applications  |

### Image vs Container

A useful analogy:

- **Image = Class**
- **Container = Object (Instance)**

An image is a template. Multiple containers can be created from the same image.

---

## 2. Understanding Docker Architecture

Docker follows a client-server architecture.

The main components are:

1. **Docker Client:** The command-line interface (CLI) through which users interact with Docker.
2. **Docker Daemon:** The background service responsible for managing images, containers, networks, and volumes.
3. **Docker Registry:** Stores and distributes Docker images. Docker Hub is a popular public registry.

### Basic Workflow

1. Execute a Docker command using the Docker CLI.
2. The Docker client communicates with the Docker daemon.
3. The daemon performs the requested operation.
4. If an image is unavailable locally, Docker can pull it from a registry.

---

## 3. Essential Docker Commands

### Checking Docker Installation

```bash
docker --version
docker version
docker info
docker compose version
```

### Working with Images

List locally available images:

```bash
docker images
```

Download an image:

```bash
docker pull nginx
```

Remove an image:

```bash
docker rmi nginx
```

Build a custom image:

```bash
docker build -t my-app .
```

### Working with Containers

List running containers:

```bash
docker ps
```

List all containers, including stopped ones:

```bash
docker ps -a
```

Run a container:

```bash
docker run nginx
```

Run a container in detached mode:

```bash
docker run -d nginx
```

Stop a container:

```bash
docker stop container-name
```

Start an existing stopped container:

```bash
docker start container-name
```

Restart a container:

```bash
docker restart container-name
```

Remove a stopped container:

```bash
docker rm container-name
```

View container logs:

```bash
docker logs container-name
```

Follow container logs continuously:

```bash
docker logs -f container-name
```

### Important Difference: `docker run` vs `docker start`

| Command        | Purpose                              |
| -------------- | ------------------------------------ |
| `docker run`   | Creates and starts a new container   |
| `docker start` | Starts an existing stopped container |

Running `docker run` multiple times creates multiple containers unless a conflicting name prevents it.

---

## 4. Running Your First Container

Run an Nginx container:

```bash
docker run -d --name my-nginx nginx
```

Check whether it is running:

```bash
docker ps
```

View its logs:

```bash
docker logs my-nginx
```

Remove the container:

```bash
docker stop my-nginx
docker rm my-nginx
```

### Detached vs Attached Mode

**Attached mode:**

```bash
docker run nginx
```

The terminal remains attached to the container's main process.

**Detached mode:**

```bash
docker run -d nginx
```

The container runs in the background.

Useful keyboard shortcuts:

| Shortcut                    | Behavior                                                |
| --------------------------- | ------------------------------------------------------- |
| `Ctrl + C`                  | Sends an interrupt to the foreground process            |
| `Ctrl + P`, then `Ctrl + Q` | Detaches from an attached container without stopping it |
| `exit`                      | Exits an interactive shell                              |

Note: `exit` is used when you are inside an interactive shell, not simply when running an attached container process.

---

## 5. Port Mapping

Containers have their own networking environment.

To access an application running inside a container, we generally publish its container port to a port on the host machine.

Syntax:

```bash
docker run -d -p HOST_PORT:CONTAINER_PORT nginx
```

Example:

```bash
docker run -d --name my-nginx -p 8080:80 nginx
```

Here:

- `8080` is the host port.
- `80` is the container port.

Access the application:

```text
http://localhost:8080
```

### Important: Understanding EXPOSE

In a Dockerfile:

```dockerfile
EXPOSE 3000
```

This documents the port the application is expected to use.

**EXPOSE does not publish the port.**

Port publishing is done using `-p`:

```bash
docker run -d -p 3000:3000 my-app
```

### Port Mapping Syntax

```text
-p HOST_PORT:CONTAINER_PORT
```

For example:

```bash
-p 8080:3000
```

Host port `8080` forwards traffic to container port `3000`.

---

## 6. Building a Custom Docker Image

For this project, I created a simple Node.js application using Express.

### Project Structure

```text
new-poject/
│
├── node_modules/
├── Dockerfile
├── .dockerignore
├── package.json
├── package-lock.json
├── index.js
└── README.md
```

### Sample Express Application

`index.js`

```javascript
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from my Dockerized Node.js application!");
});

app.get("/api", (req, res) => {
  res.send("This is the API endpoint");
});

app.listen(3000, "0.0.0.0", () => {
  console.log("App is running on port 3000");
});
```

The application listens on `0.0.0.0` so it can accept connections through the container's network interfaces.

### Building the Image

```bash
docker build -t new-app .
```

Explanation:

- `docker build`: Builds a Docker image.
- `-t new-app`: Assigns the image a name.
- `.`: Uses the current directory as the build context.

### Running the Container

```bash
docker run -d --name my-node-app -p 3000:3000 new-app
```

Access the application:

```text
http://localhost:3000
```

Test the API:

```text
http://localhost:3000/api
```

---

## 7. Dockerfile Explained

A Dockerfile contains instructions for building a Docker image.

Example:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Explanation of Each Instruction

| Instruction | Purpose                                               |
| ----------- | ----------------------------------------------------- |
| `FROM`      | Specifies the base image                              |
| `WORKDIR`   | Sets the working directory inside the container       |
| `COPY`      | Copies files from the build context into the image    |
| `RUN`       | Executes commands during image building               |
| `EXPOSE`    | Documents the application's expected port             |
| `CMD`       | Specifies the default command when a container starts |

### Understanding Each Instruction

**FROM**

```dockerfile
FROM node:22-alpine
```

Uses Node.js version 22 with Alpine Linux as the base image.

Alpine is a lightweight Linux distribution.

**WORKDIR**

```dockerfile
WORKDIR /app
```

Sets `/app` as the working directory.

Subsequent relative paths in Dockerfile instructions are generally resolved from this directory.

**COPY**

```dockerfile
COPY package*.json ./
```

Copies `package.json` and `package-lock.json` into the working directory.

**RUN**

```dockerfile
RUN npm install
```

Installs the project's dependencies during image building.

**CMD**

```dockerfile
CMD ["npm", "start"]
```

Specifies the default command executed when the container starts.

Unlike `RUN`, `CMD` is not executed while building the image.

### .dockerignore

A `.dockerignore` file prevents unnecessary files from being included in the Docker build context.

Example:

```text
node_modules
.git
.env
npm-debug.log
```

This helps reduce the build context and prevents unnecessary or sensitive files from being copied into the image.

---

## 8. Docker Image Layers and Build Cache

Docker images are built using layers.

Many Dockerfile instructions create filesystem layers or contribute to the build cache.

Docker can reuse previously built layers when their instructions and relevant inputs have not changed.

### Efficient Dockerfile Ordering

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
```

Why is this efficient?

Suppose only `index.js` changes.

Docker can reuse the dependency installation layer because `package.json` and `package-lock.json` remain unchanged.

Only the subsequent application source copy needs to be rebuilt.

### Less Efficient Ordering

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "start"]
```

Here, changing any copied application file can invalidate the cache for the later `RUN npm install` instruction.

This can cause dependencies to be installed again unnecessarily.

### Important Concept

**Keep files that change frequently separate from files that change less frequently.**

For Node.js applications:

1. Copy package files.
2. Install dependencies.
3. Copy application source code.

### Observing Build Cache

Build the image:

```bash
docker build -t new-app .
```

Build it again without changing anything:

```bash
docker build -t new-app .
```

Docker should reuse cached layers where possible.

Look for:

```text
CACHED
```

### Important: Rebuilding an Image Does Not Update Existing Containers

If you rebuild an image, an existing container continues using the image and filesystem it was created from.

To use the newly built image, remove and recreate the container.

Example:

```bash
docker stop my-node-app
docker rm my-node-app

docker run -d --name my-node-app -p 3000:3000 new-app
```

---

## 9. Working with Containers

### Executing Commands Inside a Container

Syntax:

```bash
docker exec -it CONTAINER COMMAND
```

Example:

```bash
docker exec -it my-node-app sh
```

This opens an interactive shell inside the container.

Useful commands inside the container:

```bash
pwd
ls
cat index.js
node --version
npm --version
```

Exit the container shell:

```bash
exit
```

### Why `sh` Instead of `bash`?

Our base image is:

```dockerfile
FROM node:22-alpine
```

Alpine-based images are lightweight and generally include `sh`, but not Bash by default.

Therefore:

```bash
docker exec -it my-node-app sh
```

works, while:

```bash
docker exec -it my-node-app bash
```

may fail because Bash is not installed.

### Important: `docker exec` Requires a Running Container

You cannot execute a command inside a stopped container.

Start it first:

```bash
docker start my-node-app
```

Then:

```bash
docker exec -it my-node-app sh
```

---

## 10. Docker Volumes and Bind Mounts

Containers are designed to be replaceable. Data that must survive container removal should be stored separately.

Docker provides two important mechanisms:

1. Bind Mounts
2. Volumes

### 10.1 Bind Mounts

A bind mount connects a directory or file on the host machine to a location inside a container.

Example:

```bash
docker run -d \
  --name my-node-dev \
  -p 3000:3000 \
  -v "${PWD}:/app" \
  new-app
```

On Windows PowerShell, `${PWD}` represents the current working directory.

Here:

- `${PWD}` = project directory on the host machine.
- `/app` = directory inside the container.

Changes made to files in the mounted directory are reflected inside the container.

Similarly, changes made inside that mounted directory can be reflected on the host.

### Why Use Bind Mounts?

Bind mounts are especially useful during development.

For example:

- Modify `index.js` on Windows.
- The container sees the updated file.
- No image rebuild is needed just to synchronize source code.

### 10.2 Named Volumes

A named volume is managed by Docker and exists independently of a container.

Example:

```bash
docker volume create mysql_data
```

Run a MySQL container:

```bash
docker run -d \
  --name my-mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0
```

Here:

- `mysql_data` = Docker named volume.
- `/var/lib/mysql` = directory inside the container where MySQL stores its database files.

Even if the container is removed, the named volume remains unless it is explicitly deleted.

### Why Use Named Volumes?

Named volumes are useful for persistent application data, especially:

- MySQL databases
- PostgreSQL databases
- Redis persistence
- Other stateful services

### Bind Mount vs Named Volume

| Feature                    | Bind Mount               | Named Volume        |
| -------------------------- | ------------------------ | ------------------- |
| Storage location           | Host path chosen by user | Managed by Docker   |
| Host path control          | Direct                   | Abstracted          |
| Source code development    | Excellent                | Usually unnecessary |
| Database persistence       | Possible                 | Excellent           |
| Survives container removal | Yes                      | Yes                 |
| Typical use                | Application source files | Database files      |

### Important Volume Commands

List volumes:

```bash
docker volume ls
```

Create a volume:

```bash
docker volume create mysql_data
```

Inspect a volume:

```bash
docker volume inspect mysql_data
```

Remove a volume:

```bash
docker volume rm mysql_data
```

### Container and Volume Lifecycle

| Action                        | Named volume                                |
| ----------------------------- | ------------------------------------------- |
| `docker stop`                 | Preserved                                   |
| `docker rm`                   | Preserved                                   |
| `docker rm -v`                | Named volumes are not automatically removed |
| `docker volume rm mysql_data` | Deleted                                     |

**Important:** Never remove a database volume unless you intentionally want to delete its stored data. Use backups for important databases.

### 10.3 Anonymous Volumes

We also used this command:

```bash
-v /app/node_modules
```

This creates an anonymous volume mounted at `/app/node_modules`.

It is useful in our Windows development setup because the host's `node_modules` directory should not overwrite the Linux dependencies inside the container.

Our complete development command:

```powershell
docker run -d `
  --name my-node-dev `
  -p 3000:3000 `
  -v "${PWD}:/app" `
  -v /app/node_modules `
  new-app
```

The first mount synchronizes source code. The second keeps the container's dependency directory separate from the host directory.

---

## 11. Nodemon and Live Reloading

A bind mount synchronizes files, but it does not automatically restart a running Node.js process.

For automatic restarting during development, we use **Nodemon**.

### What is Nodemon?

Nodemon is a development utility that monitors application files and automatically restarts a Node.js application when changes are detected.

Without Nodemon:

```bash
node index.js
```

When a file changes, the application generally needs to be restarted manually.

With Nodemon:

```bash
nodemon index.js
```

Nodemon monitors the files and restarts the application when changes are detected.

### Installing Nodemon

Install it as a development dependency:

```bash
npm install --save-dev nodemon
```

### Updating package.json

Add a development script:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon -L index.js"
  }
}
```

### What Does `nodemon -L index.js` Mean?

| Part       | Explanation                         |
| ---------- | ----------------------------------- |
| `nodemon`  | Starts the Nodemon utility          |
| `-L`       | Enables legacy watch mode (polling) |
| `index.js` | Application entry point             |

### Why Did We Need `-L`?

Our development environment uses:

- Windows as the host operating system.
- Docker Desktop with WSL2.
- Bind mounts to synchronize files.
- Nodemon running inside a Linux container.

Filesystem events do not always propagate reliably across Windows-to-container bind mounts.

Nodemon's legacy watch mode uses polling to detect file modifications.

This made automatic restarting work reliably in our environment.

**Trade-off:** Polling can consume more resources than normal filesystem event watching, especially in large projects.

### Running the Development Container

```powershell
docker run -d `
  --name my-node-dev `
  -p 3000:3000 `
  -v "${PWD}:/app" `
  -v /app/node_modules `
  new-app npm run dev
```

Notice the final part:

```bash
new-app npm run dev
```

This overrides the Dockerfile's default `CMD` for this container.

Instead of running:

```bash
npm start
```

Docker executes:

```bash
npm run dev
```

### Following Nodemon Logs

```bash
docker logs -f my-node-dev
```

Expected output:

```text
> new-poject@1.0.0 dev
> nodemon -L index.js

[nodemon] 3.1.14
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node index.js`

App is running on port 3000
```

After modifying and saving `index.js`, Nodemon should detect the change and restart the application.

### Testing the Application

```bash
curl http://localhost:3000
```

The updated response should appear without rebuilding the Docker image or recreating the container.

### Important Development Workflow

1. Modify source code on the host machine.
2. Bind mount synchronizes the changes into the container.
3. Nodemon detects the changes.
4. Nodemon restarts the Node.js process.
5. The updated application becomes available.

---

## 12. Useful Docker Commands

A quick reference for commands used throughout this project.

| Task                             | Command                            |
| -------------------------------- | ---------------------------------- |
| Check Docker version             | `docker --version`                 |
| Show Docker information          | `docker info`                      |
| List images                      | `docker images`                    |
| Pull an image                    | `docker pull nginx`                |
| Build an image                   | `docker build -t new-app .`        |
| Remove an image                  | `docker rmi new-app`               |
| List running containers          | `docker ps`                        |
| List all containers              | `docker ps -a`                     |
| Run a container                  | `docker run nginx`                 |
| Run detached                     | `docker run -d nginx`              |
| Stop a container                 | `docker stop my-node-app`          |
| Start a container                | `docker start my-node-app`         |
| Restart a container              | `docker restart my-node-app`       |
| Remove a container               | `docker rm my-node-app`            |
| View logs                        | `docker logs my-node-app`          |
| Follow logs                      | `docker logs -f my-node-app`       |
| Enter container shell            | `docker exec -it my-node-app sh`   |
| Execute command inside container | `docker exec my-node-app ls`       |
| List volumes                     | `docker volume ls`                 |
| Create volume                    | `docker volume create mysql_data`  |
| Inspect volume                   | `docker volume inspect mysql_data` |

---

## 13. Common Issues and Solutions

### 1. Container Name Conflict

Error:

```text
The container name is already in use.
```

Reason:

A container with the same name already exists, even if it is stopped.

Solution:

```bash
docker ps -a
docker rm container-name
```

If the container is running:

```bash
docker stop container-name
docker rm container-name
```

### 2. Bash Not Found

Error:

```text
exec: "bash": executable file not found in $PATH
```

Reason:

Bash is not installed in the Alpine-based image.

Solution:

```bash
docker exec -it my-node-app sh
```

### 3. `docker exec` Requires at Least 2 Arguments

Incorrect:

```bash
docker exec -it my-node-app
```

Correct:

```bash
docker exec -it my-node-app sh
```

The command requires both a container name or ID and a command to execute.

### 4. Nodemon Does Not Detect File Changes

Possible reason:

Filesystem events are not propagating correctly through the Windows-to-container bind mount.

Troubleshooting:

First, verify whether the updated file is visible inside the container:

```bash
docker exec -it my-node-dev sh
cat index.js
```

If the file is updated, enable Nodemon polling:

```json
{
  "scripts": {
    "dev": "nodemon -L index.js"
  }
}
```

Then recreate the container.

### 5. Application Changes Do Not Appear After Rebuilding an Image

Reason:

An existing container does not automatically switch to a newly built image.

Solution:

```bash
docker stop my-node-app
docker rm my-node-app
docker run -d --name my-node-app -p 3000:3000 new-app
```

For development, consider using bind mounts and Nodemon instead.

### 6. Port Already in Use

Error:

```text
port is already allocated
```

Reason:

Another container or application is already using the host port.

Solution:

Check running containers:

```bash
docker ps
```

Stop the conflicting container or choose a different host port:

```bash
docker run -d -p 3001:3000 new-app
```

### 7. Container Starts but Application Is Not Accessible

Check:

1. Is the container running?
2. Is the application listening on the expected container port?
3. Is the port mapping correct?
4. Is the application listening on `0.0.0.0`?
5. Are there errors in the container logs?

Useful commands:

```bash
docker ps
docker logs my-node-app
```

---

## 14. Key Takeaways

After completing these practical exercises, I learned:

- Docker images and containers and how they differ.
- Docker's client-server architecture.
- How to pull images and run containers.
- How to build custom images using Dockerfiles.
- How Docker image layers and build caching work.
- How to map container ports to host ports.
- How to inspect containers and execute commands inside them.
- How to persist data using Docker volumes.
- How bind mounts synchronize application source code.
- How Nodemon automates application restarts.
- How to troubleshoot common Docker issues.

### Important Concepts to Remember

1. An image is a template; a container is an instance of an image.
2. `docker run` creates a new container; `docker start` starts an existing one.
3. `EXPOSE` does not publish a port.
4. `docker exec` requires a running container.
5. Rebuilding an image does not update existing containers.
6. Bind mounts are useful for local development.
7. Named volumes are useful for persistent database storage.
8. Nodemon automatically restarts a Node.js application when changes are detected.
9. `nodemon -L` enables polling, which can help with bind mounts on Windows.

---

## 15. What's Next?

The next stage of this learning journey is **Docker Compose**.

Topics to explore:

- Introduction to Docker Compose.
- Writing `compose.yaml` / `docker-compose.yml`.
- Running multiple containers together.
- Service-to-service communication.
- Docker networks.
- Environment variables and `.env` files.
- MySQL with persistent named volumes.
- Redis integration.
- Container dependencies and health checks.
- Building a complete multi-container application.

The eventual goal is to containerize a Node.js application with MySQL and Redis, deploy it to a VPS, and then learn Kubernetes using the same application.

---
