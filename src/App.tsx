/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DocViewer } from './components/DocViewer';
import { CheatsheetViewer } from './components/CheatsheetViewer';
import { RunbookTracker } from './components/RunbookTracker';
import { RoadmapView } from './components/RoadmapView';
import { CommandGenerator } from './components/CommandGenerator';
import { GitPublishModal } from './components/GitPublishModal';
import { FEATURED_DOCS, CHEATSHEET_COMMANDS, CATEGORIES } from './data/knowledge-base';
import { searchDocuments, DocItem } from './utils/kb-engine';
import {
  BookOpen,
  Terminal,
  Flame,
  Map,
  Wrench,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Search,
  CheckCircle2,
  FileCode2,
  Download
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<string>('docs');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);

  // Filtered documents using search engine
  const filteredDocs = useMemo(() => {
    return searchDocuments(FEATURED_DOCS, searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const activeCategoryInfo = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans transition-colors duration-200`}>
      {/* Top Application Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        activeView={activeView}
        onViewChange={(v) => {
          setActiveView(v);
          setSelectedDoc(null);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            setSelectedDoc(null);
          }}
          activeView={activeView}
          onSelectView={(v) => {
            setActiveView(v);
            setSelectedDoc(null);
          }}
          docCount={filteredDocs.length}
        />

        {/* Content Area */}
        <section className="flex-1 min-w-0">
          {/* Active View: DOCUMENTATION */}
          {activeView === 'docs' && (
            selectedDoc ? (
              <DocViewer
                doc={selectedDoc}
                onBack={() => setSelectedDoc(null)}
                onSelectTag={(tag) => setSearchQuery(tag)}
              />
            ) : (
              <div className="space-y-6">
                {/* Hero Banner / Active Category Title */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/30 border border-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/30">
                          {activeCategoryInfo.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {filteredDocs.length} documents
                        </span>
                      </div>
                      <h1 className="text-2xl font-extrabold text-white tracking-tight">
                        {selectedCategory === 'all' ? 'DevOps Operations Handbook & Guides' : activeCategoryInfo.name}
                      </h1>
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                        {activeCategoryInfo.description}. Production-tested architecture, configuration, and troubleshooting procedures.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveView('cheatsheets')}
                        className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <Terminal className="w-3.5 h-3.5 text-teal-400" />
                        <span>View Cheatsheets</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Document Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocs.length === 0 ? (
                    <div className="col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
                      <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                      <h3 className="text-slate-300 font-semibold text-sm">No documents found matching "{searchQuery}"</h3>
                      <p className="text-slate-500 text-xs mt-1">Try another keyword or select a different category.</p>
                      <button
                        onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                        className="mt-4 px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-teal-300 border border-slate-700"
                      >
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    filteredDocs.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className="bg-slate-900/90 border border-slate-800/90 hover:border-teal-500/40 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md hover:shadow-teal-500/5 group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                              {doc.category}
                            </span>
                            {doc.level && (
                              <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                Level {doc.level}
                              </span>
                            )}
                          </div>

                          <h2 className="text-sm font-bold text-slate-100 group-hover:text-teal-300 transition-colors leading-snug">
                            {doc.title}
                          </h2>
                          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                            {doc.summary}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-mono">
                            <FileCode2 className="w-3.5 h-3.5" />
                            <span>{doc.path.split('/').pop()}</span>
                          </div>
                          <span className="text-teal-400 flex items-center gap-1 text-[11px] font-medium group-hover:translate-x-0.5 transition-transform">
                            <span>Read guide</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          )}

          {/* Active View: CHEATSHEETS */}
          {activeView === 'cheatsheets' && (
            <CheatsheetViewer
              commands={CHEATSHEET_COMMANDS}
              selectedCategory={selectedCategory}
            />
          )}

          {/* Active View: RUNBOOKS */}
          {activeView === 'runbooks' && (
            <RunbookTracker />
          )}

          {/* Active View: ROADMAP */}
          {activeView === 'roadmap' && (
            <RoadmapView />
          )}

          {/* Active View: COMMAND BUILDER */}
          {activeView === 'generator' && (
            <CommandGenerator />
          )}
        </section>
      </main>

      {/* GitHub Publish Modal */}
      <GitPublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 px-4 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            DevOps Knowledge Base & Operations Handbook • Released under MIT License
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <button onClick={() => setIsPublishModalOpen(true)} className="hover:text-teal-400 transition-colors">
              GitHub Publication Guide
            </button>
            <span>•</span>
            <span className="font-mono text-teal-400/80">107 Markdown Docs Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
