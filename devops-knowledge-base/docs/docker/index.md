# Containerization & Docker Engineering

Containers provide reproducible, portable runtime environments from local developer workstations to large-scale production Kubernetes clusters.

---

## 📑 Chapter Contents

- **[Commands Cheatsheet](commands-cheatsheet.md)**: Fast lookup for container lifecycle, inspection, volume manipulation, and log analysis.
- **[Docker Compose Guide](docker-compose.md)**: Multi-service environments, networking definitions, healthchecks, and environment variables.
- **[Container Networking](networking.md)**: Bridge networks, host mode, overlay networks, veth pairs, and port forwarding.
- **[Image Management & Optimization](image-management.md)**: Multi-stage Dockerfiles, minimal base images (Distroless / Alpine), layer caching, and vulnerability scanning.
- **[Troubleshooting Docker](troubleshooting.md)**: Triage for container crash loops, port bind errors, hanging daemon processes, and disk space reclamation.

---

## 🛡️ Container Security Baseline

1. **Never run as root**: Always define `USER 10001:10001` or create a non-privileged system user inside the Dockerfile.
2. **Mount root filesystem read-only**: Utilize `read_only: true` and mount ephemeral writable directories using `tmpfs` under `/tmp`.
3. **Drop unnecessary capabilities**: Explicitly pass `--cap-drop=ALL` and only add back required capabilities (e.g., `NET_BIND_SERVICE`).
