# APISIX TLS Certificates & Edge Security

Securing incoming traffic via TLS termination, Server Name Indication (SNI), and IP filtering.

---

## 🔒 Dynamic SSL/TLS Certificate Provisioning

APISIX terminates TLS dynamically without restarting Nginx worker processes when certificates are added or renewed.

### Uploading SSL Certificate via Admin API
```bash
# [STATE-MODIFYING] Upload SSL certificate and private key matching SNI api.example.com
curl "http://127.0.0.1:9180/apisix/admin/ssls/1" \
  -H "X-API-KEY: edd1c9f034335f136f87ad84b625c8f1" \
  -X PUT -d '{
    "cert": "<PEM_ENCODED_CERTIFICATE_CONTENT>",
    "key": "<PEM_ENCODED_PRIVATE_KEY_CONTENT>",
    "snis": ["api.example.com"]
  }'
```

---

## 🛡️ IP Restriction Filter (`ip-restriction`)

Restrict administrative routes to authorized VPN subnets:

```json
"plugins": {
  "ip-restriction": {
    "whitelist": [
      "192.0.2.0/24",
      "198.51.100.10"
    ],
    "rejected_code": 403,
    "rejected_msg": "Access Denied: IP address not allowed"
  }
}
```
