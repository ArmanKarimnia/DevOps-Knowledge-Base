# DevOps Knowledge Base & Operations Handbook

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docs Build](https://img.shields.io/badge/MkDocs-Material-teal.svg)](https://squidfunk.github.io/mkdocs-material/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-v1.30+-326CE5.svg?logo=kubernetes&logoColor=white)](docs/kubernetes/index.md)
[![RKE2](https://img.shields.io/badge/RKE2-Hardened%20K8s-orange.svg)](docs/kubernetes/rke2.md)
[![Cilium](https://img.shields.io/badge/Cilium-eBPF%20Networking-blue.svg)](docs/kubernetes/cilium.md)
[![GitLab CI](https://img.shields.io/badge/GitLab-CI%2FCD-fc6d26.svg?logo=gitlab&logoColor=white)](docs/cicd/index.md)
[![APISIX](https://img.shields.io/badge/Apache-APISIX-e84335.svg)](docs/apisix/index.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> A practical, production-hardened DevOps engineering knowledge base, operational runbooks, deep-dive cheatsheets, and architecture blueprints for platform engineers, SREs, and systems administrators.

---

## 🧭 Purpose & Three Core Pillars

This repository is built as a single source of truth for real-world infrastructure operations:

1. **📚 Structured Learning Resource**: Progressive engineering roadmaps spanning Linux systems, container runtimes, Kubernetes/RKE2 internals, Cilium eBPF networking, GitLab CI/CD pipelines, and IAM.
2. **⚡ High-Density Quick References**: Command cheatsheets with copyable snippets, parameter explanations, real output expectations, and explicit risk indicators (`[READ-ONLY]`, `[MODIFY]`, `[DESTRUCTIVE]`).
3. **🛠️ Personal Engineering Handbook**: Standardized operational runbooks, disaster recovery procedures, incident response frameworks, and post-mortem templates derived from enterprise multi-cluster environments.

---

## 🗂️ Documentation Directory Matrix

| Section | Focus Areas | Quick Links |
| :--- | :--- | :--- |
| **🚀 Start Here** | Learning path, terminology, formatting conventions | [Roadmap](docs/learning-roadmap.md) • [Glossary](docs/glossary.md) • [Conventions](docs/conventions.md) |
| **📐 Architecture** | DevOps lifecycle, release engineering, platform blueprints | [Overview](docs/architecture/overview.md) • [Lifecycle](docs/architecture/devops-lifecycle.md) • [Release Mgmt](docs/architecture/release-management.md) |
| **🐧 Linux & SysAdmin** | Ubuntu/RHEL administration, systemd, networking, storage, SSH | [Linux Index](docs/linux/index.md) • [Commands Cheatsheet](docs/linux/commands-cheatsheet.md) • [Troubleshooting](docs/linux/troubleshooting.md) |
| **🔀 Git & Versioning** | Branching workflows, rebase vs merge, hooks, recovery | [Git Index](docs/git/index.md) • [Git Cheatsheet](docs/git/commands-cheatsheet.md) • [Branching](docs/git/branching-strategies.md) |
| **🐳 Containers & Docker** | Multi-stage builds, rootless, Compose, networking, security | [Docker Index](docs/docker/index.md) • [Docker Cheatsheet](docs/docker/commands-cheatsheet.md) • [Compose](docs/docker/docker-compose.md) |
| **☸️ Kubernetes & RKE2** | Control plane, scheduling, RBAC, Cilium CNI, Helm, RKE2 | [K8s Index](docs/kubernetes/index.md) • [Kubectl Cheatsheet](docs/kubernetes/kubectl-cheatsheet.md) • [RKE2](docs/kubernetes/rke2.md) • [Cilium](docs/kubernetes/cilium.md) |
| **🌐 API Gateway (APISIX)** | Routes, upstreams, SSL certificates, key-auth, rate limiting | [APISIX Index](docs/apisix/index.md) • [Routes & Upstreams](docs/apisix/routes-services-upstreams.md) • [Plugins](docs/apisix/plugins-and-authentication.md) |
| **🔄 CI/CD & Delivery** | GitLab CI pipelines, runner tuning, artifacts, approvals, rollbacks | [CI/CD Index](docs/cicd/index.md) • [Pipelines](docs/cicd/pipeline-examples.md) • [Strategies](docs/cicd/deployment-strategies.md) |
| **📦 Nexus Repository** | Proxy caches, private Docker registries, air-gapped sync | [Nexus Index](docs/nexus/index.md) • [Docker Registries](docs/nexus/docker-registries.md) • [Proxying](docs/nexus/package-proxying.md) |
| **🤖 Ansible & Automation** | Roles, idempotent tasks, dynamic inventories, Bash, YAML | [Ansible Index](docs/ansible/index.md) • [Ansible Cheatsheet](docs/ansible/commands-cheatsheet.md) • [Bash Automation](docs/automation/bash.md) |
| **📊 Observability** | Prometheus, Grafana, ELK Stack, SLI/SLO calculations, alerts | [Observability Index](docs/observability/index.md) • [Prometheus](docs/observability/prometheus.md) • [ELK Stack](docs/observability/elk-stack.md) |
| **📨 Kafka & Streaming** | Brokers, consumer group offsets, Kafka Connect, lag diagnostics | [Kafka Index](docs/kafka/index.md) • [Kafka Cheatsheet](docs/kafka/commands-cheatsheet.md) • [Consumer Groups](docs/kafka/consumer-groups-and-offsets.md) |
| **💾 Databases & Storage** | Oracle SQL, SQL*Plus, PostgreSQL, Ceph, S3/RGW, Longhorn | [Databases](docs/databases/index.md) • [Oracle Cheatsheet](docs/databases/oracle-sql-cheatsheet.md) • [Ceph Storage](docs/storage/ceph.md) |
| **🔒 Security & IAM** | Keycloak, OAuth 2.0/OIDC, TLS certs, CIS benchmarks, DevSecOps | [Security Index](docs/security/index.md) • [Keycloak](docs/security/keycloak.md) • [TLS](docs/security/tls-and-certificates.md) |
| **📋 Runbooks & Ops** | Severity incident procedures, runbooks, RCA, recovery | [Runbooks Index](docs/runbooks/index.md) • [K8s Incident](docs/runbooks/kubernetes-incident.md) • [Failed Pipeline](docs/runbooks/failed-ci-pipeline.md) |

---

## 🔒 Security & Public Repository Safety Checklist

Before publishing this repository or adding personal contributions:

- [x] **No Hardcoded Credentials**: API tokens, AWS keys, passwords, and private SSH keys are strictly excluded.
- [x] **No Kubeconfig Leaks**: No internal cluster certificates, server endpoints, or bearer tokens.
- [x] **RFC-Compliant IP Addresses**: All sample IP addresses adhere to RFC 5737 (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`) or private RFC 1918 blocks.
- [x] **Generic Hostnames**: Domains use `*.example.com` or `*.internal.net`.
- [x] **No Internal Customer Identifiers**: All identifiers are generalized.
- [!] **Git History Warning**: Remember that deleting a secret from the HEAD commit **does not remove it from Git history**. Always scrub using `git-filter-repo` or BFG if a secret is accidentally committed.

---

## 💻 Local Preview with MkDocs

To run this documentation locally with live-reload and full search:

```bash
# Clone the repository
git clone https://github.com/yourusername/devops-knowledge-base.git
cd devops-knowledge-base

# Set up Python environment
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-docs.txt

# Start development server
mkdocs serve
```
Navigate to `http://localhost:8000`.

---

## 🏷️ Suggested GitHub Topics & Tags

When publishing to GitHub, add these repository topics:
`devops` • `kubernetes` • `rke2` • `cilium` • `gitlab-ci` • `apisix` • `linux` • `sre` • `runbooks` • `cheatsheet` • `ansible` • `prometheus` • `grafana` • `kafka` • `keycloak` • `ceph`

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
