# Git Troubleshooting & Incident Recovery

Practical procedures for resolving detached HEAD states, merge conflicts, corrupted git objects, and leaked credentials.

---

## 🚨 Incident 1: Accidental Secret Committed to Git History

### The Problem
A private key, token, or password was committed. Simply deleting the file in a new commit leaves the secret permanently exposed in previous commit objects.

### Resolution: Scrub History with `git-filter-repo`
```bash
# [HIGH-RISK] Completely purge a file from all commits and branches
# First install git-filter-repo (Python tool recommended by Git documentation)
pip install git-filter-repo

# Run filter-repo to eradicate the file from entire history
git filter-repo --invert-paths --path secrets.env

# Force push scrubbed history to remote (coordinate with team!)
git push origin --force --all
git push origin --force --tags
```
*Crucial*: Rotate the leaked secret immediately in your cloud/identity provider. Removing it from Git does not guarantee it was not scraped while visible.

---

## 🔧 Incident 2: Resolving a Detached HEAD State

### Symptoms
`git status` outputs: `HEAD detached at a1b2c3d`. Commits made in this state are orphaned if you switch branches.

### Resolution
```bash
# [STATE-MODIFYING] Create a temporary branch to preserve your detached work
git branch temp-recovery-branch

# [STATE-MODIFYING] Switch back to main and merge the recovery branch
git checkout main
git merge temp-recovery-branch

# Delete temporary branch
git branch -d temp-recovery-branch
```

---

## ⚔️ Incident 3: Aborting a Complex Broken Merge/Rebase

When a merge or rebase generates unmanageable conflicts and you want to safely abort back to the pristine state:

```bash
# [STATE-MODIFYING] Abort in-progress merge
git merge --abort

# [STATE-MODIFYING] Abort in-progress rebase
git rebase --abort
```
