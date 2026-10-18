# Git & Version Control Architecture

Version control is the foundation of Infrastructure as Code (IaC), GitOps, and collaborative software delivery.

---

## 📑 Chapter Contents

- **[Commands Cheatsheet](commands-cheatsheet.md)**: Daily operational commands, staging tricks, commit inspection, interactive rebasing, cherry-picking, and reflog recovery.
- **[Branching Strategies](branching-strategies.md)**: Comparison of GitHub Flow, GitLab Flow, Trunk-Based Development, and release branch conventions for enterprise teams.
- **[Git Troubleshooting & Disaster Recovery](troubleshooting.md)**: Recovering accidentally deleted commits via `git reflog`, detaching HEAD recovery, fixing detached submodules, and scrubbing accidentally committed secrets.

---

## 💡 Best Practices for DevOps Repositories

1. **Keep Commits Atomic**: A commit should represent one logical change. Never bundle unrelated infrastructure changes into a single monolithic commit.
2. **Standardize on Conventional Commits**:
   - `feat(k8s)`: New feature or manifest capability
   - `fix(cilium)`: Bugfix in network policy
   - `docs(ansible)`: Documentation updates
   - `refactor(ci)`: Pipeline restructuring without functional change
3. **Protect Git History**: Never run `git push --force` on shared `main` or release branches. Use `--force-with-lease` when updating personal feature branches after a rebase.
