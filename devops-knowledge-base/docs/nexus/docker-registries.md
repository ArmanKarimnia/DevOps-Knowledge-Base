# Sonatype Nexus Private Docker Registries

Configuring Docker connectors, HTTPS reverse proxies, and Kubernetes image pull secrets.

---

## 🐳 Docker Connectors Architecture

Docker CLI expects registries to respond at root `/v2/`. Because Nexus hosts multiple repositories on one server, it assigns dedicated HTTP/HTTPS ports to individual Docker repositories:

- Port `8082`: `docker-group` (Pull endpoint for Kubernetes nodes)
- Port `8083`: `docker-hosted` (Push endpoint for CI/CD Kaniko runners)

### Nginx / Ingress TLS Reverse Proxy Configuration
```nginx
# Map external domain registry.example.com to Nexus Docker Group port 8082
server {
    listen 443 ssl;
    server_name registry.example.com;

    ssl_certificate /etc/ssl/certs/registry.example.com.crt;
    ssl_certificate_key /etc/ssl/private/registry.example.com.key;

    # Disable upload payload limit for large Docker layers
    client_max_body_size 5G;

    location / {
        proxy_pass http://nexus.internal:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto "https";
    }
}
```

---

## 🔒 Kubernetes ImagePullSecret Generation

Generate the secret for Kubernetes pods to authenticate with Nexus:

```bash
# [STATE-MODIFYING] Create docker-registry secret in Kubernetes
kubectl create secret docker-registry nexus-registry-secret \
  --docker-server=registry.example.com \
  --docker-username=svc-k8s-pull \
  --docker-password='<password>' \
  --docker-email=ops@example.com \
  --namespace=workloads
```

Attach to workloads in Pod spec:
```yaml
spec:
  imagePullSecrets:
    - name: nexus-registry-secret
  containers:
    - name: app
      image: registry.example.com/platform/my-app:1.2.0
```
