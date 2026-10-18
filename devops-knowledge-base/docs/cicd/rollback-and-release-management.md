# CI/CD Rollback Automation & Release Governance

Managing emergency rollback procedures, deployment locks, and change auditing in regulated enterprise environments.

---

## ⏪ GitLab Environments & Rollback Button

GitLab Environments track deployment histories per namespace/cluster.

### 1. Manual Rollback via UI
Navigate to **Deployments ➔ Environments ➔ production**. Click **Re-deploy** on the last known healthy deployment commit.

### 2. Automated Pipeline Rollback Job
```yaml
rollback:production:
  stage: deploy-prod
  image: alpine/helm:3.15.0
  script:
    # Rolls back Helm release to immediately preceding revision
    - helm rollback "${CI_PROJECT_NAME}" -n production
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
      when: on_failure
```
*Note*: `when: on_failure` triggers rollback automatically if the primary `deploy:production` job times out or fails healthcheck probes.
