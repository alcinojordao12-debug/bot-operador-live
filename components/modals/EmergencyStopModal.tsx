'use client';

import React from 'react';
import { soundFx } from '@/lib/audio';
import { AlertOctagon, ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface EmergencyStopModalProps {
  isOpen: boolean;
  isTriggered: boolean;
  onClose: () => void;
  onToggleEmergencyStop: () => void;
}

export const EmergencyStopModal: React.FC<EmergencyStopModalProps> = ({
  isOpen,
  isTriggered,
  onClose,
  onToggleEmergencyStop,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-rose-600 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-rose-950/80 border-b border-rose-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600/30 border border-rose-500 flex items-center justify-center text-rose-400">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-200 font-pixel tracking-tight">
                TRAVÃO DE EMERGÊNCIA
              </h3>
              <p className="text-xs text-rose-300/80">Protocolo de Segurança Nível 3 (Crítico)</p>
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

        {/* Body */}
        <div className="p-6 space-y-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Diretrizes de Acionamento:
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Congela imediatamente novas intenções e roteamento de ordens financeiras.</li>
              <li>Não elimina histórico, memórias ou dados de auditoria registrados.</li>
              <li>Mantém a análise técnica e investigação funcionando em modo de segurança.</li>
              <li>Exige reconciliação de estado com a exchange antes do destravamento.</li>
            </ul>
          </div>

          <div className="p-3 bg-rose-950/40 rounded border border-rose-900/60 text-rose-300 font-mono text-[11px]">
            Status do Travão:{' '}
            <span className="font-bold">
              {isTriggered ? 'ATIVADO — OPERAÇÕES FINANCEIRAS PARALISADAS' : 'DESATIVADO — SISTEMA OPERANDO NORMALMENTE'}
            </span>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                if (!isTriggered) {
                  soundFx.playAlert();
                } else {
                  soundFx.playPowerup();
                }
                onToggleEmergencyStop();
              }}
              className={`w-full py-3 px-4 rounded-lg font-pixel text-xs transition-colors shadow-lg flex items-center justify-center gap-2 ${
                isTriggered
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
              {isTriggered ? 'DESARMAR TRAVÃO E REANÁLISAR' : 'ACIONAR TRAVÃO DE EMERGÊNCIA'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
