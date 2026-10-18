/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  Terminal,
  Activity,
  Map,
  Wrench,
  Layers,
  Boxes,
  GitMerge,
  Globe,
  Radio,
  Database,
  ShieldCheck,
  HardDrive,
  Flame,
  LifeBuoy,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { CATEGORIES } from '../data/knowledge-base';

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  activeView: string;
  onSelectView: (view: string) => void;
  docCount: number;
}

const VIEW_TABS = [
  { id: 'docs', label: 'Documentation', icon: BookOpen },
  { id: 'cheatsheets', label: 'Cheatsheets', icon: Terminal },
  { id: 'runbooks', label: 'Incident Runbooks', icon: Flame },
  { id: 'roadmap', label: 'Learning Roadmap', icon: Map },
  { id: 'generator', label: 'Command Builder', icon: Wrench }
];

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  activeView,
  onSelectView,
  docCount
}) => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'kubernetes': return Boxes;
      case 'cicd': return GitMerge;
      case 'linux': return Terminal;
      case 'apisix': return Globe;
      case 'observability': return Activity;
      case 'kafka': return Radio;
      case 'databases': return Database;
      case 'security': return ShieldCheck;
      case 'storage': return HardDrive;
      case 'runbooks': return Flame;
      case 'operations': return LifeBuoy;
      case 'templates': return FileText;
      default: return Layers;
    }
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
      {/* View Mode Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2 shadow-sm">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5">
          Knowledge Views
        </div>
        <nav className="flex flex-col gap-1">
          {VIEW_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectView(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span className="flex-1">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Categories Filter */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2 shadow-sm">
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Technology Categories
          </span>
          <span className="text-[10px] text-teal-400/80 bg-teal-500/10 px-2 py-0.5 rounded-full font-mono">
            {CATEGORIES.length - 1} domains
          </span>
        </div>

        <div className="flex flex-col gap-0.5 max-h-[380px] overflow-y-auto pr-1 mt-1 scrollbar-thin scrollbar-thumb-slate-800">
          {CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left group ${
                  isSelected
                    ? 'bg-teal-500/20 text-teal-200 font-medium'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span className="truncate">{cat.name}</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-teal-500/30 text-teal-200' : 'bg-slate-800 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quality & Security Status Badge */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-xs">
        <div className="flex items-center gap-2 text-teal-400 font-semibold mb-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Quality & Safety Audited</span>
        </div>
        <div className="space-y-1.5 text-slate-400 text-[11px]">
          <div className="flex justify-between">
            <span>Markdown Documents:</span>
            <span className="font-mono text-slate-200 font-medium">107 files</span>
          </div>
          <div className="flex justify-between">
            <span>Relative Links:</span>
            <span className="font-mono text-emerald-400 font-medium">181 verified</span>
          </div>
          <div className="flex justify-between">
            <span>Secret Scanner:</span>
            <span className="font-mono text-emerald-400 font-medium">0 leaks</span>
          </div>
          <div className="flex justify-between">
            <span>MkDocs Nav:</span>
            <span className="font-mono text-emerald-400 font-medium">100% matched</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
