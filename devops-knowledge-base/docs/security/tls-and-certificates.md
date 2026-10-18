# TLS, X.509 Certificates & PKI Operations

Managing Public Key Infrastructure (PKI), inspecting certificate expiration dates, verifying certificate chains, and debugging TLS handshakes using OpenSSL.

---

## ⚡ Essential OpenSSL Diagnostic Commands

### 1. Inspect Expiration Date of a Remote Server Certificate
```bash
# [READ-ONLY] Check certificate validity and expiration date without browser
openssl s_client -connect api.example.com:443 -servername api.example.com </dev/null 2>/dev/null \
  | openssl x509 -noout -dates -subject -issuer
```
*Expected Output*:
```text
notBefore=Jan 15 00:00:00 2026 GMT
notAfter=Apr 15 23:59:59 2026 GMT
subject=CN = api.example.com
issuer=C = US, O = Let's Encrypt, CN = R3
```

### 2. Verify Certificate & Private Key Match (Modulus Comparison)
```bash
# [READ-ONLY] Calculate MD5 hash of public and private key moduli (hashes must match!)
openssl x509 -noout -modulus -in /path/to/server.crt | openssl md5
openssl rsa -noout -modulus -in /path/to/server.key | openssl md5
```

### 3. Generate CSR with Subject Alternative Names (SAN)
```bash
# [STATE-MODIFYING] Create private key and CSR with multi-domain SANs in one command
openssl req -new -newkey rsa:2048 -nodes \
  -keyout api.example.com.key \
  -out api.example.com.csr \
  -subj "/CN=api.example.com/O=Enterprise DevOps" \
  -addext "subjectAltName = DNS:api.example.com, DNS:api-internal.example.com, IP:192.0.2.10"
```

---

## ☸️ Automated Certificate Lifecycle with Cert-Manager

In Kubernetes, Cert-Manager automates issuance and renewal:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: api-tls-cert
  namespace: workloads
spec:
  secretName: api-tls-secret
  duration: 2160h # 90 days
  renewBefore: 720h # Renew 30 days before expiry
  dnsNames:
    - api.example.com
  issuerRef:
    name: letsencrypt-production
    kind: ClusterIssuer
```
