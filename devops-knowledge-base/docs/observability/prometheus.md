# Prometheus Architecture & PromQL Query Recipes

Prometheus is a time-series database and monitoring system utilizing a pull-based HTTP scrape model.

---

## 📊 Core Metric Types

1. **Counter**: Monotonically increasing number (e.g., `http_requests_total`). Always use `rate()` or `irate()` to calculate per-second values. Never query raw counter values directly.
2. **Gauge**: Value that can go up and down arbitrarily (e.g., `node_memory_Active_bytes`, `kafka_consumergroup_lag`).
3. **Histogram**: Samples observations (usually request durations or response sizes) into configurable buckets (e.g., `http_request_duration_seconds_bucket`). Use `histogram_quantile()` to calculate p95/p99 latency.
4. **Summary**: Calculates client-side quantiles directly.

---

## ⚡ Essential PromQL Query Recipes

### 1. HTTP Request Rate (RPS) per Service
```promql
sum by (service) (rate(http_requests_total{status=~"2.."}[5m]))
```

### 2. HTTP 5xx Error Rate Percentage
```promql
sum(rate(http_requests_total{status=~"5.."}[5m]))
  /
sum(rate(http_requests_total[5m])) * 100
```

### 3. 99th Percentile Request Latency (p99)
```promql
histogram_quantile(0.99, sum by (le, service) (rate(http_request_duration_seconds_bucket[5m])))
```

### 4. Kubernetes Pod CPU Usage vs Limit Percentage
```promql
sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (pod, namespace)
  /
sum(container_spec_cpu_quota{container!=""} / 100000) by (pod, namespace) * 100
```

### 5. Node Memory Saturation Percentage
```promql
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
```

---

## 🚨 Production Alerting Rule Example

```yaml
groups:
  - name: kubernetes-workload-alerts
    rules:
      - alert: WorkloadHighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m])) by (namespace, service)
          / sum(rate(http_requests_total[5m])) by (namespace, service) > 0.05
        for: 3m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.service }} 5xx error rate > 5%"
          description: "Service {{ $labels.service }} in {{ $labels.namespace }} has error rate of {{ $value | humanizePercentage }} for > 3m."
```
