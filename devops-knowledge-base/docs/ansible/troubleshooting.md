# Ansible Troubleshooting & Failure Diagnostics

Resolving SSH connection errors, privilege escalation hangs, and task debug logging.

---

## 🔍 Common Errors & Resolutions

### 1. "Failed to connect to the host via ssh: Permission denied (publickey)"
- **Checklist**:
  1. Confirm remote user exists on the target machine.
  2. Test manually: `ssh -i ~/.ssh/id_ed25519_devops opsadmin@192.0.2.11`.
  3. Verify permissions on target: `chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys`.

---

### 2. Sudo Privilege Escalation Hangs: "Timeout (12s) waiting for privilege escalation prompt"
- **Cause**: Target host requires a sudo password, but `ansible_become_password` or `--ask-become-pass` (`-K`) was not provided.
- **Resolution**: Configure passwordless sudo for the ops user in `/etc/sudoers.d/99-opsadmin`:
  ```text
  opsadmin ALL=(ALL) NOPASSWD: ALL
  ```

---

### 3. Detailed Verbosity Debugging (`-vvv`)
To see the exact SSH handshake, temporary Python script uploads, and JSON response:
```bash
ansible-playbook -i inventory/production.ini site.yml -vvv
```
