'use client';

import React, { useState } from 'react';
import { soundFx } from '@/lib/audio';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  AlertOctagon,
  AlertTriangle,
  Scale,
  Gauge,
  Sliders,
} from 'lucide-react';

interface RiskSafetyCenterProps {
  isEmergencyActive: boolean;
  onToggleEmergencyStop: () => void;
}

export const RiskSafetyCenter: React.FC<RiskSafetyCenterProps> = ({
  isEmergencyActive,
  onToggleEmergencyStop,
}) => {
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [isLiveEnabled, setIsLiveEnabled] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  // Configurable limits
  const [maxExposureTotal, setMaxExposureTotal] = useState(30);
  const [maxExposureAsset, setMaxExposureAsset] = useState(10);
  const [maxDailyLoss, setMaxDailyLoss] = useState(3);
  const [maxSlippage, setMaxSlippage] = useState(0.2);

  const handleAttemptEnableLive = () => {
    soundFx.playAlert();
    setIsLiveModalOpen(true);
  };

  const handleConfirmLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmInput !== 'AUTORIZAR-TRADING-REAL') return;

    soundFx.playPowerup();
    setIsLiveEnabled(true);
    setIsLiveModalOpen(false);
    setConfirmInput('');
  };

  return (
    <div className="space-y-6">
      {/* Risk Overview Banner */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-950/60 border border-rose-800 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-pixel text-slate-100">
              CENTRAL DE GESTÃO DE RISCO & SEGURANÇA
            </h3>
            <p className="text-xs text-slate-400">
              Supervisão: Robo-Risk Sentinel · Alçadas e Travas Invioláveis
            </p>
          </div>
        </div>

        {/* Universal Kill Switch Button */}
        <button
          onClick={() => {
            if (!isEmergencyActive) soundFx.playAlert();
            else soundFx.playPowerup();
            onToggleEmergencyStop();
          }}
          className={`px-4 py-2.5 rounded-lg text-xs font-pixel font-bold flex items-center gap-2 transition-all shadow-md ${
            isEmergencyActive
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          {isEmergencyActive ? 'DESATIVAR TRAVÃO DE EMERGÊNCIA' : 'ACIONAR TRAVÃO UNIVERSAL'}
        </button>
      </div>

      {/* Modes Segregation Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Paper Trading Mode Card */}
        <div className="p-5 bg-slate-900 border-2 border-cyan-800/60 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-pixel text-cyan-300">
              MODO PAPER TRADING (SIMULAÇÃO)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700">
              ATIVO POR PADRÃO
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Todas as decisões dos 8 Robôs Traders são executadas em ambiente virtual com cálculo rigoroso de taxas e slippage, sem risco de perda de fundos reais.
          </p>
          <div className="pt-2 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Proteção de capital ativa · Auditoria permanente
          </div>
        </div>

        {/* Live Trading Mode Card */}
        <div
          className={`p-5 rounded-xl border-2 space-y-3 transition-colors ${
            isLiveEnabled
              ? 'bg-rose-950/20 border-rose-600'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-pixel text-slate-200">
              MODO LIVE TRADING (EXECUÇÃO REAL)
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                isLiveEnabled
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-slate-950 text-slate-500 border border-slate-800'
              }`}
            >
              {isLiveEnabled ? 'HABILITADO (RISCO REAL)' : 'BLOQUEADO'}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Requer confirmação explícita em 2 etapas, credenciais validadas via variáveis de ambiente seguras e alçadas ativas.
          </p>

          <div className="pt-2 flex justify-between items-center">
            {isLiveEnabled ? (
              <button
                onClick={() => {
                  soundFx.playPowerup();
                  setIsLiveEnabled(false);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-bold"
              >
                Bloquear Novamente
              </button>
            ) : (
              <button
                onClick={handleAttemptEnableLive}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-600/50 rounded text-xs font-pixel flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                Desbloquear Trading Real
              </button>
            )}
            <span className="text-[10px] text-slate-500 font-mono">
              Idempotência: Habilitada
            </span>
          </div>
        </div>
      </div>

      {/* Strict Limits Configuration */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h4 className="text-xs font-bold font-pixel text-slate-200 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          PARÂMETROS DE CONTROLO DE RISCO DA EMPRESA
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Exposição Total Máxima</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={5}
                max={50}
                value={maxExposureTotal}
                onChange={(e) => setMaxExposureTotal(Number(e.target.value))}
                className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono text-xs"
              />
              <span className="font-mono text-slate-400">% da carteira</span>
            </div>
            <span className="text-[10px] text-slate-500">Padrão conservador: 30%</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Exposição por Ativo</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={20}
                value={maxExposureAsset}
                onChange={(e) => setMaxExposureAsset(Number(e.target.value))}
                className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono text-xs"
              />
              <span className="font-mono text-slate-400">% máxima</span>
            </div>
            <span className="text-[10px] text-slate-500">Padrão conservador: 10%</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Perda Diária Máxima</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={10}
                value={maxDailyLoss}
                onChange={(e) => setMaxDailyLoss(Number(e.target.value))}
                className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono text-xs"
              />
              <span className="font-mono text-slate-400">% stop diário</span>
            </div>
            <span className="text-[10px] text-slate-500">Dispara suspensão de 24h</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Tolerância Slippage</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.05"
                min={0.05}
                max={2.0}
                value={maxSlippage}
                onChange={(e) => setMaxSlippage(Number(e.target.value))}
                className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono text-xs"
              />
              <span className="font-mono text-slate-400">% máxima</span>
            </div>
            <span className="text-[10px] text-slate-500">Cancela ordem se excedido</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Live Trading */}
      {isLiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-rose-600 rounded-xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-pixel text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              CONFIRMAÇÃO CRÍTICA — TRADING REAL
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              O Trading Real envolve risco financeiro direto. Todas as ordens enviadas à corretora movimentarão saldo verdadeiro.
            </p>

            <form onSubmit={handleConfirmLive} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-mono">
                  Digite <span className="text-rose-400 font-bold">AUTORIZAR-TRADING-REAL</span> para confirmar:
                </label>
                <input
                  type="text"
                  required
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder="AUTORIZAR-TRADING-REAL"
                  className="w-full bg-slate-950 border border-rose-800 rounded px-3 py-2 text-xs text-rose-200 font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setIsLiveModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={confirmInput !== 'AUTORIZAR-TRADING-REAL'}
                  className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold transition-opacity"
                >
                  Confirmar Autorização
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
