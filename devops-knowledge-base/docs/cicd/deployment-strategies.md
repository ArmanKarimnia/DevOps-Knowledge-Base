# CI/CD Deployment Strategies: Blue/Green, Canary & Rolling

Operational workflows for orchestrating safe application promotions across Kubernetes environments.

---

## 🚦 Strategy Implementation in GitLab CI

### 1. Canary Deployment (10% Traffic Split via APISIX)
```yaml
deploy:canary:
  stage: deploy-production
  image: alpine/helm:3.15.0
  script:
    # Deploy canary pod replica with weight 10
    - helm upgrade --install my-app-canary ./helm \
        --namespace production \
        --values ./helm/values-canary.yaml \
        --set apisixRoute.weight=10 \
        --set image.tag="${CI_COMMIT_SHORT_SHA}"
  environment:
    name: production/canary
```

### 2. Full Traffic Promotion (Promote to 100%)
```yaml
promote:production:
  stage: deploy-production
  image: alpine/helm:3.15.0
  script:
    - helm upgrade --install my-app ./helm \
        --namespace production \
        --values ./helm/values-production.yaml \
        --set image.tag="${CI_COMMIT_SHORT_SHA}"
    # Tear down canary release after stable rollout
    - helm uninstall my-app-canary -n production || true
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
      when: manual
```
