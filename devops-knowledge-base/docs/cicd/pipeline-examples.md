# GitLab CI Pipeline Architectures & Examples

Real-world production pipeline templates demonstrating daemonless Kaniko image builds, Sonatype Nexus repository integration, and Helm Kubernetes deployment.

---

## 🏗️ Production Microservice Pipeline Architecture

```yaml
stages:
  - validate
  - scan
  - containerize
  - deploy-staging
  - deploy-prod

variables:
  NEXUS_REGISTRY: "registry.example.com"
  IMAGE_TAG: "${CI_COMMIT_SHORT_SHA}"

# 1. Validation & Test
test:unit:
  stage: validate
  image: golang:1.22-alpine
  script:
    - go vet ./...
    - go test -v -race -coverprofile=coverage.txt ./...
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.txt

# 2. Trivy Security Vulnerability Scan
security:trivy:
  stage: scan
  image:
    name: aquasec/trivy:0.50.0
    entrypoint: [""]
  script:
    - trivy fs --exit-code 1 --severity CRITICAL --ignore-unfixed .

# 3. Kaniko Container Build to Sonatype Nexus
build:kaniko:
  stage: containerize
  image:
    name: gcr.io/kaniko-project/executor:v1.23.0-debug
    entrypoint: [""]
  before_script:
    - mkdir -p /kaniko/.docker
    - echo "{\"auths\":{\"https://${NEXUS_REGISTRY}\":{\"username\":\"${NEXUS_USER}\",\"password\":\"${NEXUS_PASSWORD}\"}}}" > /kaniko/.docker/config.json
  script:
    - /kaniko/executor
        --context "${CI_PROJECT_DIR}"
        --dockerfile "${CI_PROJECT_DIR}/Dockerfile"
        --destination "${NEXUS_REGISTRY}/apps/${CI_PROJECT_NAME}:${IMAGE_TAG}"
        --cache=true

# 4. Atomic Helm Deploy to Production (Manual Approval Gate)
deploy:production:
  stage: deploy-prod
  image: alpine/helm:3.15.0
  environment:
    name: production
    url: https://app.example.com
  script:
    - helm upgrade --install "${CI_PROJECT_NAME}" ./helm
        --namespace production
        --values ./helm/values-prod.yaml
        --set image.tag="${IMAGE_TAG}"
        --wait
        --atomic
        --timeout 5m
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
      when: manual
```
