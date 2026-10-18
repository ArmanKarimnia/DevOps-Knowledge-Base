# Docker Troubleshooting & Incident Recovery

Common runtime errors, container crash loops, storage exhaustion, and daemon recovery procedures.

---

## 🚨 Incident 1: Container Exits Immediately with Code 137

### Cause
Exit code `137` indicates `128 + 9 (SIGKILL)`. The Linux kernel Out-Of-Memory (OOM) killer killed the container process because memory exceeded the configured `--memory` limit.

### Investigation
```bash
# [READ-ONLY] Verify container termination reason
docker inspect <container-id> --format='{{.State.OOMKilled}} - ExitCode: {{.State.ExitCode}}'

# [READ-ONLY] Check kernel ring buffer for OOM events
dmesg -T | grep -i -E "oom[-_]killer|killed process"
```

### Resolution
Increase container memory limits or optimize the application memory heap (e.g., set `-XX:MaxRAMPercentage=75` for Java or `--max-old-space-size=1024` for Node.js).

---

## 🚨 Incident 2: "bind: address already in use"

### Cause
Another service or leftover container process is already listening on the host port.

### Investigation & Resolution
```bash
# [READ-ONLY] Identify PID bound to the target port
sudo ss -tulpn | grep ":8080"

# Terminate offending process or adjust port mapping
kill -15 <offending-PID>
```

---

## 🚨 Incident 3: Docker Daemon Unresponsive / Hanging CLI

```bash
# [READ-ONLY] Check daemon status and latest errors
systemctl status docker.service
journalctl -u docker.service --since "10m ago" -p err

# [STATE-MODIFYING] Safely restart daemon (with live-restore enabled in /etc/docker/daemon.json, running containers will not terminate)
sudo systemctl restart docker.service
```
