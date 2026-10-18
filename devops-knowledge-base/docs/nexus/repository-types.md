# Sonatype Nexus Repository Types & Concepts

A detailed overview of Hosted, Proxy, and Group repositories across various package formats.

---

## 🏛️ Repository Categories

### 1. Hosted Repository
- **Purpose**: Stores proprietary, in-house build artifacts and internally compiled container images.
- **Write Policy**: Typically configured as **Read-only** for releases to enforce immutability, while snapshot repositories allow redeployment.
- **Example**: `docker-hosted` (stores internal business microservices), `maven-releases`.

### 2. Proxy Repository
- **Purpose**: Acts as an intelligent local cache proxying external public registries (e.g., Docker Hub, npmjs.org, repo.maven.apache.org).
- **Benefits**:
  - Dramatically accelerates CI build times by serving cached layers locally.
  - Insulates builds against upstream network outages or Docker Hub rate limits.
  - Automatically retains packages in cache for air-gapped environments.

### 3. Group Repository
- **Purpose**: Combines multiple Hosted and Proxy repositories into a single unified URL.
- **Workflow**: A client requests an artifact from the group. Nexus checks the hosted repository first; if absent, it checks the proxy cache; if still absent, it fetches from the internet, caches it, and serves it to the client.
