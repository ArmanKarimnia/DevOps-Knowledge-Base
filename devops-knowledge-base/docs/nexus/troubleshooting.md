# Nexus Repository Troubleshooting & Diagnostics

Common operational issues, authentication failures, storage blob compaction, and Lucene index recovery.

---

## 🚨 Incident 1: Kubernetes Pod Fails with "401 Unauthorized" or "403 Forbidden"

### Cause
Kubelet cannot authenticate against the Nexus Docker connector.

### Investigation Steps:
1. Verify credentials from the worker node:
   ```bash
   docker login registry.example.com -u svc-k8s-pull
   ```
2. Check Nexus **Docker Bearer Token Realm**:
   - In Nexus Admin UI: **Security ➔ Realms**. Ensure **Docker Bearer Token Realm** is added to **Active Realms**. Without this, Docker CLI and Kubelet token handshakes will fail with HTTP 401.

---

## 💾 Incident 2: Blob Store Exhaustion (Disk 100% Full)

### Cause
Deleting artifacts or container tags in Nexus marks items as deleted in the database, but physical disk space is NOT freed until a compaction task runs.

### Resolution: Run Compact Blob Store Task
1. In Nexus Admin UI: **System ➔ Tasks**.
2. Run task: **Admin - Compact blob store** targeting the saturated blob store (e.g., `default`).
3. To automate, schedule this task weekly along with **Docker - Delete unused manifests and tags**.
