# Runbook: Failed CI/CD Pipeline & Runner Outage

- **Severity Level**: SEV-2 / SEV-3
- **Target Response Time**: < 15 minutes
- **Applicable Environments**: GitLab CI/CD & Kubernetes Runners

---

## 🎯 Symptoms & Triggers

- Developer pull requests blocked with message: `This job is stuck because you don't have any active runners online with any of these tags`.
- Build jobs timing out during container image compilation or cache extraction.

---

## 🔍 Investigation Steps

1. Check GitLab Runner Pods in Kubernetes:
   ```bash
   # [READ-ONLY] Check status of runner manager pods
   kubectl get pods -n gitlab-runners -o wide
   ```
2. Inspect runner manager logs:
   ```bash
   # [READ-ONLY] Check runner logs for registration errors or API 401s
   kubectl logs -f -l app=gitlab-runner -n gitlab-runners --tail=100
   ```
3. Check for stuck / orphaned job pods:
   ```bash
   # [READ-ONLY] Identify job pods running longer than 1 hour
   kubectl get pods -n gitlab-runners --sort-by='.metadata.creationTimestamp'
   ```

---

## 🛠️ Mitigation Procedures

### Issue 1: Runner Registration Token Expired
If logs report `ERROR: Registering runner... forbidden (403)`:
1. Generate a new runner authentication token in GitLab Admin ➔ CI/CD ➔ Runners.
2. Update Kubernetes runner secret:
   ```bash
   kubectl create secret generic gitlab-runner-secret \
     --from-literal=runner-token="<new-token>" \
     -n gitlab-runners --dry-run=client -o yaml | kubectl apply -f -
   ```
3. Restart runner deployment:
   ```bash
   kubectl rollout restart deployment/gitlab-runner -n gitlab-runners
   ```

### Issue 2: Runner Node Disk Full (Docker/Kaniko Cache)
```bash
# Clean up orphaned build volumes
kubectl delete pods -n gitlab-runners --field-selector status.phase=Failed
```
