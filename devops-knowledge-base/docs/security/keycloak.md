# Keycloak Identity & Access Management (IAM) Operations

Keycloak provides centralized Single Sign-On (SSO), Active Directory / LDAP federation, client management, and role-based access control.

---

## 🏛️ Keycloak Hierarchy: Realm, Client, Role & User

- **Realm**: A tenant boundary isolating users, credentials, roles, and clients. Never use the `master` realm for business workloads; create dedicated realms (e.g., `enterprise`).
- **Client**: Entities that request authentication (web apps, mobile apps, backend microservices).
- **Client Scopes**: Sets of claims (e.g., `email`, `profile`, `roles`) mapped into the JWT access and identity tokens.
- **Service Account Roles**: Enabled on confidential clients to assign fine-grained roles for M2M machine authentication.

---

## 🏢 Active Directory / LDAP User Federation

Configuring LDAP federation in Keycloak:

```text
Edit Mode: READ_ONLY (or WRITABLE if Keycloak syncs password updates back to AD)
Vendor: Active Directory
Connection URL: ldaps://dc01.corp.example.com:636
Users DN: ou=Users,ou=Enterprise,dc=corp,dc=example,dc=com
Bind DN: cn=svc-keycloak,ou=ServiceAccounts,dc=corp,dc=example,dc=com
User Object Classes: person, organizationalPerson, user
Search Scope: Subtree
```
- **Sync Schedule**: Set **Periodic Changed Users Sync** to every 900 seconds (15 minutes).
- **Kerberos / SPNEGO**: Enable SPNEGO for automatic zero-click desktop browser login when domain joined.

---

## ⏱️ Token Lifespan Best Practices

In **Realm Settings ➔ Tokens**:
- **Access Token Lifespan**: Set to **5 minutes** (short-lived to minimize damage if leaked).
- **Refresh Token Lifespan**: Set to **8 hours** (aligns with working business day).
- **SSO Session Idle**: Set to **30 minutes**.
