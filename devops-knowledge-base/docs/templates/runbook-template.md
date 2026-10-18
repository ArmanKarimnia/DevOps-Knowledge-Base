# Runbook: [Incident / Operation Title]

- **Severity Level**: [SEV-1 / SEV-2 / SEV-3]
- **Target Response Time**: [< X minutes]
- **Applicable Environments**: [List target clusters, operating systems, or datastores]

---

## 🎯 Symptoms & Triggers
- **Prometheus Alert**: `[AlertNameFiring]`
- **Customer Symptom**: [e.g., HTTP 5xx errors, latency elevated, checkout blocked]

---

## 🔍 Initial Triage (First 3-5 Minutes)
1. Step 1: [Command to verify severity and affected components]
   ```bash
   # [READ-ONLY] Diagnostic command
   ```
2. Step 2: [Inspection of logs, metrics, or events]

---

## 🛠️ Step-by-Step Mitigation Procedures
### Scenario A: [Most common root cause]
1. [Action 1]
   ```bash
   # [STATE-MODIFYING] Corrective command
   ```
2. [Action 2]

### Scenario B: [Alternative root cause]
1. [Action 1]

---

## ✅ Verification & Health Checks
- [ ] Metric 1 returned to baseline.
- [ ] Verification command output is normal:
  ```bash
  # [READ-ONLY] Verification command
  ```
- [ ] Customer traffic flowing smoothly.

---

## 📞 Escalation Paths
- **Primary On-Call**: [Team name / Slack channel / PagerDuty schedule]
- **Secondary Escalation**: [Platform Lead / Database Administrator]
