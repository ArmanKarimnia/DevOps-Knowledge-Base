# ELK Stack (Elasticsearch, Logstash, Kibana) Architecture

Centralized logging architecture for ingesting, transforming, indexing, and searching petabytes of container logs.

---

## 🔍 Elasticsearch Cluster Health & Diagnostics

The health of an Elasticsearch cluster is designated by three statuses:
- 🟢 **Green**: All primary shards and replica shards are allocated.
- 🟡 **Yellow**: All primary shards are allocated, but one or more replica shards are unassigned (single-node cluster or lost worker).
- 🔴 **Red**: At least one primary shard is unallocated. Data loss or partial read failure is occurring!

### Essential Diagnostics Commands
```bash
# [READ-ONLY] Check cluster health and unassigned shards count
curl -s "http://127.0.0.1:9200/_cluster/health?pretty"

# [READ-ONLY] View allocation explanation for unassigned shards
curl -s "http://127.0.0.1:9200/_cluster/allocation/explain?pretty"

# [READ-ONLY] List indices with disk size and document counts
curl -s "http://127.0.0.1:9200/_cat/indices?v&s=pri.store.size:desc"
```

---

## 🪵 Logstash Pipeline Configuration

```ruby
# /etc/logstash/conf.d/k8s-pipeline.conf
input {
  beats {
    port => 5044
    ssl => true
    ssl_certificate => "/etc/logstash/certs/logstash.crt"
    ssl_key => "/etc/logstash/certs/logstash.key"
  }
}

filter {
  # Parse JSON structured application logs
  if [kubernetes][container][name] =~ /^app-/ {
    json {
      source => "message"
      target => "parsed_json"
      skip_on_invalid_json => true
    }
  }
  
  # Normalize timestamp
  date {
    match => [ "[parsed_json][timestamp]", "ISO8601" ]
    target => "@timestamp"
  }
}

output {
  elasticsearch {
    hosts => ["https://es-node-01:9200", "https://es-node-02:9200"]
    index => "k8s-logs-%{+YYYY.MM.dd}"
    user => "elastic"
    password => "${ES_PASSWORD}"
    ssl => true
    cacert => "/etc/logstash/certs/ca.crt"
  }
}
```
