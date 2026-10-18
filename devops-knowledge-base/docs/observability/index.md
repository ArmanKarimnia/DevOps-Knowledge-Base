# Cloud-Native Observability & Reliability Engineering

Observability provides actionable visibility into distributed systems through the **Three Pillars of Observability**: Metrics (Prometheus), Visualizations & Dashboards (Grafana), and Centralized Logs (ELK Stack).

---

## 📑 Chapter Contents

- **[Prometheus Architecture & PromQL](prometheus.md)**: Scrape configs, metrics types (Counter, Gauge, Histogram, Summary), and production query recipes.
- **[Grafana Visualizations & Dashboards](grafana.md)**: Panel types, variables, templating, and dashboard JSON provisioning.
- **[ELK Stack Log Aggregation](elk-stack.md)**: Elasticsearch cluster health, Logstash pipelines, Filebeat shipping, and Kibana search syntax.
- **[SLI, SLO, SLA & Error Budgets](sli-slo-sla.md)**: Formulating quantitative reliability objectives and error budget burn rate alerting.
- **[Alerting & Troubleshooting](alerting-and-troubleshooting.md)**: Alertmanager routing, deduplication, inhibiting rules, and alert fatigue mitigation.

---

## 🏛️ Unified Observability Pipeline

```mermaid
graph TD
    subgraph Workload_Tier [Kubernetes Pods & Nodes]
        NodeExp[Node Exporter :9100]
        KubeState[Kube-State-Metrics]
        App[Application :8080/metrics]
        Logs[Application Stdout Logs]
    end

    subgraph Metrics_Tier [Metrics Pipeline]
        Prom[Prometheus Server]
        AM[Alertmanager]
        Graf[Grafana Dashboards]
        
        Prom -->|Scrapes :9090| NodeExp
        Prom -->|Scrapes| KubeState
        Prom -->|Scrapes| App
        Prom -->|Alert Rules| AM
        AM -->|Pages| OnCall[On-Call PagerDuty / Slack]
        Graf -->|PromQL Queries| Prom
    end

    subgraph Logging_Tier [Log Aggregation Pipeline]
        Beats[Filebeat / Fluent Bit]
        LS[Logstash / Pipeline Filtering]
        ES[(Elasticsearch Cluster)]
        Kib[Kibana UI]
        
        Logs --> Beats
        Beats --> LS
        LS --> ES
        Kib -->|Lucene Queries| ES
    end
```
