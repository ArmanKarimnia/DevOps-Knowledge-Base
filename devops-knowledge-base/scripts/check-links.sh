#!/usr/bin/env bash
set -euo pipefail

# Check internal Markdown links across the repository
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "=========================================="
echo "Checking Internal Markdown Links..."
echo "Repository Root: ${REPO_ROOT}"
echo "=========================================="

FAILED=0
CHECKED=0

# Use node to parse and validate relative markdown links accurately
node -e '
const fs = require("fs");
const path = require("path");

function getFiles(dir, ext = ".md") {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".venv" && entry.name !== "site" && entry.name !== ".git") {
        results = results.concat(getFiles(fullPath, ext));
      }
    } else if (entry.name.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

const rootDir = process.argv[1];
const docsFiles = getFiles(path.join(rootDir, "docs"));
const rootFiles = [path.join(rootDir, "README.md"), path.join(rootDir, "CONTRIBUTING.md")].filter(f => fs.existsSync(f));
const allFiles = [...docsFiles, ...rootFiles];

let checkedLinks = 0;
let brokenLinks = 0;

const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, "utf-8");
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const linkTarget = match[2].trim();
    // Skip external links, anchors, mailto
    if (linkTarget.startsWith("http://") || linkTarget.startsWith("https://") || linkTarget.startsWith("#") || linkTarget.startsWith("mailto:")) {
      continue;
    }
    
    // Strip query or anchor from target
    const cleanTarget = linkTarget.split("#")[0].split("?")[0];
    if (!cleanTarget) continue;

    checkedLinks++;
    const resolvedPath = path.resolve(path.dirname(filePath), cleanTarget);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`[BROKEN LINK] in ${path.relative(rootDir, filePath)}: "${linkTarget}" -> Target does not exist (${path.relative(rootDir, resolvedPath)})`);
      brokenLinks++;
    }
  }
}

console.log(`\nResults: Checked ${checkedLinks} relative links across ${allFiles.length} files.`);
if (brokenLinks > 0) {
  console.error(`FAILURE: Found ${brokenLinks} broken links.`);
  process.exit(1);
} else {
  console.log(`SUCCESS: All internal relative links are valid!`);
  process.exit(0);
}
' "${REPO_ROOT}"
