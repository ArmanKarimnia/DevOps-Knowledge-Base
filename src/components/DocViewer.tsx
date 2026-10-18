/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DocItem } from '../utils/kb-engine';
import { Copy, Check, FileText, ExternalLink, ArrowLeft, Tag, Layers } from 'lucide-react';
import { marked } from 'marked';

interface DocViewerProps {
  doc: DocItem;
  onBack: () => void;
  onSelectTag?: (tag: string) => void;
}

export const DocViewer: React.FC<DocViewerProps> = ({ doc, onBack, onSelectTag }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyContent = () => {
    if (doc.content) {
      navigator.clipboard.writeText(doc.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Render markdown safely using marked
  const renderedHtml = doc.content ? marked.parse(doc.content) : '';

  return (
    <article className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to list</span>
          </button>
          <span>/</span>
          <span className="capitalize text-teal-400 font-medium">{doc.category}</span>
          <span>/</span>
          <span className="font-mono text-slate-400 truncate max-w-[200px]">{doc.path}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyContent}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all active:scale-95"
            title="Copy entire raw Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Markdown' : 'Copy Raw .md'}</span>
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="p-6 md:p-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-800/20 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/30">
            {doc.category}
          </span>
          {doc.level && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              Level {doc.level}
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
          {doc.title}
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          {doc.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {doc.tags.map(tag => (
            <span
              key={tag}
              onClick={() => onSelectTag && onSelectTag(tag)}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-md hover:border-teal-500/50 hover:text-teal-300 cursor-pointer transition-colors"
            >
              <Tag className="w-2.5 h-2.5 text-slate-500" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Rendered Markdown Body */}
      <div className="p-6 md:p-8">
        <div
          className="prose prose-invert prose-teal max-w-none 
            prose-headings:text-slate-100 prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
            prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2 prose-h2:mt-8
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-code:text-teal-300 prose-code:bg-slate-950 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs
            prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl prose-pre:p-4 prose-pre:text-slate-200
            prose-ul:text-slate-300 prose-ol:text-slate-300
            prose-li:my-1
            prose-table:border-collapse prose-table:border prose-table:border-slate-800
            prose-th:bg-slate-800/60 prose-th:p-3 prose-th:text-xs prose-th:font-semibold prose-th:text-slate-200 prose-th:border prose-th:border-slate-700
            prose-td:p-3 prose-td:text-xs prose-td:text-slate-300 prose-td:border prose-td:border-slate-800
            prose-blockquote:border-l-teal-500 prose-blockquote:bg-teal-500/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:text-slate-300"
          dangerouslySetInnerHTML={{ __html: renderedHtml as string }}
        />
      </div>
    </article>
  );
};
