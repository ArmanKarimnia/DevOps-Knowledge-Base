# Apache Kafka & Distributed Streaming Architecture

Apache Kafka is a horizontally scalable, fault-tolerant, high-throughput distributed event log platform.

---

## 📑 Chapter Contents

- **[Kafka Commands Cheatsheet](commands-cheatsheet.md)**: Topic creation, partition rebalancing, consumer group diagnostics, and offset inspection.
- **[Kafka Connect & CDC Pipelines](kafka-connect.md)**: Source and Sink connectors, Debezium change data capture, and JDBC connectors.
- **[Consumer Groups & Offset Lag](consumer-groups-and-offsets.md)**: Partition rebalance triggers, offset commit strategies, and lag diagnostics.
- **[Kafka Troubleshooting](troubleshooting.md)**: Broker out of sync replicas (ISR), partition leader election failures, and disk storage compaction.

---

## 🏛️ Kafka Core Architecture

```mermaid
graph TD
    subgraph Producers [Event Producers]
        P1[Order Service]
        P2[Payment Gateway]
    end

    subgraph Kafka_Cluster [Apache Kafka Cluster]
        B1[Broker 1: Leader P0, Follower P1]
        B2[Broker 2: Leader P1, Follower P2]
        B3[Broker 3: Leader P2, Follower P0]
    end

    subgraph Consumers [Consumer Groups]
        C1[Consumer 1: reads P0, P1]
        C2[Consumer 2: reads P2]
    end

    P1 --> B1
    P2 --> B2
    B1 --> C1
    B2 --> C1
    B3 --> C2
```
