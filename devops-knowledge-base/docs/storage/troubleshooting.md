# Storage Troubleshooting & Incident Recovery

Triage procedures for Ceph degraded placement groups, slow OSD requests, and Kubernetes volume attach timeouts.

---

## 🚨 Incident 1: Ceph Cluster Reports "HEALTH_WARN: degraded data redundancy"

### Cause
An OSD failed or went down, causing placement groups (PGs) to fall below target replica counts (e.g., 2/3 replicas available).

### Investigation & Recovery:
1. Identify failed OSD:
   ```bash
   ceph osd tree | grep -i "down"
   ```
2. Inspect OSD daemon systemd journal logs on the affected host:
   ```bash
   journalctl -u ceph-osd@<osd-id> -f
   ```
3. Check for drive hardware failure via SMART:
   ```bash
   smartctl -a /dev/sdX
   ```
4. If disk failed, replace disk and remove old OSD:
   ```bash
   ceph osd out <osd-id>
   ceph osd purge <osd-id> --yes-i-really-mean-it
   ```

---

## 🚨 Incident 2: Kubernetes Pod Stuck in `ContainerCreating` with Volume Attachment Timeout

### Cause
Underlying CSI block volume is locked by a previous worker node that terminated unexpectedly.

### Resolution:
1. Verify volumeattachment object:
   ```bash
   kubectl get volumeattachment
   ```
2. If previous node is confirmed dead, delete stale VolumeAttachment object to release lock:
   ```bash
   kubectl delete volumeattachment <attachment-name>
   ```
