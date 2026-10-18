# Docker Commands Cheatsheet

A production-focused cheat sheet for managing containers, images, volumes, and networks with Docker CLI.

---

## 🏃 Container Lifecycle & Operations

### 1. Run a Hardened Container
- **Command**:
  ```bash
  # [STATE-MODIFYING] Run non-root, read-only container with memory limit
  docker run -d \
    --name web-app \
    --user 10001:10001 \
    --read-only \
    --tmpfs /tmp:rw,noexec,nosuid \
    --cap-drop=ALL \
    --memory=512m \
    --cpus=1.0 \
    -p 127.0.0.1:8080:8080 \
    registry.example.com/platform/web-app:1.2.0
  ```
- **When to use**: Launching secure background workloads.

### 2. Live Resource Consumption of Running Containers
- **Command**:
  ```bash
  # [READ-ONLY] Stream real-time CPU, RAM, Network I/O, and Block I/O
  docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
  ```
- **When to use**: Rapid identification of containers causing host memory or CPU pressure.

### 3. Container Inspection & IP Extraction
- **Command**:
  ```bash
  # [READ-ONLY] Extract IP address and healthcheck status via jq format
  docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}} - {{.State.Health.Status}}' <container-id>
  ```

---

## 📜 Logs & Interactive Debugging

### 1. View Logs with Timestamps
- **Command**:
  ```bash
  # [READ-ONLY] Follow logs with timestamps since last 15 minutes
  docker logs -f --tail 100 --timestamps --since 15m <container-id>
  ```

### 2. Execute Shell Inside Container
- **Command**:
  ```bash
  # [READ-ONLY] Open interactive shell inside running container
  docker exec -it <container-id> sh
  ```

---

## 🧹 Maintenance & Disk Reclamation

### 1. Docker Disk Space Usage Overview
- **Command**:
  ```bash
  # [READ-ONLY] View breakdown of space consumed by images, containers, and build cache
  docker system df
  ```

### 2. Prune Unused Objects Safely
- **Command**:
  ```bash
  # [STATE-MODIFYING] Clean dangling images and stopped containers older than 24h
  docker system prune --filter "until=24h"

  # [HIGH-RISK] Remove all unused images, networks, and build cache (volumes excluded)
  docker system prune -a
  ```
- **Risk Note**: `docker system prune -a` removes all unreferenced images. In air-gapped environments or slow internet connections, this requires re-pulling hundreds of gigabytes of layers.
