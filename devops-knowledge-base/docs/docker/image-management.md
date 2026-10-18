# Container Image Optimization & Security

Optimizing container images minimizes attack surfaces, decreases Kubernetes pod pull times, and reduces network transit costs in air-gapped or restricted bandwidth environments.

---

## 🏗️ Production Multi-Stage Dockerfile Pattern

```dockerfile
# Stage 1: Build & Compilation Environment
FROM node:20-alpine AS builder
WORKDIR /app

# Cache dependency layer separately from source code
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .
RUN npm run build && npm prune --production

# Stage 2: Minimal Distroless Runtime Environment
FROM gcr.io/distroless/nodejs20-debian12:nonroot
WORKDIR /app

# Copy only production artifacts and node_modules
COPY --from=builder --chown=nonroot:nonroot /app/dist ./dist
COPY --from=builder --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=builder --chown=nonroot:nonroot /app/package.json ./package.json

EXPOSE 8080
USER nonroot

CMD ["dist/main.js"]
```

---

## 🔍 Vulnerability Scanning with Trivy

```bash
# [READ-ONLY] Scan container image for OS and package vulnerabilities
trivy image --severity HIGH,CRITICAL registry.example.com/platform/api-backend:2.1.0

# [READ-ONLY] Generate CycloneDX Software Bill of Materials (SBOM)
trivy image --format cyclonedx --output sbom.json registry.example.com/platform/api-backend:2.1.0
```
