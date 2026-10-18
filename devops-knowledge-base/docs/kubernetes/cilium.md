# Cilium eBPF Networking, Security & Hubble Observability

Cilium is a cloud-native networking, observability, and security solution built directly on Linux **eBPF (Extended Berkeley Packet Filter)**.

---

## ⚡ Why Cilium Replaces Kube-Proxy

In legacy Kubernetes networking, `kube-proxy` writes thousands of sequential `iptables` rules. Every packet traverses linear rule chains ($O(N)$ overhead), causing significant CPU waste and latency at scale.

Cilium replaces `iptables` with **eBPF Hash Maps ($O(1)$ complexity)**. Packet translation and socket redirection (`sockops`) occur directly in kernel space without entering the network stack:

```mermaid
graph LR
    subgraph Legacy_Iptables [Legacy Kube-Proxy: iptables]
        P1[Packet In] --> R1[Rule 1] --> R2[Rule 2] --> Rn[Rule N...] --> PodDest1[Pod Destination]
    end

    subgraph Cilium_eBPF [Cilium eBPF Datapath]
        P2[Packet In] --> Map[(eBPF BPF Map Lookup: O(1))] --> PodDest2[Pod Destination]
    end
```

---

## 🚀 Cilium Deployment with Kube-Proxy Replacement

Helm installation on an RKE2 cluster with native routing and Hubble enabled:

```bash
# [STATE-MODIFYING] Install Cilium with complete kube-proxy replacement
helm repo add cilium https://helm.cilium.io/
helm repo update

helm upgrade --install cilium cilium/cilium \
  --namespace kube-system \
  --set kubeProxyReplacement=true \
  --set k8sServiceHost="127.0.0.1" \
  --set k8sServicePort="6443" \
  --set bpf.masquerade=true \
  --set tunnel=disabled \
  --set autoDirectNodeRoutes=true \
  --set hubble.enabled=true \
  --set hubble.relay.enabled=true \
  --set hubble.ui.enabled=true
```

---

## 🛡️ Production CiliumNetworkPolicy (L3, L4, L7)

Standard Kubernetes `NetworkPolicy` only filters Layer 3 (IP) and Layer 4 (Port). Cilium enables Layer 7 HTTP filtering directly inside the kernel:

```yaml
apiVersion: "cilium.io/v2"
kind: CiliumNetworkPolicy
metadata:
  name: secure-backend-policy
  namespace: workloads
spec:
  endpointSelector:
    matchLabels:
      app.kubernetes.io/name: backend-service
  ingress:
    # 1. Allow traffic only from pods with label 'role: apisix-gateway'
    - fromEndpoints:
        - matchLabels:
            app.kubernetes.io/name: apisix-gateway
      toPorts:
        - ports:
            - port: "8080"
              protocol: TCP
          # Layer 7 HTTP rule: allow only GET on /api/v1/orders
          rules:
            http:
              - method: "GET"
                path: "/api/v1/orders/.*"
  egress:
    # 2. Allow egress only to PostgreSQL on port 5432
    - toEndpoints:
        - matchLabels:
            app.kubernetes.io/name: postgresql
      toPorts:
        - ports:
            - port: "5432"
              protocol: TCP
    # 3. Allow DNS egress to CoreDNS in kube-system
    - toEndpoints:
        - matchLabels:
            k8s-app: kube-dns
      toPorts:
        - ports:
            - port: "53"
              protocol: ANY
          rules:
            dns:
              - matchPattern: "*"
```

---

## 🔬 Cilium CLI & Hubble Observability

### 1. Check Cilium Agent Status & eBPF Health
```bash
# [READ-ONLY] Check Cilium status, IPAM, and kernel BPF maps
cilium status --wait

# [READ-ONLY] Inspect eBPF load balancer table
cilium bpf lb list
```

### 2. Live Flow Observability with Hubble
```bash
# [READ-ONLY] Stream dropped packets in real-time across namespace
hubble observe --namespace workloads --verdict DROPPED

# [READ-ONLY] Filter flows by HTTP status 500+
hubble observe --namespace workloads --http-status "5.."

# [READ-ONLY] Track DNS resolution latency
hubble observe --protocol dns -f
```
