# Ansible Commands Cheatsheet

Fast reference for Ansible ad-hoc modules, playbook execution options, inventory inspection, and encrypted vault operations.

---

## ⚡ Ad-Hoc Cluster Operations

### 1. Test SSH Connectivity & Python Interpreter
```bash
# [READ-ONLY] Ping all hosts in production inventory
ansible all -i inventory/production.ini -m ping
```

### 2. Gather Remote Host Hardware & OS Facts
```bash
# [READ-ONLY] Output distribution, CPU cores, and memory facts
ansible k8s-workers -i inventory/production.ini -m setup -a "filter=ansible_distribution*"
```

### 3. Execute Arbitrary Command Across Fleet
```bash
# [READ-ONLY] Check uptime and kernel release on all web servers
ansible webservers -i inventory/production.ini -m command -a "uptime"
```

---

## 📖 Playbook Execution & Dry-Runs

### 1. Dry-Run Execution (`--check`)
```bash
# [READ-ONLY] Simulate playbook execution and print predicted changes without modifying hosts
ansible-playbook -i inventory/production.ini site.yml --check --diff
```

### 2. Syntax Check & Step-by-Step Execution
```bash
# [READ-ONLY] Validate YAML and task syntax
ansible-playbook -i inventory/production.ini site.yml --syntax-check

# [STATE-MODIFYING] Execute specific tagged tasks only (e.g., skip base hardening, only run rke2)
ansible-playbook -i inventory/production.ini site.yml --tags "rke2" --limit "k8s-node-01"
```

---

## 🔒 Ansible Vault (Secrets Encryption)

```bash
# [STATE-MODIFYING] Encrypt credentials file with AES-256
ansible-vault encrypt group_vars/all/vault.yml

# [STATE-MODIFYING] Edit encrypted file in $EDITOR
ansible-vault edit group_vars/all/vault.yml

# [STATE-MODIFYING] Run playbook passing vault password from secure file
ansible-playbook -i inventory/production.ini site.yml --vault-password-file ~/.vault_pass
```
