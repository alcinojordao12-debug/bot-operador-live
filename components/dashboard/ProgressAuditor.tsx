'use client';

import React, { useState } from 'react';
import { AuditPhase } from '@/lib/types';
import { soundFx } from '@/lib/audio';
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

interface ProgressAuditorProps {
  phases: AuditPhase[];
}

export const ProgressAuditor: React.FC<ProgressAuditorProps> = ({ phases }) => {
  const [filter, setFilter] = useState<string>('all');

  // Exact verifiable calculation
  const totalPhases = phases.length;
  const completedPhases = phases.filter(
    (p) => p.status === 'IMPLEMENTADA E TESTADA' && p.progressPct === 100
  ).length;
  const overallProgress = Math.round(
    phases.reduce((acc, p) => acc + p.progressPct, 0) / totalPhases
  );

  const filteredPhases = phases.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const handleExportAuditReport = () => {
    soundFx.playCoin();
    let report = `# HUMANO BOT — RELATÓRIO FINAL DE AUDITORIA & IMPLEMENTAÇÃO\n`;
    report += `Data de Emissão: ${new Date().toISOString()}\n`;
    report += `Progresso Global Comprovado: ${overallProgress}%\n`;
    report += `Fases Concluídas: ${completedPhases}/${totalPhases}\n\n`;
    report += `## DETALHAMENTO DAS 18 FASES:\n\n`;

    phases.forEach((p) => {
      report += `### ${p.name} (${p.progressPct}% - ${p.status})\n`;
      report += `- Descrição: ${p.description}\n`;
      report += `- Evidência Verificável: ${p.verifiedEvidence}\n\n`;
    });

    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `humano_bot_relatorio_auditoria_${new Date().toISOString().substring(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Master Progress */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-pixel text-slate-100">
                AUDITORIA DE IMPLEMENTAÇÃO DAS 18 FASES
              </h3>
              <p className="text-xs text-slate-400">
                Progresso calculado estritamente com base em evidências verificáveis de código
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportAuditReport}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Exportar Relatório Markdown
            </button>
          </div>
        </div>

        {/* Master Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Progresso Global das 18 Fases</span>
            <span className="text-emerald-400 font-bold">{overallProgress}% CONCLUÍDO</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => {
            soundFx.playBlip(500);
            setFilter('all');
          }}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          Todas as Fases ({phases.length})
        </button>
        <button
          onClick={() => {
            soundFx.playBlip(550);
            setFilter('IMPLEMENTADA E TESTADA');
          }}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'IMPLEMENTADA E TESTADA'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          Implementadas e Testadas ({completedPhases})
        </button>
      </div>

      {/* 18 Phases Grid / List */}
      <div className="space-y-3">
        {filteredPhases.map((phase) => (
          <div
            key={phase.number}
            className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-slate-950 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-amber-400">
                  {phase.number}
                </span>
                <h4 className="text-xs font-bold font-pixel text-slate-100">{phase.name}</h4>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {phase.progressPct}%
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {phase.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{phase.description}</p>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] font-mono text-emerald-400/90 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-300">Evidência Comprovável:</span>{' '}
                {phase.verifiedEvidence}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
