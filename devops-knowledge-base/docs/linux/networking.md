# Linux Networking, DNS & Firewall Administration

Modern cloud-native and Kubernetes nodes require a deep understanding of Linux network stacks, interface routing, packet filtering, and name resolution.

---

## 🖧 Network Interfaces & Routing Table

### 1. Interface Inspection (`ip`)
```bash
# [READ-ONLY] Show status, MTU, IP addresses, and flags for all network interfaces
ip -br addr show

# [READ-ONLY] View detailed link layer packet statistics and dropped frames
ip -s link show dev eth0
```

### 2. Kernel Routing Table
```bash
# [READ-ONLY] Inspect IPv4 routing table
ip route show

# [READ-ONLY] Simulate route lookup to determine which interface handles a destination IP
ip route get 198.51.100.25
```
*Expected Output*:
```text
198.51.100.25 via 192.0.2.1 dev eth0 src 192.0.2.100 uid 1000
    cache
```

---

## 🔍 DNS Resolution & `systemd-resolved`

On modern Ubuntu (20.04/22.04/24.04), DNS resolution is managed via `systemd-resolved`.

### 1. Inspect Active DNS Servers
```bash
# [READ-ONLY] Inspect DNS servers per network interface
resolvectl status
```

### 2. Trace DNS Lookups with `dig`
```bash
# [READ-ONLY] Perform recursive trace lookup to root DNS servers
dig +trace api.example.com

# [READ-ONLY] Query specific internal nameserver with full EDNS options
dig @192.0.2.53 api.example.com +dnssec +time=2
```

### 3. Flush Local DNS Cache
```bash
# [STATE-MODIFYING] Flush systemd-resolved DNS cache
resolvectl flush-caches
resolvectl statistics
```

---

## 🛡️ Host Firewalls: UFW & nftables

### 1. UFW (Uncomplicated Firewall) Basics
```bash
# [READ-ONLY] Check active firewall rules and status
sudo ufw status verbose

# [STATE-MODIFYING] Allow incoming SSH with rate limiting
sudo ufw limit ssh/tcp comment "Prevent brute-force SSH attacks"

# [STATE-MODIFYING] Allow Kubernetes API server traffic from worker subnet only
sudo ufw allow proto tcp from 192.0.2.0/24 to any port 6443 comment "K8s API"
```

### 2. Inspect Raw Kernel Packet Rules (`nftables` / `iptables`)
```bash
# [READ-ONLY] List active nftables rulesets (used by modern Kubernetes & Docker)
sudo nft list ruleset

# [READ-ONLY] List legacy iptables NAT rules (useful when diagnosing kube-proxy issues)
sudo iptables -t nat -L -n -v --line-numbers
```

---

## 🔬 TCP Socket Diagnostics & Connectivity Testing

### 1. Fast Layer 4 Connectivity Check with `nc` (Netcat)
```bash
# [READ-ONLY] Test TCP port connectivity with 3-second timeout
nc -zv -w 3 198.51.100.50 443

# [READ-ONLY] Test UDP socket reachability
nc -zvu -w 3 198.51.100.50 53
```

### 2. Packet Capture with `tcpdump`
```bash
# [READ-ONLY] Capture TLS handshake traffic on eth0 and print packet headers
sudo tcpdump -nn -i eth0 'tcp port 443 and (tcp-syn != 0 or tcp-fin != 0)' -c 20

# [READ-ONLY] Capture raw packet trace to pcap file for Wireshark analysis
sudo tcpdump -i any -w /tmp/traffic-capture.pcap 'host 198.51.100.50 and port 8080'
```
