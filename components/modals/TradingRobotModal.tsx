'use client';

import React from 'react';
import { TradingRobot } from '@/lib/types';
import { soundFx } from '@/lib/audio';
import { formatUSD } from '@/lib/utils';
import {
  X,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  History,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Lock,
} from 'lucide-react';

interface TradingRobotModalProps {
  robot: TradingRobot | null;
  livePrice?: number;
  onClose: () => void;
  onTriggerAnalysis: (robotId: string) => void;
}

export const TradingRobotModal: React.FC<TradingRobotModalProps> = ({
  robot,
  livePrice,
  onClose,
  onTriggerAnalysis,
}) => {
  if (!robot) return null;

  const currentPrice = livePrice || robot.currentPosition?.currentPrice || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-pixel text-xs font-bold">
              R{robot.number}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 font-pixel tracking-tight">
                  {robot.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  PAPER TRADING ATIVO
                </span>
              </div>
              <p className="text-xs text-slate-400">{robot.specialty}</p>
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

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-200 text-sm flex-1">
          {/* Top Ticker & Strategy Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block mb-0.5">Par / Ativo Atribuído</span>
              <div className="text-base font-bold text-amber-400 font-mono">{robot.assignedAsset}</div>
              <div className="text-xs text-slate-300 mt-1 font-mono">
                {currentPrice > 0 ? (
                  `$${formatUSD(currentPrice, 2, 8)}`
                ) : (
                  'DADOS N/D'
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block mb-0.5">Decisão em Vigor</span>
              <div className="text-base font-bold font-mono text-emerald-400">
                {robot.currentDecision}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 truncate">
                {robot.decisionHistory[0]?.reason || 'Aguardando gatilho de mercado'}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block mb-0.5">Exposição & Taxas Pagas</span>
              <div className="text-base font-bold font-mono text-slate-200">
                ${robot.currentExposure.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                Comissões: ${robot.feesPaid.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Real Confirmed vs Paper Trading Results - Anti-Deception Requirement */}
          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Segregação Obrigatória: Resultados Reais vs Simulados
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                Trading Real: DESLIGADO (Segurança)
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900/90 rounded border border-cyan-800/50">
                <div className="flex items-center justify-between font-bold text-cyan-300 mb-1">
                  <span>Paper Trading (Simulação)</span>
                  <span className="text-emerald-400 font-mono">Ativo</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-slate-300 mt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taxa de Acerto:</span>
                    <span className="text-emerald-400 font-bold">{robot.simulatedResults.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PnL Simulado:</span>
                    <span className="text-emerald-400 font-bold">+${robot.simulatedResults.totalPnl.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total de Operações:</span>
                    <span>{robot.simulatedResults.tradeCount}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/90 rounded border border-slate-800 opacity-90">
                <div className="flex items-center justify-between font-bold text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    Trading Real Confirmado
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">Não Ativado</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-slate-400 mt-2">
                  <div className="flex justify-between">
                    <span>Taxa de Acerto Real:</span>
                    <span className="text-slate-500">0% (Sem execuções)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PnL Real Verificado:</span>
                    <span className="text-slate-500">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status de Verificação:</span>
                    <span className="text-amber-500/80">Bloqueado por padrão</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Limits Configured */}
          <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Limites de Risco Configurados
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Drawdown Máx</span>
                <span className="text-amber-400 font-bold">{robot.riskLimits.maxDrawdownPct}%</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Ordem Máx</span>
                <span className="text-slate-200 font-bold">${robot.riskLimits.maxOrderSizeUSD}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Slippage Máx</span>
                <span className="text-slate-200 font-bold">{robot.riskLimits.maxSlippagePct}%</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Liquidez Mín</span>
                <span className="text-slate-200 font-bold">${(robot.riskLimits.minLiquidityUSD / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </div>

          {/* Decision History Log */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              Histórico Verificável de Decisões do Robô
            </h4>
            <div className="space-y-2">
              {robot.decisionHistory.map((dec) => (
                <div key={dec.id} className="p-3 bg-slate-950/80 rounded border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-300 font-mono">{dec.action}</span>
                      <span className="text-slate-400">@ ${dec.price.toFixed(2)}</span>
                    </div>
                    <span className="text-slate-500 font-mono text-[10px]">{dec.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{dec.reason}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                    <span className="text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      Confiança: {(dec.confidence * 100).toFixed(0)}%
                    </span>
                    <span className="text-rose-400 bg-rose-950/30 px-1.5 py-0.5 rounded border border-rose-900/50">
                      Invalidação: {dec.invalidationCriteria}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              soundFx.playPowerup();
              onTriggerAnalysis(robot.id);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-sm"
          >
            <Activity className="w-3.5 h-3.5" />
            Executar Ciclo de Análise Imediata
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
          >
            Fechar Monitor
          </button>
        </div>
      </div>
    </div>
  );
};
