# Runbook: Sonatype Nexus & Container Registry Outage

- **Severity Level**: SEV-1 (blocks production deployments) / SEV-2
- **Target Response Time**: < 10 minutes
- **Applicable Environments**: Sonatype Nexus Repository & Kubernetes Workloads

---

## 🎯 Symptoms & Triggers

- Kubernetes pods failing with `ImagePullBackOff` or `ErrImagePull`.
- CI/CD Kaniko jobs failing with `error checking push permissions -- make sure you entered the correct credentials`.

---

## 🔍 Investigation Steps

1. Test Registry Reachability & Port Connectivity:
   ```bash
   # [READ-ONLY] Test HTTPS handshake to Nexus Docker port
   curl -vk "https://registry.example.com/v2/"
   ```
2. Verify Docker Realm in Nexus:
   - Login to Nexus Admin UI ➔ Security ➔ Realms.
   - Verify **Docker Bearer Token Realm** is in the **Active** column.
3. Check Nexus Blob Store Disk Capacity:
   ```bash
   # [READ-ONLY] Check disk space on Nexus host
   df -h /opt/sonatype-work
   ```

---

## 🛠️ Mitigation Procedures

### Scenario A: Disk 100% Full on Nexus Host
1. Free temporary system files:
   ```bash
   sudo journalctl --vacuum-size=500M
   ```
2. In Nexus UI: **System ➔ Tasks ➔ Create Task**.
   - Select **Admin - Compact blob store**.
   - Run task immediately to reclaim deleted blobs.

### Scenario B: Expired Kubernetes Pull Secret
1. Refresh the secret from valid credentials:
   ```bash
   kubectl create secret docker-registry nexus-registry-secret \
     --docker-server=registry.example.com \
     --docker-username=svc-k8s-pull \
     --docker-password='<password>' \
     -n workloads --dry-run=client -o yaml | kubectl apply -f -
   ```
2. Trigger rollout restart to resume pod pulling:
   ```bash
   kubectl rollout restart deployment -n workloads
   ```
