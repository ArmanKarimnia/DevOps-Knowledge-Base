# Linux Administration Commands Cheatsheet

A high-density reference of essential Linux system administration commands, flags, diagnostics, and operational risk classifications.

---

## 🔍 System Performance & Process Monitoring

### 1. Identify Top CPU & Memory Consumers
- **Command**:
  ```bash
  # [READ-ONLY] Interactive real-time process monitoring sorted by memory
  top -o %MEM
  ```
- **When to use**: High server load or memory exhaustion investigations.
- **Key options**:
  - `-o %MEM`: Sorts processes by RAM consumption.
  - `-o %CPU`: Sorts processes by processor utilization.
  - Press `1` inside `top` to toggle individual CPU core breakdowns.

### 2. Detailed Process Hierarchy & Arguments
- **Command**:
  ```bash
  # [READ-ONLY] List all processes with full command lines and process tree
  ps auxf
  ```
- **When to use**: Tracking down parent/child worker relationships (e.g., Nginx, Gunicorn, containerd-shim).
- **Key options**:
  - `a`: All users.
  - `u`: User-oriented format displaying CPU/MEM percentages.
  - `x`: Includes processes not attached to a terminal.
  - `f`: ASCII-art process tree hierarchy.

### 3. Track Disk I/O Bottlenecks (`iostat`)
- **Command**:
  ```bash
  # [READ-ONLY] Report disk throughput, IOPS, and await latency every 2 seconds
  iostat -xz 2 5
  ```
- **When to use**: High `%iowait` shown in `top` or unexplainable database slowness.
- **Key options**:
  - `-x`: Extended statistics (critical metric: `%util` and `await`).
  - `-z`: Suppress output for devices with zero activity during the interval.
- **Expected Output**:
  ```text
  Device    r/s     w/s     rkB/s     wkB/s   await  %util
  nvme0n1  12.00  340.50    48.00  18240.00    0.85  18.40
  ```
- **Risk Note**: Read-only, safe in production.

---

## 💾 Disk Space & Inode Analysis

### 1. Filesystem Capacity & Inodes
- **Command**:
  ```bash
  # [READ-ONLY] Check disk space in human-readable format
  df -hT

  # [READ-ONLY] Check filesystem inode consumption
  df -i
  ```
- **When to use**: "No space left on device" errors. If `df -h` shows space available, run `df -i` to check for inode exhaustion.
- **Key options**:
  - `-h`: Human-readable (MB, GB, TB).
  - `-T`: Displays filesystem type (`ext4`, `xfs`, `overlay`).
  - `-i`: Lists total, used, and free inode counts.

### 2. Locate Top Space-Consuming Directories
- **Command**:
  ```bash
  # [READ-ONLY] Find largest directories under /var without crossing filesystems
  du -h --max-depth=1 /var 2>/dev/null | sort -hr | head -n 15
  ```
- **When to use**: Identifying runaway log or cache files.
- **Key options**:
  - `-h`: Human-readable size tags.
  - `--max-depth=1`: Limits directory traversal to immediate children.
  - `2>/dev/null`: Suppresses permission denied warnings on protected subdirectories.

### 3. Find Large Files Over 1GB
- **Command**:
  ```bash
  # [READ-ONLY] Search entire filesystem for files larger than 1GB
  find / -type f -size +1G -exec ls -lh {} + 2>/dev/null
  ```
- **When to use**: Disk threshold alerts triggered by un-rotated log files or database core dumps.

---

## 🌐 Network Sockets & Port Diagnostics

### 1. View Listening TCP & UDP Sockets
- **Command**:
  ```bash
  # [READ-ONLY] List all listening TCP/UDP ports with service names and PIDs
  ss -tulpn
  ```
- **When to use**: Verifying if an application (e.g., APISIX on port 9080 or Node Exporter on 9100) is actively listening.
- **Key options**:
  - `-t`: TCP sockets.
  - `-u`: UDP sockets.
  - `-l`: Only listening sockets.
  - `-p`: Show process name and PID (requires `sudo` for processes owned by other users).
  - `-n`: Do not resolve service names; display numeric port numbers.

### 2. Check Established Connections Count by State
- **Command**:
  ```bash
  # [READ-ONLY] Summarize TCP connection states
  ss -s
  ```
- **When to use**: Investigating socket starvation, `TIME_WAIT` pileups, or SYN flood attacks.

---

## 📄 File Manipulation & Log Analysis (grep, awk, sed)

### 1. Extract and Count HTTP Status Codes with `awk`
- **Command**:
  ```bash
  # [READ-ONLY] Aggregate and count HTTP response codes from access logs
  awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn
  ```
- **When to use**: Quickly quantifying HTTP 500, 502, and 404 error frequency during production incidents.

### 2. Search Compressed Archived Logs
- **Command**:
  ```bash
  # [READ-ONLY] Search for error patterns inside gzipped rotated logs
  zgrep -i "database connection timed out" /var/log/syslog*.gz
  ```
- **When to use**: Auditing historical incidents without uncompressing gigabytes of logs to disk.

---

## ⚠️ High-Risk Maintenance Commands

### 1. Safely Clear Memory PageCache
- **Command**:
  ```bash
  # [STATE-MODIFYING] Sync dirty pages to disk and drop PageCache
  sync && echo 1 > /proc/sys/vm/drop_caches
  ```
- **When to use**: Benchmarking or reclaiming non-essential cache.
- **Risk Note**: Causes temporary disk I/O latency spike as active applications reload cached binaries from disk. Never run in heavy production without justification.

### 2. Terminate Unresponsive Process (`SIGKILL`)
- **Command**:
  ```bash
  # [DESTRUCTIVE] Graceful shutdown first (SIGTERM)
  kill -15 <PID>

  # [HIGH-RISK] Forceful termination only if unresponsive after 30 seconds
  kill -9 <PID>
  ```
- **Risk Note**: `kill -9` prevents applications from flushing database buffers or removing lockfiles, which can cause state corruption.
