'use client';

import React from 'react';
import { CollectiveMemoryReport } from '@/lib/types';
import { soundFx } from '@/lib/audio';
import {
  Brain,
  Download,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

interface MemoryCollectiveProps {
  reports: CollectiveMemoryReport[];
}

export const MemoryCollective: React.FC<MemoryCollectiveProps> = ({ reports }) => {
  const handleExportJSON = () => {
    soundFx.playCoin();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `humano_bot_memoria_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-pink-400" />
          <div>
            <h3 className="text-xs font-bold font-pixel text-slate-100">
              MEMÓRIA COLETIVA & BASE DE CONHECIMENTO
            </h3>
            <p className="text-xs text-slate-400">
              Repositório persistente de heurísticas, lições validadas e relatórios de auditoria
            </p>
          </div>
        </div>

        <button
          onClick={handleExportJSON}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-pink-400" />
          Exportar Memória (JSON)
        </button>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-pink-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {report.id}
                </span>
                <span className="text-xs font-bold text-slate-200 font-pixel">
                  {report.departmentName}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {report.timestamp} · {report.supervisor}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-100 font-pixel mb-1">{report.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{report.summary}</p>
            </div>

            {/* Key Findings */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Descobertas Relevantes
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                {report.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded border border-slate-800/60">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Approved vs Rejected Strategies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Approved */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-xs space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Estratégias Aprovadas
                </div>
                {report.approvedStrategies.map((strat, idx) => (
                  <div key={idx} className="text-slate-300">
                    · {strat}
                  </div>
                ))}
              </div>

              {/* Rejected */}
              <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-lg text-xs space-y-1">
                <div className="font-bold text-rose-400 flex items-center gap-1.5 mb-1">
                  <XCircle className="w-3.5 h-3.5" />
                  Estratégias Rejeitadas
                </div>
                {report.rejectedStrategies.map((strat, idx) => (
                  <div key={idx} className="text-slate-300">
                    · {strat}
                  </div>
                ))}
              </div>
            </div>

            {/* Incidents (if any) */}
            {report.incidentsReported.length > 0 && (
              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs">
                <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  Incidentes Registados
                </div>
                {report.incidentsReported.map((inc, idx) => (
                  <div key={idx} className="text-amber-200">
                    · {inc}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
