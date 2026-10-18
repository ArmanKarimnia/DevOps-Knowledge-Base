# Runbook: Emergency TLS Certificate Expiration

- **Severity Level**: SEV-1
- **Target Response Time**: Immediate (< 5 minutes)
- **Applicable Environments**: Apache APISIX, Ingress, and External API Endpoints

---

## 🎯 Symptoms & Triggers

- Web browsers display `NET::ERR_CERT_DATE_INVALID` or `SSL_ERROR_EXPIRED_CERTIFICATE`.
- Mobile clients report handshake failures.
- Prometheus alert: `SSLCertificateExpired`.

---

## 🔍 Investigation Steps

1. Verify the exact certificate expiration date:
   ```bash
   # [READ-ONLY] Check remote endpoint TLS expiration
   echo | openssl s_client -connect api.example.com:443 -servername api.example.com 2>/dev/null \
     | openssl x509 -noout -dates
   ```
2. In Kubernetes, check Cert-Manager certificate resource:
   ```bash
   # [READ-ONLY] Check Cert-Manager issuance status
   kubectl describe certificate api-tls-cert -n workloads
   ```

---

## 🛠️ Emergency Resolution

### Procedure 1: Force Cert-Manager Immediate Renewal
```bash
# [STATE-MODIFYING] Re-trigger certificate issuance request
kubectl cert-manager renew api-tls-cert -n workloads

# Check resulting order status
kubectl get certificaterequest -n workloads
```

### Procedure 2: Manual Certificate Secret Override
If Cert-Manager is blocked or rate-limited by Let's Encrypt:

1. Obtain a replacement certificate from backup enterprise internal CA.
2. Update the Kubernetes TLS Secret directly:
   ```bash
   kubectl create secret tls api-tls-secret \
     --cert=new_certificate.crt \
     --key=new_private.key \
     --namespace=workloads \
     --dry-run=client -o yaml | kubectl apply -f -
   ```
3. APISIX automatically synchronizes the new certificate from etcd within 1 second.
4. Verify resolution via openssl:
   ```bash
   echo | openssl s_client -connect api.example.com:443 -servername api.example.com 2>/dev/null | openssl x509 -noout -dates
   ```
