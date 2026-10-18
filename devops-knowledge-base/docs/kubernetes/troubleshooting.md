# Kubernetes Troubleshooting & Incident Triage

A practical diagnostic guide for diagnosing common pod states, scheduling failures, networking issues, and node pressure conditions.

---

## 🚦 Common Pod Failure States

### 1. `CrashLoopBackOff`
- **Meaning**: The container starts, crashes, exits with an error code, and kubelet enters an exponential backoff sleep before retrying.
- **Triage Steps**:
  1. Check previous container exit logs:
     ```bash
     kubectl logs <pod-name> -n <namespace> --previous
     ```
  2. Inspect termination reason and exit code:
     ```bash
     kubectl describe pod <pod-name> -n <namespace> | grep -A 5 "Last State:"
     ```
  3. Common causes: Missing environment variables, database connection timeouts, syntax errors in config files.

---

### 2. `ImagePullBackOff` / `ErrImagePull`
- **Meaning**: Kubelet failed to pull the specified container image.
- **Triage Steps**:
  1. Inspect exact pull error in Events:
     ```bash
     kubectl describe pod <pod-name> -n <namespace> | grep -A 5 "Events:"
     ```
  2. Check whether image name and tag exist in the registry:
     - Typos in image tag (e.g., `:v1.2` instead of `:1.2.0`).
  3. Check image pull secrets:
     ```bash
     kubectl get secret <image-pull-secret> -n <namespace>
     ```
     Ensure `imagePullSecrets:` is referenced in the Pod spec or ServiceAccount.

---

### 3. `Pending` Pod (Scheduling Bottlenecks)
- **Meaning**: Pod cannot be scheduled to any worker node.
- **Triage Steps**:
  1. Inspect scheduler failure messages:
     ```bash
     kubectl describe pod <pod-name> -n <namespace> | grep -A 5 "Events:"
     ```
  2. Common causes:
     - `0/10 nodes are available: 10 Insufficient cpu/memory`: Requested CPU/RAM exceeds cluster capacity.
     - `node(s) had untolerated taint`: Workload lacks matching toleration.
     - `node(s) didn't match PodTopologySpread / PodAntiAffinity`: Anti-affinity constraints prevent co-location.

---

### 4. `OOMKilled` (Exit Code 137)
- **Meaning**: Container memory exceeded `resources.limits.memory` and was killed by Linux cgroup OOM killer.
- **Resolution**:
  1. Check peak usage via Prometheus or `kubectl top pod <pod-name> -n <namespace>`.
  2. Increase memory limit or tune JVM heap size (`-Xmx`).

---

### 5. `Terminating` Pod Stuck Indefinitely
- **Meaning**: Pod process is ignoring `SIGTERM` or waiting on an unmounted NFS/storage volume.
- **Resolution**:
  1. Verify if finalizers are blocking deletion:
     ```bash
     kubectl get pod <pod-name> -n <namespace> -o jsonpath='{.metadata.finalizers}'
     ```
  2. If safe, remove finalizers or force-terminate:
     ```bash
     kubectl delete pod <pod-name> -n <namespace> --grace-period=0 --force
     ```
