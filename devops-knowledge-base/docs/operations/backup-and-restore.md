# Backup Validation & Disaster Recovery Drills

Un-tested backups are merely aspirations. A backup is not valid until a restore has been executed successfully in an isolated test environment.

---

## 💾 The 3-2-1 Backup Strategy

- **3 Copies of Data**: 1 primary production copy + 2 backup copies.
- **2 Different Storage Media**: e.g., NVMe SSD block storage + S3 object storage.
- **1 Copy Off-Site**: In a separate physical data center or air-gapped immutable storage tier.

---

## 🔄 Routine Recovery Drill Procedure

Execute this drill quarterly:

1. **Provision Sandbox Environment**: Spin up an isolated staging namespace or test cluster.
2. **Retrieve Latest Automated Snapshot**: Download yesterday's PostgreSQL database backup or RKE2 etcd snapshot from Ceph RGW S3.
3. **Execute Restore**:
   ```bash
   # Restore PostgreSQL database in isolated test container
   gunzip -c backup_20261018.sql.gz | psql -h test-db.internal -U postgres -d restore_test_db
   ```
4. **Data Integrity Verification**: Run automated verification queries checking row counts and latest timestamp records.
5. **Record Findings & Recovery Time Objective (RTO)**: Document actual elapsed restore time versus target RTO.
