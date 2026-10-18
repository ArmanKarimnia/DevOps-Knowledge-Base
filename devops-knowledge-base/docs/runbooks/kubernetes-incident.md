# Runbook: Kubernetes Node Failure & Mass Pod Outage

- **Severity Level**: SEV-1 / SEV-2
- **Target Response Time**: < 5 minutes
- **Applicable Environments**: RKE2 Kubernetes Clusters

---

## 🎯 Symptoms & Alert Triggers

- Prometheus alert firing: `NodeNotReady`, `KubePodCrashLooping`, or `DeploymentReplicasUnavailable`.
- Customer requests returning HTTP 502 / 503 via APISIX.

---

## 🔍 Initial Triage (First 3 Minutes)

1. Check overall cluster node states:
   ```bash
   # [READ-ONLY] Identify nodes reporting NotReady
   kubectl get nodes -o wide
   ```
2. If a node is `NotReady`, inspect node conditions:
   ```bash
   # [READ-ONLY] Check kernel conditions, DiskPressure, MemoryPressure
   kubectl describe node <not-ready-node> | grep -A 8 "Conditions:"
   ```
3. Identify affected pods on that node:
   ```bash
   # [READ-ONLY] List pods scheduled on the failing node
   kubectl get pods -A --field-selector spec.nodeName=<not-ready-node> -o wide
   ```

---

## 🛠️ Mitigation & Eviction Procedure

### Scenario A: Node Hardware / Network Failure
If the node is completely down or unreachable:

1. Safely cordon the node to prevent new pods from landing on it:
   ```bash
   # [STATE-MODIFYING] Mark unschedulable
   kubectl cordon <not-ready-node>
   ```
2. Drain workloads from the node:
   ```bash
   # [HIGH-RISK] Force eviction of stateless workloads
   kubectl drain <not-ready-node> --ignore-daemonsets --delete-emptydir-data --force --timeout=3m
   ```
3. Verify that Deployments automatically rescheduled replacements on healthy nodes:
   ```bash
   kubectl get deployment -n workloads
   ```

### Scenario B: Kubelet / Containerd Daemon Hang
If the node is online via SSH but Kubelet is unresponsive:

1. SSH into the node:
   ```bash
   ssh opsadmin@<node-ip>
   ```
2. Check memory and swap:
   ```bash
   free -h
   dmesg -T | grep -i oom
   ```
3. Restart containerd and rke2-agent:
   ```bash
   # [STATE-MODIFYING] Restart container runtime
   sudo systemctl restart containerd
   sudo systemctl restart rke2-agent
   ```
4. Confirm node status returns to `Ready`:
   ```bash
   kubectl get nodes
   ```

---

## ✅ Verification & Post-Recovery
- [ ] All deployment replicas match desired count: `kubectl get deployments -A`.
- [ ] HTTP 5xx error rate on APISIX drops to < 0.01%.
- [ ] If node required reboot, uncordon: `kubectl uncordon <node-name>`.
