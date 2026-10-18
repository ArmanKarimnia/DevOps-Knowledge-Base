# APISIX Routes, Services & Upstreams Administration

Administering APISIX objects declaratively via the Admin API or Kubernetes Custom Resource Definitions (CRDs).

---

## 🛠️ Admin API Declarative Examples

The Admin API runs on port `9180` protected by the `X-API-KEY` header.

### 1. Create an Upstream with Active Health Checking
```bash
# [STATE-MODIFYING] Define upstream pool with round-robin balancing and passive/active health checks
curl "http://127.0.0.1:9180/apisix/admin/upstreams/100" \
  -H "X-API-KEY: edd1c9f034335f136f87ad84b625c8f1" \
  -X PUT -d '{
    "type": "roundrobin",
    "nodes": {
      "10.42.1.25:8080": 1,
      "10.42.2.30:8080": 1
    },
    "timeout": {
      "connect": 3,
      "send": 5,
      "read": 10
    },
    "checks": {
      "active": {
        "type": "http",
        "http_path": "/healthz",
        "healthy": {
          "interval": 5,
          "successes": 2
        },
        "unhealthy": {
          "interval": 2,
          "http_failures": 3
        }
      }
    }
  }'
```

### 2. Create a Route Binding to Upstream 100
```bash
# [STATE-MODIFYING] Create route forwarding /api/v1/orders/* to upstream 100
curl "http://127.0.0.1:9180/apisix/admin/routes/1" \
  -H "X-API-KEY: edd1c9f034335f136f87ad84b625c8f1" \
  -X PUT -d '{
    "uri": "/api/v1/orders/*",
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "upstream_id": "100"
  }'
```

---

## ☸️ Declarative Kubernetes CRD: `ApisixRoute`

When operating in Kubernetes with the `apisix-ingress-controller`, manage routes via CRDs:

```yaml
apiVersion: apisix.apache.org/v2
kind: ApisixRoute
metadata:
  name: order-service-route
  namespace: workloads
spec:
  http:
    - name: orders
      match:
        hosts:
          - api.example.com
        paths:
          - /api/v1/orders*
      backends:
        - serviceName: order-service
          servicePort: 8080
          weight: 100
      plugins:
        - name: proxy-rewrite
          enable: true
          config:
            regex_uri: ["^/api/v1/orders/(.*)", "/orders/$1"]
```
