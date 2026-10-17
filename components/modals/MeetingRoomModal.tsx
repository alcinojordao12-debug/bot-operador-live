'use client';

import React, { useState } from 'react';
import { soundFx } from '@/lib/audio';
import {
  X,
  Users,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldCheck,
  Cpu,
  TrendingUp,
  Brain,
  Scale,
} from 'lucide-react';

interface MeetingRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeetingRoomModal: React.FC<MeetingRoomModalProps> = ({ isOpen, onClose }) => {
  const [selectedAsset, setSelectedAsset] = useState('SOL/USDT');
  const [meetingStep, setMeetingStep] = useState<number>(0);
  const [isMeetingRunning, setIsMeetingRunning] = useState<boolean>(false);

  if (!isOpen) return null;

  const meetingSteps = [
    {
      agent: 'Robo-Market Lead',
      dept: 'Análise de Mercado',
      action: 'Análise de Liquidez & Livro de Ordens',
      report: `Profundidade de liquidez em ${selectedAsset} verificada em $4.6M. Rácio Buy/Sell favorável a 1.42. Spreads dentro dos limites operacionais tolerados.`,
      status: 'VERIFICADO',
      color: '#06b6d4',
    },
    {
      agent: 'Robo-Chartist Prime',
      dept: 'Análise Técnica',
      action: 'Avaliação de Confluências e Timeframes',
      report: `EMA 20 cruzou acima da EMA 50 em 4h. RSI estabilizado em 56.4 (sem sobrecompra). Suporte crítico identificado em nível anterior de resistência.`,
      status: 'BULLISH',
      color: '#10b981',
    },
    {
      agent: 'Robo-Intel Overseer',
      dept: 'Investigação e Inteligência',
      action: 'Auditoria On-Chain & Risco de Contrato',
      report: `Contrato auditado sem risco de freeze/mint authority. Nenhuma movimentação incomum de insiders detectada nas últimas 6 horas.`,
      status: 'SEGURO',
      color: '#8b5cf6',
    },
    {
      agent: 'Robo-Quant Master',
      dept: 'Estratégias Quantitativas',
      action: 'Modelagem de Breakout & Desconto de Custos',
      report: `Backtest histórico validou taxa de acerto de 64% com Sharpe de 1.94. Slippage estimado descontado em 0.08% por trade.`,
      status: 'APROVADO',
      color: '#3b82f6',
    },
    {
      agent: 'Robo-Risk Sentinel',
      dept: 'Gestão de Risco',
      action: 'Cálculo de Exposição e Autorização',
      report: `Exposição do ativo fixada em no máximo 5.0% da carteira. Stop Loss obrigatório estabelecido a -2.2%. Sem violação do limite diário.`,
      status: 'SINAL VERDE',
      color: '#ef4444',
    },
    {
      agent: 'Robo-Diretor Alpha',
      dept: 'Direção e Coordenação',
      action: 'Síntese Executiva & Recomendação Final',
      report: `Consenso estabelecido entre os 5 departamentos. Proposta aprovada para simulação controlada em PAPER TRADING. Nenhuma ordem real autorizada sem confirmação humana.`,
      status: 'CONSENSO ATINGIDO',
      color: '#eab308',
    },
  ];

  const handleStartMeeting = () => {
    soundFx.playPowerup();
    setIsMeetingRunning(true);
    setMeetingStep(1);

    // Simulate step progression
    const interval = setInterval(() => {
      setMeetingStep((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          setIsMeetingRunning(false);
          soundFx.playCoin();
          return 6;
        }
        soundFx.playBlip(500 + prev * 80);
        return prev + 1;
      });
    }, 1200);
  };

  const handleResetMeeting = () => {
    soundFx.playWarp();
    setMeetingStep(0);
    setIsMeetingRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-pixel tracking-tight">
                SALA DE REUNIÕES DIGITAL
              </h3>
              <p className="text-xs text-slate-400">
                Debate Coletivo de Decisão com Contribuição dos Especialistas
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

        {/* Meeting Controls Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Pauta da Reunião (Ativo):</span>
            <select
              value={selectedAsset}
              disabled={isMeetingRunning}
              onChange={(e) => {
                soundFx.playBlip(500);
                setSelectedAsset(e.target.value);
                setMeetingStep(0);
              }}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
            >
              <option value="BTC/USDT">BTC/USDT (Bitcoin)</option>
              <option value="ETH/USDT">ETH/USDT (Ethereum)</option>
              <option value="SOL/USDT">SOL/USDT (Solana)</option>
              <option value="LINK/USDT">LINK/USDT (Chainlink)</option>
              <option value="PEPE/USDT">PEPE/USDT (Pepe Meme)</option>
              <option value="SUI/USDT">SUI/USDT (Sui Network)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {meetingStep === 0 ? (
              <button
                onClick={handleStartMeeting}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-sm"
              >
                <Play className="w-3.5 h-3.5" />
                Iniciar Reunião dos Supervisores
              </button>
            ) : (
              <button
                onClick={handleResetMeeting}
                disabled={isMeetingRunning}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                Nova Reunião
              </button>
            )}
          </div>
        </div>

        {/* Meeting Progression Flow */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {meetingStep === 0 && (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/40 rounded-lg border border-slate-800">
              <Users className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-60" />
              <p className="font-semibold text-slate-300">
                A mesa de reuniões aguarda o início da deliberação sobre {selectedAsset}.
              </p>
              <p className="text-slate-500 mt-1 max-w-md mx-auto">
                Ao iniciar, cada departamento apresentará seu parecer técnico sequencialmente até a homologação da Direção e Gestão de Risco.
              </p>
            </div>
          )}

          {meetingSteps.slice(0, meetingStep).map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800 animate-in slide-in-from-top-2 duration-200"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    style={{ backgroundColor: step.color }}
                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                  />
                  <span className="text-xs font-bold text-slate-200">{step.agent}</span>
                  <span className="text-[10px] text-slate-400">({step.dept})</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-700 text-emerald-400">
                  {step.status}
                </span>
              </div>
              <div className="text-xs font-semibold text-amber-400 mb-1">{step.action}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{step.report}</p>
            </div>
          ))}

          {meetingStep === 6 && (
            <div className="p-4 bg-emerald-950/40 rounded-lg border border-emerald-700/60 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold mb-1 font-pixel text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                DELIBERAÇÃO CONCLUÍDA — ORDEM SIMULADA HABILITADA
              </div>
              <p className="text-slate-300 mt-1">
                A estratégia foi arquivada na Memória Coletiva sob o identificador{' '}
                <span className="font-mono text-cyan-300">CONS-{selectedAsset.replace('/', '')}-20261016</span>.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Decisão Final: Exige Veto Zero da Gestão de Risco</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Fechar Sala
          </button>
        </div>
      </div>
    </div>
  );
};
