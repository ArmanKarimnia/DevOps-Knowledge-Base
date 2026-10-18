# Service Level Indicators (SLI), Objectives (SLO) & Error Budgets

The Site Reliability Engineering (SRE) framework for quantifying system reliability and making data-driven release decisions.

---

## 📐 Terminology & Mathematical Definitions

$$\text{SLI} = \frac{\text{Good Events}}{\text{Total Valid Events}} \times 100\%$$

- **SLI (Service Level Indicator)**: The exact metric measured (e.g., proportion of successful HTTP requests with latency < 300ms).
- **SLO (Service Level Objective)**: The target reliability agreed upon internally by engineering and product teams (e.g., 99.9% over a rolling 30-day window).
- **SLA (Service Level Agreement)**: The external contract with clients with legal or financial consequences if violated (e.g., 99.5%). *SLO must always be stricter than SLA.*
- **Error Budget**: The permitted unreliability over a time window:
  $$\text{Error Budget} = 100\% - \text{SLO} = 100\% - 99.9\% = 0.1\%$$

---

## ⏱️ Availability Calculation Table (Rolling 30 Days)

| Target Availability | Permitted Downtime / Month | Permitted Downtime / Year |
| :--- | :--- | :--- |
| **99.0% (Two Nines)** | 7 hours, 18 minutes | 3.65 days |
| **99.9% (Three Nines)** | 43 minutes, 49 seconds | 8.76 hours |
| **99.95%** | 21 minutes, 54 seconds | 4.38 hours |
| **99.99% (Four Nines)** | 4 minutes, 23 seconds | 52.6 minutes |

---

## 🔥 Multiwindow Multi-Burn-Rate Alerting

Alerting on simple thresholds generates noise. Modern SRE practices use Multi-Burn-Rate alerting to notify on consumption of the 30-day error budget:

```yaml
# Alert if burning 2% of monthly budget within 1 hour (Burn rate 14.4x)
- alert: HighErrorBudgetBurnRate
  expr: |
    (
      sum(rate(http_requests_total{status=~"5.."}[1h]))
      / sum(rate(http_requests_total[1h]))
    ) > (14.4 * (1 - 0.999))
  for: 2m
  labels:
    severity: page
  annotations:
    summary: "Critical Error Budget Burn Rate (14.4x) in {{ $labels.service }}"
```
