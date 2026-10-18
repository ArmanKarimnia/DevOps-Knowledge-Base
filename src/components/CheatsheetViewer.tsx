/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CommandItem, RiskLevel } from '../utils/kb-engine';
import { Copy, Check, Terminal, Shield, AlertTriangle, AlertOctagon, Filter, Tag } from 'lucide-react';

interface CheatsheetViewerProps {
  commands: CommandItem[];
  selectedCategory: string;
}

export const CheatsheetViewer: React.FC<CheatsheetViewerProps> = ({
  commands,
  selectedCategory
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCommands = commands.filter(cmd => {
    // Category filter
    if (selectedCategory !== 'all' && cmd.category !== selectedCategory) {
      return false;
    }
    // Risk filter
    if (riskFilter !== 'all' && cmd.risk !== riskFilter) {
      return false;
    }
    // Local text search
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      const matchName = cmd.name.toLowerCase().includes(q);
      const matchCmd = cmd.command.toLowerCase().includes(q);
      const matchExpl = cmd.explanation.toLowerCase().includes(q);
      const matchTags = cmd.tags.some(t => t.toLowerCase().includes(q));
      return matchName || matchCmd || matchExpl || matchTags;
    }
    return true;
  });

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'READ-ONLY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield className="w-3 h-3" />
            READ-ONLY (SAFE)
          </span>
        );
      case 'STATE-MODIFYING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            STATE-MODIFYING
          </span>
        );
      case 'DESTRUCTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertOctagon className="w-3 h-3" />
            HIGH-RISK / DESTRUCTIVE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        {/* Risk Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Risk:
          </span>
          {['all', 'READ-ONLY', 'STATE-MODIFYING', 'DESTRUCTIVE'].map((risk) => (
            <button
              key={risk}
              onClick={() => setRiskFilter(risk)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                riskFilter === risk
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {risk === 'all' ? 'All Risks' : risk}
            </button>
          ))}
        </div>

        {/* Quick Search */}
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Filter commands..."
          className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 w-full sm:w-48"
        />
      </div>

      {/* Commands List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCommands.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
            <Terminal className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-slate-300 font-semibold text-sm">No commands matched your filter</h3>
            <p className="text-slate-500 text-xs mt-1">Try switching categories or clearing search tokens.</p>
          </div>
        ) : (
          filteredCommands.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-sm group"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-slate-100 font-bold text-sm tracking-tight group-hover:text-teal-300 transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 uppercase">
                    {item.category}
                  </span>
                </div>
                {getRiskBadge(item.risk)}
              </div>

              {/* Explanation & When to Use */}
              <p className="text-slate-300 text-xs leading-relaxed mb-2">
                {item.explanation}
              </p>
              <div className="text-[11px] text-slate-400 mb-3 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800/60">
                <span className="text-teal-400/90 font-medium">When to use: </span>
                {item.whenToUse}
              </div>

              {/* Code Box */}
              <div className="relative mt-2">
                <pre className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 pr-20 text-xs font-mono text-teal-300 overflow-x-auto selection:bg-teal-900">
                  <code>{item.command}</code>
                </pre>
                <button
                  onClick={() => handleCopy(item.id, item.command)}
                  className="absolute right-2 top-2 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/70 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                  title="Copy command to clipboard"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[11px] text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Flags list */}
              {item.flags && item.flags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Key Flags:</span>
                  {item.flags.map((flag, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {flag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
