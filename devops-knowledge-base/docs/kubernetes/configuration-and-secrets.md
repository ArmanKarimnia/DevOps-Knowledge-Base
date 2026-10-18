# Kubernetes Configuration & Secrets Architecture

Separating configuration artifacts and sensitive credentials from container application code is a core requirement of the Twelve-Factor App methodology.

---

## 📄 ConfigMaps vs Secrets

| Feature | ConfigMap | Secret |
| :--- | :--- | :--- |
| **Intended Content** | Non-sensitive configs (log levels, timeouts, Nginx configs) | Passwords, tokens, private keys, TLS certs |
| **Storage in etcd** | Plaintext UTF-8 | Base64-encoded (or encrypted at rest via KMS) |
| **Size Limit** | 1 MiB per object | 1 MiB per object |
| **Consumption** | Environment variables, volume mounts | Environment variables, volume mounts (tmpfs in memory) |

---

## 🔒 Creating Secrets Safely

Never commit raw secrets into Git repositories.

### 1. Imperative Secret Creation (Avoiding Shell History Leaks)
```bash
# [STATE-MODIFYING] Create generic secret from a local credentials file
kubectl create secret generic db-credentials \
  --from-file=password=/path/to/password.txt \
  --namespace=<namespace>

# Clean up file immediately
shred -u /path/to/password.txt
```

### 2. TLS Secret Creation
```bash
# [STATE-MODIFYING] Create TLS secret for ingress or APISIX
kubectl create secret tls api-tls-cert \
  --cert=/etc/ssl/certs/api.example.com.crt \
  --key=/etc/ssl/private/api.example.com.key \
  --namespace=<namespace>
```

---

## ⚡ Volume Mounting vs Environment Variables

### Recommended: Volume Mount Projection
Mounting Secrets and ConfigMaps as files into `/etc/config` or `/etc/secrets` allows Kubernetes to automatically update mounted files when the underlying Secret/ConfigMap is modified, without restarting the container:

```yaml
volumeMounts:
  - name: config-volume
    mountPath: /etc/app/config
    readOnly: true
volumes:
  - name: config-volume
    configMap:
      name: app-config
```

*Note*: If injected as environment variables (`envFrom`), Kubernetes does NOT update the environment variable in running containers when the ConfigMap changes; a rolling restart is required.
