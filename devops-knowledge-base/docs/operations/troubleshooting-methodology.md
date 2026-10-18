# Systematic Systems Troubleshooting Methodology

Avoid guesswork. When diagnosing complex distributed failures across Linux, Kubernetes, and network layers, follow systematic deduction frameworks.

---

## 🔬 The 6-Step Diagnostic Loop

1. **Verify the Problem & Define Symptoms**: What exactly is failing? What is the error message or HTTP status code? Which users or regions are affected?
2. **Examine Timeline & Recent Changes**: Did a deployment, configuration update, DNS record change, or database migration occur in the last 60 minutes?
3. **Isolate the Fault Domain**: Divide and conquer:
   - Client to Load Balancer?
   - Gateway to Kubernetes Service?
   - Service to Pod?
   - Pod to Database / External API?
4. **Formulate a Testable Hypothesis**: "Hypothesis: The database connection pool is exhausted due to an unindexed query holding locks."
5. **Test the Hypothesis (Non-Destructive First)**: Query metrics or logs (`pg_stat_activity`) before restarting services.
6. **Apply Smallest Effective Mitigation**: Roll back the offending deployment or apply a query patch; verify SLIs return to green.
