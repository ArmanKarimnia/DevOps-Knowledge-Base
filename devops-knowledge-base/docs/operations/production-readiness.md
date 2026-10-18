# Production Readiness Review (PRR) Checklist

Before any new microservice or infrastructure component is permitted to receive production traffic, it must satisfy this comprehensive scorecard.

---

## 🚦 PRR Evaluation Scorecard

### 1. High Availability & Resilience
- [ ] At least **3 replicas** running in production.
- [ ] `PodAntiAffinity` configured to schedule replicas across different nodes and availability zones.
- [ ] `PodDisruptionBudget` (PDB) defined with `minAvailable: 2`.
- [ ] Graceful termination handling (`terminationGracePeriodSeconds` sufficient for draining in-flight requests).

### 2. Resource Management
- [ ] Explicit `requests` and `limits` defined for both CPU and Memory.
- [ ] Memory limit matches or exceeds application heap allocation.

### 3. Observability & Monitoring
- [ ] Prometheus metrics endpoint active and scraped (`/metrics`).
- [ ] Structured JSON logging emitted to `stdout`/`stderr` (no multi-line stack traces printed without formatting).
- [ ] Alerting rules configured with linked runbooks for high error rate and p99 latency spikes.

### 4. Security Hardening
- [ ] Container runs as non-root user (UID >= 10000).
- [ ] Read-only root filesystem enabled (`readOnlyRootFilesystem: true`).
- [ ] No hardcoded secrets; secrets injected via Kubernetes Secret or Secrets Store CSI.
- [ ] NetworkPolicy restricts inbound and outbound traffic to authorized peers only.
