# Kafka Consumer Groups, Partitions & Offset Lag Architecture

Understanding partition assignment strategies, heartbeat timeouts, rebalance storms, and consumer lag.

---

## ⚖️ Consumer Group Partition Assignment

In Apache Kafka, a single topic partition is consumed by **exactly one consumer instance** within the same Consumer Group at any given time:

- If you have **6 partitions** and **3 consumers**, each consumer reads from 2 partitions.
- If you have **6 partitions** and **6 consumers**, each consumer reads from 1 partition (optimal parallelism).
- If you have **6 partitions** and **8 consumers**, 2 consumers sit completely idle as warm standbys.

---

## 🌪️ Rebalance Storms & Root Causes

A rebalance occurs whenever:
1. A new consumer joins or an existing consumer leaves the group.
2. A consumer fails to send heartbeats within `session.timeout.ms` (default 45s).
3. The processing time for a batch of polled messages exceeds `max.poll.interval.ms` (default 5m).

### Fixing Processing Timeout Rebalances
If consumers frequently crash with `CommitFailedException`:
- Decrease `max.poll.records` (e.g., from 500 down to 50).
- Increase `max.poll.interval.ms` (e.g., to 600000ms / 10m).
- Move slow I/O or database operations to a worker thread pool.
