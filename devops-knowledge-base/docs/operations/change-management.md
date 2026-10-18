# Production Change Management & Governance

High-performing DevOps teams balance velocity with risk governance through automated checks and standardized change request records (RFCs).

---

## 📋 Standard Change Request Template

Every production change (infrastructure upgrade, firewall adjustment, database migration) must record:

```markdown
### Change Overview
- **Service Affected**: Order Service & APISIX Gateway
- **Scheduled Window**: 2026-10-20 02:00 UTC - 03:00 UTC
- **Engineer**: @ops-engineer | Peer Reviewer: @principal-sre

### Detailed Plan
1. Drain node-03 (`kubectl drain node-03 --ignore-daemonsets`).
2. Apply OS kernel update and reboot node.
3. Validate node readiness (`kubectl uncordon node-03`).

### Rollback Plan
- If node fails to join cluster within 10 minutes, boot into previous kernel from GRUB menu and restore previous `/etc/rancher/rke2/config.yaml`.

### Verification Steps
- `kubectl get nodes` shows Ready.
- APISIX error rates remain < 0.01% on Grafana dashboard.
```
