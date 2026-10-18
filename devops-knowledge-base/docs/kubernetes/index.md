# Kubernetes & RKE2 Cluster Engineering

Comprehensive guides and operational runbooks for orchestrating cloud-native workloads using **Kubernetes**, **RKE2 (Government-grade hardened Kubernetes)**, **Cilium eBPF networking**, and **Helm 3**.

---

## 📑 Chapter Contents

- **[Architecture & Control Plane](architecture.md)**: Deep dive into API Server, etcd quorum, Controller Manager, Scheduler, Kubelet, and CRI runtime.
- **[Kubectl Cheatsheet](kubectl-cheatsheet.md)**: High-density command reference covering pods, deployments, services, endpoints, logs, contexts, and diagnostics.
- **[Workloads & Services](workloads-and-services.md)**: Deployments, StatefulSets, DaemonSets, Jobs, CronJobs, ClusterIP, NodePort, and LoadBalancers.
- **[Configuration & Secrets](configuration-and-secrets.md)**: ConfigMaps, Secrets, immutable configs, volume projection, and secret encryption at rest.
- **[RBAC & Security Hardening](rbac.md)**: Roles, ClusterRoles, RoleBindings, ServiceAccounts, least-privilege, and Pod Security Standards (PSS).
- **[Cilium eBPF Networking & Hubble](cilium.md)**: Kernel-level routing, kube-proxy replacement, L3/L4/L7 Network Policies, and Hubble observability.
- **[Cluster Networking & Ingress](networking.md)**: CNI fundamentals, CoreDNS tuning, EndpointSlices, Ingress controllers, and MTU configuration.
- **[Storage & CSI](storage.md)**: PersistentVolumes (PV), PersistentVolumeClaims (PVC), StorageClasses, Longhorn, Ceph CSI, and volume expansion.
- **[Helm 3 Packaging & Releases](helm.md)**: Chart templating, `values.yaml` hierarchy, atomic upgrades, and rollback strategies.
- **[RKE2 Cluster Operations](rke2.md)**: Architecture, installation, `config.yaml`, CIS 1.23 profile, certificates, and control plane backup.
- **[Cluster Upgrades & Maintenance](upgrades-and-maintenance.md)**: Safe node cordon, drain, eviction, sequential RKE2 binary upgrades, and etcd snapshotting.
- **[Kubernetes Troubleshooting Guide](troubleshooting.md)**: Step-by-step triage for CrashLoopBackOff, Pending pods, OOMKilled, Evicted states, and DNS failures.
