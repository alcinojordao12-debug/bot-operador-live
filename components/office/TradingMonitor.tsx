'use client';

import React from 'react';
import { TradingRobot } from '@/lib/types';
import { formatUSD } from '@/lib/utils';
import { Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

interface TradingMonitorProps {
  robot: TradingRobot;
  livePrice?: number;
  onClick: (robot: TradingRobot) => void;
  isSelected?: boolean;
}

export const TradingMonitor: React.FC<TradingMonitorProps> = ({
  robot,
  livePrice,
  onClick,
  isSelected,
}) => {
  const displayPrice = livePrice || robot.currentPosition?.currentPrice || 0;

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'BUY':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'SELL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'HOLD':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'BLOCKED':
        return 'bg-red-950 text-red-400 border-red-700/60 animate-pulse';
      case 'EXIT':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div
      onClick={() => onClick(robot)}
      className={`group relative p-2.5 rounded-lg border-2 cursor-pointer transition-all duration-150 select-none ${
        isSelected
          ? 'border-amber-400 bg-slate-900/95 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]'
          : 'border-slate-800 hover:border-slate-700 bg-slate-950/90 hover:bg-slate-900/90'
      }`}
    >
      {/* CRT Top Bar with Retro Status Screws */}
      <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-pixel text-amber-400 truncate tracking-tight">
            R-{robot.number} {robot.assignedAsset.split('/')[0]}
          </span>
        </div>
        <span
          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${getDecisionBadge(
            robot.currentDecision
          )}`}
        >
          {robot.currentDecision}
        </span>
      </div>

      {/* Screen Area (Green/Amber CRT Phosphor Style) */}
      <div className="bg-slate-900/80 rounded border border-slate-800 p-2 font-mono">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-slate-400 truncate">{robot.assignedAsset}</span>
          <span className="text-xs font-bold text-slate-100 tabular-nums">
            {displayPrice > 0 ? (
              `$${formatUSD(displayPrice, 2, 8)}`
            ) : (
              <span className="text-slate-500 text-[10px]">DADOS N/D</span>
            )}
          </span>
        </div>

        {/* Mini Status Grid */}
        <div className="mt-1.5 grid grid-cols-2 gap-1 text-[10px]">
          <div className="bg-slate-950/70 p-1 rounded border border-slate-800/60">
            <span className="text-slate-500 block text-[9px]">Posição (Sim)</span>
            <span className="font-semibold text-slate-300">
              {robot.currentPosition ? (
                <span className={robot.currentPosition.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {robot.currentPosition.side} ({robot.currentPosition.pnlPercent > 0 ? '+' : ''}
                  {robot.currentPosition.pnlPercent.toFixed(1)}%)
                </span>
              ) : (
                <span className="text-slate-500">NEUTRO</span>
              )}
            </span>
          </div>
          <div className="bg-slate-950/70 p-1 rounded border border-slate-800/60">
            <span className="text-slate-500 block text-[9px]">Risco Máx</span>
            <span className="text-slate-300 tabular-nums">
              DD {robot.riskLimits.maxDrawdownPct}%
            </span>
          </div>
        </div>

        {/* Simulated vs Real notice footer */}
        <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-800/50 pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5 text-cyan-400" />
            <span className="text-slate-400">Paper Trading</span>
          </span>
          <span className="text-amber-500/80 font-bold">WR {robot.simulatedResults.winRate}%</span>
        </div>
      </div>
    </div>
  );
};
