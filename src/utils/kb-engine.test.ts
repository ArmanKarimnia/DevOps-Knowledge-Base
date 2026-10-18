import test from 'node:test';
import assert from 'node:assert/strict';
import {
  scoreDocument,
  searchDocuments,
  generateKubectlDrainCommand,
  generateHelmDeployCommand,
  calculateRoadmapProgress
} from './kb-engine.ts';
import type { DocItem } from './kb-engine.ts';

const mockDocs: DocItem[] = [
  {
    id: 'k8s-kubectl',
    title: 'Kubectl Commands Cheatsheet',
    category: 'Kubernetes',
    path: 'docs/kubernetes/kubectl-cheatsheet.md',
    summary: 'High-density kubectl command reference for pods, nodes, and rollouts.',
    tags: ['kubectl', 'kubernetes', 'pods', 'debugging'],
    level: 3
  },
  {
    id: 'cilium-ebpf',
    title: 'Cilium eBPF Networking & Hubble',
    category: 'Kubernetes',
    path: 'docs/kubernetes/cilium.md',
    summary: 'Kernel-level routing, kube-proxy replacement, and Hubble observability.',
    tags: ['cilium', 'ebpf', 'networking', 'hubble'],
    level: 4
  },
  {
    id: 'linux-networking',
    title: 'Linux Networking & DNS',
    category: 'Linux',
    path: 'docs/linux/networking.md',
    summary: 'Socket inspection, iproute2, and DNS resolution.',
    tags: ['linux', 'networking', 'dns', 'ss'],
    level: 1
  }
];

test('scoreDocument scores title matches highest', () => {
  const match = scoreDocument(mockDocs[0], 'kubectl');
  assert.ok(match !== null);
  assert.ok(match.score >= 50);
  assert.ok(match.matchedFields.includes('title'));
});

test('scoreDocument returns null when token does not match any field', () => {
  const match = scoreDocument(mockDocs[0], 'nonexistenttermxyz');
  assert.equal(match, null);
});

test('searchDocuments filters by category and ranks matches', () => {
  const results = searchDocuments(mockDocs, 'networking', 'Kubernetes');
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'cilium-ebpf');
});

test('generateKubectlDrainCommand formats flags properly', () => {
  const cmd = generateKubectlDrainCommand({
    nodeName: 'worker-01',
    ignoreDaemonsets: true,
    deleteEmptydir: true,
    timeoutMinutes: 5,
    force: true
  });
  assert.equal(cmd, 'kubectl drain worker-01 --ignore-daemonsets --delete-emptydir-data --timeout=5m --force');
});

test('generateHelmDeployCommand outputs atomic upgrade command', () => {
  const cmd = generateHelmDeployCommand({
    releaseName: 'order-service',
    chartPath: './helm',
    namespace: 'production',
    valuesFile: './helm/values-prod.yaml',
    imageTag: 'sha-12345',
    atomic: true,
    timeoutMinutes: 8
  });
  assert.equal(
    cmd,
    'helm upgrade --install order-service ./helm --namespace production --create-namespace --values ./helm/values-prod.yaml --set image.tag="sha-12345" --atomic --timeout 8m'
  );
});

test('calculateRoadmapProgress calculates correct percentages', () => {
  const completed = new Set(['k8s', 'docker', 'linux']);
  const progress = calculateRoadmapProgress(completed, 6);
  assert.equal(progress.completed, 3);
  assert.equal(progress.remaining, 3);
  assert.equal(progress.percentage, 50);
});
