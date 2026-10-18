# Enterprise Git Branching Strategies

Selecting the right branching model determines how smoothly teams integrate code, trigger continuous integration pipelines, and release to staging and production environments.

---

## 🌳 Branching Models Comparison

### 1. Trunk-Based Development (Recommended for Modern CI/CD)
Developers commit short-lived branches (1-2 days max) directly into `main` after automated testing and peer code review.
- **Pros**: Minimal merge conflicts, promotes small incremental changes, ideal for continuous deployment.
- **Cons**: Requires high test coverage and feature flags to hide incomplete work.

### 2. GitLab Flow (Environment Branches)
Branches reflect deployment environments (`main` ➔ `staging` ➔ `production`).
- **Code Flow**: Changes merge into `main`, deploy to dev/test, and are then cherry-picked or merged into `production` when approved.
- **Best for**: Teams with strict compliance gates and formal release freezes.

---

## 🏷️ Release Tagging & Semantic Versioning (SemVer)

Always use annotated Git tags matching `vMAJOR.MINOR.PATCH`:
- `MAJOR`: Incompatible API or breaking infrastructure changes.
- `MINOR`: Backwards-compatible functionality additions.
- `PATCH`: Backwards-compatible bug fixes.

```bash
# [STATE-MODIFYING] Create cryptographically signed release tag
git tag -s -a v1.4.0 -m "Release v1.4.0: Cilium eBPF integration & Helm chart updates"

# [STATE-MODIFYING] Push tag to remote to trigger release CI pipeline
git push origin v1.4.0
```
