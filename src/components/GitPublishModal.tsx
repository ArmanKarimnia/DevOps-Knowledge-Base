/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Github, X, Copy, Check, Terminal, ExternalLink, ShieldCheck, Download } from 'lucide-react';

interface GitPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitPublishModal: React.FC<GitPublishModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copySnippet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const PUBLISH_STEPS = [
    {
      title: 'Step 1: Create a New Empty GitHub Repository',
      desc: 'Go to github.com/new and create a repository named devops-knowledge-base (Leave "Initialize with README" unchecked).',
      code: '# On GitHub: https://github.com/new\n# Repository name: devops-knowledge-base\n# Visibility: Public or Private'
    },
    {
      title: 'Step 2: Initialize Git in the Knowledge Base Directory',
      desc: 'Navigate to devops-knowledge-base, initialize git tracking, and create the initial commit.',
      code: 'cd devops-knowledge-base\ngit init -b main\ngit add .\ngit commit -m "feat: initial commit of production DevOps knowledge base and runbooks"'
    },
    {
      title: 'Step 3: Link Remote & Push to Your Personal GitHub Account',
      desc: 'Replace YOUR_GITHUB_USERNAME with your actual GitHub account handle.',
      code: 'git remote add origin https://github.com/YOUR_GITHUB_USERNAME/devops-knowledge-base.git\ngit push -u origin main'
    },
    {
      title: 'Step 4: Optional - Deploy Live Searchable MkDocs Site',
      desc: 'Use GitHub Actions or the mkdocs gh-deploy command to publish your documentation site to GitHub Pages.',
      code: 'pip install -r requirements-docs.txt\nmkdocs gh-deploy --force'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Publish to Personal GitHub Account</h3>
              <p className="text-xs text-slate-400">All 107 files and configurations are ready to push</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Security Banner */}
          <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <div>
              <strong className="font-semibold text-emerald-200">Public Release Safe: </strong>
              All sample configs use RFC documentation IP addresses (192.0.2.0/24), generic hostnames (*.example.com), and zero hardcoded secrets.
            </div>
          </div>

          {/* Steps */}
          {PUBLISH_STEPS.map((step, idx) => (
            <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-bold text-slate-200">{step.title}</h4>
                <button
                  onClick={() => copySnippet(step.code, idx)}
                  className="flex items-center gap-1 text-[11px] font-mono text-teal-400 hover:text-teal-300 active:scale-95"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy snippet</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{step.desc}</p>
              <pre className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 text-xs font-mono text-teal-300 overflow-x-auto">
                <code>{step.code}</code>
              </pre>
            </div>
          ))}

          {/* GitHub Topics Tag List */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
            <span className="text-xs font-semibold text-slate-300 block mb-2">Recommended GitHub Repository Topics:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'devops', 'kubernetes', 'rke2', 'cilium', 'gitlab-ci', 'apisix',
                'linux', 'sre', 'runbooks', 'cheatsheet', 'ansible', 'prometheus', 'grafana', 'kafka'
              ].map(tag => (
                <span key={tag} className="text-[10px] font-mono bg-slate-800 text-teal-300 border border-slate-700 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-xl transition-all shadow-md active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
