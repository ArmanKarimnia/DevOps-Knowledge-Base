# APISIX Plugins, Authentication & Rate Limiting

APISIX provides modular plugins executed during request processing phases.

---

## 🔑 Authentication Plugins

### 1. Consumer API Key Authentication (`key-auth`)
1. Create Consumer with API Key:
   ```bash
   # [STATE-MODIFYING] Provision an API Consumer
   curl "http://127.0.0.1:9180/apisix/admin/consumers" \
     -H "X-API-KEY: edd1c9f034335f136f87ad84b625c8f1" \
     -X PUT -d '{
       "username": "mobile-client",
       "plugins": {
         "key-auth": {
           "key": "secret-mobile-api-key-value"
         }
       }
     }'
   ```
2. Enable `key-auth` on Route:
   ```json
   "plugins": {
     "key-auth": {}
   }
   ```
   *Requests without `apikey: secret-mobile-api-key-value` header receive HTTP 401 Unauthorized.*

---

## 🚦 Traffic Protection: Rate Limiting (`limit-req`)

Prevent denial of service or upstream overload using the Leaky Bucket algorithm:

```json
"plugins": {
  "limit-req": {
    "rate": 100,
    "burst": 25,
    "key_type": "var",
    "key": "remote_addr",
    "rejected_code": 429,
    "rejected_msg": "Too Many Requests - Rate limit exceeded"
  }
}
```
- `rate`: 100 requests per second.
- `burst`: Maximum queue capacity before returning HTTP 429.
- `key`: IP address (`remote_addr`) or consumer username (`consumer_name`).

---

## 🌐 Cross-Origin Resource Sharing (`cors`)

Enable browser AJAX requests with secure origins:

```json
"plugins": {
  "cors": {
    "allow_origins": "https://app.example.com,https://admin.example.com",
    "allow_methods": "GET,POST,PUT,DELETE,OPTIONS",
    "allow_headers": "Authorization,Content-Type,X-Request-Id",
    "allow_credential": true,
    "max_age": 3600
  }
}
```
