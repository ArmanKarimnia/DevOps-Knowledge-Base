/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Github, BookOpen, Terminal, Sparkles, Moon, Sun, Download } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenPublishModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenPublishModal,
  darkMode,
  onToggleDarkMode,
  activeView,
  onViewChange
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/60 bg-slate-900/90 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onViewChange('docs')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-indigo-500 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-base tracking-tight">DevOps Knowledge Base</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  v1.0 Release
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Kubernetes • RKE2 • Cilium • GitLab CI • APISIX • SRE Runbooks
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenPublishModal}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
              title="Publish to GitHub"
            >
              <Github className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:max-w-md lg:max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search commands, runbooks, kubectl, cilium, apisix (Press /)..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-12 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/60 shadow-inner"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 rounded px-1.5 py-0.5 font-mono">
              /
            </kbd>
          </div>
        </div>

        {/* Desktop Navigation / Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={onOpenPublishModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-xl transition-all shadow-sm hover:border-slate-600 active:scale-95"
            title="Publish to personal GitHub repository"
          >
            <Github className="w-4 h-4 text-teal-400" />
            <span>GitHub Publish</span>
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
