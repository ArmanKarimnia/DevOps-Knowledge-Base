# Command-Line JSON Processing with jq

`jq` is an indispensable tool for slicing, filtering, mapping, and transforming JSON payloads returned by `kubectl`, Docker, and REST APIs.

---

## ⚡ High-Frequency jq Snippets

### 1. Extract Specific Fields from Kubernetes Pod List
```bash
# [READ-ONLY] Extract pod names, node names, and pod IPs in tab-separated format
kubectl get pods -n workloads -o json | jq -r '.items[] | [.metadata.name, .spec.nodeName, .status.podIP] | @tsv'
```

### 2. Filter Objects by Condition
```bash
# [READ-ONLY] Find all containers with memory limits greater than 1Gi
kubectl get pods -A -o json | jq -r '.items[] | {pod: .metadata.name, container: .spec.containers[] | select(.resources.limits.memory != null)}'
```

### 3. Parse and Decode Kubernetes Secrets
```bash
# [READ-ONLY] Automatically decode all base64 keys inside a Kubernetes Secret
kubectl get secret db-credentials -n workloads -o json | jq -r '.data | map_values(@base64d)'
```

### 4. Construct JSON Payloads Safely
```bash
# [READ-ONLY] Create valid JSON payload escaping special characters
jq -n --arg user "opsadmin" --arg ts "$(date -u +%s)" '{user: $user, timestamp: ($ts | tonumber)}'
```
