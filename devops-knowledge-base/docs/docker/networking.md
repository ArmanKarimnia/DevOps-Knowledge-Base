# Container Networking Architecture

Docker manages container networking using Linux network namespaces, virtual ethernet pairs (`veth`), and iptables NAT rules.

---

## 🖧 Network Drivers Comparison

| Driver | Scope | Characteristics | Typical Use Case |
| :--- | :--- | :--- | :--- |
| **bridge** | Single host | Default driver; provides isolated subnet with DNS resolution between containers on user-defined networks. | Standard multi-container applications |
| **host** | Single host | Bypasses container network namespace; container binds directly to host IP and ports. Zero NAT overhead. | High-throughput network tooling, Prometheus node-exporter |
| **none** | Single host | Completely isolates container from network stack; loopback interface only. | Air-gapped batch compute jobs, cryptographic signing |
| **overlay** | Multi-host | Encapsulates layer 2 traffic across multiple Docker Swarm / Kubernetes hosts using VXLAN tunnels. | Multi-host clustering |

---

## 🛠️ Inspecting Network Namespaces & VETH Pairs

```bash
# [READ-ONLY] List all Docker networks
docker network ls

# [READ-ONLY] Inspect subnet, gateway, and connected containers
docker network inspect bridge

# [READ-ONLY] Find host veth peer corresponding to a container eth0
docker exec -it <container-id> cat /sys/class/net/eth0/iflink
# Then search on host:
ip link show | grep "^<iflink-number>:"
```
