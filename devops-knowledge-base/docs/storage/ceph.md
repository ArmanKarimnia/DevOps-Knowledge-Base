# Ceph Distributed Storage Architecture & Operations

Ceph is a unified, distributed storage system providing object, block, and file storage on commodity hardware with self-healing capabilities.

---

## 🏛️ Ceph Core Daemons & Functions

- **OSD (Object Storage Daemon)**: Stores data, handles replication, recovery, and rebalancing. One OSD daemon runs per physical disk.
- **MON (Monitor)**: Maintains master cluster maps (monmap, osdmap, pgmap, crushmap). Requires odd quorum (3 or 5 monitors).
- **MGR (Manager)**: Runs monitoring dashboards, Prometheus metric exporters, and orchestrator modules.
- **MDS (Metadata Server)**: Manages POSIX filesystem metadata for CephFS (not required for RBD or RGW).

---

## ⚡ Essential Ceph CLI Operations

```bash
# [READ-ONLY] View cluster health, active alerts, and storage capacity
ceph status

# [READ-ONLY] Check OSD tree, failure domains (host/rack), and weight distribution
ceph osd tree

# [READ-ONLY] Check placement group (PG) statuses and identify degraded objects
ceph pg stat

# [READ-ONLY] List slow or blocked I/O requests
ceph health detail | grep -i "slow"
```
