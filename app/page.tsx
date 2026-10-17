'use client';

import React, { useState, useEffect } from 'react';
import {
  AgentRobot,
  TradingRobot,
  Department,
  TaskItem,
  CollectiveMemoryReport,
  AuditPhase,
  CryptoMarketAsset,
} from '@/lib/types';
import { DEPARTMENTS } from '@/lib/data/departments';
import { AGENT_ROBOTS } from '@/lib/data/agents';
import { TRADING_ROBOTS } from '@/lib/data/tradingRobots';
import { INITIAL_TASKS } from '@/lib/data/tasks';
import { COLLECTIVE_MEMORY_REPORTS } from '@/lib/data/initialMemory';
import { IMPLEMENTATION_PHASES } from '@/lib/data/phases';
import { soundFx } from '@/lib/audio';

import dynamic from 'next/dynamic';
import { HeaderNav } from '@/components/dashboard/HeaderNav';

const OfficeScene3D = dynamic(
  () => import('@/components/office3d/OfficeScene3D'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[660px] md:h-[740px] bg-slate-950 border-2 border-slate-800 rounded-xl flex items-center justify-center font-pixel text-xs text-amber-400">
        CARREGANDO SALA DE TRADING 3D...
      </div>
    ),
  }
);
import { OfficeCanvas2D } from '@/components/office/OfficeCanvas2D';
import { LivingOfficeEngine } from '@/components/simulation/LivingOfficeEngine';
import { PixelAgentsOfficeEngine } from '@/components/pixeloffice/PixelAgentsOfficeEngine';
import { OverviewDashboard } from '@/components/dashboard/OverviewDashboard';
import { TasksManager } from '@/components/dashboard/TasksManager';
import { MemoryCollective } from '@/components/dashboard/MemoryCollective';
import { RiskSafetyCenter } from '@/components/dashboard/RiskSafetyCenter';
import { ProgressAuditor } from '@/components/dashboard/ProgressAuditor';

import { AgentProfileModal } from '@/components/modals/AgentProfileModal';
import { TradingRobotModal } from '@/components/modals/TradingRobotModal';
import { MeetingRoomModal } from '@/components/modals/MeetingRoomModal';
import { EmergencyStopModal } from '@/components/modals/EmergencyStopModal';
import { OpenCodeExportModal } from '@/components/modals/OpenCodeExportModal';
import { Box, Layers, Sparkles, Gamepad2 } from 'lucide-react';


export default function HumanoBotApp() {
  // Application Data States
  const [agents, setAgents] = useState<AgentRobot[]>(AGENT_ROBOTS);
  const [tradingRobots, setTradingRobots] = useState<TradingRobot[]>(TRADING_ROBOTS);
  const [departments] = useState<Department[]>(DEPARTMENTS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [reports, setReports] = useState<CollectiveMemoryReport[]>(COLLECTIVE_MEMORY_REPORTS);
  const [phases] = useState<AuditPhase[]>(IMPLEMENTATION_PHASES);

  // Market Asset Prices (Live / Cached API data)
  const [marketAssets, setMarketAssets] = useState<CryptoMarketAsset[]>([
    {
      symbol: 'BTC/USDT',
      name: 'Bitcoin',
      price: 67950.0,
      change24h: 2.45,
      high24h: 68420.0,
      low24h: 66200.0,
      volume24h: 31200000000,
      lastUpdated: '2026-10-16 16:20:00',
      source: 'BINANCE_API',
      dataQuality: 'DADOS AO VIVO',
    },
    {
      symbol: 'ETH/USDT',
      name: 'Ethereum',
      price: 2542.8,
      change24h: 1.15,
      high24h: 2590.0,
      low24h: 2495.0,
      volume24h: 14800000000,
      lastUpdated: '2026-10-16 16:20:00',
      source: 'BINANCE_API',
      dataQuality: 'DADOS AO VIVO',
    },
    {
      symbol: 'SOL/USDT',
      name: 'Solana',
      price: 158.8,
      change24h: 4.82,
      high24h: 161.4,
      low24h: 150.2,
      volume24h: 4600000000,
      lastUpdated: '2026-10-16 16:20:00',
      source: 'BINANCE_API',
      dataQuality: 'DADOS AO VIVO',
    },
    {
      symbol: 'LINK/USDT',
      name: 'Chainlink',
      price: 11.45,
      change24h: -0.65,
      high24h: 11.9,
      low24h: 11.1,
      volume24h: 320000000,
      lastUpdated: '2026-10-16 16:20:00',
      source: 'BINANCE_API',
      dataQuality: 'DADOS AO VIVO',
    },
    {
      symbol: 'PEPE/USDT',
      name: 'Pepe',
      price: 0.00001042,
      change24h: 6.85,
      high24h: 0.00001095,
      low24h: 0.00000965,
      volume24h: 1150000000,
      lastUpdated: '2026-10-16 16:20:00',
      source: 'BINANCE_API',
      dataQuality: 'DADOS AO VIVO',
    },
    {
      symbol: 'DOGE/USDT',
      name: 'Dogecoin',
      price: 0.128,
      change24h: 3.12,
      high24h: 0.134,
      low24h: 0.122,
      volume24h: 980000000,
      lastUpdated: '2026-10-16 16:20:00',
      source: 'BINANCE_API',
      dataQuality: 'DADOS AO VIVO',
    },
    {
      symbol: 'SUI/USDT',
      name: 'Sui',
      price: 2.14,
      change24h: 5.4,
      high24h: 2.22,
      low24h: 1.98,
      volume24h: 670000000,
      lastUpdated: '2026-10-16 16:20:00',
      source: 'BINANCE_API',
      dataQuality: 'DADOS AO VIVO',
    },
    {
      symbol: 'NEAR/USDT',
      name: 'NEAR Protocol',
      price: 4.88,
      change24h: 1.8,
      high24h: 5.05,
      low24h: 4.7,
      volume24h: 410000000,
      lastUpdated: '2026-10-16 16:20:00',
      source: 'BINANCE_API',
      dataQuality: 'DADOS AO VIVO',
    },
  ]);

  // UI Navigation - Defaults to Pixel Agents HQ (Visualizador Oficial)
  const [currentTab, setCurrentTab] = useState<string>('pixel');


  // Modals state
  const [selectedAgent, setSelectedAgent] = useState<AgentRobot | null>(null);
  const [selectedTradingRobot, setSelectedTradingRobot] = useState<TradingRobot | null>(null);
  const [isMeetingRoomOpen, setIsMeetingRoomOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isOpenCodeModalOpen, setIsOpenCodeModalOpen] = useState<boolean>(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);

  // Fetch real market rates
  useEffect(() => {
    let isMounted = true;
    const fetchMarketRates = async () => {
      try {
        const res = await fetch('/api/market');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.assets && data.assets.length > 0) {
            setMarketAssets(data.assets);
          }
        }
      } catch {
        // Keep fallback
      }
    };

    fetchMarketRates();
    const interval = setInterval(fetchMarketRates, 15000); // 15s refresh
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Update Agent Visor / Status
  const handleUpdateAgent = (updated: AgentRobot) => {
    setAgents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelectedAgent(updated);
  };

  // Add Task
  const handleAddTask = (task: TaskItem) => {
    setTasks((prev) => [task, ...prev]);
  };

  // Update Task Status
  const handleUpdateTaskStatus = (taskId: string, status: TaskItem['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status, completedAt: new Date().toISOString() } : t))
    );
  };

  // Trigger Trading Robot Analysis
  const handleTriggerAnalysis = (robotId: string) => {
    setTradingRobots((prev) =>
      prev.map((r) => {
        if (r.id === robotId) {
          const decisions = ['BUY', 'HOLD', 'NO_TRADE', 'EXIT'] as const;
          const randomDecision = decisions[Math.floor(Math.random() * decisions.length)];
          return {
            ...r,
            currentDecision: randomDecision,
            lastUpdate: new Date().toISOString().replace('T', ' ').substring(0, 19),
            decisionHistory: [
              {
                id: `dec-${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                action: randomDecision,
                asset: r.assignedAsset,
                price: r.currentPosition?.currentPrice || 100,
                reason: 'Análise imediata executada via comando operacional do operador.',
                confidence: 0.9,
                risksIdentified: ['Monitorização contínua de volatilidade local'],
                invalidationCriteria: 'Ruptura da média móvel em timeframe de 15m',
                authorizationState: 'APPROVED',
              },
              ...r.decisionHistory,
            ],
          };
        }
        return r;
      })
    );
  };

  // Toggle Emergency Stop
  const handleToggleEmergencyStop = () => {
    setIsEmergencyActive((prev) => !prev);
    setIsEmergencyModalOpen(false);
  };

  const selectedAgentDept = departments.find((d) => d.id === selectedAgent?.departmentId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar Contract */}
      <HeaderNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenOpenCodeModal={() => setIsOpenCodeModalOpen(true)}
        isEmergencyActive={isEmergencyActive}
      />

      {/* Emergency Active Banner */}
      {isEmergencyActive && (
        <div className="bg-rose-950 border-b border-rose-800 px-6 py-2 text-rose-200 text-xs font-mono font-bold flex items-center justify-between">
          <span>
            ⚠️ TRAVÃO DE EMERGÊNCIA ATIVADO: TODAS AS EXECUÇÕES FINANCEIRAS ESTÃO PARALISADAS.
          </span>
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="underline hover:text-white"
          >
            Ver Detalhes do Travão
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-5">
        {/* TAB 0: PIXEL AGENTS HQ (Visualizador Oficial - Canvas, Editor de Layout, Pets, Ghosts, Balões, Context Gauge) */}
        {currentTab === 'pixel' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-pixel text-slate-100 tracking-tight flex items-center gap-2">
                  <span className="text-amber-400">PIXEL AGENTS HQ</span> · VISUALIZADOR OFICIAL
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Arquitetura Pixel Agents V1.5 · Canvas com Editor de Layout em Tempo Real, Sub-Agents Ghost, 4 Pets Interativos, Gauges de Contexto LLM (200k) e Feed JSONL
                </p>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                <button
                  onClick={() => soundFx.playBlip(700)}
                  className="px-3 py-1.5 rounded-md text-xs font-pixel font-bold bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1.5"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Pixel Agents HQ</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playWarp();
                    setCurrentTab('living');
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>🏢 Escritório 2.5D</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playWarp();
                    setCurrentTab('office3d');
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Modo 3D</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playWarp();
                    setCurrentTab('office');
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Planta 2D</span>
                </button>
              </div>
            </div>

            {/* Master Pixel Agents Engine */}
            <PixelAgentsOfficeEngine
              agents={agents}
              tradingRobots={tradingRobots}
              departments={departments}
              marketAssets={marketAssets}
              onSelectAgent={(agent) => {
                soundFx.playBlip(750);
                setSelectedAgent(agent);
              }}
              onSelectTradingRobot={(robot) => {
                soundFx.playCoin();
                setSelectedTradingRobot(robot);
              }}
              onOpenMeetingRoom={() => setIsMeetingRoomOpen(true)}
              onTriggerEmergencyModal={() => setIsEmergencyModalOpen(true)}
              selectedAgentId={selectedAgent?.id}
              selectedTradingRobotId={selectedTradingRobot?.id}
            />
          </div>
        )}

        {/* TAB 1: ESCRITÓRIO VIVO 2.5D (Rotinas Reais Autónomas - Bebedouro, Banheiro, Café, CEO) */}
        {currentTab === 'living' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-pixel text-slate-100 tracking-tight flex items-center gap-2">
                  <span className="text-amber-400">ESCRITÓRIO 2.5D</span> · ROTINAS REAIS AUTÓNOMAS
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Gráfico Realista & Leve · Robôs circulam pela empresa para beber água, ir à casa de banho, tomar café · CEO inspeciona todos os departamentos
                </p>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                <button
                  onClick={() => {
                    soundFx.playWarp();
                    setCurrentTab('pixel');
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Pixel Agents HQ</span>
                </button>
                <button
                  onClick={() => soundFx.playBlip(700)}
                  className="px-3 py-1.5 rounded-md text-xs font-pixel font-bold bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1.5"
                >
                  <span>🏢 Escritório 2.5D</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playWarp();
                    setCurrentTab('office3d');
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Modo 3D</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playWarp();
                    setCurrentTab('office');
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Planta 2D</span>
                </button>
              </div>
            </div>


            {/* Living Office Simulation Engine */}
            <LivingOfficeEngine
              agents={agents}
              tradingRobots={tradingRobots}
              departments={departments}
              marketAssets={marketAssets}
              onSelectAgent={(agent) => {
                soundFx.playBlip(750);
                setSelectedAgent(agent);
              }}
              onSelectTradingRobot={(robot) => {
                soundFx.playCoin();
                setSelectedTradingRobot(robot);
              }}
              onOpenMeetingRoom={() => setIsMeetingRoomOpen(true)}
              onTriggerEmergencyModal={() => setIsEmergencyModalOpen(true)}
              selectedAgentId={selectedAgent?.id}
              selectedTradingRobotId={selectedTradingRobot?.id}
            />
          </div>
        )}

        {/* TAB 1: ESCRITÓRIO 3D INTERATIVO (Super Mario RPG Style) */}
        {currentTab === 'office3d' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-pixel text-slate-100 tracking-tight">
                  ESCRITÓRIO 3D INTERATIVO · HUMANO BOT HQ
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Ambiente tridimensional completo · Estilo Super Mario RPG · 30 Robôs com Visores 3D · 8 Robôs Traders
                </p>
              </div>

              {/* View Mode Switcher: Living vs 3D vs 2D */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                <button
                  onClick={() => {
                    soundFx.playCoin();
                    setCurrentTab('living');
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>🏢 Escritório Vivo</span>
                </button>
                <button
                  onClick={() => soundFx.playBlip(700)}
                  className="px-3 py-1.5 rounded-md text-xs font-pixel font-bold bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1.5"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>3D Ativo</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playWarp();
                    setCurrentTab('office');
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Planta 2D</span>
                </button>
              </div>
            </div>

            {/* 3D Scene */}
            <OfficeScene3D
              agents={agents}
              tradingRobots={tradingRobots}
              departments={departments}
              marketAssets={marketAssets}
              onSelectAgent={(agent) => {
                soundFx.playBlip(750);
                setSelectedAgent(agent);
              }}
              onSelectTradingRobot={(robot) => {
                soundFx.playCoin();
                setSelectedTradingRobot(robot);
              }}
              onOpenMeetingRoom={() => setIsMeetingRoomOpen(true)}
              onTriggerEmergencyModal={() => setIsEmergencyModalOpen(true)}
              selectedAgentId={selectedAgent?.id}
              selectedTradingRobotId={selectedTradingRobot?.id}
            />
          </div>
        )}

        {/* TAB 2: PLANTA 2D DO ESCRITÓRIO */}
        {currentTab === 'office' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold font-pixel text-slate-100 tracking-tight">
                  PLANTA DO ESCRITÓRIO 2D VISTO DE CIMA
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  12 Salas Interativas · 30 Agentes Robôs com Visores na Cabeça · 8 Robôs Traders com Monitores CRT
                </p>
              </div>

              {/* View Mode Switcher: Living vs 3D vs 2D */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                <button
                  onClick={() => {
                    soundFx.playCoin();
                    setCurrentTab('living');
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>🏢 Escritório Vivo</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playWarp();
                    setCurrentTab('office3d');
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Modo 3D</span>
                </button>
                <button
                  onClick={() => soundFx.playBlip(700)}
                  className="px-3 py-1.5 rounded-md text-xs font-pixel font-bold bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>2D Ativo</span>
                </button>
              </div>
            </div>

            {/* 2D Office Canvas */}
            <OfficeCanvas2D
              agents={agents}
              tradingRobots={tradingRobots}
              departments={departments}
              marketAssets={marketAssets}
              onSelectAgent={(agent) => {
                soundFx.playBlip(750);
                setSelectedAgent(agent);
              }}
              onSelectTradingRobot={(robot) => {
                soundFx.playCoin();
                setSelectedTradingRobot(robot);
              }}
              onOpenMeetingRoom={() => setIsMeetingRoomOpen(true)}
              onTriggerEmergencyModal={() => setIsEmergencyModalOpen(true)}
              selectedAgentId={selectedAgent?.id}
              selectedTradingRobotId={selectedTradingRobot?.id}
            />
          </div>
        )}

        {/* TAB 3: Dashboard Geral da Empresa */}
        {currentTab === 'dashboard' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-pixel text-slate-100 tracking-tight">
                PAINEL PRINCIPAL DA EMPRESA
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Estatísticas operacionais, cotações em tempo real e estrutura dos 8 departamentos
              </p>
            </div>

            <OverviewDashboard
              departments={departments}
              marketAssets={marketAssets}
              tradingRobots={tradingRobots}
              tasks={tasks}
              onOpenOfficeRoom={(roomId) => {
                setCurrentTab('office3d');
              }}
              onOpenMeetingRoom={() => setIsMeetingRoomOpen(true)}
            />
          </div>
        )}

        {/* TAB 4: Gestão de Tarefas */}
        {currentTab === 'tasks' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-pixel text-slate-100 tracking-tight">
                TAREFAS & AUTOMAÇÃO DOS ROBÔS
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Rastreabilidade ponta a ponta: do planejamento à evidência verificável
              </p>
            </div>

            <TasksManager
              tasks={tasks}
              departments={departments}
              agents={agents}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          </div>
        )}

        {/* TAB 5: Memória Coletiva */}
        {currentTab === 'memory' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-pixel text-slate-100 tracking-tight">
                MEMÓRIA COLETIVA & CONHECIMENTO
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Relatórios departamentais, estratégias aprovadas/rejeitadas e heurísticas persistentes
              </p>
            </div>

            <MemoryCollective reports={reports} />
          </div>
        )}

        {/* TAB 6: Gestão de Risco & Segurança */}
        {currentTab === 'risk' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-pixel text-slate-100 tracking-tight">
                GESTÃO DE RISCO & SEGURANÇA
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Limites de exposição, drawdown máximo, travão de emergência e controles de trading real
              </p>
            </div>

            <RiskSafetyCenter
              isEmergencyActive={isEmergencyActive}
              onToggleEmergencyStop={handleToggleEmergencyStop}
            />
          </div>
        )}

        {/* TAB 7: Auditoria das 18 Fases */}
        {currentTab === 'audit' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-pixel text-slate-100 tracking-tight">
                AUDITORIA DE IMPLEMENTAÇÃO
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Progresso detalhado das 18 fases obrigatórias com evidências de código verificáveis
              </p>
            </div>

            <ProgressAuditor phases={phases} />
          </div>
        )}
      </main>

      {/* Modal 1: Ficha Individual do Trabalhador (Robot Profile) */}
      <AgentProfileModal
        agent={selectedAgent}
        department={selectedAgentDept}
        onClose={() => setSelectedAgent(null)}
        onUpdateAgent={handleUpdateAgent}
      />

      {/* Modal 2: Monitor CRT do Robô Trader */}
      <TradingRobotModal
        robot={selectedTradingRobot}
        livePrice={
          selectedTradingRobot
            ? marketAssets.find((m) => m.symbol === selectedTradingRobot.assignedAsset)?.price
            : undefined
        }
        onClose={() => setSelectedTradingRobot(null)}
        onTriggerAnalysis={handleTriggerAnalysis}
      />

      {/* Modal 3: Sala de Reuniões Digital */}
      <MeetingRoomModal
        isOpen={isMeetingRoomOpen}
        onClose={() => setIsMeetingRoomOpen(false)}
      />

      {/* Modal 4: Travão de Emergência */}
      <EmergencyStopModal
        isOpen={isEmergencyModalOpen}
        isTriggered={isEmergencyActive}
        onClose={() => setIsEmergencyModalOpen(false)}
        onToggleEmergencyStop={handleToggleEmergencyStop}
      />

      {/* Modal 5: Guia de Integração Open Code */}
      <OpenCodeExportModal
        isOpen={isOpenCodeModalOpen}
        onClose={() => setIsOpenCodeModalOpen(false)}
      />

      {/* Clean Footer */}
      <footer className="mt-auto px-6 py-4 border-t border-slate-900 bg-slate-950 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] text-amber-400">HUMANO BOT</span>
          <span>·</span>
          <span>Empresa de Inteligência Artificial, Investigação e Trading de Criptomoedas</span>
        </div>
        <div className="font-mono text-[11px] text-slate-500">
          Modo 3D & 2D · 30 Agentes Robôs · 8 Robôs Traders · Paper Trading
        </div>
      </footer>
    </div>
  );
}
