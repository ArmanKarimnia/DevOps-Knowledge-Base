# Apache Kafka Operational Commands Cheatsheet

A command reference for topic management, partition administration, consumer group lag inspection, and console producing/consuming.

---

## 📋 Topic Management (`kafka-topics.sh`)

### 1. Create a Production Topic with Replication
```bash
# [STATE-MODIFYING] Create topic with 6 partitions and replication factor 3
kafka-topics.sh --bootstrap-server kafka.example.com:9092 \
  --create --topic orders.events \
  --partitions 6 \
  --replication-factor 3 \
  --config min.insync.replicas=2 \
  --config retention.ms=604800000
```

### 2. Inspect Topic Partitions, Leaders & ISR
```bash
# [READ-ONLY] View partition distribution, leader brokers, and In-Sync Replicas (ISR)
kafka-topics.sh --bootstrap-server kafka.example.com:9092 \
  --describe --topic orders.events
```

### 3. List Topics with Under-Replicated Partitions
```bash
# [READ-ONLY] Pinpoint partitions whose replicas are out of sync
kafka-topics.sh --bootstrap-server kafka.example.com:9092 \
  --describe --under-replicated-partitions
```

---

## 👥 Consumer Groups & Lag Diagnostics (`kafka-consumer-groups.sh`)

### 1. View Consumer Lag Across All Partitions
```bash
# [READ-ONLY] Inspect current offset, log end offset, lag, and assigned consumer ID
kafka-consumer-groups.sh --bootstrap-server kafka.example.com:9092 \
  --describe --group order-processing-group
```
*Expected Output*:
```text
GROUP                  TOPIC          PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG             CONSUMER-ID
order-processing-group orders.events  0          140230          140235          5               consumer-1-a1b2
order-processing-group orders.events  1          182040          195000          12960           consumer-2-c3d4
```
*Note*: Partition 1 shows severe consumer lag (12,960 unread events), indicating slow processing or stalled worker thread.

### 2. Reset Consumer Group Offsets
```bash
# [HIGH-RISK] Reset offsets to earliest available message (requires group to be stopped)
kafka-consumer-groups.sh --bootstrap-server kafka.example.com:9092 \
  --group order-processing-group \
  --reset-offsets --to-earliest \
  --topic orders.events \
  --execute
```

---

## 🧪 Console Produce & Consume

```bash
# [READ-ONLY] Consume messages from beginning with keys and timestamps
kafka-console-consumer.sh --bootstrap-server kafka.example.com:9092 \
  --topic orders.events \
  --from-beginning \
  --property print.key=true \
  --property print.timestamp=true \
  --max-messages 10
```
