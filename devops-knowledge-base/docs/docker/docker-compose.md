# Docker Compose Architecture & Standards

Docker Compose coordinates multi-container services, network isolation, persistent storage volumes, and dependency startup sequences for integration environments.

---

## 🏗️ Production-Grade Docker Compose Specification

Below is a reference `compose.yaml` illustrating modern best practices:

```yaml
services:
  app:
    image: registry.example.com/platform/api-backend:2.1.0
    restart: unless-stopped
    ports:
      - "127.0.0.1:8080:8080"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://app_user:${DB_PASSWORD}@postgres:5432/app_db
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:8080/healthz"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 15s
    networks:
      - backend_net
    deploy:
      resources:
        limits:
          cpus: '1.5'
          memory: 1G

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: app_db
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - backend_net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app_user -d app_db"]
      interval: 5s
      timeout: 3s
      retries: 5

networks:
  backend_net:
    driver: bridge

volumes:
  pgdata:

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

---

## ⚡ Operational Commands

```bash
# [STATE-MODIFYING] Start all services detached in background
docker compose up -d

# [READ-ONLY] View service status and healthcheck results
docker compose ps

# [READ-ONLY] Stream unified logs with service prefixes
docker compose logs -f --tail 100 app

# [STATE-MODIFYING] Stop and remove containers and networks (preserves volumes)
docker compose down

# [HIGH-RISK] Tear down stack and purge all persistent volume data
docker compose down -v
```
