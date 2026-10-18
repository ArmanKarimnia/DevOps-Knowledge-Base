# Helm 3 Packaging, Releases & Lifecycle Management

Helm is the standard package manager for Kubernetes, enabling parameterization, release versioning, dependency management, and atomic rollbacks.

---

## ⚡ Helm 3 Operational Cheatsheet

### 1. Release Lifecycle Operations
```bash
# [STATE-MODIFYING] Install or upgrade release with wait and atomic rollback on failure
helm upgrade --install my-app ./helm-chart \
  --namespace workloads \
  --create-namespace \
  --values ./helm-chart/values.yaml \
  --values ./helm-chart/values-production.yaml \
  --wait \
  --atomic \
  --timeout 5m

# [READ-ONLY] List all releases across all namespaces
helm list -A

# [READ-ONLY] View revision history of a release
helm history my-app -n workloads

# [STATE-MODIFYING] Roll back release to a specific previous revision
helm rollback my-app 2 -n workloads
```

### 2. Chart Inspection & Manifest Debugging
```bash
# [READ-ONLY] Render templates locally to verify generated YAML without touching the cluster
helm template my-app ./helm-chart -f values-production.yaml --debug

# [READ-ONLY] Lint chart files for syntax and schema errors
helm lint ./helm-chart

# [READ-ONLY] Inspect computed values applied to a live release
helm get values my-app -n workloads -a
```

---

## 🛡️ Production Helm Chart Best Practices

1. **Always use `--atomic` in CI/CD**: Ensures failed upgrades do not leave half-deployed, crash-looping workloads in production.
2. **Implement `values.schema.json`**: Enforces strict JSON Schema validation on user inputs (e.g., verifying replicaCount is an integer >= 1).
3. **Use Helpers for Labels (`_helpers.tpl`)**: Standardize metadata labels (`app.kubernetes.io/name`, `app.kubernetes.io/instance`, `app.kubernetes.io/version`) across all chart templates.
