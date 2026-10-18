# Contributing to DevOps Knowledge Base

Thank you for your interest in contributing to the **DevOps Knowledge Base & Operations Handbook**. This repository is designed to be a living, high-standard reference for Linux administration, Kubernetes, cloud-native networking, CI/CD, and site reliability operations.

## Guiding Principles

1. **Production-Ready & Field-Tested**: Every command, manifest, and procedure should reflect real operational conditions. Avoid pseudo-code when real syntax can be supplied.
2. **Safety & Zero Secrets**: Never commit actual secrets, API tokens, passwords, private keys, company internal DNS names, or sensitive IP addresses. Always use standard documentation RFC placeholders:
   - IPs: `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` (RFC 5737)
   - Hostnames: `*.example.com`, `registry.example.org`
   - Placeholders: `<namespace>`, `<pod-name>`, `<service-name>`, `<token>`
3. **Copy-Pastable with Explicit Risk Warning**: For any command that alters state or causes disruption (e.g., node drain, pod eviction, table drop, partition rebalance), prefix it with a visible risk indicator:
   - `[READ-ONLY]` vs `[STATE-MODIFYING]` vs `[HIGH-RISK / DESTRUCTIVE]`
4. **Structured Format**: Adhere to the templates in `docs/templates/`:
   - `cheatsheet-template.md`
   - `runbook-template.md`
   - `troubleshooting-template.md`
   - `tool-documentation-template.md`

---

## Local Development Workflow

### Prerequisites
- Python 3.10+
- `pip` or `pipx`

### Setup Local MkDocs Server
```bash
# Clone the repository
git clone https://github.com/yourusername/devops-knowledge-base.git
cd devops-knowledge-base

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install documentation dependencies
pip install -r requirements-docs.txt

# Run local preview server
mkdocs serve
```
Open `http://127.0.0.1:8000` in your web browser.

---

## Validation & Linting

Before pushing your changes, execute the validation test scripts:

```bash
# Run link and format validation
chmod +x scripts/*.sh
./scripts/check-links.sh
./scripts/validate-docs.sh

# Run MkDocs strict build
mkdocs build --strict
```

---

## Pull Request Guidelines

1. **Branch Naming**:
   - `feat/topic-name` (e.g., `feat/cilium-egress-gateway`)
   - `fix/broken-link-helm`
   - `docs/troubleshooting-oracle`
2. **Commit Messages**:
   - Follow Conventional Commits: `docs(k8s): add cilium bpf debugging cheatsheet`
3. **Verification**:
   - Confirm all internal Markdown links resolve properly.
   - Confirm code blocks have appropriate syntax language tags (`bash`, `yaml`, `sql`, `json`).
