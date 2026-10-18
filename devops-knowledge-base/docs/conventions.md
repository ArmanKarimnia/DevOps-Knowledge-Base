# Documentation Conventions & Safety Standards

To ensure maximum clarity, operational safety, and ease of copy-pasting during high-stress troubleshooting scenarios, all documentation across this repository adheres to the following conventions.

---

## 🚦 Operational Safety Levels

Every command or script block must clearly communicate its operational impact:

| Level | Tag | Meaning & Safety Procedure |
| :--- | :--- | :--- |
| **Safe** | `[READ-ONLY]` | The command queries, inspects, or visualizes state without modifying any system, file, or network setting. Safe to run immediately in production. |
| **Caution** | `[STATE-MODIFYING]` | The command creates, updates, restarts, or pauses non-critical resources. Verify parameters and current context (`kubectl config current-context`) before executing. |
| **Critical** | `[DESTRUCTIVE / HIGH-RISK]` | The command terminates pods, drains nodes, drops tables, resets offsets, or removes volumes. Can cause immediate user-visible downtime or data loss. Requires peer review or change approval. |

---

## 🏷️ Standard Placeholder Syntax

Never hardcode proprietary, production, or client-specific values. Always use angle-bracket placeholders formatted in kebab-case or uppercase:

- `<namespace>`: Kubernetes namespace (e.g., `workloads`, `ingress-apisix`)
- `<pod-name>`: Specific pod name (e.g., `order-service-7f8d9b-k4x2q`)
- `<context>`: Kubeconfig context name (e.g., `prod-rke2-cluster-01`)
- `<registry-url>`: Container registry endpoint (e.g., `registry.example.com`)
- `<service-name>`: Target service or deployment identifier
- `<database-name>`: Oracle SID / PDB or PostgreSQL database name
- `<username>` / `<password>`: Credentials placeholders

---

## 🌐 RFC-Compliant Network Addresses

All IP addresses and domain names used in examples follow official RFC reservations:

- **IPv4 Documentation Blocks (RFC 5737)**:
  - `192.0.2.0/24` (TEST-NET-1)
  - `198.51.100.0/24` (TEST-NET-2)
  - `203.0.113.0/24` (TEST-NET-3)
- **Private Subnets (RFC 1918)**:
  - `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
- **Documentation Domains (RFC 2606 & RFC 6761)**:
  - `example.com`, `example.org`, `example.net`

---

## 💻 Code Block Language Tags

All fenced code snippets must explicitly specify their grammar:
- `bash`: Shell commands, terminal sessions, CLI scripts
- `yaml`: Kubernetes manifests, Helm values, GitLab CI pipelines, Ansible playbooks
- `sql`: Oracle Database and PostgreSQL queries
- `json`: Configuration files, API payloads, Grafana dashboard models
- `ini`: Systemd units, MySQL/Postgres configs
- `mermaid`: Architectural flowcharts and sequence diagrams
