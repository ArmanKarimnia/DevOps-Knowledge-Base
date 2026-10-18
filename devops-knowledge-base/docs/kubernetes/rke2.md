# RKE2 Hardened Kubernetes Administration

RKE2 (Rancher Government / Rancher Kubernetes Engine 2) is a security-focused, CIS Benchmark-hardened Kubernetes distribution designed for mission-critical enterprise environments.

---

## 🏛️ RKE2 Architecture & Key Differences

- **FIPS 140-2 Compliant**: Compiled using FIPS 140-2 validated cryptographic modules.
- **Embedded etcd & Containerd**: Packages etcd, containerd, and runc in a single self-contained binary.
- **Hardened Defaults**: Restricts node filesystem permissions, applies CIS 1.23 benchmarks out of the box, and generates separate token secrets for server and agent registration.

---

## ⚙️ Server Configuration (`/etc/rancher/rke2/config.yaml`)

Prior to launching `rke2-server`, establish the declarative configuration:

```yaml
# /etc/rancher/rke2/config.yaml

# Cluster Token (used for agent joins)
token: "K10abcd1234efgh5678ijkl::server:rke2-cluster-secret"

# TLS SANs for Load Balancer or VIP
tls-san:
  - "k8s-api.example.com"
  - "192.0.2.10"

# Hardening Profile: CIS 1.23
profile: "cis-1.23"

# Disable default CNI (Canal) to enable Cilium eBPF
cni: "none"
disable-kube-proxy: true

# Disable bundled Ingress Controller (using Apache APISIX instead)
disable:
  - rke2-ingress-nginx

# Pod & Service CIDR
cluster-cidr: "10.42.0.0/16"
service-cidr: "10.43.0.0/16"

# Kubelet flags
kubelet-arg:
  - "protect-kernel-defaults=true"
  - "max-pods=110"
```

---

## 🚀 Service Lifecycle & Operational Commands

```bash
# [STATE-MODIFYING] Enable and start RKE2 control plane service
sudo systemctl enable --now rke2-server.service

# [READ-ONLY] Follow RKE2 startup logs
sudo journalctl -u rke2-server -f

# [READ-ONLY] Use bundled kubectl and configure environment
export KUBECONFIG=/etc/rancher/rke2/rke2.yaml
/var/lib/rancher/rke2/bin/kubectl get nodes -o wide
```

---

## 💾 RKE2 etcd Backup & Disaster Recovery

RKE2 includes built-in snapshot management for the embedded etcd datastore.

### 1. Trigger Manual On-Demand Snapshot
```bash
# [STATE-MODIFYING] Create named etcd snapshot saved to /var/lib/rancher/rke2/server/db/snapshots/
sudo rke2 etcd-snapshot save --name pre-upgrade-snapshot

# [READ-ONLY] List available snapshots
sudo rke2 etcd-snapshot list
```

### 2. Restore etcd Snapshot in Emergency
```bash
# [HIGH-RISK] Stop RKE2 service before restoring
sudo systemctl stop rke2-server

# Restore cluster state from snapshot
sudo rke2 server --cluster-reset --cluster-reset-restore-path=/var/lib/rancher/rke2/server/db/snapshots/pre-upgrade-snapshot

# Restart RKE2 service
sudo systemctl start rke2-server
```

---

## 🔒 Certificate Expiration & Rotation

RKE2 internal control plane certificates auto-renew during service restarts if within 90 days of expiration.

```bash
# [READ-ONLY] Check RKE2 certificate expiration dates
sudo rke2 certificate check

# [STATE-MODIFYING] Force manual certificate rotation
sudo rke2 certificate rotate
sudo systemctl restart rke2-server
```
