# The Complete Docker Guide for Linux Servers

> A step-by-step, command-by-command walkthrough for installing, configuring, and operating every major Docker component on a Linux server — with real sample output and a troubleshooting section for every stage.

**Covers:** Ubuntu/Debian and RHEL/CentOS/Fedora installation, post-install hardening, images, containers, Docker networking (bridge/host/none/overlay/macvlan/ipvlan), volumes & bind mounts, Dockerfile/BuildKit, Docker Compose, Docker Swarm, registries, resource limits (cgroups), logging drivers, security (rootless mode, user namespaces, seccomp/AppArmor), system maintenance, and a full command-output error/troubleshooting appendix.

---

## Table of Contents

1. [Prerequisites & Planning](#1-prerequisites--planning)
2. [Installing Docker Engine on Debian/Ubuntu](#2-installing-docker-engine-on-debianubuntu)
3. [Installing Docker Engine on RHEL/CentOS/Fedora](#3-installing-docker-engine-on-rhelcentosfedora)
4. [Post-Installation Configuration](#4-post-installation-configuration)
5. [Verifying the Installation](#5-verifying-the-installation)
6. [Docker Architecture Quick Reference](#6-docker-architecture-quick-reference)
7. [Working with Images](#7-working-with-images)
8. [Working with Containers](#8-working-with-containers)
9. [Dockerfile & Building Custom Images](#9-dockerfile--building-custom-images)
10. [Docker Networking (All Drivers)](#10-docker-networking-all-drivers)
11. [Docker Volumes & Storage](#11-docker-volumes--storage)
12. [Docker Compose](#12-docker-compose)
13. [Docker Swarm (Orchestration & Clustering)](#13-docker-swarm-orchestration--clustering)
14. [Docker Registry (Private Image Storage)](#14-docker-registry-private-image-storage)
15. [Resource Limits & cgroups](#15-resource-limits--cgroups)
16. [Logging & Monitoring](#16-logging--monitoring)
17. [Security Hardening](#17-security-hardening)
18. [The `daemon.json` Reference](#18-the-daemonjson-reference)
19. [System Maintenance & Cleanup](#19-system-maintenance--cleanup)
20. [Full Troubleshooting Appendix](#20-full-troubleshooting-appendix)
21. [Command Cheat Sheet](#21-command-cheat-sheet)

---

## 1. Prerequisites & Planning

| Requirement | Detail |
|---|---|
| OS | 64-bit Linux: Ubuntu 22.04/24.04/26.04, Debian 11/12, RHEL/CentOS Stream 8/9, Fedora, Amazon Linux |
| Kernel | Linux kernel 3.10+ (5.x+ strongly recommended) with `overlay2`, cgroups v2 support |
| Architecture | x86_64/amd64, armhf, arm64, s390x, ppc64le |
| Privileges | `sudo`/root access |
| Storage | Dedicated disk space for `/var/lib/docker` (grows fast with images/volumes) |
| Network | Outbound access to `download.docker.com` and (for images) `registry-1.docker.io` |

Check your kernel and OS before starting:

```bash
uname -r
cat /etc/os-release
```

Sample output:

```
6.8.0-45-generic
PRETTY_NAME="Ubuntu 24.04.1 LTS"
NAME="Ubuntu"
VERSION_ID="24.04"
```

---

## 2. Installing Docker Engine on Debian/Ubuntu

### 2.1 Remove conflicting packages

Older distro-shipped packages conflict with Docker's official packages.

```bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do
  sudo apt-get remove -y $pkg
done
```

Expected output if none are installed:

```
Package 'docker.io' is not installed, so not removed
Package 'docker-doc' is not installed, so not removed
...
0 upgraded, 0 newly installed, 0 to remove and 12 not upgraded.
```

### 2.2 Set up Docker's `apt` repository

```bash
# Update the apt package index and install prerequisites
sudo apt-get update
sudo apt-get install -y ca-certificates curl

# Create the keyrings directory
sudo install -m 0755 -d /etc/apt/keyrings

# Download Docker's official GPG key
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
```

> For Debian, replace `linux/ubuntu` with `linux/debian` in both URLs.

### 2.3 Install Docker Engine

```bash
sudo apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin
```

Sample (truncated) output:

```
Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  containerd.io docker-buildx-plugin docker-ce docker-ce-cli docker-compose-plugin ...
Setting up docker-ce-cli (5:28.3.1-1~ubuntu.24.04~noble) ...
Setting up containerd.io (1.7.20-1) ...
Setting up docker-ce (5:28.3.1-1~ubuntu.24.04~noble) ...
Created symlink /etc/systemd/system/multi-user.target.wants/docker.service → /usr/lib/systemd/system/docker.service.
Setting up docker-buildx-plugin (0.16.2-1~ubuntu.24.04~noble) ...
Setting up docker-compose-plugin (2.29.1-1~ubuntu.24.04~noble) ...
```

### 2.4 Install a specific version (optional)

```bash
# List available versions
apt-cache madison docker-ce

# Install a pinned version string exactly as listed
sudo apt-get install -y docker-ce=5:27.3.1-1~ubuntu.24.04~noble \
  docker-ce-cli=5:27.3.1-1~ubuntu.24.04~noble containerd.io
```

### 2.5 Install via the convenience script (quick test/dev only)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

> **Not recommended for production.** It installs the latest edge/test builds and cannot be reliably upgraded through your package manager afterward.

---

## 3. Installing Docker Engine on RHEL/CentOS/Fedora

### 3.1 Remove conflicting packages

```bash
sudo dnf remove -y docker \
  docker-client \
  docker-client-latest \
  docker-common \
  docker-latest \
  docker-latest-logrotate \
  docker-logrotate \
  docker-engine \
  podman \
  runc
```

### 3.2 Add the repository

```bash
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
```

> Fedora users: use `https://download.docker.com/linux/fedora/docker-ce.repo` instead. CentOS: `https://download.docker.com/linux/centos/docker-ce.repo`.

Expected output:

```
Adding repo from: https://download.docker.com/linux/rhel/docker-ce.repo
```

### 3.3 Install Docker Engine

```bash
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

If prompted to import the GPG key:

```
Importing GPG key 0x621E9F35:
 Userid     : "Docker Release (CE rpm) <docker@docker.com>"
 Fingerprint: 060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35
 From       : https://download.docker.com/linux/rhel/gpg
Is this ok [y/N]: y
```

### 3.4 Start and enable the service

```bash
sudo systemctl enable --now docker
```

### 3.5 Verify

```bash
sudo docker run hello-world
```

---

## 4. Post-Installation Configuration

### 4.1 Manage Docker as a non-root user

By default `docker` requires `sudo` because the daemon socket `/var/run/docker.sock` is owned by `root`.

```bash
sudo groupadd docker            # usually already exists
sudo usermod -aG docker $USER
newgrp docker                   # or log out/in for it to take effect
```

Verify:

```bash
docker run hello-world
```

> **Security note:** membership in the `docker` group is root-equivalent — any user in that group can mount the host filesystem into a container and gain root. Only add trusted administrators.

### 4.2 Configure Docker to start on boot

```bash
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
```

### 4.3 Basic service management

```bash
sudo systemctl start docker
sudo systemctl stop docker
sudo systemctl restart docker
sudo systemctl status docker
```

Sample `status` output:

```
● docker.service - Docker Application Container Engine
     Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; preset: enabled)
     Active: active (running) since Wed 2026-09-02 09:14:02 UTC; 3min ago
TriggeredBy: ● docker.socket
       Docs: https://docs.docker.com
   Main PID: 18422 (dockerd)
      Tasks: 11
     Memory: 42.7M
        CPU: 612ms
     CGroup: /system.slice/docker.service
             └─18422 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
```

### 4.4 Configure the storage driver location (optional)

If `/var` is small, relocate Docker's data root before you start pulling large images:

```bash
sudo systemctl stop docker
sudo mkdir -p /data/docker
echo '{"data-root": "/data/docker"}' | sudo tee /etc/docker/daemon.json
sudo rsync -aP /var/lib/docker/ /data/docker
sudo mv /var/lib/docker /var/lib/docker.old
sudo systemctl start docker
docker info | grep "Docker Root Dir"
```

Expected:

```
Docker Root Dir: /data/docker
```

---

## 5. Verifying the Installation

```bash
docker --version
docker compose version
docker info
docker version
```

Sample `docker version` output:

```
Client: Docker Engine - Community
 Version:           28.3.1
 API version:       1.47
 Go version:        go1.22.5
 Git commit:        378e0f5
 Built:             Wed Jul  9 22:37:26 2026
 OS/Arch:           linux/amd64

Server: Docker Engine - Community
 Engine:
  Version:          28.3.1
  API version:      1.47 (minimum version 1.24)
  Go version:       go1.22.5
  Git commit:       9fca378
  Built:            Wed Jul  9 22:37:26 2026
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.7.20
 runc:
  Version:          1.7.20
 docker-init:
  Version:          0.19.0
```

Sample `docker info` (trimmed):

```
Client: Docker Engine - Community
 Version:    28.3.1
 Context:    default
Server:
 Containers: 1
  Running: 1
  Paused: 0
  Stopped: 0
 Images: 2
 Server Version: 28.3.1
 Storage Driver: overlay2
  Backing Filesystem: extfs
  Supports d_type: true
  Native Overlay Diff: true
 Cgroup Driver: systemd
 Cgroup Version: 2
 Kernel Version: 6.8.0-45-generic
 Operating System: Ubuntu 24.04.1 LTS
 OSType: linux
 Architecture: x86_64
 CPUs: 4
 Total Memory: 7.63GiB
 Docker Root Dir: /var/lib/docker
```

---

## 6. Docker Architecture Quick Reference

```
┌───────────────────────────┐        REST API over
│   docker CLI (client)     │  ───── unix:///var/run/docker.sock ────►
└───────────────────────────┘                                    │
                                                                  ▼
                                                     ┌────────────────────────┐
                                                     │  dockerd (daemon)      │
                                                     │  - image management    │
                                                     │  - networking          │
                                                     │  - volumes             │
                                                     └───────────┬────────────┘
                                                                 ▼
                                                     ┌────────────────────────┐
                                                     │  containerd            │
                                                     └───────────┬────────────┘
                                                                 ▼
                                                     ┌────────────────────────┐
                                                     │  runc (OCI runtime)    │
                                                     │  → Linux namespaces +  │
                                                     │    cgroups             │
                                                     └────────────────────────┘
```

Key daemon components: **images**, **containers**, **networks**, **volumes**, **plugins**, **builder (BuildKit)**.

---

## 7. Working with Images

### 7.1 Pull an image

```bash
docker pull nginx:latest
```

```
latest: Pulling from library/nginx
a480a496ba95: Pull complete
Digest: sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31
Status: Downloaded newer image for nginx:latest
docker.io/library/nginx:latest
```

### 7.2 List images

```bash
docker images
```

```
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
nginx        latest    5ef79149e0ec   2 weeks ago   192MB
```

### 7.3 Inspect an image

```bash
docker inspect nginx:latest
docker image history nginx:latest
```

```
IMAGE          CREATED       CREATED BY                                      SIZE
5ef79149e0ec   2 weeks ago   CMD ["nginx" "-g" "daemon off;"]                0B
<missing>      2 weeks ago   STOPD ["/docker-entrypoint.sh"]                 0B
<missing>      2 weeks ago   EXPOSE map[80/tcp:{}]                          0B
```

### 7.4 Tag and push

```bash
docker tag nginx:latest myregistry.example.com/team/nginx:v1
docker push myregistry.example.com/team/nginx:v1
```

### 7.5 Remove images

```bash
docker rmi nginx:latest
docker image prune            # remove dangling images
docker image prune -a         # remove ALL unused images
```

```
Deleted Images:
untagged: nginx:latest
deleted: sha256:5ef79149e0ec...

Total reclaimed space: 191.8MB
```

### 7.6 Search Docker Hub

```bash
docker search redis
```

```
NAME                     DESCRIPTION                                     STARS     OFFICIAL
redis                    Open source, advanced key-value store...       12987     [OK]
bitnami/redis            Bitnami container image for Redis               450
```

### 7.7 Save / Load images (offline transfer)

```bash
docker save -o nginx.tar nginx:latest
docker load -i nginx.tar
```

---

## 8. Working with Containers

### 8.1 Run a container

```bash
docker run -d --name web -p 8080:80 nginx:latest
```

```
9f8c2a7d4e1b6a3c0f5d8e2a1b4c7d9e0f3a2b5c8d1e4f7a0b3c6d9e2f5a8b1c
```

### 8.2 List containers

```bash
docker ps                 # running only
docker ps -a               # include stopped
```

```
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                  NAMES
9f8c2a7d4e1b   nginx:latest   "/docker-entrypoint.…"   3 seconds ago   Up 2 seconds   0.0.0.0:8080->80/tcp   web
```

### 8.3 Inspect logs / exec / stats

```bash
docker logs web
docker logs -f web              # follow
docker exec -it web bash        # interactive shell
docker top web                  # processes inside container
docker stats web                # live resource usage
```

Sample `docker stats`:

```
CONTAINER ID   NAME   CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O   PIDS
9f8c2a7d4e1b   web    0.00%     3.512MiB / 7.63GiB    0.04%     1.24kB / 0B       0B / 0B     2
```

### 8.4 Stop / start / restart / remove

```bash
docker stop web
docker start web
docker restart web
docker rm web            # must be stopped, or use -f to force
docker rm -f web
```

### 8.5 Copy files to/from a container

```bash
docker cp ./index.html web:/usr/share/nginx/html/index.html
docker cp web:/etc/nginx/nginx.conf ./nginx.conf
```

### 8.6 Environment variables, restart policy, resource caps

```bash
docker run -d \
  --name app \
  -e NODE_ENV=production \
  -e API_KEY=changeme \
  --restart unless-stopped \
  --memory=512m \
  --cpus=1.5 \
  -p 3000:3000 \
  myapp:latest
```

### 8.7 Health checks

```bash
docker run -d --name web \
  --health-cmd="curl -f http://localhost/ || exit 1" \
  --health-interval=30s \
  --health-timeout=5s \
  --health-retries=3 \
  nginx
```

```bash
docker inspect --format='{{json .State.Health}}' web
```

```json
{"Status":"healthy","FailingStreak":0,"Log":[{"Start":"2026-09-02T09:20:11Z","End":"2026-09-02T09:20:11Z","ExitCode":0,"Output":""}]}
```

---

## 9. Dockerfile & Building Custom Images

### 9.1 Example Dockerfile (Node.js app)

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
USER node
CMD ["node", "dist/server.js"]
```

### 9.2 Build the image

```bash
docker build -t myapp:1.0 .
```

```
[+] Building 18.4s (12/12) FINISHED
 => [internal] load build definition from Dockerfile
 => [build 1/5] FROM docker.io/library/node:20-alpine
 => [build 2/5] WORKDIR /app
 => [build 3/5] COPY package*.json ./
 => [build 4/5] RUN npm ci --omit=dev
 => [build 5/5] COPY . .
 => exporting to image
 => => naming to docker.io/library/myapp:1.0
```

### 9.3 Build with BuildKit / Buildx (multi-platform)

```bash
docker buildx create --use --name multiarch
docker buildx build --platform linux/amd64,linux/arm64 -t myrepo/myapp:1.0 --push .
```

### 9.4 Build arguments and caching

```bash
docker build --build-arg NODE_ENV=production --no-cache -t myapp:1.0 .
docker build --cache-from myrepo/myapp:cache -t myapp:1.0 .
```

### 9.5 `.dockerignore`

```
node_modules
.git
*.log
Dockerfile
.env
```

---

## 10. Docker Networking (All Drivers)

### 10.1 List and inspect networks

```bash
docker network ls
```

```
NETWORK ID     NAME      DRIVER    SCOPE
b1f2c3d4e5a6   bridge    bridge    local
c2d3e4f5a6b7   host      host      local
d3e4f5a6b7c8   none      null      local
```

```bash
docker network inspect bridge
```

```json
[
    {
        "Name": "bridge",
        "Driver": "bridge",
        "IPAM": {
            "Config": [{"Subnet": "172.17.0.0/16", "Gateway": "172.17.0.1"}]
        },
        "Containers": {}
    }
]
```

### 10.2 Bridge networks (default & user-defined)

The default `bridge` network provides no automatic DNS between containers. **User-defined bridge networks** do, and are the recommended default for standalone containers.

```bash
docker network create --driver bridge \
  --subnet 10.10.0.0/24 \
  --gateway 10.10.0.1 \
  app-net

docker run -d --name db --network app-net postgres:16
docker run -d --name api --network app-net -e DB_HOST=db myapi:latest
```

Inside `api`, `ping db` resolves automatically via Docker's embedded DNS:

```
PING db (10.10.0.2): 56 data bytes
64 bytes from 10.10.0.2: seq=0 ttl=64 time=0.089 ms
```

Connect/disconnect a running container to additional networks:

```bash
docker network connect app-net web
docker network disconnect app-net web
```

### 10.3 Host network

Container shares the host's network namespace — no port mapping, best raw performance, less isolation.

```bash
docker run -d --name web --network host nginx
curl http://localhost:80          # nginx is directly on the host's port 80
```

> Not supported on Docker Desktop (macOS/Windows); Linux-only in practice.

### 10.4 None network

Full network isolation — only a loopback interface.

```bash
docker run -it --network none alpine sh
# inside container:
ip addr
```

```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    inet 127.0.0.1/8 scope host lo
```

### 10.5 Overlay network (multi-host, requires Swarm)

```bash
docker swarm init
docker network create --driver overlay --attachable my-overlay
docker service create --name web --network my-overlay --replicas 3 nginx
```

```
NETWORK ID     NAME          DRIVER    SCOPE
f4a5b6c7d8e9   my-overlay    overlay   swarm
```

### 10.6 Macvlan network (container gets its own MAC/IP on the physical LAN)

```bash
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  macvlan-net

docker run -d --name legacy-app --network macvlan-net --ip 192.168.1.50 nginx
```

### 10.7 IPvlan network

```bash
docker network create -d ipvlan \
  --subnet=192.168.2.0/24 \
  -o parent=eth0 \
  -o ipvlan_mode=l2 \
  ipvlan-net
```

### 10.8 Port publishing patterns

```bash
docker run -d -p 8080:80 nginx                 # host:container, all interfaces
docker run -d -p 127.0.0.1:8080:80 nginx       # bind to localhost only
docker run -d -p 8080-8085:8080-8085 nginx     # port range
docker run -d -P nginx                          # publish all EXPOSEd ports to random host ports
```

```bash
docker port web
```

```
80/tcp -> 0.0.0.0:8080
80/tcp -> [::]:8080
```

### 10.9 Remove networks

```bash
docker network rm app-net
docker network prune
```

---

## 11. Docker Volumes & Storage

### 11.1 Named volumes (managed by Docker, recommended for persistent data)

```bash
docker volume create db-data
docker volume ls
docker volume inspect db-data
```

```
DRIVER    VOLUME NAME
local     db-data
```

```json
[
    {
        "CreatedAt": "2026-09-02T09:25:00Z",
        "Driver": "local",
        "Mountpoint": "/var/lib/docker/volumes/db-data/_data",
        "Name": "db-data",
        "Scope": "local"
    }
]
```

```bash
docker run -d --name pg -v db-data:/var/lib/postgresql/data postgres:16
```

### 11.2 Bind mounts (map a host path directly)

```bash
docker run -d --name web \
  -v /srv/website:/usr/share/nginx/html:ro \
  nginx
```

Or the more explicit `--mount` syntax (recommended, clearer errors):

```bash
docker run -d --name web \
  --mount type=bind,source=/srv/website,target=/usr/share/nginx/html,readonly \
  nginx
```

### 11.3 tmpfs mounts (in-memory, non-persistent)

```bash
docker run -d --name cache --mount type=tmpfs,destination=/app/cache,tmpfs-size=64m myapp
```

### 11.4 Backup and restore a volume

```bash
# Backup
docker run --rm -v db-data:/data -v $(pwd):/backup alpine \
  tar czf /backup/db-data-backup.tar.gz -C /data .

# Restore
docker run --rm -v db-data:/data -v $(pwd):/backup alpine \
  sh -c "cd /data && tar xzf /backup/db-data-backup.tar.gz"
```

### 11.5 Remove volumes

```bash
docker volume rm db-data
docker volume prune           # remove all unused volumes
```

```
WARNING! This will remove all local volumes not used by at least one container.
Are you sure you want to continue? [y/N] y
Deleted Volumes:
db-data

Total reclaimed space: 41.2MB
```

---

## 12. Docker Compose

### 12.1 Example `docker-compose.yml`

```yaml
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html:ro
    depends_on:
      - api
    networks:
      - frontend

  api:
    build: ./api
    environment:
      - DB_HOST=db
      - DB_PASSWORD=${DB_PASSWORD}
    networks:
      - frontend
      - backend
    restart: unless-stopped

  db:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - backend

networks:
  frontend:
  backend:

volumes:
  db-data:
```

### 12.2 Core commands

```bash
docker compose up -d              # start all services, detached
docker compose ps                 # list services
docker compose logs -f api        # follow logs for one service
docker compose exec api sh        # shell into a running service
docker compose stop
docker compose down               # stop and remove containers/networks
docker compose down -v            # also remove named volumes
docker compose build --no-cache
docker compose config             # validate & print resolved config
```

Sample `docker compose ps`:

```
NAME              IMAGE          COMMAND                  SERVICE   STATUS         PORTS
myapp-web-1       nginx:latest   "/docker-entrypoint.…"   web       Up 2 minutes   0.0.0.0:8080->80/tcp
myapp-api-1       myapp-api      "node server.js"        api       Up 2 minutes
myapp-db-1        postgres:16    "docker-entrypoint.s…"   db        Up 2 minutes   5432/tcp
```

### 12.3 Scaling a service

```bash
docker compose up -d --scale api=3
```

### 12.4 Multiple compose files (overrides for environments)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 13. Docker Swarm (Orchestration & Clustering)

### 13.1 Initialize a swarm

```bash
docker swarm init --advertise-addr 10.0.0.10
```

```
Swarm initialized: current node (a1b2c3...) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-abc123...xyz 10.0.0.10:2377

To add a manager to this swarm, run 'docker swarm join-token manager'.
```

### 13.2 Join worker/manager nodes

```bash
# on a worker node
docker swarm join --token SWMTKN-1-abc123...xyz 10.0.0.10:2377
```

```
This node joined a swarm as a worker.
```

### 13.3 View nodes

```bash
docker node ls
```

```
ID                            HOSTNAME    STATUS    AVAILABILITY   MANAGER STATUS
a1b2c3d4e5f6 *                mgr1        Ready     Active         Leader
b2c3d4e5f6a7                  worker1     Ready     Active
```

### 13.4 Deploy a service

```bash
docker service create --name web --replicas 3 -p 80:80 nginx:latest
docker service ls
docker service ps web
```

```
ID             NAME      MODE         REPLICAS   IMAGE          PORTS
xk9j3n7q2p4r   web       replicated   3/3        nginx:latest   *:80->80/tcp
```

### 13.5 Scale, update, and roll back

```bash
docker service scale web=5
docker service update --image nginx:1.27 web
docker service rollback web
```

### 13.6 Deploy a full stack from a Compose file

```bash
docker stack deploy -c docker-compose.yml myapp
docker stack services myapp
docker stack ps myapp
docker stack rm myapp
```

### 13.7 Leave the swarm

```bash
docker swarm leave              # worker
docker swarm leave --force      # manager (last one)
```

---

## 14. Docker Registry (Private Image Storage)

### 14.1 Run a local registry

```bash
docker run -d -p 5000:5000 --restart=always --name registry \
  -v registry-data:/var/lib/registry \
  registry:2
```

### 14.2 Push/pull to the private registry

```bash
docker tag myapp:1.0 localhost:5000/myapp:1.0
docker push localhost:5000/myapp:1.0
docker pull localhost:5000/myapp:1.0
```

```
The push refers to repository [localhost:5000/myapp]
5f70bf18a086: Pushed
1.0: digest: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 size: 528
```

### 14.3 Log in to Docker Hub or another registry

```bash
docker login
docker login myregistry.example.com -u myuser
```

```
Login Succeeded
```

### 14.4 Registry with TLS (production)

```bash
docker run -d -p 443:443 --name registry \
  -v /etc/docker/certs.d/registry:/certs \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
  -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
  registry:2
```

---

## 15. Resource Limits & cgroups

```bash
docker run -d --name limited \
  --cpus="1.5" \
  --memory="512m" \
  --memory-swap="1g" \
  --pids-limit=200 \
  --blkio-weight=500 \
  myapp:latest
```

Check enforced limits at runtime:

```bash
docker inspect --format='{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}}' limited
```

```
536870912 1500000000
```

View live usage across all containers:

```bash
docker stats --no-stream
```

```
CONTAINER ID   NAME      CPU %     MEM USAGE / LIMIT   MEM %     NET I/O
b7e2a9f1c3d4   limited   0.15%     18.4MiB / 512MiB    3.59%     648B / 0B
```

---

## 16. Logging & Monitoring

### 16.1 Configure a logging driver

```bash
docker run -d --name web \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  nginx
```

Set the default globally in `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

```bash
sudo systemctl restart docker
```

### 16.2 Send logs to syslog / journald

```bash
docker run -d --log-driver=journald --name web nginx
journalctl CONTAINER_NAME=web -f
```

### 16.3 Common inspection commands

```bash
docker events                      # live daemon event stream
docker system df                   # disk usage summary
docker system df -v                # per-image/container/volume breakdown
```

Sample `docker system df`:

```
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          6         3         1.42GB    612MB (43%)
Containers      4         2         48.2MB    12MB (25%)
Local Volumes   3         2         210MB     41.2MB (19%)
Build Cache     22        0         890MB     890MB (100%)
```

---

## 17. Security Hardening

### 17.1 Rootless mode (run the daemon itself as a non-root user)

```bash
sudo apt-get install -y uidmap dbus-user-session
curl -fsSL https://get.docker.com/rootless | sh
```

```
[INFO] Creating /home/user/.config/systemd/user/docker.service
[INFO] systemctl --user start docker
[INFO] To control docker as a normal user, run:
        export PATH=/usr/bin:$PATH
        export DOCKER_HOST=unix:///run/user/1000/docker.sock
```

```bash
systemctl --user enable --now docker
export DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock
docker run hello-world
```

### 17.2 Run containers as non-root

```dockerfile
RUN addgroup -S app && adduser -S app -G app
USER app
```

```bash
docker run --user 1001:1001 myapp:latest
```

### 17.3 Drop capabilities / read-only root filesystem

```bash
docker run -d --name secure-app \
  --cap-drop=ALL \
  --cap-add=NET_BIND_SERVICE \
  --read-only \
  --tmpfs /tmp \
  --security-opt no-new-privileges \
  myapp:latest
```

### 17.4 Seccomp and AppArmor profiles

```bash
docker run --security-opt seccomp=/etc/docker/seccomp/custom.json myapp
docker run --security-opt apparmor=docker-default myapp
```

### 17.5 Scan images for vulnerabilities

```bash
docker scout quickview nginx:latest
docker scout cves nginx:latest
```

```
Target: nginx:latest
✗ 12 vulnerabilities found (2 critical, 4 high, 6 medium)
```

### 17.6 Enable content trust (verify signed images)

```bash
export DOCKER_CONTENT_TRUST=1
docker pull nginx:latest
```

---

## 18. The `daemon.json` Reference

Location: `/etc/docker/daemon.json` (create if it doesn't exist).

```json
{
  "data-root": "/data/docker",
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" },
  "exec-opts": ["native.cgroupdriver=systemd"],
  "default-address-pools": [
    { "base": "172.30.0.0/16", "size": 24 }
  ],
  "insecure-registries": ["myregistry.local:5000"],
  "registry-mirrors": ["https://mirror.gcr.io"],
  "features": { "buildkit": true },
  "live-restore": true
}
```

Apply changes:

```bash
sudo dockerd --validate --config-file /etc/docker/daemon.json
sudo systemctl restart docker
```

`live-restore: true` keeps containers running if the daemon is restarted/upgraded — important for production servers.

---

## 19. System Maintenance & Cleanup

```bash
docker container prune           # remove all stopped containers
docker image prune -a            # remove all unused images
docker volume prune              # remove all unused volumes
docker network prune             # remove all unused networks
docker builder prune             # clear build cache
docker system prune -a --volumes # remove EVERYTHING unused (careful!)
```

Sample `docker system prune -a`:

```
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all images without at least one container associated to them
  - all build cache

Are you sure you want to continue? [y/N] y
Total reclaimed space: 2.184GB
```

### 19.1 Scheduled cleanup with cron

```bash
echo "0 3 * * 0 root docker system prune -af --filter \"until=168h\"" | sudo tee /etc/cron.d/docker-cleanup
```

### 19.2 Upgrading Docker

```bash
sudo apt-get update
sudo apt-get install --only-upgrade docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 19.3 Uninstalling Docker completely

```bash
sudo apt-get purge -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
sudo rm -rf /etc/docker
sudo groupdel docker
```

---

## 20. Full Troubleshooting Appendix

### 20.1 Installation-time errors

**Error:** `E: Package 'docker-ce' has no installation candidate`
- **Cause:** Repository wasn't added correctly, or architecture/codename mismatch.
- **Fix:**
  ```bash
  cat /etc/apt/sources.list.d/docker.list
  dpkg --print-architecture
  . /etc/os-release && echo $VERSION_CODENAME
  ```
  Ensure the codename in the repo file matches your actual release, then `sudo apt-get update` again.

**Error:** `GPG error: ... NO_PUBKEY` or `The following signatures couldn't be verified`
- **Cause:** GPG key missing or corrupted.
- **Fix:**
  ```bash
  sudo rm /etc/apt/keyrings/docker.asc
  sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  sudo chmod a+r /etc/apt/keyrings/docker.asc
  sudo apt-get update
  ```

**Error:** `Unable to locate package docker-ce` (RHEL/CentOS)
- **Cause:** `dnf-plugins-core` not installed, or repo not added.
- **Fix:**
  ```bash
  sudo dnf install -y dnf-plugins-core
  sudo dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo
  sudo dnf makecache
  ```

**Error:** `package containerd.io-X.Y.Z is excluded` (older CentOS/RHEL 8)
- **Cause:** `container-tools` module conflicts with Docker's containerd package.
- **Fix:**
  ```bash
  sudo dnf module disable -y container-tools
  sudo dnf install -y docker-ce docker-ce-cli containerd.io
  ```

### 20.2 Daemon start-up errors

**Error:** `Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?`
- **Fix:**
  ```bash
  sudo systemctl status docker
  sudo systemctl start docker
  journalctl -u docker.service -n 100 --no-pager
  ```

**Error:** `failed to start daemon: error initializing graphdriver: driver not supported`
- **Cause:** Filesystem (e.g., ZFS/BTRFS/AUFS remnants) incompatible with configured storage driver.
- **Fix:** Set an explicit supported driver in `/etc/docker/daemon.json`:
  ```json
  { "storage-driver": "overlay2" }
  ```
  Then `sudo systemctl restart docker`.

**Error:** `Error starting daemon: error while opening volume store metadata database: timeout`
- **Cause:** Corrupted state file or another dockerd instance already holding the lock.
- **Fix:**
  ```bash
  sudo systemctl stop docker
  sudo rm /var/lib/docker/volumes/metadata.db
  sudo systemctl start docker
  ```

**Error:** `dockerd: Error: /var/run/docker.sock: permission denied` when starting manually
- **Fix:** Start via systemd (`sudo systemctl start docker`) rather than invoking `dockerd` directly, or run with `sudo`.

### 20.3 Permission / non-root user errors

**Error:** `Got permission denied while trying to connect to the Docker daemon socket`
- **Cause:** Current user not in the `docker` group, or group membership not refreshed.
- **Fix:**
  ```bash
  sudo usermod -aG docker $USER
  newgrp docker
  # or fully log out and back in
  groups            # confirm 'docker' is listed
  ```

### 20.4 Networking errors

**Error:** `Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:80 -> 0.0.0.0:0: listen tcp 0.0.0.0:80: bind: address already in use`
- **Fix:**
  ```bash
  sudo ss -ltnp | grep :80
  sudo systemctl stop apache2      # or whichever service owns the port
  # or choose a different host port
  docker run -d -p 8081:80 nginx
  ```

**Error:** `docker: Error response from daemon: network with name app-net already exists`
- **Fix:**
  ```bash
  docker network rm app-net
  # or reuse the existing network
  docker network inspect app-net
  ```

**Error:** Containers on the default `bridge` network can't resolve each other by name
- **Cause:** The default `bridge` network has no embedded DNS.
- **Fix:** Create and use a user-defined bridge network instead (see §10.2):
  ```bash
  docker network create app-net
  docker run --network app-net --name db ...
  docker run --network app-net --name api ...
  ```

**Error:** `iptables: No chain/target/match by that name` after a firewall reload
- **Cause:** `firewalld`/`ufw` reload wiped Docker's iptables rules.
- **Fix:**
  ```bash
  sudo systemctl restart docker
  ```
  For persistence, ensure Docker's rules are re-applied after every firewall reload (systemd drop-in `After=` ordering, or use `DOCKER-USER` chain for custom rules).

**Error:** No internet access from inside containers (`Temporary failure in name resolution`)
- **Fix:** Set explicit DNS in `/etc/docker/daemon.json`:
  ```json
  { "dns": ["8.8.8.8", "1.1.1.1"] }
  ```
  ```bash
  sudo systemctl restart docker
  ```

### 20.5 Storage / volume errors

**Error:** `no space left on device`
- **Fix:**
  ```bash
  docker system df
  docker system prune -a --volumes
  df -h /var/lib/docker
  ```
  Consider relocating `data-root` to a larger disk (§4.4).

**Error:** `Error response from daemon: volume is in use - [container_id]`
- **Fix:**
  ```bash
  docker ps -a --filter volume=db-data
  docker rm -f <container_id>
  docker volume rm db-data
  ```

**Error:** Bind mount shows empty directory / `Mounts denied` (SELinux enabled hosts)
- **Cause:** SELinux blocks container access to host paths by default.
- **Fix:** Add the `:z` or `:Z` SELinux label:
  ```bash
  docker run -v /srv/data:/data:Z myapp
  ```

### 20.6 Build errors

**Error:** `failed to solve: process "/bin/sh -c npm install" did not complete successfully: exit code 1`
- **Fix:** Re-run with cache disabled and inspect verbose output:
  ```bash
  docker build --no-cache --progress=plain -t myapp .
  ```

**Error:** `COPY failed: file not found in build context`
- **Cause:** File excluded by `.dockerignore`, or wrong build context path.
- **Fix:**
  ```bash
  cat .dockerignore
  docker build -f Dockerfile -t myapp .    # ensure context (the trailing '.') is correct
  ```

**Error:** `docker: 'buildx' is not a docker command` (older installs)
- **Fix:**
  ```bash
  sudo apt-get install -y docker-buildx-plugin
  docker buildx version
  ```

### 20.7 Container run-time errors

**Error:** `docker: Error response from daemon: OCI runtime create failed: ... exec: "xyz": executable file not found in $PATH`
- **Cause:** `CMD`/`ENTRYPOINT` binary doesn't exist in the final image (often from a bad multi-stage copy).
- **Fix:** Verify the binary path inside the image:
  ```bash
  docker run --rm -it --entrypoint sh myapp:1.0
  which xyz
  ```

**Error:** Container exits immediately with code `0` or `137`
- **`0`** — the main process finished (foreground apps need to keep running; add `-it` for shells or ensure your CMD is long-running).
- **`137`** — killed by OOM killer or `docker stop`/`SIGKILL`. Check:
  ```bash
  docker inspect <container> --format='{{.State.OOMKilled}}'
  dmesg | grep -i "killed process"
  ```
  Raise `--memory` limits or optimize the app.

**Error:** `standard_init_linux.go:228: exec user process caused: exec format error`
- **Cause:** Image built for the wrong CPU architecture (e.g., arm64 image run on amd64 host).
- **Fix:**
  ```bash
  docker image inspect myapp:1.0 --format='{{.Architecture}}'
  docker buildx build --platform linux/amd64 -t myapp:1.0 .
  ```

**Error:** `Error response from daemon: Conflict. The container name "/web" is already in use`
- **Fix:**
  ```bash
  docker rm -f web
  # or run with a different name
  docker run -d --name web2 nginx
  ```

### 20.8 Compose errors

**Error:** `service "api" depends on undefined service "db"`
- **Fix:** Check indentation/spelling of the `depends_on` target in `docker-compose.yml`; run `docker compose config` to validate.

**Error:** `Error response from daemon: driver failed programming external connectivity ... port is already allocated`
- **Fix:** Same as §20.4 port conflicts — check `docker ps` for another container already using that host port, or change the mapped port in `docker-compose.yml`.

**Error:** `.env` variables not being substituted (`${DB_PASSWORD}` shows up literally)
- **Fix:** Ensure `.env` sits in the same directory you run `docker compose` from, and there's no space around `=` in the file:
  ```
  DB_PASSWORD=supersecret
  ```

### 20.9 Swarm errors

**Error:** `Error response from daemon: This node is not a swarm manager`
- **Fix:** Run manager-only commands (`docker service`, `docker stack`) from a manager node, or promote the node:
  ```bash
  docker node promote <node-id>
  ```

**Error:** `rpc error: code = Unavailable desc = ... context deadline exceeded` on `swarm join`
- **Cause:** Firewall blocking swarm ports.
- **Fix:** Open required ports between nodes:
  ```bash
  sudo ufw allow 2377/tcp   # cluster management
  sudo ufw allow 7946/tcp   # node communication
  sudo ufw allow 7946/udp
  sudo ufw allow 4789/udp   # overlay network traffic (VXLAN)
  ```

### 20.10 Registry / pull errors

**Error:** `Error response from daemon: Get "https://myregistry.local:5000/v2/": http: server gave HTTP response to HTTPS client`
- **Cause:** Registry doesn't have TLS but Docker expects HTTPS by default.
- **Fix:** Add it to `insecure-registries` in `daemon.json` (§18), or add proper TLS certs to the registry.

**Error:** `toomanyrequests: You have reached your pull rate limit`
- **Cause:** Docker Hub's anonymous pull rate limits.
- **Fix:**
  ```bash
  docker login
  ```
  Authenticated pulls get a higher quota; alternatively configure a pull-through mirror/cache.

**Error:** `denied: requested access to the resource is denied` on `docker push`
- **Cause:** Not logged in, or insufficient permissions/wrong repo name namespace.
- **Fix:**
  ```bash
  docker login myregistry.example.com
  docker tag myapp:1.0 myregistry.example.com/<your-namespace>/myapp:1.0
  docker push myregistry.example.com/<your-namespace>/myapp:1.0
  ```

---

## 21. Command Cheat Sheet

```bash
# System
docker info                     docker version                 docker system df
docker system prune -a          journalctl -u docker -f

# Images
docker pull <image>             docker images                  docker rmi <image>
docker build -t <name> .        docker tag <src> <dst>         docker push <image>
docker save -o f.tar <image>    docker load -i f.tar            docker history <image>

# Containers
docker run -d -p H:C <image>    docker ps -a                    docker stop/start/restart <c>
docker exec -it <c> sh          docker logs -f <c>               docker rm -f <c>
docker cp <c>:/path ./local     docker inspect <c>               docker stats

# Networks
docker network ls               docker network create -d bridge <name>
docker network inspect <name>   docker network connect <net> <c>
docker network rm <name>        docker network prune

# Volumes
docker volume create <name>     docker volume ls                docker volume inspect <name>
docker volume rm <name>         docker volume prune

# Compose
docker compose up -d            docker compose down -v          docker compose logs -f
docker compose ps               docker compose exec <svc> sh    docker compose build

# Swarm
docker swarm init                docker swarm join --token ...  docker node ls
docker service create ...        docker service scale <s>=N     docker stack deploy -c f.yml <name>

# Security
docker scout cves <image>        docker run --cap-drop=ALL ...  export DOCKER_CONTENT_TRUST=1
```

---

## Sources & Further Reading

- Docker official documentation — `docs.docker.com` (Engine install guides for Ubuntu/Debian/RHEL/CentOS, networking, Compose, Swarm references)
- `download.docker.com` package repositories (apt/yum/dnf)
- Docker Engine release notes
