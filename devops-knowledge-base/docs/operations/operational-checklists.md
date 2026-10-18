# Routine DevOps Operational Checklists

Checklists for daily standups, weekly cluster health checks, and on-call shift handovers.

---

## ☕ Daily Operations Morning Checklist

- [ ] Check overnight Prometheus & Alertmanager firing alerts.
- [ ] Review cluster node status: `kubectl get nodes` (confirm 0 nodes NotReady).
- [ ] Check for pods in CrashLoopBackOff: `kubectl get pods -A | grep -v -E "Running|Completed"`.
- [ ] Inspect Nexus and Ceph storage capacity: confirm all disk partitions are < 80% capacity.

---

## 📅 Weekly Cluster Maintenance Checklist

- [ ] Audit etcd snapshot status in `/var/lib/rancher/rke2/server/db/snapshots/`.
- [ ] Run Nexus blob compaction task to reclaim deleted package space.
- [ ] Review Kafka consumer group lag: `kafka-consumer-groups.sh --describe --all-groups`.
- [ ] Review upcoming TLS certificate expirations (< 30 days remaining).
- [ ] Check for pending OS kernel and security patches on host machines.
