# Ansible Roles, Handlers & Idempotence

Structuring reusable configuration roles and ensuring tasks execute idempotently without unnecessary state changes.

---

## 📁 Standard Ansible Role Hierarchy

```text
roles/rke2_node/
├── defaults/
│   └── main.yml        # Default overridable variables
├── files/              # Static files copied verbatim
├── handlers/
│   └── main.yml        # Service restart triggers
├── meta/
│   └── main.yml        # Author info and role dependencies
├── tasks/
│   └── main.yml        # Core task execution list
├── templates/
│   └── config.yaml.j2  # Dynamic Jinja2 configuration templates
└── vars/
    └── main.yml        # Un-overridable internal role variables
```

---

## ⚡ Enforcing Idempotence & Handlers

An idempotent task modifies host state only when the target is out of sync (`ok` vs `changed`):

```yaml
# tasks/main.yml
- name: Deploy RKE2 configuration file
  ansible.builtin.template:
    src: config.yaml.j2
    dest: /etc/rancher/rke2/config.yaml
    owner: root
    group: root
    mode: '0600'
  notify: Restart RKE2 Service

# handlers/main.yml
- name: Restart RKE2 Service
  ansible.builtin.systemd:
    name: rke2-server
    state: restarted
```
*Handlers only trigger once at the end of the play if and only if the template task resulted in a `changed` status.*
