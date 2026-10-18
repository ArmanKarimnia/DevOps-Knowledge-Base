/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommandItem, DocItem } from '../utils/kb-engine';

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'all', name: 'All Categories', icon: 'Layers', description: 'Complete DevOps documentation repository', count: 18 },
  { id: 'kubernetes', name: 'Kubernetes & RKE2', icon: 'Boxes', description: 'Hardened clusters, Cilium eBPF, RBAC, Helm, and kubectl', count: 12 },
  { id: 'cicd', name: 'GitLab CI/CD & Nexus', icon: 'GitMerge', description: 'Pipelines, runners, Kaniko, Sonatype Nexus, and rollbacks', count: 8 },
  { id: 'linux', name: 'Linux & SysAdmin', icon: 'Terminal', description: 'Systemd, networking, storage, SSH, and troubleshooting', count: 8 },
  { id: 'apisix', name: 'API Gateway (APISIX)', icon: 'Globe', description: 'Routes, upstreams, plugins, rate limiting, and mTLS', count: 6 },
  { id: 'observability', name: 'Observability & Monitoring', icon: 'Activity', description: 'Prometheus, Grafana, ELK Stack, and SLI/SLO calculations', count: 6 },
  { id: 'kafka', name: 'Messaging & Kafka', icon: 'Radio', description: 'Brokers, consumer group lag, offsets, and Kafka Connect', count: 5 },
  { id: 'databases', name: 'Databases & Data', icon: 'Database', description: 'Oracle SQL, SQL*Plus, PostgreSQL, and HikariCP pooling', count: 5 },
  { id: 'security', name: 'Security & IAM', icon: 'ShieldCheck', description: 'Keycloak OIDC, DevSecOps scanning, TLS, and CIS benchmarks', count: 7 },
  { id: 'storage', name: 'Storage & Ceph', icon: 'HardDrive', description: 'Ceph RGW S3, Longhorn distributed block, and CSI volumes', count: 5 },
  { id: 'runbooks', name: 'Incident Runbooks', icon: 'Flame', description: 'Battle-tested step-by-step procedures for live production triage', count: 6 },
  { id: 'operations', name: 'Operations & SRE', icon: 'LifeBuoy', description: 'Incident triage, change governance, and production readiness', count: 6 },
  { id: 'templates', name: 'Standard Templates', icon: 'FileText', description: 'Cheatsheets, runbooks, and troubleshooting templates', count: 4 }
];

export const FEATURED_DOCS: DocItem[] = [
  {
    id: 'k8s-kubectl',
    title: 'Kubectl Operational Commands Cheatsheet',
    category: 'kubernetes',
    path: 'docs/kubernetes/kubectl-cheatsheet.md',
    summary: 'Comprehensive, battle-tested kubectl command reference for pods, nodes, rollouts, EndpointSlices, and debugging.',
    tags: ['kubectl', 'kubernetes', 'pods', 'debugging', 'nodes', 'rollout'],
    level: 3,
    content: `# Kubectl Operational Commands Cheatsheet\n\nA production-grade, copy-pasteable reference for Kubernetes cluster operations, workload debugging, networking diagnostics, and emergency recovery.\n\n## 🧭 Cluster Contexts & Namespace Navigation\n\n### 1. View current active context\n\`\`\`bash\n# [READ-ONLY] View current active context\nkubectl config current-context\n\`\`\`\n\n### 2. Node Health & Resource Capacity\n\`\`\`bash\n# [READ-ONLY] View real-time CPU and Memory utilization per node\nkubectl top nodes\n\n# [READ-ONLY] Inspect node conditions (MemoryPressure, DiskPressure, PIDPressure, Ready)\nkubectl describe node <node-name> | grep -A 8 "Conditions:"\n\`\`\`\n\n## 🔍 Workload Diagnostics: Pods, Deployments & Rollouts\n\n\`\`\`bash\n# [READ-ONLY] List all unhealthy pods across the entire cluster\nkubectl get pods -A --field-selector status.phase!=Running,status.phase!=Succeeded\n\n# [READ-ONLY] View logs from previous container instance before crash (CrashLoopBackOff)\nkubectl logs <pod-name> -c <container-name> -n <namespace> --previous\n\`\`\`\n\n## 🔄 Rolling Restarts & Rollbacks\n\n\`\`\`bash\n# [STATE-MODIFYING] Trigger graceful rolling restart without code changes\nkubectl rollout restart deployment/<deployment-name> -n <namespace>\n\n# [STATE-MODIFYING] Roll back deployment to immediately preceding revision\nkubectl rollout undo deployment/<deployment-name> -n <namespace>\n\`\`\`\n\n## ⚠️ High-Risk Maintenance & Recovery Commands\n\n\`\`\`bash\n# [HIGH-RISK] Safely mark node unschedulable and evict all workloads (PDBs respected)\nkubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data --force\n\n# [STATE-MODIFYING] Uncordon node after maintenance to allow new pod scheduling\nkubectl uncordon <node-name>\n\`\`\``
  },
  {
    id: 'k8s-cilium',
    title: 'Cilium eBPF Networking, Security & Hubble',
    category: 'kubernetes',
    path: 'docs/kubernetes/cilium.md',
    summary: 'Kernel-level routing, kube-proxy replacement with eBPF maps, L3/L4/L7 Network Policies, and Hubble observability.',
    tags: ['cilium', 'ebpf', 'networking', 'hubble', 'security', 'cni'],
    level: 4,
    content: `# Cilium eBPF Networking, Security & Hubble Observability\n\nCilium is a cloud-native networking, observability, and security solution built directly on Linux eBPF.\n\n## ⚡ Why Cilium Replaces Kube-Proxy\nIn legacy Kubernetes networking, kube-proxy writes thousands of sequential iptables rules. Every packet traverses linear rule chains (O(N) overhead). Cilium replaces iptables with eBPF Hash Maps (O(1) complexity).\n\n## 🛡️ Production CiliumNetworkPolicy (L3, L4, L7)\nStandard Kubernetes NetworkPolicy only filters Layer 3 (IP) and Layer 4 (Port). Cilium enables Layer 7 HTTP filtering directly inside the kernel.\n\n## 🔬 Hubble Live Flow Observability\n\`\`\`bash\n# [READ-ONLY] Stream dropped packets in real-time across namespace\nhubble observe --namespace workloads --verdict DROPPED\n\n# [READ-ONLY] Filter flows by HTTP status 500+\nhubble observe --namespace workloads --http-status "5.."\n\`\`\``
  },
  {
    id: 'k8s-rke2',
    title: 'RKE2 Hardened Kubernetes Administration',
    category: 'kubernetes',
    path: 'docs/kubernetes/rke2.md',
    summary: 'CIS 1.23 profile, config.yaml directives, embedded etcd snapshots, certificate rotation, and FIPS compliance.',
    tags: ['rke2', 'security', 'etcd', 'cis', 'hardening'],
    level: 4,
    content: `# RKE2 Hardened Kubernetes Administration\n\nRKE2 (Rancher Government / Rancher Kubernetes Engine 2) is a security-focused, CIS Benchmark-hardened Kubernetes distribution designed for mission-critical enterprise environments.\n\n## ⚙️ Server Configuration (/etc/rancher/rke2/config.yaml)\nIncludes CIS 1.23 profile, embedded etcd encryption, disabled default CNI for Cilium, and TLS SAN configuration.\n\n## 💾 RKE2 etcd Backup & Disaster Recovery\n\`\`\`bash\n# [STATE-MODIFYING] Create named etcd snapshot\nsudo rke2 etcd-snapshot save --name pre-upgrade-snapshot\n\n# [READ-ONLY] List available snapshots\nsudo rke2 etcd-snapshot list\n\`\`\``
  },
  {
    id: 'cicd-gitlab-ci',
    title: 'GitLab CI Pipeline Architectures & Kaniko',
    category: 'cicd',
    path: 'docs/cicd/pipeline-examples.md',
    summary: 'Multi-stage pipelines, daemonless Kaniko image builds, Sonatype Nexus push, Trivy scanning, and atomic Helm deploy.',
    tags: ['gitlab-ci', 'kaniko', 'nexus', 'trivy', 'helm', 'pipelines'],
    level: 5,
    content: `# GitLab CI Pipeline Architectures & Examples\n\nReal-world production pipeline templates demonstrating daemonless Kaniko image builds, Sonatype Nexus repository integration, and Helm Kubernetes deployment.\n\n## 🏗️ Pipeline Stages\n1. validate: Static code linting and unit testing.\n2. scan: Aquasec Trivy vulnerability scanning.\n3. containerize: Kaniko daemonless build pushing to Nexus.\n4. deploy-prod: Atomic Helm upgrade with rollback protection.`
  },
  {
    id: 'apisix-architecture',
    title: 'Apache APISIX API Gateway Architecture & Routes',
    category: 'apisix',
    path: 'docs/apisix/architecture.md',
    summary: 'Dynamic routing without worker reloads, etcd watch mechanism, plugins (key-auth, limit-req, cors), and mTLS.',
    tags: ['apisix', 'api-gateway', 'ingress', 'etcd', 'plugins'],
    level: 4,
    content: `# Apache APISIX API Gateway Architecture\n\nAPISIX completely decouples the Control Plane (Admin API & etcd storage) from the Data Plane (OpenResty worker processes).\n\n## ⚡ Dynamic Zero-Downtime Hot Reloading\nUnlike legacy Nginx ingress controllers that trigger worker process reloads on every Endpoint change, APISIX updates routing tables in Lua memory dynamically via etcd watch events.`
  },
  {
    id: 'linux-cheatsheet',
    title: 'Linux Administration Commands Cheatsheet',
    category: 'linux',
    path: 'docs/linux/commands-cheatsheet.md',
    summary: 'High-frequency Linux sysadmin commands: ss, iostat, ps, top, df, find, systemctl, journalctl, awk, and sed.',
    tags: ['linux', 'cheatsheet', 'sysadmin', 'bash', 'networking'],
    level: 1,
    content: `# Linux Administration Commands Cheatsheet\n\nA high-density reference of essential Linux system administration commands, flags, diagnostics, and operational risk classifications.\n\n## 🔍 System Performance & Process Monitoring\n\`\`\`bash\n# [READ-ONLY] Interactive real-time process monitoring sorted by memory\ntop -o %MEM\n\n# [READ-ONLY] Report disk throughput, IOPS, and await latency every 2 seconds\niostat -xz 2 5\n\`\`\`\n\n## 🌐 Network Sockets & Port Diagnostics\n\`\`\`bash\n# [READ-ONLY] List all listening TCP/UDP ports with service names and PIDs\nss -tulpn\n\`\`\``
  },
  {
    id: 'observability-promql',
    title: 'Prometheus Architecture & PromQL Recipes',
    category: 'observability',
    path: 'docs/observability/prometheus.md',
    summary: 'PromQL queries for HTTP RPS, p99 latency histograms, pod memory saturation, and Alertmanager notification rules.',
    tags: ['prometheus', 'promql', 'metrics', 'monitoring', 'alerting'],
    level: 6,
    content: `# Prometheus Architecture & PromQL Query Recipes\n\nPrometheus is a time-series database and monitoring system utilizing a pull-based HTTP scrape model.\n\n## ⚡ Essential PromQL Query Recipes\n- HTTP Request Rate (RPS): sum by (service) (rate(http_requests_total{status=~"2.."}[5m]))\n- p99 Latency: histogram_quantile(0.99, sum by (le, service) (rate(http_request_duration_seconds_bucket[5m])))\n- Pod CPU Usage vs Limit: sum(rate(container_cpu_usage_seconds_total[5m])) / sum(container_spec_cpu_quota / 100000) * 100`
  },
  {
    id: 'kafka-consumer-groups',
    title: 'Kafka Consumer Groups & Lag Diagnostics',
    category: 'kafka',
    path: 'docs/kafka/consumer-groups-and-offsets.md',
    summary: 'Partition assignment algorithms, rebalance storm prevention, offset reset procedures, and consumer lag triage.',
    tags: ['kafka', 'consumer-groups', 'lag', 'streaming', 'partitions'],
    level: 6,
    content: `# Kafka Consumer Groups, Partitions & Offset Lag\n\nUnderstanding partition assignment strategies, heartbeat timeouts, rebalance storms, and consumer lag.\n\n## 👥 Consumer Lag Diagnostics\n\`\`\`bash\n# [READ-ONLY] Inspect current offset, log end offset, lag, and assigned consumer ID\nkafka-consumer-groups.sh --bootstrap-server kafka.example.com:9092 --describe --group order-processing-group\n\`\`\``
  },
  {
    id: 'databases-oracle-sql',
    title: 'Oracle SQL & Session Lock Diagnostics',
    category: 'databases',
    path: 'docs/databases/oracle-sql-cheatsheet.md',
    summary: 'Queries for v$session, blocking locks, dba_tablespace_usage_metrics, kill session commands, and long SQL triage.',
    tags: ['oracle', 'sql', 'dba', 'locks', 'sessions'],
    level: 6,
    content: `# Oracle SQL Diagnostic Queries Cheatsheet\n\nBattle-tested Oracle SQL queries for database performance triage, session management, lock resolution, and storage capacity auditing.\n\n## 🔒 Identify Active Blocking Sessions\n\`\`\`sql\nSELECT b.sid AS blocker_sid, b.username AS blocker_user, w.sid AS waiting_sid, w.seconds_in_wait\nFROM v$session b JOIN v$session w ON b.sid = w.blocking_session;\n\`\`\``
  },
  {
    id: 'runbook-k8s-incident',
    title: 'Runbook: Kubernetes Node Failure & Mass Pod Outage',
    category: 'runbooks',
    path: 'docs/runbooks/kubernetes-incident.md',
    summary: 'SEV-1 / SEV-2 operational procedure for cordon, drain, containerd triage, and workload recovery.',
    tags: ['runbook', 'kubernetes', 'incident', 'drain', 'sev-1'],
    level: 7,
    content: `# Runbook: Kubernetes Node Failure & Mass Pod Outage\n\n- Severity Level: SEV-1 / SEV-2\n- Target Response Time: < 5 minutes\n- Applicable Environments: RKE2 Kubernetes Clusters\n\n## 🔍 Initial Triage\n1. Identify nodes reporting NotReady: kubectl get nodes -o wide\n2. Inspect node conditions: kubectl describe node <not-ready-node>\n\n## 🛠️ Mitigation & Eviction Procedure\n1. kubectl cordon <not-ready-node>\n2. kubectl drain <not-ready-node> --ignore-daemonsets --delete-emptydir-data --force --timeout=3m\n3. Verify replacement pods scheduled on healthy nodes.`
  },
  {
    id: 'security-keycloak',
    title: 'Keycloak Identity & Active Directory Federation',
    category: 'security',
    path: 'docs/security/keycloak.md',
    summary: 'Configuring enterprise OIDC realms, client credentials grant, token lifespans, and AD/LDAP federation via LDAPS.',
    tags: ['keycloak', 'oidc', 'oauth2', 'active-directory', 'sso'],
    level: 7,
    content: `# Keycloak Identity & Access Management\n\nCentralized Single Sign-On (SSO), Active Directory / LDAP federation, client management, and role-based access control.\n\n## ⏱️ Token Lifespan Best Practices\n- Access Token Lifespan: 5 minutes (short-lived).\n- Refresh Token Lifespan: 8 hours.\n- SSO Session Idle: 30 minutes.`
  },
  {
    id: 'storage-ceph-rgw',
    title: 'Ceph RADOS Gateway (RGW) & S3 Object Storage',
    category: 'storage',
    path: 'docs/storage/s3-and-rgw.md',
    summary: 'S3-compatible object storage, radosgw-admin user creation, quotas, bucket policies, and AWS CLI commands.',
    tags: ['ceph', 'rgw', 's3', 'storage', 'object-storage'],
    level: 6,
    content: `# Ceph RADOS Gateway (RGW) & S3 Object Storage\n\nCeph Rados Gateway (RGW) provides an HTTP/REST interface fully compatible with Amazon S3 APIs.\n\n## 🔑 Provisioning S3 Users & Access Keys\n\`\`\`bash\n# [STATE-MODIFYING] Create new S3 service account user with quotas\nradosgw-admin user create --uid="backup-service" --display-name="Automated Database Backup Service" --max-buckets=50\n\`\`\``
  }
];

export const CHEATSHEET_COMMANDS: CommandItem[] = [
  {
    id: 'k8s-top-nodes',
    name: 'Check Node CPU & RAM Consumption',
    category: 'kubernetes',
    command: 'kubectl top nodes',
    risk: 'READ-ONLY',
    explanation: 'Queries metrics-server for live CPU cores and memory allocation per cluster node.',
    whenToUse: 'During cluster slowdowns or before scheduling heavy batch jobs.',
    flags: ['--sort-by=cpu', '--sort-by=memory'],
    tags: ['kubectl', 'nodes', 'metrics', 'performance']
  },
  {
    id: 'k8s-unhealthy-pods',
    name: 'Find All Unhealthy Pods in Cluster',
    category: 'kubernetes',
    command: 'kubectl get pods -A --field-selector status.phase!=Running,status.phase!=Succeeded',
    risk: 'READ-ONLY',
    explanation: 'Scans all namespaces and filters out normal Running and Completed pods.',
    whenToUse: 'Initial triage during Sev-1 or Sev-2 incidents to spot failing workloads.',
    flags: ['-A (all namespaces)', '--field-selector'],
    tags: ['kubectl', 'pods', 'triage', 'incident']
  },
  {
    id: 'k8s-drain-node',
    name: 'Safely Drain Worker Node for Maintenance',
    category: 'kubernetes',
    command: 'kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data --force --timeout=5m',
    risk: 'DESTRUCTIVE',
    explanation: 'Evicts all workloads from a node honoring PodDisruptionBudgets so host can be patched or rebooted.',
    whenToUse: 'Prior to kernel updates, OS reboots, or hardware maintenance.',
    flags: ['--ignore-daemonsets', '--delete-emptydir-data', '--timeout=5m'],
    tags: ['kubectl', 'drain', 'node', 'maintenance', 'eviction']
  },
  {
    id: 'k8s-rollout-restart',
    name: 'Graceful Rolling Restart of Deployment',
    category: 'kubernetes',
    command: 'kubectl rollout restart deployment/<deployment-name> -n <namespace>',
    risk: 'STATE-MODIFYING',
    explanation: 'Instructs the Deployment controller to rotate all pods sequentially with zero downtime.',
    whenToUse: 'When ConfigMap or Secret changes need to be reloaded into running pods.',
    flags: ['-n <namespace>'],
    tags: ['kubectl', 'rollout', 'deployment', 'restart']
  },
  {
    id: 'cilium-status',
    name: 'Check Cilium eBPF Agent Health',
    category: 'kubernetes',
    command: 'cilium status --wait',
    risk: 'READ-ONLY',
    explanation: 'Inspects Cilium DaemonSet pods, BPF map allocations, IPAM controller, and Hubble relay.',
    whenToUse: 'Diagnosing cluster networking, DNS timeouts, or node CNI failures.',
    flags: ['--wait (blocks until fully ready)'],
    tags: ['cilium', 'ebpf', 'cni', 'networking']
  },
  {
    id: 'hubble-dropped',
    name: 'Stream Dropped Network Packets with Hubble',
    category: 'kubernetes',
    command: 'hubble observe --namespace <namespace> --verdict DROPPED',
    risk: 'READ-ONLY',
    explanation: 'Uses kernel eBPF tracepoints to print dropped network packets and policy rejections in real time.',
    whenToUse: 'Diagnosing connection refused or network policy isolation blocks.',
    flags: ['--namespace', '--verdict DROPPED'],
    tags: ['hubble', 'cilium', 'security', 'network-policy']
  },
  {
    id: 'linux-sockets',
    name: 'List Listening TCP & UDP Sockets with Process',
    category: 'linux',
    command: 'ss -tulpn',
    risk: 'READ-ONLY',
    explanation: 'Modern replacement for netstat showing listening sockets, port numbers, and owning process PIDs.',
    whenToUse: 'Verifying if a daemon (e.g., APISIX, containerd, node-exporter) is listening.',
    flags: ['-t (TCP)', '-u (UDP)', '-l (listening)', '-p (process)', '-n (numeric)'],
    tags: ['linux', 'networking', 'ports', 'sockets']
  },
  {
    id: 'linux-inodes',
    name: 'Check Filesystem Inode Capacity',
    category: 'linux',
    command: 'df -i',
    risk: 'READ-ONLY',
    explanation: 'Reports total, used, and free inode counts for mounted filesystems.',
    whenToUse: 'Resolving "No space left on device" errors when df -h shows free space.',
    flags: ['-i (inodes)'],
    tags: ['linux', 'storage', 'disk', 'inodes']
  },
  {
    id: 'docker-hardened-run',
    name: 'Run Hardened Non-Root Container',
    category: 'docker',
    command: 'docker run -d --name <name> --user 10001:10001 --read-only --tmpfs /tmp:rw,noexec,nosuid --cap-drop=ALL --memory=512m <image>',
    risk: 'STATE-MODIFYING',
    explanation: 'Launches container with restricted non-root UID, read-only rootfs, dropped capabilities, and RAM limit.',
    whenToUse: 'Running secure microservices in Docker environments.',
    flags: ['--read-only', '--cap-drop=ALL', '--memory=512m'],
    tags: ['docker', 'security', 'container', 'hardening']
  },
  {
    id: 'helm-atomic-upgrade',
    name: 'Deploy Helm Release with Atomic Rollback Protection',
    category: 'cicd',
    command: 'helm upgrade --install <release> ./chart -n <namespace> --create-namespace --values values.yaml --wait --atomic --timeout 5m',
    risk: 'STATE-MODIFYING',
    explanation: 'Applies chart release and automatically rolls back to previous revision if health probes fail.',
    whenToUse: 'All production CI/CD deployment jobs.',
    flags: ['--atomic', '--wait', '--timeout 5m'],
    tags: ['helm', 'cicd', 'deploy', 'atomic']
  },
  {
    id: 'kafka-consumer-lag',
    name: 'Inspect Kafka Consumer Group Lag',
    category: 'kafka',
    command: 'kafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe --group <group-name>',
    risk: 'READ-ONLY',
    explanation: 'Shows current offset vs log-end-offset per partition to identify stalled consumer threads.',
    whenToUse: 'When messaging consumers fall behind producers or message latency increases.',
    flags: ['--describe', '--group'],
    tags: ['kafka', 'consumer-group', 'lag', 'offsets']
  },
  {
    id: 'oracle-blocking-locks',
    name: 'Identify Oracle Database Blocking Sessions',
    category: 'databases',
    command: `SELECT b.sid AS blocker_sid, b.username, w.sid AS waiting_sid, w.seconds_in_wait FROM v$session b JOIN v$session w ON b.sid = w.blocking_session;`,
    risk: 'READ-ONLY',
    explanation: 'Cross-joins v$session to locate database sessions holding locks that cause other transactions to stall.',
    whenToUse: 'When application threads timeout waiting on database write transactions.',
    flags: ['SQL Query'],
    tags: ['oracle', 'sql', 'locks', 'sessions']
  },
  {
    id: 'openssl-remote-cert',
    name: 'Inspect Remote TLS Certificate Expiry Without Browser',
    category: 'security',
    command: 'openssl s_client -connect <domain>:443 -servername <domain> </dev/null 2>/dev/null | openssl x509 -noout -dates -subject',
    risk: 'READ-ONLY',
    explanation: 'Executes TLS handshake directly from terminal and extracts valid notBefore and notAfter dates.',
    whenToUse: 'Auditing SSL/TLS expiration dates or verifying new certificate rollouts.',
    flags: ['s_client', 'x509 -noout -dates'],
    tags: ['openssl', 'tls', 'certificates', 'security']
  }
];

export const ROADMAP_LEVELS = [
  {
    level: 1,
    title: 'Linux Systems, Networking & Git Hygiene',
    color: 'emerald',
    badge: 'Foundations',
    topics: [
      { id: 'l1-1', title: 'Linux process tracking with top, ps auxf, and mpstat' },
      { id: 'l1-2', title: 'Socket inspection via ss -tulpn & network routing tables' },
      { id: 'l1-3', title: 'Systemd custom units, timer units, and journalctl' },
      { id: 'l1-4', title: 'Git interactive rebasing, reflog recovery, and hygiene' },
      { id: 'l1-5', title: 'Idempotent Bash scripting with set -euo pipefail' }
    ]
  },
  {
    level: 2,
    title: 'Docker & Container Runtime Fundamentals',
    color: 'blue',
    badge: 'Containers',
    topics: [
      { id: 'l2-1', title: 'Multi-stage Dockerfiles with minimal distroless bases' },
      { id: 'l2-2', title: 'Non-root execution (UID 10001) & read-only rootfilesystems' },
      { id: 'l2-3', title: 'Docker Compose networking, volumes, and healthchecks' },
      { id: 'l2-4', title: 'Container vulnerability scanning with Trivy' }
    ]
  },
  {
    level: 3,
    title: 'Kubernetes Workloads & Helm Packaging',
    color: 'indigo',
    badge: 'Orchestration',
    topics: [
      { id: 'l3-1', title: 'Control plane internals: API Server, etcd, Scheduler, Controller' },
      { id: 'l3-2', title: 'Deployments, StatefulSets, DaemonSets, and Jobs' },
      { id: 'l3-3', title: 'Startup, Liveness, and Readiness probes tuning' },
      { id: 'l3-4', title: 'ConfigMaps, Secrets volume projection, and PDBs' },
      { id: 'l3-5', title: 'Helm 3 chart templating and atomic upgrades' }
    ]
  },
  {
    level: 4,
    title: 'RKE2 Hardened Clusters & Cilium eBPF',
    color: 'purple',
    badge: 'Hardened K8s',
    topics: [
      { id: 'l4-1', title: 'RKE2 server config.yaml & CIS 1.23 benchmark profile' },
      { id: 'l4-2', title: 'RKE2 etcd on-demand snapshots and restore procedures' },
      { id: 'l4-3', title: 'Cilium eBPF kube-proxy replacement & socket routing' },
      { id: 'l4-4', title: 'CiliumNetworkPolicy L3/L4/L7 rules & Hubble observability' }
    ]
  },
  {
    level: 5,
    title: 'GitLab CI/CD, Nexus & Release Governance',
    color: 'amber',
    badge: 'CI/CD & Delivery',
    topics: [
      { id: 'l5-1', title: 'Multi-stage GitLab CI pipelines with caching & artifacts' },
      { id: 'l5-2', title: 'Daemonless Kaniko image builds on Kubernetes runners' },
      { id: 'l5-3', title: 'Sonatype Nexus hosted Docker registries & proxy caches' },
      { id: 'l5-4', title: 'Blue/Green and Canary releases with automated rollback' }
    ]
  },
  {
    level: 6,
    title: 'Observability, Kafka, Ceph & Databases',
    color: 'orange',
    badge: 'Data & Reliability',
    topics: [
      { id: 'l6-1', title: 'Prometheus PromQL rate, histogram_quantile, and alerts' },
      { id: 'l6-2', title: 'Grafana GitOps dashboard provisioning' },
      { id: 'l6-3', title: 'Kafka consumer group lag triage and offset recovery' },
      { id: 'l6-4', title: 'Oracle SQL blocking sessions and PostgreSQL maintenance' },
      { id: 'l6-5', title: 'Ceph RGW S3 object storage & Longhorn block volumes' }
    ]
  },
  {
    level: 7,
    title: 'DevSecOps, IAM & SRE Incident Mastery',
    color: 'rose',
    badge: 'SRE & DevSecOps',
    topics: [
      { id: 'l7-1', title: 'Keycloak OIDC M2M client credentials & AD federation' },
      { id: 'l7-2', title: 'OpenSSL TLS certificate inspection and Cert-Manager' },
      { id: 'l7-3', title: 'SLI, SLO, and Multi-Burn-Rate alerting design' },
      { id: 'l7-4', title: 'SEV-1 incident commander triage & blameless post-mortems' }
    ]
  }
];
