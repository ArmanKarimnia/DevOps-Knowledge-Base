# Longhorn Cloud-Native Distributed Block Storage

Longhorn is a lightweight, reliable, distributed block storage system built natively for Kubernetes.

---

## 🏛️ Longhorn Architecture & Replication

- **Per-Volume Controller**: Unlike traditional SAN storage, each Longhorn Persistent Volume runs its own dedicated controller engine pod.
- **Synchronous Replicas**: Data is synchronously written to multiple worker node storage disks (typically 3 replicas across different availability zones or hosts).
- **Snapshot & Backup to S3**: Snapshots can be taken instantaneously using Copy-On-Write (COW) and pushed asynchronously as compressed incremental backups directly to Ceph RGW or AWS S3.

---

## ⚡ Operational Triage

```bash
# [READ-ONLY] Check Longhorn node storage allocations
kubectl get nodes.longhorn.io -n longhorn-system -o wide

# [READ-ONLY] Check volume replica status and health
kubectl get volumes.longhorn.io -n longhorn-system

# [STATE-MODIFYING] Trigger recurring snapshot schedule
kubectl apply -f - <<EOF
apiVersion: longhorn.io/v1beta2
kind: RecurringJob
metadata:
  name: daily-backup
  namespace: longhorn-system
spec:
  cron: "0 2 * * *"
  task: "backup"
  groups:
    - default
  retain: 7
EOF
```
