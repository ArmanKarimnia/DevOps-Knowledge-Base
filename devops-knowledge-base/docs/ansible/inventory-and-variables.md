# Ansible Inventory & Variable Precedence Architecture

Managing static and dynamic inventories, group hierarchies, and understanding Ansible's complex variable inheritance rules.

---

## 📋 Production YAML Inventory Structure

```yaml
# inventory/production.yaml
all:
  children:
    k8s_cluster:
      children:
        k8s_masters:
          hosts:
            master-01.example.com: { ansible_host: 192.0.2.11 }
            master-02.example.com: { ansible_host: 192.0.2.12 }
            master-03.example.com: { ansible_host: 192.0.2.13 }
        k8s_workers:
          hosts:
            worker-01.example.com: { ansible_host: 192.0.2.21 }
            worker-02.example.com: { ansible_host: 192.0.2.22 }
      vars:
        ansible_user: opsadmin
        ansible_port: 22
        ansible_ssh_private_key_file: ~/.ssh/id_ed25519_devops
        ansible_python_interpreter: /usr/bin/python3
```

---

## ⚖️ Variable Precedence Hierarchy

Ansible evaluates variables across 22 levels of precedence. The most critical practical levels (from lowest to highest precedence) are:

1. `role/defaults/main.yml` (Lowest: easily overridden by consumers).
2. `inventory/group_vars/all.yml`
3. `inventory/group_vars/<group_name>.yml`
4. `inventory/host_vars/<hostname>.yml`
5. `role/vars/main.yml` (High: intended not to be overridden).
6. Playbook `vars:`
7. Extra vars via CLI: `-e "my_var=override"` (Absolute highest precedence).
