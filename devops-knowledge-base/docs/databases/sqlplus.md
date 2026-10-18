# Oracle SQL*Plus Administration & Automation Guide

SQL*Plus is the primary command-line tool for executing SQL and PL/SQL commands on Oracle Database instances.

---

## ⚡ Connecting with SQL*Plus

```bash
# [READ-ONLY] Connect using local EZCONNECT syntax without tnsnames.ora
sqlplus username/password@//oracle-db.example.com:1521/ORCLPDB1

# [STATE-MODIFYING] Connect locally as SYSDBA for database maintenance
sqlplus / as sysdba
```

---

## 📜 Headless Script Execution & Spooling

When automating migrations or reports in CI/CD pipelines or cron jobs, suppress interactive prompts:

```sql
-- migration.sql
SET ECHO OFF
SET FEEDBACK OFF
SET HEADING ON
SET LINESIZE 200
SET PAGESIZE 50000
SET TRIMSPOOL ON
SET TERMOUT OFF
SET SERVEROUTPUT ON

WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK;
WHENEVER OSERROR EXIT 9 ROLLBACK;

SPOOL /tmp/migration_output.log;

-- Execute operations
UPDATE schema_migrations SET applied_at = SYSDATE WHERE version = '20261018';
COMMIT;

SPOOL OFF;
EXIT SUCCESS;
```

Run headlessly from bash:
```bash
sqlplus -s username/password@//oracle-db.example.com:1521/ORCLPDB1 @migration.sql
```
