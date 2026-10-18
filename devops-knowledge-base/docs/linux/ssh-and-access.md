# SSH Hardening, Key Management & Enterprise Access (SSSD)

Secure remote access is the bedrock of server administration. This guide covers SSH daemon hardening, modern public key cryptography, jump hosts, and enterprise Active Directory integration via SSSD.

---

## 🔑 Modern SSH Key Generation (Ed25519)

RSA keys with small bit lengths are deprecated. Always generate modern elliptic curve keys using the `Ed25519` algorithm:

```bash
# [STATE-MODIFYING] Generate an Ed25519 key pair with 100 KDF rounds for passphrase protection
ssh-keygen -t ed25519 -a 100 -C "admin@example.com" -f ~/.ssh/id_ed25519_devops

# [STATE-MODIFYING] Copy public key to target server
ssh-copy-id -i ~/.ssh/id_ed25519_devops.pub user@192.0.2.50
```

---

## 🔒 Hardened `/etc/ssh/sshd_config` Configuration

Apply these security baselines to prevent unauthorized access and brute-force attacks:

```ini
# /etc/ssh/sshd_config.d/99-hardened.conf

# Protocol & Port
Port 22
Protocol 2

# Authentication Security
PermitRootLogin no
PasswordAuthentication no
PermitEmptyPasswords no
PubkeyAuthentication yes
AuthenticationMethods publickey

# Limit Access to Sudoers Group
AllowGroups sudo sysadmins

# Key Exchange & Cipher Hardening (Modern Crypto Only)
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com

# Session Limits
MaxAuthTries 3
MaxSessions 5
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no
```

Validate and reload:
```bash
# [READ-ONLY] Test SSH daemon configuration syntax before applying
sudo sshd -t

# [STATE-MODIFYING] Safely reload SSH daemon
sudo systemctl reload sshd
```

---

## 🚀 Bastion Jump Host Configuration (`~/.ssh/config`)

To access private Kubernetes nodes or database servers behind a DMZ bastion host without exposing private keys to the bastion:

```ini
# ~/.ssh/config

# Bastion Jump Host
Host bastion
    HostName bastion.example.com
    User opsadmin
    IdentityFile ~/.ssh/id_ed25519_devops
    Port 22

# Private Internal Node via Jump Host
Host k8s-node-*
    User opsadmin
    IdentityFile ~/.ssh/id_ed25519_devops
    ProxyJump bastion
    StrictHostKeyChecking accept-new
```
Connect directly using:
```bash
ssh k8s-node-01
```

---

## 🏢 Enterprise Identity Integration with SSSD

System Security Services Daemon (SSSD) connects Linux hosts to Microsoft Active Directory or FreeIPA for centralized identity.

### 1. Verification of AD User & Group Lookup
```bash
# [READ-ONLY] Test directory query for user and groups
id user@corp.example.com

# [READ-ONLY] Verify SSSD communication with Active Directory domain controllers
sudo sssdctl domain-status corp.example.com
```

### 2. Flush SSSD Local Identity Cache
```bash
# [STATE-MODIFYING] Invalidate cached AD credentials after group membership update
sudo sss_cache -E
```
