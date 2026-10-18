# Production Bash Scripting & Automation Standards

Writing resilient, defensive, and maintainable shell scripts for DevOps infrastructure automation.

---

## 🛡️ The Golden Preamble: `set -euo pipefail`

Every shell script must begin with strict error handling:

```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
```

- `-e`: Exit immediately if any command exits with a non-zero status.
- `-u`: Treat unset variables as an error and exit immediately.
- `-o pipefail`: Return the exit status of the last command in the pipeline that failed (prevents hidden failures in `command | grep`).
- `IFS=$'\n\t'`: Sets the Internal Field Separator to newline and tab only, preventing catastrophic whitespace splitting on filenames.

---

## 🧹 Safe Cleanups with `trap`

Always clean up temporary files and background sub-processes on exit or interruption:

```bash
TMP_DIR=$(mktemp -d -t devops-ops-XXXXXX)

cleanup() {
    local exit_code=$?
    rm -rf "${TMP_DIR}"
    echo "Cleanup completed with code: ${exit_code}"
    exit "${exit_code}"
}

trap cleanup EXIT INT TERM
```

---

## 📝 Portable Script Header & Logging Template

```bash
#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_NAME="$(basename "$0")"

log_info()  { echo "[INFO]  $(date -u +'%Y-%m-%dT%H:%M:%SZ') - $*"; }
log_warn()  { echo "[WARN]  $(date -u +'%Y-%m-%dT%H:%M:%SZ') - $*" >&2; }
log_error() { echo "[ERROR] $(date -u +'%Y-%m-%dT%H:%M:%SZ') - $*" >&2; }

# Check required commands
for cmd in kubectl helm jq curl; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        log_error "Required tool '$cmd' is not installed."
        exit 1
    fi
done

log_info "All dependencies verified. Executing automation..."
```
