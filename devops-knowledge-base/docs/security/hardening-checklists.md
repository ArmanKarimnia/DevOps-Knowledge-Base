# Production Security Hardening Checklists

CIS Benchmarks and defense-in-depth security validation checklists for Linux hosts and Kubernetes clusters.

---

## 🐧 Linux OS Node Hardening Checklist

- [ ] **SSH Hardened**: `PermitRootLogin no`, `PasswordAuthentication no`, non-standard port or firewall-restricted.
- [ ] **Kernel Parameters (`/etc/sysctl.d/99-security.conf`)**:
  - `net.ipv4.ip_forward = 1` (Only on router/K8s nodes).
  - `net.ipv4.conf.all.accept_source_route = 0` (Reject IP source routing).
  - `net.ipv4.conf.all.rp_filter = 1` (Enable reverse path filtering to prevent IP spoofing).
  - `fs.protected_hardlinks = 1` and `fs.protected_symlinks = 1`.
- [ ] **Firewall Active**: UFW / iptables / nftables active with default DROP policy on incoming traffic.
- [ ] **Automatic Security Patches**: `unattended-upgrades` installed and active for critical CVEs.

---

## ☸️ Kubernetes Pod Security Standards (PSS) Checklist

Enforce the **Restricted** Pod Security Profile across application namespaces:

- [ ] `runAsNonRoot: true`: Container user UID must not be `0`.
- [ ] `readOnlyRootFilesystem: true`: Container cannot write to root `/`.
- [ ] `allowPrivilegeEscalation: false`: Child processes cannot acquire higher privileges than parent.
- [ ] `capabilities.drop: ["ALL"]`: Drop all default Linux kernel capabilities.
- [ ] `seccompProfile.type: "RuntimeDefault"`: Restrict system calls available to containers.
- [ ] `resources.limits`: CPU and memory limits strictly defined on all containers.
- [ ] `NetworkPolicy`: Default-deny ingress and egress applied to all application namespaces.
