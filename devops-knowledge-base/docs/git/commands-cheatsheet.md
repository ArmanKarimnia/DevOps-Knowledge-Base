# Git Operational Commands Cheatsheet

A concise, high-utility cheat sheet for Git repository administration, branch management, interactive rebasing, and recovery operations.

---

## 🔀 Branching & History Inspection

### 1. Visual Commit Graph
```bash
# [READ-ONLY] Pretty tree graph of commit history across all branches
git log --graph --oneline --decorate --all -n 20
```

### 2. Search Commit History by Code Changes
```bash
# [READ-ONLY] Search commits that introduced or removed a specific string ('NEXUS_REGISTRY')
git log -S "NEXUS_REGISTRY" --source --all -p
```

### 3. Compare Differences Between Branches
```bash
# [READ-ONLY] Show summary of files changed between current branch and main
git diff --stat origin/main...HEAD
```

---

## 🛠️ Staging & Stashing Operations

### 1. Interactive Staging (`git add -p`)
```bash
# [STATE-MODIFYING] Interactively review and stage individual code hunks
git add -p
```
- Allows selecting `y` (stage hunk), `n` (skip hunk), `s` (split hunk into smaller pieces), or `e` (manually edit hunk).

### 2. Stash Uncommitted Changes with Descriptive Label
```bash
# [STATE-MODIFYING] Stash work-in-progress including untracked files with a note
git stash push -u -m "WIP: debug helm template failure"

# [READ-ONLY] List all saved stashes
git stash list

# [STATE-MODIFYING] Pop most recent stash and re-apply changes
git stash pop
```

---

## 🔄 Rebasing & Cherry-Picking

### 1. Interactive Rebase (Clean Up Commits)
```bash
# [STATE-MODIFYING] Rebase and squash last 4 commits before opening PR
git rebase -i HEAD~4
```
Options in editor:
- `pick`: Use commit as is.
- `reword`: Change commit message.
- `squash`: Melt into previous commit.
- `drop`: Remove commit entirely.

### 2. Safe Push After Rebase
```bash
# [STATE-MODIFYING] Push rebased branch safely (fails if remote has updates you lack)
git push origin feature/my-branch --force-with-lease
```

### 3. Cherry-Pick Specific Hotfix
```bash
# [STATE-MODIFYING] Apply specific commit from another branch to current branch
git cherry-pick <commit-sha>
```

---

## 🚑 Disaster Recovery & Undoing Mistakes

### 1. Undo Last Commit but Keep Changes Staged
```bash
# [STATE-MODIFYING] Soft reset HEAD by 1 commit
git reset --soft HEAD~1
```

### 2. Recover Lost Commits via Reflog
```bash
# [READ-ONLY] View historical HEAD movements including deleted branches and hard resets
git reflog

# [STATE-MODIFYING] Restore repository to state prior to accidental reset
git reset --hard HEAD@{2}
```
