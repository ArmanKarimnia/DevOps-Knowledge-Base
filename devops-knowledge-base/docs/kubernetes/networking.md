# Kubernetes Cluster Networking & Ingress Architecture

Understanding packet flow between Pods, Services, CoreDNS, and ingress controllers is essential for high-availability cluster operations.

---

## 🖧 Pod-to-Pod & Service Packet Flow

Kubernetes enforces three fundamental networking premises:
1. All Pods can communicate with all other Pods without NAT.
2. All agents on a node (e.g., kubelet) can communicate with all Pods on that node.
3. The IP that a Pod sees itself as is the same IP that others see it as.

### Service Virtual IPs & EndpointSlices
A Kubernetes `Service` does not have a physical network interface. It is a virtual IP (`ClusterIP`) represented in etcd. When client pods send a packet to `10.96.0.10:80`, the node's datapath (Cilium eBPF or kube-proxy) intercepts the packet and translates destination IP (`DNAT`) to one of the healthy pod IPs listed in the Service's `EndpointSlice`.

---

## 🌐 CoreDNS Tuning & Optimization

CoreDNS resolves internal cluster domains formatted as `<service>.<namespace>.svc.cluster.local`.

### Production Corefile Optimization
```ini
.:53 {
    errors
    health {
        lameduck 5s
    }
    ready
    kubernetes cluster.local in-addr.arpa ip6.arpa {
        pods insecure
        fallthrough in-addr.arpa ip6.arpa
        ttl 30
    }
    prometheus :9153
    forward . 192.0.2.53 198.51.100.53 {
        max_concurrent 1000
    }
    cache 30 {
        success 5000 30
        denial 2500 5
    }
    loop
    reload
    loadbalance
}
```

### Diagnosing DNS Latency Issues
If pods report periodic 5-second connection delays:
1. Check for **conntrack race conditions** in older kernels (fixed by Cilium eBPF socket routing).
2. Configure `options ndots:2` in the pod's `dnsConfig` to prevent unnecessary suffix search expansions:
```yaml
dnsConfig:
  options:
    - name: ndots
      value: "2"
```
