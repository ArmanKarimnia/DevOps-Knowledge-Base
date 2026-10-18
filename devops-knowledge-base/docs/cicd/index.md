# GitLab CI/CD & Delivery Engineering

GitLab CI/CD enables automated, scalable, and secure continuous integration, testing, vulnerability evaluation, and multi-environment deployment pipelines.

---

## 📑 Chapter Contents

- **[GitLab CI Fundamentals](gitlab-ci-fundamentals.md)**: Stages, jobs, `rules:`, variables, caching, and runner tags.
- **[Pipeline Architecture & Examples](pipeline-examples.md)**: Production pipeline blueprints for microservices, Kaniko image builds, and Helm releases.
- **[Runners & Artifacts](runners-and-artifacts.md)**: Kubernetes runner executor architecture, caching strategies (`cache:` vs `artifacts:`), and runner token rotation.
- **[Deployment Strategies](deployment-strategies.md)**: Blue/Green, Canary, and Rolling updates orchestrated through GitLab environments.
- **[Rollback & Release Governance](rollback-and-release-management.md)**: Automated rollback criteria, manual approval gates, and deployment auditing.

---

## ⚡ Core Principles of Secure CI/CD

1. **Keep Secrets Out of Shell Scripts**: Always inject credentials via masked, protected GitLab CI variables.
2. **Never Mount Docker Socket in Kubernetes Runners**: Mounting `/var/run/docker.sock` grants root host access. Build images daemonlessly with Kaniko.
3. **Decouple Artifacts from Caching**:
   - `cache:`: Best-effort temporary storage for dependencies (`node_modules/`, `.m2/`); may be wiped without failing pipelines.
   - `artifacts:`: Guaranteed storage for build outputs (binaries, test reports, SBOMs) passed between stages.
