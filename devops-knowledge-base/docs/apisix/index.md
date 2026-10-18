# Apache APISIX API Gateway Architecture & Operations

Apache APISIX is a dynamic, high-performance, open-source cloud-native API gateway built on Nginx and LuaJIT, utilizing etcd for real-time configuration synchronization.

---

## 📑 Chapter Contents

- **[Architecture & Control Plane](architecture.md)**: Data plane vs Control plane separation, etcd watch mechanisms, and hot configuration reloading without worker reloads.
- **[Routes, Services & Upstreams](routes-services-upstreams.md)**: Route matching criteria, upstream balancing algorithms (chash, roundrobin, least_conn), and active health checks.
- **[Plugins & Authentication](plugins-and-authentication.md)**: Enabling plugins (`key-auth`, `jwt-auth`, `openid-connect`, `limit-req`, `cors`, `proxy-rewrite`).
- **[TLS & Security Hardening](tls-and-security.md)**: SSL certificate management, SNI matching, mTLS client verification, and IP restriction filters.
- **[APISIX Troubleshooting](troubleshooting.md)**: Admin API diagnostics, upstream timeouts, 502 Bad Gateway analysis, and plugin debugging.

---

## ⚡ Core Advantages in Kubernetes

1. **Zero-Downtime Hot Reloading**: Unlike legacy Nginx ingress controllers that trigger worker process reloads on every Endpoint change (dropping long-lived WebSocket connections), APISIX updates routing tables in Lua memory dynamically via etcd watch events.
2. **Rich Plugin Ecosystem**: Over 80 built-in plugins for authentication, rate limiting, traffic splitting, and observability.
