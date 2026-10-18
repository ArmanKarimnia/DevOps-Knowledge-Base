# Oracle SQL Diagnostic Queries Cheatsheet

A collection of battle-tested Oracle SQL queries for database performance triage, session management, lock resolution, and storage capacity auditing.

---

## 💾 Tablespace Capacity & Growth

### 1. Check Tablespace Free Space & Percentage Used
```sql
-- [READ-ONLY] Query tablespace usage metrics across the database
SELECT 
    tablespace_name,
    ROUND(used_space * 8192 / 1024 / 1024, 2) AS used_mb,
    ROUND(tablespace_size * 8192 / 1024 / 1024, 2) AS total_mb,
    ROUND(used_percent, 2) AS pct_used
FROM 
    dba_tablespace_usage_metrics
ORDER BY 
    pct_used DESC;
```

---

## 🔒 Session Monitoring & Blocking Locks

### 1. Identify Active Blocking Sessions
```sql
-- [READ-ONLY] Locate sessions causing lock contention and blocked sessions
SELECT 
    b.sid AS blocker_sid,
    b.serial# AS blocker_serial,
    b.username AS blocker_user,
    b.machine AS blocker_machine,
    b.sql_id AS blocker_sql_id,
    w.sid AS waiting_sid,
    w.serial# AS waiting_serial,
    w.username AS waiting_user,
    w.wait_class,
    w.seconds_in_wait
FROM 
    v$session b
JOIN 
    v$session w ON b.sid = w.blocking_session;
```

### 2. Kill a Stalled or Blocking Session
```sql
-- [STATE-MODIFYING] Terminate session (SID, SERIAL#)
ALTER SYSTEM KILL SESSION '145,28901' IMMEDIATE;
```

---

## ⚡ Active Long-Running SQL Execution

```sql
-- [READ-ONLY] Find SQL statements executing for longer than 60 seconds
SELECT 
    s.sid,
    s.serial#,
    s.username,
    s.status,
    s.last_call_et AS elapsed_seconds,
    s.sql_id,
    q.sql_text
FROM 
    v$session s
JOIN 
    v$sql q ON s.sql_id = q.sql_id
WHERE 
    s.status = 'ACTIVE' 
    AND s.username IS NOT NULL 
    AND s.last_call_et > 60
ORDER BY 
    s.last_call_et DESC;
```
