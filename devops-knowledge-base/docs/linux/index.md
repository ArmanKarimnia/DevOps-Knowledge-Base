# Linux & Server Administration

Welcome to the **Linux & Server Administration** documentation hub. Enterprise Kubernetes nodes, container hosts, CI/CD runners, and database servers depend upon solid, production-hardened Linux engineering.

---

## 📑 Chapter Contents

- **[Commands Cheatsheet](commands-cheatsheet.md)**: High-frequency operational commands for process tracking, disk analysis, text manipulation, and performance monitoring.
- **[Linux Networking & DNS](networking.md)**: Socket inspection (`ss`), routing tables (`ip route`), DNS resolution (`systemd-resolved`, `dig`), and firewall configuration (`ufw`, `iptables`, `nftables`).
- **[Systemd Service Management](systemd.md)**: Unit lifecycle, custom service creation, timer units, journal logging, and dependency debugging.
- **[Storage & Filesystems](storage-and-filesystems.md)**: LVM, ext4/xfs formatting, inode exhaustion triage, mount options, and disk performance measurement (`fio`, `iostat`).
- **[SSH & Access Management](ssh-and-access.md)**: Hardening `/etc/ssh/sshd_config`, key generation (Ed25519), SSH agent forwarding, bastion jump hosts, and SSSD Active Directory integration.
- **[Permissions & Processes](permissions-and-processes.md)**: POSIX permissions, ACLs, process signals (`SIGTERM`, `SIGKILL`), cgroups v2, and OOM-killer tuning.
- **[Linux Troubleshooting Guide](troubleshooting.md)**: Systematic triage for CPU spikes, memory leaks, disk I/O bottlenecks, and network packet loss.

---

## 🎯 Production Engineering Principles

1. **Prefer `ss` over legacy `netstat`**: Modern Linux kernels deprecate `netstat` in favor of `iproute2` utilities (`ss`, `ip`).
2. **Always inspect `/var/log/journal`**: Avoid fragmented log files when systemd journal provides unified, structured, timestamped output.
3. **Guard against Inode Exhaustion**: A filesystem can report 0 bytes free despite having hundreds of gigabytes of disk space if all available inodes are consumed by small temporary files.
