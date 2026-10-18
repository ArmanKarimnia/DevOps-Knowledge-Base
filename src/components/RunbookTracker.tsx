/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle, Clock, ShieldAlert, ArrowRight, RefreshCw, Terminal, Copy, Check } from 'lucide-react';

interface RunbookStep {
  id: string;
  title: string;
  command?: string;
  description: string;
  completed: boolean;
}

interface IncidentRunbook {
  id: string;
  title: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3';
  slaMinutes: number;
  environment: string;
  steps: RunbookStep[];
}

const RUNBOOKS: IncidentRunbook[] = [
  {
    id: 'k8s-node-outage',
    title: 'Kubernetes Node Failure & Mass Pod Outage',
    severity: 'SEV-1',
    slaMinutes: 5,
    environment: 'RKE2 Clusters / Production Nodes',
    steps: [
      {
        id: 's1',
        title: 'Step 1: Check cluster node statuses',
        command: 'kubectl get nodes -o wide',
        description: 'Identify nodes reporting NotReady status and note internal IP addresses.',
        completed: false
      },
      {
        id: 's2',
        title: 'Step 2: Inspect node conditions & pressure',
        command: 'kubectl describe node <not-ready-node> | grep -A 8 "Conditions:"',
        description: 'Verify DiskPressure, MemoryPressure, or PIDPressure conditions.',
        completed: false
      },
      {
        id: 's3',
        title: 'Step 3: Cordon node to stop scheduling',
        command: 'kubectl cordon <not-ready-node>',
        description: 'Marks node SchedulingDisabled so new pods land on healthy nodes.',
        completed: false
      },
      {
        id: 's4',
        title: 'Step 4: Drain workloads honoring PDBs',
        command: 'kubectl drain <not-ready-node> --ignore-daemonsets --delete-emptydir-data --force --timeout=3m',
        description: 'Evict running pods to allow replacements to initialize on alternate nodes.',
        completed: false
      },
      {
        id: 's5',
        title: 'Step 5: Verify replacement pods healthy',
        command: 'kubectl get deployments -A -o wide',
        description: 'Confirm all deployment replica counts match desired numbers and traffic resumes.',
        completed: false
      }
    ]
  },
  {
    id: 'tls-expiration',
    title: 'Emergency TLS Certificate Expiration',
    severity: 'SEV-1',
    slaMinutes: 5,
    environment: 'APISIX Edge / Ingress Tier',
    steps: [
      {
        id: 'tls1',
        title: 'Step 1: Inspect remote certificate expiration',
        command: 'echo | openssl s_client -connect api.example.com:443 -servername api.example.com 2>/dev/null | openssl x509 -noout -dates',
        description: 'Confirm exact validity dates and verify issuer chain.',
        completed: false
      },
      {
        id: 'tls2',
        title: 'Step 2: Force Cert-Manager renewal',
        command: 'kubectl cert-manager renew api-tls-cert -n workloads',
        description: 'Re-trigger ACME challenge order with Let’s Encrypt.',
        completed: false
      },
      {
        id: 'tls3',
        title: 'Step 3: Apply manual secret override if ACME rate-limited',
        command: 'kubectl create secret tls api-tls-secret --cert=cert.crt --key=priv.key -n workloads --dry-run=client -o yaml | kubectl apply -f -',
        description: 'Emergency override using internal enterprise CA wildcard cert.',
        completed: false
      },
      {
        id: 'tls4',
        title: 'Step 4: Verify APISIX dynamic TLS reload',
        command: 'echo | openssl s_client -connect api.example.com:443 -servername api.example.com 2>/dev/null | openssl x509 -noout -dates',
        description: 'APISIX synchronizes new cert via etcd in under 1 second without dropping connections.',
        completed: false
      }
    ]
  },
  {
    id: 'db-connection-pool',
    title: 'Database Connection Pool Exhaustion & Thread Starvation',
    severity: 'SEV-1',
    slaMinutes: 10,
    environment: 'PostgreSQL & Oracle Database / HikariCP',
    steps: [
      {
        id: 'db1',
        title: 'Step 1: Check active database connections',
        command: 'SELECT count(*), client_addr FROM pg_stat_activity GROUP BY client_addr ORDER BY count(*) DESC;',
        description: 'Identify client IPs hogging connection slots.',
        completed: false
      },
      {
        id: 'db2',
        title: 'Step 2: Terminate idle in transaction sessions',
        command: "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction' AND (now() - state_change) > interval '5 minutes';",
        description: 'Release locked rows and idle connection slots immediately.',
        completed: false
      },
      {
        id: 'db3',
        title: 'Step 3: Temporarily throttle rogue workload replicas',
        command: 'kubectl scale deployment/rogue-service -n workloads --replicas=1',
        description: 'Prevent connection storms while reviewing connection pool leaks.',
        completed: false
      }
    ]
  }
];

export const RunbookTracker: React.FC = () => {
  const [selectedRunbookId, setSelectedRunbookId] = useState(RUNBOOKS[0].id);
  const [runbooks, setRunbooks] = useState(RUNBOOKS);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [incidentSeconds, setIncidentSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const activeRunbook = runbooks.find(r => r.id === selectedRunbookId) || runbooks[0];

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setIncidentSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleStep = (stepId: string) => {
    setRunbooks(prev =>
      prev.map(rb => {
        if (rb.id === activeRunbook.id) {
          return {
            ...rb,
            steps: rb.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s)
          };
        }
        return rb;
      })
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const completedCount = activeRunbook.steps.filter(s => s.completed).length;
  const progressPct = Math.round((completedCount / activeRunbook.steps.length) * 100);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Runbook Selector & Live Incident HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Selector */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Incident Runbook
            </div>
            <div className="flex flex-wrap gap-2">
              {runbooks.map(rb => (
                <button
                  key={rb.id}
                  onClick={() => {
                    setSelectedRunbookId(rb.id);
                    setIncidentSeconds(0);
                    setIsTimerRunning(true);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all text-left flex items-center gap-2 ${
                    rb.id === activeRunbook.id
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>{rb.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Incident Timer & Triage SLA */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Incident Bridge Clock
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
              {activeRunbook.severity}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-mono font-extrabold text-white tracking-tight">
              {formatTimer(incidentSeconds)}
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400">Target Triage SLA</div>
              <div className="text-xs font-semibold text-emerald-400">&lt; {activeRunbook.slaMinutes} minutes</div>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step by Step Interactive Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">{activeRunbook.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Target: {activeRunbook.environment}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-mono">
              Completed: <strong className="text-emerald-400">{completedCount}</strong> / {activeRunbook.steps.length}
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {activeRunbook.steps.map((step, idx) => (
            <div
              key={step.id}
              className={`p-5 transition-colors ${step.completed ? 'bg-emerald-950/10' : 'hover:bg-slate-800/30'}`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={step.id}
                  checked={step.completed}
                  onChange={() => toggleStep(step.id)}
                  className="mt-1 w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-teal-500/40 bg-slate-950 cursor-pointer"
                />
                <div className="flex-1">
                  <label
                    htmlFor={step.id}
                    className={`text-sm font-semibold cursor-pointer ${
                      step.completed ? 'line-through text-slate-400' : 'text-slate-100 hover:text-teal-300'
                    }`}
                  >
                    {step.title}
                  </label>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {step.description}
                  </p>

                  {step.command && (
                    <div className="relative mt-2.5">
                      <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 pr-20 text-xs font-mono text-teal-300 overflow-x-auto">
                        <code>{step.command}</code>
                      </pre>
                      <button
                        onClick={() => handleCopy(step.command!)}
                        className="absolute right-2 top-2 px-2 py-1 rounded-md text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 active:scale-95"
                      >
                        {copiedCmd === step.command ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
