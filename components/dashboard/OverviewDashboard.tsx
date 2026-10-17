'use client';

import React from 'react';
import { Department, CryptoMarketAsset, TradingRobot, TaskItem } from '@/lib/types';
import { soundFx } from '@/lib/audio';
import { formatUSD } from '@/lib/utils';
import {
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface OverviewDashboardProps {
  departments: Department[];
  marketAssets: CryptoMarketAsset[];
  tradingRobots: TradingRobot[];
  tasks: TaskItem[];
  onOpenOfficeRoom: (roomId: string) => void;
  onOpenMeetingRoom: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  departments,
  marketAssets,
  tradingRobots,
  tasks,
  onOpenOfficeRoom,
  onOpenMeetingRoom,
}) => {
  const completedTasks = tasks.filter((t) => t.status === 'CONCLUÍDA').length;

  return (
    <div className="space-y-6">
      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Agentes Robôs</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-pixel text-slate-100">30</div>
          <div className="text-[11px] text-slate-400 mt-1">8 Departamentos Ativos</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Robôs Traders</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-pixel text-emerald-400">8</div>
          <div className="text-[11px] text-slate-400 mt-1">Sala de Trading Própria</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Modo Operacional</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold font-pixel text-cyan-300 mt-1">PAPER TRADING</div>
          <div className="text-[11px] text-slate-400 mt-1">Fundos Reais Bloqueados</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Exposição Total</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-pixel text-amber-400">14.2%</div>
          <div className="text-[11px] text-slate-400 mt-1">Teto Máximo: 30.0%</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Tarefas Concluídas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-pixel text-slate-100">
            {completedTasks}/{tasks.length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">100% Verificável</div>
        </div>
      </div>

      {/* Live Market Assets Strip */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold font-pixel text-slate-200">
              COTAÇÕES DE MERCADO EM TEMPO REAL
            </h3>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {marketAssets[0]?.dataQuality || 'DADOS AO VIVO'} · Fonte:{' '}
            {marketAssets[0]?.source || 'BINANCE'}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {marketAssets.map((asset) => (
            <div
              key={asset.symbol}
              className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs"
            >
              <div className="text-[10px] text-slate-400 font-medium truncate">{asset.symbol}</div>
              <div className="text-xs font-bold text-slate-100 font-mono mt-0.5">
                ${formatUSD(asset.price, 2, 7)}
              </div>
              <div
                className={`text-[10px] font-mono font-semibold flex items-center gap-0.5 mt-0.5 ${
                  asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {asset.change24h >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                <span>{asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Departments Overview Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold font-pixel text-slate-200">
            ESTRUTURA DOS 8 DEPARTAMENTOS DA EMPRESA
          </h3>
          <span className="text-xs text-slate-500 font-mono">30 Agentes Robôs Alocados</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    style={{ backgroundColor: dept.color }}
                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                  />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {dept.agentCount} Robôs
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 font-pixel mb-1">{dept.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {dept.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                  {dept.supervisorName}
                </span>
                <button
                  onClick={() => {
                    soundFx.playWarp();
                    onOpenOfficeRoom(dept.code.toLowerCase());
                  }}
                  className="text-amber-400 hover:text-amber-300 font-bold text-[10px] font-pixel"
                >
                  VER SALA →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
