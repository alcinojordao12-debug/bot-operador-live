'use client';

import React, { useState } from 'react';
import { AgentRobot, Department } from '@/lib/types';
import { soundFx } from '@/lib/audio';
import {
  X,
  Brain,
  ShieldAlert,
  Cpu,
  Layers,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';

interface AgentProfileModalProps {
  agent: AgentRobot | null;
  department?: Department;
  onClose: () => void;
  onUpdateAgent: (updated: AgentRobot) => void;
}

export const AgentProfileModal: React.FC<AgentProfileModalProps> = ({
  agent,
  department,
  onClose,
  onUpdateAgent,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'memory' | 'tools' | 'control'>('profile');
  const [customVisorText, setCustomVisorText] = useState('');

  if (!agent) return null;

  const handleVisorChange = (text: string) => {
    soundFx.playBlip(750);
    onUpdateAgent({
      ...agent,
      visorText: text,
      status: text.includes('ERRO') ? 'ERROR' : text.includes('INATIVO') ? 'IDLE' : 'BUSY',
    });
  };

  const handleToggleStatus = () => {
    soundFx.playCoin();
    const newStatus = agent.status === 'PAUSED' ? 'BUSY' : 'PAUSED';
    onUpdateAgent({
      ...agent,
      status: newStatus,
      visorText: newStatus === 'PAUSED' ? 'PAUSADO' : 'EM EXECUÇÃO',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Retro Header with 16-bit title bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {/* Mini Robot Avatar */}
            <div
              style={{ backgroundColor: agent.chassisColor }}
              className="w-8 h-8 rounded-md border-2 border-slate-950 flex items-center justify-center shadow-sm"
            >
              <Cpu className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 font-pixel tracking-tight">
                  {agent.name}
                </h3>
                {agent.isSupervisor && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                    SUPERVISOR
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {department?.name} · {agent.role}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playBlip(400);
              onClose();
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 text-xs font-medium">
          <button
            onClick={() => {
              soundFx.playBlip(500);
              setActiveTab('profile');
            }}
            className={`px-3 py-2.5 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Ficha & Tarefa
          </button>
          <button
            onClick={() => {
              soundFx.playBlip(550);
              setActiveTab('memory');
            }}
            className={`px-3 py-2.5 border-b-2 transition-colors ${
              activeTab === 'memory'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Memória Individual ({agent.memory.length})
          </button>
          <button
            onClick={() => {
              soundFx.playBlip(600);
              setActiveTab('tools');
            }}
            className={`px-3 py-2.5 border-b-2 transition-colors ${
              activeTab === 'tools'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Ferramentas & Fontes
          </button>
          <button
            onClick={() => {
              soundFx.playBlip(650);
              setActiveTab('control');
            }}
            className={`px-3 py-2.5 border-b-2 transition-colors ${
              activeTab === 'control'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Comando do Visor
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-200 text-sm flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Live Visor Display Banner */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block mb-1">
                    Visor Ativo na Cabeça do Robô
                  </span>
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 inline-block shadow-sm">
                    {agent.visorText}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block mb-1">
                    Estado Operacional
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      agent.status === 'BUSY'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                        : agent.status === 'ERROR'
                        ? 'bg-rose-950 text-rose-300 border border-rose-700/60'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>
              </div>

              {/* Current Task Details */}
              <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Tarefa Atual em Execução
                </h4>
                <p className="text-xs text-slate-300 mt-1">{agent.currentTask}</p>

                {agent.taskProgress !== null && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Progresso Mensurável</span>
                      <span className="font-mono font-bold text-amber-400">{agent.taskProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                        style={{ width: `${agent.taskProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Learnings */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Últimas Aprendizagens Validadas
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {agent.recentLearnings.map((learning, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded border border-slate-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{learning}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Errors (if any) */}
              {agent.recentErrors.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    Erros Detectados
                  </h4>
                  <ul className="space-y-1.5 text-xs text-rose-300">
                    {agent.recentErrors.map((err, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-rose-950/20 p-2 rounded border border-rose-900/40">
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{err}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'memory' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Registos Persistentes na Memória do Robô</span>
                <span className="font-mono text-cyan-400">{agent.memory.length} registos ativos</span>
              </div>

              {agent.memory.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded border border-slate-800">
                  Nenhum registo gravado na memória até o momento.
                </div>
              ) : (
                agent.memory.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                        {item.category}
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">{item.timestamp}</span>
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs mt-1">{item.title}</h5>
                    <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                    <div className="mt-2 text-[10px] text-slate-500 font-mono">
                      Confiança Heurística: {(item.confidenceScore * 100).toFixed(0)}%
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2">Ferramentas de Execução do Robô</h4>
                <div className="grid grid-cols-2 gap-2">
                  {agent.tools.map((tool, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950/60 rounded border border-slate-800 text-xs font-mono text-amber-300 flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-amber-400" />
                      <span>{tool}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2">Fontes de Dados Autorizadas</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {agent.dataSources.map((ds, idx) => (
                    <li key={idx} className="p-2 bg-slate-950/40 rounded border border-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{ds}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'control' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <h4 className="text-xs font-bold text-slate-200 mb-1">Alterar Estado do Visor em Tempo Real</h4>
                <p className="text-xs text-slate-400 mb-3">
                  Selecione uma diretiva operacional imediata para atualizar o visor na cabeça do robô no escritório 2D.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    'ANALISAR BTC',
                    'A INVESTIGAR SOL',
                    'A VALIDAR DADOS',
                    'A TESTAR ESTRATÉGIA',
                    'A ESTUDAR ERROS',
                    'A TREINAR MODELO',
                    'A VERIFICAR RISCO',
                    'MONITORIZAR ORDEM',
                    'À ESPERA DE DADOS',
                    'TAREFA CONCLUÍDA',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleVisorChange(preset)}
                      className={`px-2.5 py-1.5 rounded text-xs font-mono text-left transition-colors border ${
                        agent.visorText === preset
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Visor Text Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escrever status customizado no visor..."
                  value={customVisorText}
                  onChange={(e) => setCustomVisorText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => {
                    if (customVisorText.trim()) {
                      handleVisorChange(customVisorText.trim().toUpperCase());
                      setCustomVisorText('');
                    }
                  }}
                  className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded text-xs font-bold hover:bg-amber-400 transition-colors"
                >
                  Definir
                </button>
              </div>

              {/* Pause / Resume button */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleToggleStatus}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                    agent.status === 'PAUSED'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {agent.status === 'PAUSED' ? (
                    <>
                      <Play className="w-3.5 h-3.5" /> Reativar Robô
                    </>
                  ) : (
                    <>
                      <Pause className="w-3.5 h-3.5" /> Pausar Atividade
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Supervisor: {department?.supervisorName || 'Robo-Diretor Alpha'}</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Fechar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
