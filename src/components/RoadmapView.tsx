/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ROADMAP_LEVELS } from '../data/knowledge-base';
import { calculateRoadmapProgress } from '../utils/kb-engine';
import { CheckCircle2, Circle, Trophy, ArrowRight, BookOpen } from 'lucide-react';

interface RoadmapViewProps {
  onNavigateDoc?: (docId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = () => {
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(new Set(['l1-1', 'l1-2', 'l2-1']));

  const totalTopics = ROADMAP_LEVELS.reduce((acc, lvl) => acc + lvl.topics.length, 0);
  const progress = calculateRoadmapProgress(completedTopicIds, totalTopics);

  const toggleTopic = (id: string) => {
    setCompletedTopicIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">DevOps Engineering Competency Progress</h2>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Progressive mastery from Linux sysadmin fundamentals to hardened RKE2 Kubernetes, Cilium eBPF datapath, and enterprise DevSecOps reliability.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <div className="text-right">
              <div className="text-2xl font-extrabold text-teal-400 font-mono">{progress.percentage}%</div>
              <div className="text-[10px] text-slate-400 font-medium">Completed ({progress.completed}/{totalTopics})</div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
              <div
                className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin-slow"
                style={{ clipPath: `polygon(0 0, 100% 0, 100% ${progress.percentage}%, 0 ${progress.percentage}%)` }}
              />
              <span className="text-xs font-mono font-bold text-slate-200">{progress.completed}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-2.5 rounded-full mt-5 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* 7 Levels */}
      <div className="grid grid-cols-1 gap-6">
        {ROADMAP_LEVELS.map((lvl) => {
          const completedInLevel = lvl.topics.filter(t => completedTopicIds.has(t.id)).length;
          const isAllDone = completedInLevel === lvl.topics.length;

          return (
            <div
              key={lvl.level}
              className={`bg-slate-900 border rounded-2xl p-6 transition-all shadow-sm ${
                isAllDone ? 'border-teal-500/40 bg-teal-950/10' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold font-mono text-sm text-teal-400">
                    0{lvl.level}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">{lvl.title}</h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      Level {lvl.level} • {lvl.badge}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  {completedInLevel} / {lvl.topics.length} topics done
                </div>
              </div>

              {/* Topics list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3">
                {lvl.topics.map(t => {
                  const isChecked = completedTopicIds.has(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleTopic(t.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-teal-500/10 border-teal-500/30 text-teal-200'
                          : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <button className="mt-0.5 shrink-0 focus:outline-none">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-teal-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>
                      <span className={`leading-snug ${isChecked ? 'line-through text-slate-400' : ''}`}>
                        {t.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
