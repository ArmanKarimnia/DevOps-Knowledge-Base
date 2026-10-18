# Runbook: Database Connectivity & Connection Pool Exhaustion

- **Severity Level**: SEV-1
- **Target Response Time**: < 10 minutes
- **Applicable Environments**: Oracle Database, PostgreSQL & HikariCP Application Workloads

---

## 🎯 Symptoms & Triggers

- Application pods throwing `HikariPool-1 - Connection is not available, request timed out after 10000ms`.
- PostgreSQL logs: `FATAL: remaining connection slots are reserved for non-replication superuser connections`.
- Oracle error: `ORA-00020: maximum number of processes (xxx) exceeded`.

---

## 🔍 Investigation Steps

### PostgreSQL Diagnostics
```sql
-- [READ-ONLY] Check current active connections vs max allowed
SELECT count(*), (SELECT setting FROM pg_settings WHERE name = 'max_connections') AS max_conn
FROM pg_stat_activity;

-- [READ-ONLY] Group active connections by client IP address
SELECT client_addr, count(*) 
FROM pg_stat_activity 
GROUP BY client_addr 
ORDER BY count(*) DESC;
```

### Oracle Database Diagnostics
```sql
-- [READ-ONLY] Check current sessions count vs process limits
SELECT count(*) FROM v$session;
SELECT name, value FROM v$parameter WHERE name IN ('processes', 'sessions');
```

---

## 🛠️ Mitigation Procedures

### Step 1: Terminate Idle In-Transaction Sessions
```sql
-- [STATE-MODIFYING] Terminate idle connections in PostgreSQL holding locks for > 5m
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle in transaction'
  AND (now() - state_change) > interval '5 minutes';
```

### Step 2: Scale Down Leaking Workload Replicas
If a rogue pod is opening un-closed connections:
```bash
# [STATE-MODIFYING] Temporarily scale down offending microservice to release DB slots
kubectl scale deployment/rogue-service -n workloads --replicas=1
```

### Step 3: Implement PgBouncer Connection Pooling
If traffic legitimately grew, deploy PgBouncer between application pods and PostgreSQL to multiplex thousands of client connections into a controlled pool of 50 backend database connections.
