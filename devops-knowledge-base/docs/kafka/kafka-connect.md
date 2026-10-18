# Kafka Connect & JDBC Database Integrations

Kafka Connect provides scalable and fault-tolerant data streaming between Apache Kafka and external systems (such as Oracle, PostgreSQL, and Elasticsearch).

---

## 🔌 Connector Types: Source vs Sink

- **Source Connector**: Streams data FROM external systems (e.g., changes in an Oracle or Postgres table) INTO Kafka topics.
- **Sink Connector**: Consumes data FROM Kafka topics and writes INTO downstream datastores.

---

## 🛠️ PostgreSQL JDBC Sink Connector Configuration

Deploying a JDBC Sink connector via the Kafka Connect REST API:

```bash
# [STATE-MODIFYING] Provision JDBC Sink Connector streaming into PostgreSQL
curl -X POST "http://kafka-connect.example.com:8083/connectors" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "postgres-order-sink",
    "config": {
      "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
      "tasks.max": "3",
      "topics": "orders.events",
      "connection.url": "jdbc:postgresql://postgres.example.com:5432/analytics_db",
      "connection.user": "sink_user",
      "connection.password": "${file:/secrets/db.properties:sink_password}",
      "auto.create": "true",
      "auto.evolve": "true",
      "insert.mode": "upsert",
      "pk.mode": "record_key",
      "pk.fields": "order_id"
    }
  }'
```

---

## 🔍 Connector Health & Status Diagnostics

```bash
# [READ-ONLY] List all active connectors
curl -s "http://kafka-connect.example.com:8083/connectors"

# [READ-ONLY] Check task states and stack traces of failed tasks
curl -s "http://kafka-connect.example.com:8083/connectors/postgres-order-sink/status" | jq .

# [STATE-MODIFYING] Restart a failed connector task
curl -X POST "http://kafka-connect.example.com:8083/connectors/postgres-order-sink/tasks/0/restart"
```
