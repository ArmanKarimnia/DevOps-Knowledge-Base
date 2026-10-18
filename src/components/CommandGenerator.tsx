/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { generateKubectlDrainCommand, generateHelmDeployCommand } from '../utils/kb-engine';
import { Terminal, Copy, Check, Wrench, ShieldAlert } from 'lucide-react';

export const CommandGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drain' | 'helm' | 'docker' | 'openssl'>('drain');
  const [copied, setCopied] = useState(false);

  // Kubectl Drain State
  const [nodeName, setNodeName] = useState('worker-01.example.com');
  const [ignoreDaemonsets, setIgnoreDaemonsets] = useState(true);
  const [deleteEmptydir, setDeleteEmptydir] = useState(true);
  const [timeoutMins, setTimeoutMins] = useState(5);
  const [forceDrain, setForceDrain] = useState(true);

  // Helm Deploy State
  const [helmRelease, setHelmRelease] = useState('order-service');
  const [helmChart, setHelmChart] = useState('./helm-chart');
  const [helmNamespace, setHelmNamespace] = useState('workloads');
  const [helmValues, setHelmValues] = useState('./helm-chart/values-production.yaml');
  const [helmTag, setHelmTag] = useState('v1.4.2');
  const [helmAtomic, setHelmAtomic] = useState(true);

  // Docker Hardened State
  const [dockerName, setDockerName] = useState('api-backend');
  const [dockerImage, setDockerImage] = useState('registry.example.com/platform/api-backend:2.1.0');
  const [dockerPort, setDockerPort] = useState('8080:8080');
  const [dockerMem, setDockerMem] = useState('512m');

  // OpenSSL CSR State
  const [sslDomain, setSslDomain] = useState('api.example.com');
  const [sslAltDomains, setSslAltDomains] = useState('api-internal.example.com, 192.0.2.10');

  const getActiveCommand = () => {
    switch (activeTab) {
      case 'drain':
        return generateKubectlDrainCommand({
          nodeName,
          ignoreDaemonsets,
          deleteEmptydir,
          timeoutMinutes: timeoutMins,
          force: forceDrain
        });
      case 'helm':
        return generateHelmDeployCommand({
          releaseName: helmRelease,
          chartPath: helmChart,
          namespace: helmNamespace,
          valuesFile: helmValues,
          imageTag: helmTag,
          atomic: helmAtomic,
          timeoutMinutes: 8
        });
      case 'docker':
        return `docker run -d --name ${dockerName || 'my-app'} --user 10001:10001 --read-only --tmpfs /tmp:rw,noexec,nosuid --cap-drop=ALL --memory=${dockerMem || '512m'} -p ${dockerPort || '8080:8080'} ${dockerImage || 'my-image:latest'}`;
      case 'openssl': {
        const sans = sslAltDomains.split(',').map(s => {
          const trimmed = s.trim();
          return trimmed.match(/^\d+\.\d+\.\d+\.\d+$/) ? `IP:${trimmed}` : `DNS:${trimmed}`;
        }).join(', ');
        return `openssl req -new -newkey rsa:2048 -nodes -keyout ${sslDomain}.key -out ${sslDomain}.csr -subj "/CN=${sslDomain}/O=DevOps Infrastructure" -addext "subjectAltName = DNS:${sslDomain}${sans ? ', ' + sans : ''}"`;
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCommand());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Wrench className="w-5 h-5 text-teal-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Interactive DevOps Command Builder</h2>
        </div>
        <p className="text-xs text-slate-400">
          Generate bulletproof, parameter-validated commands for Kubernetes operations, atomic Helm upgrades, hardened containers, and cryptographic certificates.
        </p>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mt-5">
          {[
            { id: 'drain', label: 'kubectl drain (Maintenance)' },
            { id: 'helm', label: 'helm upgrade (Atomic)' },
            { id: 'docker', label: 'docker run (Hardened Non-Root)' },
            { id: 'openssl', label: 'openssl req (CSR with SAN)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        {activeTab === 'drain' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Node Name</label>
              <input
                type="text"
                value={nodeName}
                onChange={e => setNodeName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Timeout (Minutes)</label>
              <input
                type="number"
                value={timeoutMins}
                onChange={e => setTimeoutMins(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreDaemonsets}
                  onChange={e => setIgnoreDaemonsets(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-500/30"
                />
                <span>--ignore-daemonsets (Do not evict Cilium/node agents)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deleteEmptydir}
                  onChange={e => setDeleteEmptydir(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-500/30"
                />
                <span>--delete-emptydir-data (Allow evicting pods with local emptyDir)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={forceDrain}
                  onChange={e => setForceDrain(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-500/30"
                />
                <span>--force (Continue even if unmanaged pods exist)</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'helm' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Release Name</label>
              <input
                type="text"
                value={helmRelease}
                onChange={e => setHelmRelease(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Namespace</label>
              <input
                type="text"
                value={helmNamespace}
                onChange={e => setHelmNamespace(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Chart Path</label>
              <input
                type="text"
                value={helmChart}
                onChange={e => setHelmChart(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Image Tag</label>
              <input
                type="text"
                value={helmTag}
                onChange={e => setHelmTag(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="md:col-span-2 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={helmAtomic}
                  onChange={e => setHelmAtomic(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-500/30"
                />
                <span>--atomic (Automatically roll back if health checks fail)</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'docker' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Container Name</label>
              <input
                type="text"
                value={dockerName}
                onChange={e => setDockerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Image Reference</label>
              <input
                type="text"
                value={dockerImage}
                onChange={e => setDockerImage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Port Mapping (Host:Container)</label>
              <input
                type="text"
                value={dockerPort}
                onChange={e => setDockerPort(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Memory Limit</label>
              <input
                type="text"
                value={dockerMem}
                onChange={e => setDockerMem(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'openssl' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Common Name (CN)</label>
              <input
                type="text"
                value={sslDomain}
                onChange={e => setSslDomain(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Alternative Names (Comma Separated)</label>
              <input
                type="text"
                value={sslAltDomains}
                onChange={e => setSslAltDomains(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
        )}

        {/* Output Command Box */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
              Generated Command
            </span>
            <span className="text-[11px] text-teal-400 font-medium">Ready to execute</span>
          </div>

          <div className="relative">
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 pr-24 text-xs font-mono text-teal-300 overflow-x-auto selection:bg-teal-900 leading-relaxed">
              <code>{getActiveCommand()}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute right-2.5 top-2.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
