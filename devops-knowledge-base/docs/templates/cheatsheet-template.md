# [Technology] Commands Cheatsheet

A concise, practical cheat sheet containing frequently used operational commands, flags, diagnostics, and risk ratings.

---

## 🔍 [Category 1: Inspection & Health]

### 1. Command Name
- **Command**:
  ```bash
  # [READ-ONLY] Command explanation
  tool-cli inspect --flag=<value>
  ```
- **When to use**: Context or scenario.
- **Key options**:
  - `--flag`: Description of flag.
- **Expected Output**:
  ```text
  Sample output
  ```
- **Risk Level**: Safe `[READ-ONLY]`.

---

## ⚡ [Category 2: State Modifications & Configuration]

### 1. Command Name
- **Command**:
  ```bash
  # [STATE-MODIFYING] Command explanation
  tool-cli update --setting=active
  ```
- **When to use**: Scenario.
- **Risk Level**: Caution `[STATE-MODIFYING]`.

---

## ⚠️ [Category 3: Disaster Recovery & High Risk]

### 1. Command Name
- **Command**:
  ```bash
  # [HIGH-RISK] Command explanation
  tool-cli purge --all --force
  ```
- **When to use**: Emergency recovery only.
- **Risk Level**: Critical `[HIGH-RISK / DESTRUCTIVE]`.
