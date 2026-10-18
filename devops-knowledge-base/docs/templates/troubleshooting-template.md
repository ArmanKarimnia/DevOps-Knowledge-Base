# Troubleshooting Case Study Template

Use this standardized template to document real-world operational incidents, root cause analyses, and permanent engineering remediations.

---

## 📋 Case Study Overview
- **Incident Title**: [Short descriptive summary, e.g., Cilium eBPF Map Exhaustion in Staging]
- **Date & Duration**: [YYYY-MM-DD | Duration: e.g., 42 minutes]
- **Environment**: [Cluster / OS / Tool Versions, e.g., Ubuntu 22.04, RKE2 v1.30.2, Cilium v1.15.5]
- **Severity**: [SEV-1 / SEV-2 / SEV-3]

---

## 🚨 Symptoms & Observed Errors
- **Error Messages**:
  ```text
  [Paste exact error logs or stack trace here]
  ```
- **Observed Behavior**: [What customer-visible or system anomalies were observed?]

---

## 🔍 Investigation & Diagnostic Steps
1. **Initial Triaging**: [First commands run, hypotheses tested]
2. **Key Clue / Breakthrough**: [What finding pinpointed the actual defect?]

---

## 🎯 Root Cause
[Technical deep-dive explaining why the failure occurred at the kernel, network, application, or configuration level.]

---

## 🛠️ Resolution & Recovery
[Exact commands executed to mitigate the immediate incident and restore normal operations.]
```bash
# [STATE-MODIFYING] Command that resolved the issue
```

---

## 🛡️ Preventive Actions & Lessons Learned
- [ ] Action item 1: [e.g., Increase eBPF BPF map limit in Helm values]
- [ ] Action item 2: [e.g., Add Prometheus alerting rule for map capacity > 80%]
- [ ] Action item 3: [e.g., Update operational runbook with new diagnostics]
