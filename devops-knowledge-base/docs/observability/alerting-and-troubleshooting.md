# Alert Quality, Alertmanager Routing & Noise Mitigation

Alert fatigue degrades engineering response times. Alerts must be actionable, symptom-based, and routed intelligently.

---

## 🔔 Principles of High-Quality Alerts

1. **Page on Symptoms, Not Causes**: Page on high customer error rate or latency; do not page on high CPU usage unless it actively causes latency degradation.
2. **Every Page Must Have a Runbook**: If an alert does not have a linked, actionable runbook URL in its annotations, it should be a ticket or dashboard metric, not a high-priority page.
3. **Use Inhibitions in Alertmanager**: If an entire data center or Kubernetes node is down, suppress individual pod crash alerts from that node.

---

## ⚙️ Alertmanager Routing Configuration

```yaml
# /etc/alertmanager/alertmanager.yml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'slack-default'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty-urgent'
      continue: true

inhibit_rules:
  # Inhibit pod-level alerts if the underlying node is down
  - source_match:
      alertname: 'NodeNotReady'
    target_match:
      alertname: 'KubePodCrashLooping'
    equal: ['node', 'instance']

receivers:
  - name: 'pagerduty-urgent'
    pagerduty_configs:
      - service_key: '${PAGERDUTY_TOKEN}'
        severity: 'critical'

  - name: 'slack-default'
    slack_configs:
      - channel: '#alerts-ops'
        api_url: '${SLACK_WEBHOOK_URL}'
        send_resolved: true
```
