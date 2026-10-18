# GitLab CI Fundamentals & Syntax Standards

A reference guide for configuring `.gitlab-ci.yml` pipelines with clean hierarchy, caching, artifacts, and modern condition matching.

---

## 🧱 Key Pipeline Concepts

- **Stages**: Sequential phases of the pipeline (`stages: [test, build, deploy]`). Jobs in the same stage run concurrently if runner capacity allows.
- **Jobs**: Atomic units of execution specifying the Docker image, shell script, and environment bindings.
- **Rules (`rules:`)**: Replaces legacy `only/except` syntax with robust conditional evaluation:
  ```yaml
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'
      when: on_success
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: on_success
    - when: never
  ```

---

## 📦 Caching vs Artifacts Pattern

```yaml
# Caching speeds up dependency downloads
build:job:
  stage: build
  image: maven:3.9-eclipse-temurin-17-alpine
  cache:
    key: "${CI_COMMIT_REF_SLUG}-m2"
    paths:
      - .m2/repository/
    policy: pull-push
  script:
    - mvn clean package -Dmaven.repo.local=.m2/repository
  artifacts:
    name: "app-build-${CI_COMMIT_SHORT_SHA}"
    expire_in: 7 days
    paths:
      - target/*.jar
    reports:
      junit: target/surefire-reports/*.xml
```

---

## 🔒 Masked & Protected CI/CD Variables

- **Protected Variables**: Only available on protected branches (e.g., `main`) and protected tags, preventing feature branch PRs from reading production deployment credentials.
- **Masked Variables**: Filtered out from job logs if matched against variable regex rules.
