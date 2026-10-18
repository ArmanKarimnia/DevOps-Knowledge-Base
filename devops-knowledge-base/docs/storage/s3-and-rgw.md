# Ceph RADOS Gateway (RGW) & S3-Compatible Object Storage

Ceph Rados Gateway (RGW) provides an HTTP/REST interface fully compatible with Amazon S3 APIs.

---

## 🔑 Provisioning S3 Users & Access Keys (`radosgw-admin`)

```bash
# [STATE-MODIFYING] Create new S3 service account user with quotas
radosgw-admin user create \
  --uid="backup-service" \
  --display-name="Automated Database Backup Service" \
  --max-buckets=50

# [STATE-MODIFYING] Set bucket storage quota (500GB max per user)
radosgw-admin quota set --uid="backup-service" --quota-scope=user --max-size=500G
radosgw-admin quota enable --uid="backup-service" --quota-scope=user
```

---

## 🧪 Testing S3 Operations with AWS CLI

Configure `~/.aws/credentials`:
```ini
[default]
aws_access_key_id = <access-key>
aws_secret_access_key = <secret-key>
```

Execute commands against Ceph RGW:
```bash
# [READ-ONLY] List all buckets on local Ceph RGW
aws --endpoint-url https://s3.example.com s3 ls

# [STATE-MODIFYING] Create a new private bucket
aws --endpoint-url https://s3.example.com s3 mb s3://postgres-backups

# [STATE-MODIFYING] Upload file using multipart upload
aws --endpoint-url https://s3.example.com s3 cp backup.sql.gz s3://postgres-backups/2026-10-18/
```
