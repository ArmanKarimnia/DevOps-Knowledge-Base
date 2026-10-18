# JDBC Integrations & Connection Pool Architecture (HikariCP)

Properly configuring JDBC connection pools is critical for preventing database thread starvation and connection storms.

---

## ⚡ HikariCP Recommended Configuration

HikariCP is the gold standard for high-performance Java/Spring/Kotlin JDBC connection pools.

```properties
# HikariCP Production Baseline
spring.datasource.hikari.pool-name=OrderServiceHikariPool
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=1800000
spring.datasource.hikari.connection-timeout=10000
spring.datasource.hikari.validation-timeout=3000
spring.datasource.hikari.leak-detection-threshold=60000
```

### Critical Rules:
1. **Never set `maximum-pool-size` arbitrarily large**: A pool of 200 connections per pod across 10 pods equals 2,000 database connections, which will exhaust database RAM and context-switch limits. The formula recommended by PostgreSQL and Oracle is:
   $$\text{Pool Size} = (2 \times \text{CPU Core Count}) + \text{Disk Spindle / SSD factor}$$
2. **`leak-detection-threshold`**: Logs an exception if a thread borrows a connection without returning it to the pool within 60 seconds (catches unclosed JDBC ResultSets).
