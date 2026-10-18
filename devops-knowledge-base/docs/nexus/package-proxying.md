# Package Proxying & Air-Gapped Environments in Nexus

Managing external package caching for npm, Maven, PyPI, and operating in air-gapped or restricted-internet environments.

---

## 📦 Configuring Proxy Repositories

### 1. Maven Central Proxy
- **Remote URL**: `https://repo.maven.apache.org/maven2/`
- **Cache Timeout**: 1440 minutes (24 hours) for metadata; artifacts are cached permanently.

### 2. npmjs Proxy
- **Remote URL**: `https://registry.npmjs.org/`
- Developer/CI config (`~/.npmrc`):
  ```ini
  registry=https://nexus.example.com/repository/npm-group/
  always-auth=true
  _auth=<base64-encoded-username:password>
  ```

---

## 🛡️ Air-Gapped Operation Strategy

When operating in isolated environments with zero outbound internet connectivity:

1. **Pre-population Phase**: Mirror upstream dependencies via Nexus proxy while connected to a staging network or DMZ transfer node.
2. **Offline Mode**: Set **Auto-block outbound requests** and toggle **Offline mode** in the Nexus repository settings.
3. **Artifact Bundles**: Import offline tarballs using Nexus REST APIs or the `curl` upload endpoint:
   ```bash
   curl -u <user>:<pass> --upload-file artifact.jar "https://nexus.example.com/service/rest/v1/components?repository=maven-hosted"
   ```
