# Kafka Troubleshooting & Failure Diagnostics

Triage guides for Under-Replicated Partitions, Broker disk exhaustion, connection timeouts, and consumer deadlocks.

---

## 🚨 Incident 1: Under-Replicated Partitions Alert (URP > 0)

### Cause
One or more brokers are not replicating partition leaders within `replica.lag.time.max.ms` (network partitioning, broker restart, or disk I/O stall).

### Investigation Steps:
1. Identify affected topics and partitions:
   ```bash
   kafka-topics.sh --bootstrap-server kafka.example.com:9092 --describe --under-replicated-partitions
   ```
2. Check broker error logs:
   ```bash
   grep -i -E "OutOfMemoryError|DiskFull|IOException|replica" /var/log/kafka/server.log
   ```
3. Verify broker network connectivity and disk space.

---

## 🚨 Incident 2: "NOT_ENOUGH_REPLICAS" Exception on Producers

### Cause
The number of available In-Sync Replicas (ISR) dropped below `min.insync.replicas` while producer uses `acks=all`.

### Resolution:
1. Check how many brokers are alive and healthy.
2. If a broker failed, restart it to allow it to catch up with the leader.
3. Once the replica synchronizes, it is added back to the ISR and producer writes succeed automatically.
