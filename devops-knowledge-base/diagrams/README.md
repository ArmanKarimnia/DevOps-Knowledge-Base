# DevOps Architecture Diagrams

This directory contains reference architectural diagrams created using [Mermaid.js](https://mermaid.js.org/). Mermaid diagrams are rendered natively on GitHub, in MkDocs (via `pymdownx.superfences`), and inside modern Markdown editors.

## Available Architecture Diagrams

1. **Enterprise CI/CD Delivery Pipeline**:
   - Location: Embedded in `docs/architecture/devops-lifecycle.md` and `docs/cicd/gitlab-ci-fundamentals.md`
   - Flow: Developer Commit ➔ GitLab Runner (Lint/Test) ➔ Trivy Scan ➔ Kaniko Container Build ➔ Sonatype Nexus ➔ Helm Staging Deploy ➔ Manual QA Gate ➔ Production Blue/Green Deploy.

2. **Kubernetes Request Path & API Gateway Topology**:
   - Location: Embedded in `docs/architecture/overview.md` and `docs/apisix/architecture.md`
   - Flow: Client Traffic ➔ DNS/TLS Termination ➔ Apache APISIX Gateway ➔ Cilium eBPF Service Mesh / Ingress Controller ➔ Kubernetes Service ➔ Pod Endpoint (with sidecar/mTLS).

3. **Cilium eBPF Datapath vs iptables**:
   - Location: Embedded in `docs/kubernetes/cilium.md`
   - Comparison: Traditional kube-proxy iptables sequential evaluation vs Cilium direct eBPF socket routing and BPF maps.

4. **Incident Response & Triage Workflow**:
   - Location: Embedded in `docs/operations/incident-response.md`
   - Lifecycle: Alert Fired ➔ Triage & Sev Level Assignment ➔ Incident Commander Activated ➔ Containment ➔ Resolution & Verification ➔ Blameless Post-Mortem.

5. **Observability Pipeline**:
   - Location: Embedded in `docs/observability/index.md`
   - Flow: Node/App Exporters ➔ Prometheus Scrape ➔ Alertmanager ➔ Grafana Dashboards / On-Call Paging; Beats/Fluentbit ➔ Logstash ➔ Elasticsearch ➔ Kibana.
