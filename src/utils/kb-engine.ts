/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DocItem {
  id: string;
  title: string;
  category: string;
  path: string;
  summary: string;
  tags: string[];
  level?: number;
  content?: string;
}

export type RiskLevel = 'READ-ONLY' | 'STATE-MODIFYING' | 'DESTRUCTIVE';

export interface CommandItem {
  id: string;
  name: string;
  category: string;
  command: string;
  risk: RiskLevel;
  explanation: string;
  whenToUse: string;
  flags?: string[];
  tags: string[];
}

export interface SearchResult {
  doc: DocItem;
  score: number;
  matchedFields: string[];
}

/**
 * Calculate search relevance score based on query tokens
 */
export function scoreDocument(doc: DocItem, query: string): SearchResult | null {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return { doc, score: 1, matchedFields: [] };
  }

  const tokens = cleanQuery.split(/\s+/).filter(Boolean);
  let totalScore = 0;
  const matchedFields: string[] = [];

  const titleLower = doc.title.toLowerCase();
  const summaryLower = doc.summary.toLowerCase();
  const categoryLower = doc.category.toLowerCase();
  const tagsLower = doc.tags.map(t => t.toLowerCase());
  const contentLower = (doc.content || '').toLowerCase();

  for (const token of tokens) {
    let tokenMatched = false;

    if (titleLower.includes(token)) {
      totalScore += titleLower.startsWith(token) ? 50 : 30;
      if (!matchedFields.includes('title')) matchedFields.push('title');
      tokenMatched = true;
    }

    if (tagsLower.some(t => t.includes(token))) {
      totalScore += 25;
      if (!matchedFields.includes('tags')) matchedFields.push('tags');
      tokenMatched = true;
    }

    if (categoryLower.includes(token)) {
      totalScore += 20;
      if (!matchedFields.includes('category')) matchedFields.push('category');
      tokenMatched = true;
    }

    if (summaryLower.includes(token)) {
      totalScore += 15;
      if (!matchedFields.includes('summary')) matchedFields.push('summary');
      tokenMatched = true;
    }

    if (contentLower.includes(token)) {
      totalScore += 5;
      if (!matchedFields.includes('content')) matchedFields.push('content');
      tokenMatched = true;
    }

    if (!tokenMatched) {
      return null; // All tokens must match somewhere
    }
  }

  return { doc, score: totalScore, matchedFields };
}

/**
 * Filter and sort documents by relevance
 */
export function searchDocuments(docs: DocItem[], query: string, categoryFilter?: string): DocItem[] {
  let list = docs;
  if (categoryFilter && categoryFilter !== 'all') {
    list = list.filter(d => d.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  if (!query.trim()) {
    return list;
  }

  const scored = list
    .map(doc => scoreDocument(doc, query))
    .filter((res): res is SearchResult => res !== null)
    .sort((a, b) => b.score - a.score);

  return scored.map(s => s.doc);
}

/**
 * Command Generator Helpers
 */
export interface KubectlDrainParams {
  nodeName: string;
  ignoreDaemonsets?: boolean;
  deleteEmptydir?: boolean;
  timeoutMinutes?: number;
  force?: boolean;
}

export function generateKubectlDrainCommand(params: KubectlDrainParams): string {
  const parts = ['kubectl', 'drain', params.nodeName || '<node-name>'];
  if (params.ignoreDaemonsets ?? true) parts.push('--ignore-daemonsets');
  if (params.deleteEmptydir ?? true) parts.push('--delete-emptydir-data');
  if (params.timeoutMinutes && params.timeoutMinutes > 0) {
    parts.push(`--timeout=${params.timeoutMinutes}m`);
  }
  if (params.force) parts.push('--force');
  return parts.join(' ');
}

export interface HelmDeployParams {
  releaseName: string;
  chartPath: string;
  namespace: string;
  valuesFile?: string;
  imageTag?: string;
  atomic?: boolean;
  timeoutMinutes?: number;
}

export function generateHelmDeployCommand(params: HelmDeployParams): string {
  const parts = [
    'helm upgrade --install',
    params.releaseName || '<release-name>',
    params.chartPath || './helm-chart',
    `--namespace ${params.namespace || '<namespace>'}`,
    '--create-namespace'
  ];

  if (params.valuesFile) {
    parts.push(`--values ${params.valuesFile}`);
  }
  if (params.imageTag) {
    parts.push(`--set image.tag="${params.imageTag}"`);
  }
  if (params.atomic ?? true) {
    parts.push('--atomic');
  }
  parts.push(`--timeout ${params.timeoutMinutes || 5}m`);

  return parts.join(' ');
}

/**
 * Learning roadmap completion calculator
 */
export function calculateRoadmapProgress(completedIds: Set<string>, totalItems: number): {
  percentage: number;
  completed: number;
  remaining: number;
} {
  const completed = completedIds.size;
  const remaining = Math.max(0, totalItems - completed);
  const percentage = totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0;
  return { percentage, completed, remaining };
}
