# Operational Incident Runbooks Directory

Production-hardened, prescriptive runbooks for active on-call triage during system incidents.

---

## 📑 Available Incident Runbooks

- **[Kubernetes Workload & Node Incident](kubernetes-incident.md)**: Handling cluster node failures, mass CrashLoopBackOff events, and DNS outages.
- **[Failed CI/CD Pipeline & Runner Outage](failed-ci-pipeline.md)**: Triaging stuck jobs, runner daemon crashes, and cache corruption.
- **[Container Registry & Nexus Pull Failures](container-registry-issues.md)**: Resolving 401 Unauthorized errors, blob store full, and image pull backoffs.
- **[Emergency TLS Certificate Expiration](certificate-expiration.md)**: Emergency rotation of expired ingress, API, or kubelet certificates.
- **[Database Connectivity & Connection Pool Exhaustion](database-connectivity.md)**: Diagnosing PostgreSQL connection spikes, Oracle blocking sessions, and JDBC thread starvation.
