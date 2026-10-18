# Enterprise Secrets Management Architecture

Decoupling sensitive credentials, certificates, and API tokens from code and containers using centralized secrets engines.

---

## 🏛️ Secrets Management Models

1. **Static Secrets (Legacy)**: Plaintext values written in `.env` or stored base64 in Kubernetes etcd without encryption. High operational risk of leaks.
2. **Centralized Vault Store (HashiCorp Vault / Cloud KMS)**: Centralized, encrypted-at-rest repository providing access auditing, lease expiration, and dynamic credential generation.
3. **Secrets Store CSI Driver**: Projects secrets from external secret vaults directly into Kubernetes Pod volumes as temporary in-memory files (`tmpfs`), without writing to etcd.

---

## ☸️ Secrets Store CSI Driver Pattern

```yaml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: vault-db-creds
  namespace: workloads
spec:
  provider: vault
  parameters:
    vaultAddress: "https://vault.example.com:8200"
    roleName: "workload-db-role"
    objects: |
      - objectName: "db-password"
        secretPath: "secret/data/production/database"
        secretKey: "password"
```
Workloads mount this volume; the CSI driver retrieves the secret at pod startup, mounting it into `/mnt/secrets/db-password` in RAM only.
