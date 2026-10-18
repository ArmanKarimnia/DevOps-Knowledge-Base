#!/usr/bin/env bash
set -euo pipefail

# Documentation quality assurance and secret scanning validation
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "=========================================="
echo "DevOps Knowledge Base Quality Validator"
echo "Repository Root: ${REPO_ROOT}"
echo "=========================================="

node -e '
const fs = require("fs");
const path = require("path");

const rootDir = process.argv[1];

function getFiles(dir, ext = ".md") {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", ".venv", "site", ".git"].includes(entry.name)) {
        results = results.concat(getFiles(fullPath, ext));
      }
    } else if (entry.name.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

const docsDir = path.join(rootDir, "docs");
const mdFiles = getFiles(docsDir);

console.log(`Checking ${mdFiles.length} Markdown files in docs/...`);

let issues = 0;

// 1. Check for empty files or missing headings
for (const file of mdFiles) {
  const content = fs.readFileSync(file, "utf-8").trim();
  const relPath = path.relative(rootDir, file);
  if (content.length < 50) {
    console.error(`[EMPTY/STUB FILE] ${relPath} has only ${content.length} characters.`);
    issues++;
  }
  if (!content.startsWith("#") && !content.startsWith("---")) {
    console.warn(`[MISSING HEADING/FRONTMATTER] ${relPath} does not start with # or frontmatter.`);
  }
}

// 2. Secret and sensitive data heuristic audit
const forbiddenPatterns = [
  /-----BEGIN RSA PRIVATE KEY-----/,
  /-----BEGIN OPENSSH PRIVATE KEY-----/,
  /password\s*[:=]\s*["\x27](?!<|YOUR_|test|changeme|admin123|example)[a-zA-Z0-9_\-!@#$%^&*]{8,}["\x27]/i,
  /ghp_[a-zA-Z0-9]{36}/,
  /glpat-[a-zA-Z0-9_\-]{20}/,
  /\beyJ[A-Za-z0-9-_=]{10,}\.eyJ[A-Za-z0-9-_=]{10,}\.[A-Za-z0-9-_.+/=]{10,}\b/ // Real base64 JWT tokens
];

for (const file of mdFiles) {
  const content = fs.readFileSync(file, "utf-8");
  const relPath = path.relative(rootDir, file);
  for (const pat of forbiddenPatterns) {
    if (pat.test(content)) {
      console.error(`[POTENTIAL SECRET LEAK] Pattern matched in ${relPath}: ${pat}`);
      issues++;
    }
  }
}

// 3. Check mkdocs.yml nav references
const mkdocsPath = path.join(rootDir, "mkdocs.yml");
if (fs.existsSync(mkdocsPath)) {
  const mkdocsContent = fs.readFileSync(mkdocsPath, "utf-8");
  const navMatches = mkdocsContent.match(/:\s*([a-zA-Z0-9_\-\/]+\.md)/g) || [];
  let navChecked = 0;
  for (const m of navMatches) {
    const docRel = m.replace(/^:\s*/, "").trim();
    navChecked++;
    const fullDocPath = path.join(docsDir, docRel);
    if (!fs.existsSync(fullDocPath)) {
      console.error(`[MKDOCS NAV ERROR] Referenced file does not exist: docs/${docRel}`);
      issues++;
    }
  }
  console.log(`Validated ${navChecked} mkdocs.yml navigation links.`);
}

if (issues > 0) {
  console.error(`\nFAILED: Found ${issues} issues during documentation validation.`);
  process.exit(1);
} else {
  console.log(`\nSUCCESS: All files verified! No empty files, no leaked tokens, all nav links valid.`);
  process.exit(0);
}
' "${REPO_ROOT}"
