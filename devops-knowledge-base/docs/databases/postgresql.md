# PostgreSQL Administration & Performance Diagnostics

Managing enterprise PostgreSQL databases, inspecting active queries, configuring connection pools, and monitoring replication lag.

---

## ⚡ Active Queries & Lock Diagnostics

### 1. View Active Long-Running Queries
```sql
-- [READ-ONLY] Query running statements active for longer than 30 seconds
SELECT 
    pid,
    usename,
    client_addr,
    now() - query_start AS duration,
    wait_event_type,
    wait_event,
    state,
    query
FROM 
    pg_stat_activity
WHERE 
    state != 'idle' 
    AND (now() - query_start) > interval '30 seconds'
ORDER BY 
    duration DESC;
```

### 2. Terminate a Runaway Query Gracefully
```sql
-- [STATE-MODIFYING] Cancel query without terminating client connection
SELECT pg_cancel_backend(14820);

-- [HIGH-RISK] Terminate backend connection completely if query ignores cancel
SELECT pg_terminate_backend(14820);
```

---

## 💾 Table & Index Bloat Inspection

```sql
-- [READ-ONLY] List largest tables and total disk consumption
SELECT 
    relname AS table_name,
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
    pg_size_pretty(pg_relation_size(relid)) AS table_size,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) AS index_size
FROM 
    pg_catalog.pg_statio_user_tables
ORDER BY 
    pg_total_relation_size(relid) DESC
LIMIT 10;
```
