# APISIX Troubleshooting & Diagnostics

A guide to troubleshooting routing anomalies, 502 Bad Gateway errors, upstream connection timeouts, and plugin failures.

---

## 🔍 Diagnostic Checklist & Error Codes

### 1. HTTP 404 Not Found: "{"error_msg":"404 Route Not Found"}"
- **Cause**: Incoming request did not match any active Route definition.
- **Checklist**:
  1. Verify the `Host` header sent by client matches `hosts` field in Route.
  2. Verify URI path matches `uri` and regex prefix.
  3. Verify HTTP method (`GET`, `POST`) is explicitly listed in `methods: [...]`.
  4. Query Admin API to dump effective routes:
     ```bash
     curl -H "X-API-KEY: <key>" http://127.0.0.1:9180/apisix/admin/routes
     ```

---

### 2. HTTP 502 Bad Gateway: Upstream Node Unreachable
- **Cause**: APISIX matched the route, but upstream backend pods are refusing connection or not listening on the specified port.
- **Triage Steps**:
  1. Inspect error logs for socket errors:
     ```bash
     tail -f /usr/local/apisix/logs/error.log | grep -E "connect\(\) failed|Connection refused"
     ```
  2. Verify upstream node IP and port reachability from APISIX container:
     ```bash
     nc -zv -w 2 10.42.1.25 8080
     ```
  3. Check whether upstream healthcheck marked all nodes unhealthy.

---

### 3. HTTP 504 Gateway Timeout
- **Cause**: Backend service took longer to respond than the configured `read` timeout.
- **Resolution**:
  - Increase read timeout in Upstream definition:
    ```json
    "timeout": {
      "connect": 3,
      "send": 10,
      "read": 60
    }
    ```
  - Inspect backend database locks or thread exhaustion causing the delayed response.
