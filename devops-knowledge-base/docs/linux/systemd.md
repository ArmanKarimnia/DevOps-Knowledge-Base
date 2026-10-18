# Systemd Service & Unit Management

Systemd is the default init system and service manager on modern enterprise Linux distributions (Ubuntu, Debian, RHEL, Rocky, SUSE).

---

## ⚙️ Service Lifecycle & Inspection

### 1. Common Operational Commands
```bash
# [READ-ONLY] Check service status, active state, PID, memory, and latest logs
systemctl status rke2-server.service

# [STATE-MODIFYING] Restart a service
sudo systemctl restart containerd.service

# [STATE-MODIFYING] Gracefully reload service configuration without dropping connections
sudo systemctl reload nginx.service

# [STATE-MODIFYING] Enable service to launch automatically at system boot
sudo systemctl enable --now apisix.service
```

### 2. Identify Failing or Degraded Units
```bash
# [READ-ONLY] List all system units currently in a failed state
systemctl --failed

# [READ-ONLY] View boot performance bottlenecks and slow services
systemd-analyze blame | head -n 15
```

---

## 📝 Creating a Production Systemd Service Unit

Place service definition files in `/etc/systemd/system/<unit-name>.service`.

### Production Hardened Service Example
```ini
[Unit]
Description=Prometheus Node Exporter
Documentation=https://github.com/prometheus/node_exporter
After=network.target
Wants=network-online.target

[Service]
Type=exec
User=node_exporter
Group=node_exporter
ExecStart=/usr/local/bin/node_exporter \
  --web.listen-address=127.0.0.1:9100 \
  --collector.systemd

# Restart Policy
Restart=on-failure
RestartSec=5s

# Security Hardening Directives
ProtectSystem=strict
ProtectHome=true
NoNewPrivileges=true
PrivateTmp=true
ProtectKernelTunables=true
ProtectControlGroups=true
CapabilityBoundingSet=

# Resource Limits
LimitNOFILE=65536
MemoryMax=512M

[Install]
WantedBy=multi-user.target
```

### Activating New Units
```bash
# [STATE-MODIFYING] Reload systemd manager configuration after editing unit files
sudo systemctl daemon-reload

# [STATE-MODIFYING] Start and verify service
sudo systemctl start node_exporter.service
systemctl is-active node_exporter.service
```

---

## 📜 Journalctl Log Querying & Filtering

The systemd journal provides unified, high-performance binary logging.

```bash
# [READ-ONLY] Stream live logs from a specific service unit
journalctl -u rke2-server.service -f

# [READ-ONLY] Filter logs since a specific timestamp with error severity
journalctl -u containerd.service --since "1 hour ago" -p err

# [READ-ONLY] View kernel messages from current boot
journalctl -k -b 0

# [READ-ONLY] Inspect disk space consumed by journal logs and clean up
journalctl --disk-usage
sudo journalctl --vacuum-time=7d
```
