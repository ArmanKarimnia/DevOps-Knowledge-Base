# DevOps & Platform Engineering Glossary

A standardized dictionary of core acronyms, terms, and technical definitions used across this handbook.

| Term | Expansion | Definition |
| :--- | :--- | :--- |
| **APISIX** | Apache APISIX | A dynamic, real-time, high-performance Cloud-Native API gateway based on OpenResty and LuaJIT. |
| **BPF / eBPF** | Extended Berkeley Packet Filter | Linux kernel technology that allows custom sandboxed programs to execute inside the kernel space without changing kernel source code or loading modules. |
| **CANARY** | Canary Deployment | A release strategy where changes are rolled out to a small subset of users or pods to verify behavior before wider rollout. |
| **CILIUM** | Cilium CNI | An open-source, eBPF-based networking, security, and observability project for cloud-native workloads. |
| **CIS** | Center for Internet Security | Non-profit organization that publishes prescriptive cybersecurity benchmarks for operating systems, Kubernetes, and clouds. |
| **CNI** | Container Network Interface | Standardized specification and set of libraries for configuring network interfaces in Linux containers. |
| **CRI** | Container Runtime Interface | Plugin interface that enables kubelet to use a wide variety of container runtimes (such as containerd or CRI-O) without recompiling. |
| **CSI** | Container Storage Interface | Standard specification for exposing arbitrary block and file storage systems to containerized workloads on Kubernetes. |
| **ELK** | Elasticsearch, Logstash, Kibana | A popular open-source log aggregation and analytical search engine stack. |
| **ETCD** | Consistent Distributed Key-Value Store | Strongly consistent, distributed key-value store used as Kubernetes' persistent data plane. |
| **HPA** | Horizontal Pod Autoscaler | Kubernetes controller that automatically scales the number of Pod replicas based on observed CPU/memory utilization or custom metrics. |
| **IAM** | Identity & Access Management | Framework of policies and technologies for ensuring the right individuals access the appropriate technology resources. |
| **IDEMPOTENCE** | Mathematical / Operational Property | An operation can be applied multiple times without changing the result beyond the initial application (e.g., Ansible tasks). |
| **KAFKA** | Apache Kafka | Distributed event streaming platform capable of handling trillions of events a day. |
| **KANIKO** | Kaniko Build Tool | A Google-authored tool to build container images from a Dockerfile inside a container or Kubernetes cluster without root privileges or Docker daemon. |
| **KEYCLOAK** | Open Source Identity Provider | Open-source IAM tool for single sign-on (SSO), user federation, and OpenID Connect / OAuth 2.0. |
| **MTLS** | Mutual Transport Layer Security | A process where both client and server authenticate each other using X.509 digital certificates before encrypted communications begin. |
| **NEXUS** | Sonatype Nexus Repository | Enterprise artifact and repository manager supporting Maven, npm, PyPI, and Docker registry formats. |
| **OIDC** | OpenID Connect | An identity layer built on top of the OAuth 2.0 protocol that allows clients to verify the identity of an end-user. |
| **PDB** | Pod Disruption Budget | Kubernetes API object that limits the number of Pods of a replicated application that can be simultaneously down from voluntary disruptions. |
| **PVC / PV** | Persistent Volume (Claim) | Kubernetes storage abstraction decoupling user storage requests (`PVC`) from underlying physical storage provisioning (`PV`). |
| **RBAC** | Role-Based Access Control | Access control mechanism restricting system access to authorized users based on their assigned roles. |
| **RKE2** | Rancher Kubernetes Engine 2 | A hardened, security-focused, CIS-compliant Kubernetes distribution focused on government and regulated enterprise environments. |
| **S3** | Simple Storage Service | Standardized RESTful API protocol for object storage, supported by Ceph RGW, MinIO, and AWS. |
| **SLA** | Service Level Agreement | Legally or organizationally binding contract committing a service provider to specific performance levels (often tied to penalties). |
| **SLI** | Service Level Indicator | A carefully defined quantitative measure of some aspect of the level of service that is provided (e.g., latency, error rate). |
| **SLO** | Service Level Objective | A target value or range of values for a service level that is measured by an SLI (e.g., 99.95% successful requests over 30 days). |
| **SSSD** | System Security Services Daemon | Linux system service that manages access to remote directory services such as Active Directory or LDAP. |
| **VETH** | Virtual Ethernet Pair | Linux virtual network device pair acting as a bidirectional tunnel between network namespaces (e.g., container to host bridge). |
