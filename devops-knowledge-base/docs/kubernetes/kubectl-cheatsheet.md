# Kubectl Operational Commands Cheatsheet

A production-grade, copy-pasteable reference for Kubernetes cluster operations, workload debugging, networking diagnostics, and emergency recovery.

---

## 🧭 Cluster Contexts & Namespace Navigation

### 1. Context & Kubeconfig Management
```bash
# [READ-ONLY] View current active context
kubectl config current-context

# [READ-ONLY] List all contexts available in kubeconfig
kubectl config get-contexts

# [STATE-MODIFYING] Switch active cluster context
kubectl config use-context <context>

# [STATE-MODIFYING] Set default working namespace for current context
kubectl config set-context --current --namespace=<namespace>
```

### 2. Node Health & Resource Capacity
```bash
# [READ-ONLY] List all cluster nodes with roles, internal IPs, and Kubelet versions
kubectl get nodes -o wide

# [READ-ONLY] View real-time CPU and Memory utilization per node
kubectl top nodes

# [READ-ONLY] Inspect node conditions (MemoryPressure, DiskPressure, PIDPressure, Ready)
kubectl describe node <node-name> | grep -A 8 "Conditions:"

# [READ-ONLY] View allocated resource requests vs capacity on a node
kubectl describe node <node-name> | grep -A 6 "Allocated resources:"
```

---

## 🔍 Workload Diagnostics: Pods, Deployments & Rollouts

### 1. Pod Health & Status Filtering
```bash
# [READ-ONLY] List pods in namespace with IP, node placement, and restart count
kubectl get pods -n <namespace> -o wide

# [READ-ONLY] List all unhealthy pods across the entire cluster
kubectl get pods -A --field-selector status.phase!=Running,status.phase!=Succeeded

# [READ-ONLY] Find pods with high restart counts (>5)
kubectl get pods -n <namespace> --sort-by='.status.containerStatuses[0].restartCount'
```

### 2. Deep Pod Inspection & Events
```bash
# [READ-ONLY] Inspect pod events, probe failures, and container exit reasons
kubectl describe pod <pod-name> -n <namespace>

# [READ-ONLY] Extract only the termination reason and last exit code
kubectl get pod <pod-name> -n <namespace> -o jsonpath='{.status.containerStatuses[*].lastState.terminated}'
```

### 3. Log Streaming & Multi-Container Triage
```bash
# [READ-ONLY] Stream live logs from a specific container with timestamps
kubectl logs -f <pod-name> -c <container-name> -n <namespace> --timestamps --tail=200

# [READ-ONLY] View logs from previous container instance before crash (CrashLoopBackOff)
kubectl logs <pod-name> -c <container-name> -n <namespace> --previous

# [READ-ONLY] Stream aggregated logs across all pods matching a label selector
kubectl logs -f -l app.kubernetes.io/name=<service-name> -n <namespace> --max-log-requests=10
```

### 4. Interactive Debugging & Port Forwarding
```bash
# [READ-ONLY] Open interactive shell inside running container
kubectl exec -it <pod-name> -c <container-name> -n <namespace> -- /bin/sh

# [READ-ONLY] Forward local port 8080 to remote pod port 8080 for private API testing
kubectl port-forward pod/<pod-name> 8080:8080 -n <namespace>

# [READ-ONLY] Launch ephemeral debug container with network tools in target pod network namespace
kubectl debug -it <pod-name> -n <namespace> --image=nicolaka/netshoot --target=<container-name>
```

---

## 🔄 Deployments, Rollouts & Restarts

### 1. Rollout Inspection & Verification
```bash
# [READ-ONLY] Track rolling update progression in real-time
kubectl rollout status deployment/<deployment-name> -n <namespace>

# [READ-ONLY] View revision history and applied annotations
kubectl rollout history deployment/<deployment-name> -n <namespace>
```

### 2. Rolling Restarts & Rollbacks
```bash
# [STATE-MODIFYING] Trigger graceful rolling restart without code changes
kubectl rollout restart deployment/<deployment-name> -n <namespace>

# [STATE-MODIFYING] Roll back deployment to immediately preceding revision
kubectl rollout undo deployment/<deployment-name> -n <namespace>

# [STATE-MODIFYING] Roll back deployment to a specific historical revision
kubectl rollout undo deployment/<deployment-name> -n <namespace> --to-revision=2
```

---

## 🌐 Networking: Services & EndpointSlices

```bash
# [READ-ONLY] List Services with ClusterIP and Port mappings
kubectl get svc -n <namespace>

# [READ-ONLY] Verify whether backing Pods are registered as healthy endpoints
kubectl get endpointslices -l kubernetes.io/service-name=<service-name> -n <namespace>

# [READ-ONLY] Test cluster CoreDNS resolution from temporary pod
kubectl run dns-test --image=busybox:1.36 --restart=Never --rm -it -- nslookup <service-name>.<namespace>.svc.cluster.local
```

---

## 🔒 Security & RBAC Querying

```bash
# [READ-ONLY] Test if your current user has permission to delete pods in a namespace
kubectl auth can-i delete pods -n <namespace>

# [READ-ONLY] Test if a specific ServiceAccount can read secrets
kubectl auth can-i get secrets --as=system:serviceaccount:<namespace>:<sa-name> -n <namespace>
```

---

## ⚠️ High-Risk Maintenance & Recovery Commands

```bash
# [HIGH-RISK] Safely mark node unschedulable and evict all workloads (PDBs respected)
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data --force

# [STATE-MODIFYING] Uncordon node after maintenance to allow new pod scheduling
kubectl uncordon <node-name>

# [HIGH-RISK] Force-delete stuck terminating pod (WARNING: Bypasses graceful termination)
kubectl delete pod <pod-name> -n <namespace> --grace-period=0 --force
```
