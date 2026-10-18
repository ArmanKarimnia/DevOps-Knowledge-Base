# YAML Formatting Standards & Best Practices

YAML is the ubiquitous configuration grammar for Kubernetes, GitLab CI, Ansible, and Helm. Understanding its data model and edge cases prevents silent parsing defects.

---

## ⚠️ Common YAML Gotchas

### 1. The Norway Problem (Unquoted `NO` / `OFF`)
In YAML 1.1, unquoted strings like `no`, `yes`, `on`, `off`, `true`, `false` are automatically parsed as booleans:
```yaml
# BAD: parsed as country_code: false
country_code: NO

# GOOD: correctly parsed as string "NO"
country_code: "NO"
```

### 2. Port Numbers Parsed as Base-60 (Sexagesimal)
```yaml
# BAD in YAML 1.1: 80:80 is evaluated as 4880 decimal!
ports:
  - 80:80

# GOOD: always quote port mappings
ports:
  - "80:80"
```

---

## 📄 Multi-Line Strings: `|` (Literal) vs `>` (Folded)

- `|` (Pipe): Preserves newlines verbatim (ideal for embedded shell scripts or certificates).
- `>` (Angle): Replaces single newlines with spaces (ideal for long descriptive paragraphs).
- `-` (Chomping strip): Trims trailing newlines (`|-`).
- `+` (Chomping keep): Preserves all trailing newlines (`|+`).

---

## 🔍 Linting YAML
```bash
# [READ-ONLY] Validate YAML syntax with yamllint
yamllint -d "{extends: default, rules: {line-length: {max: 120}}}" file.yaml
```
