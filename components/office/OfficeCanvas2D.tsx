'use client';

import React, { useState } from 'react';
import { AgentRobot, TradingRobot, Department, CryptoMarketAsset } from '@/lib/types';
import { RobotSprite } from './RobotSprite';
import { TradingMonitor } from './TradingMonitor';
import { soundFx } from '@/lib/audio';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Users,
  AlertTriangle,
  Crown,
  Eye,
  Sparkles,
} from 'lucide-react';

interface OfficeCanvas2DProps {
  agents: AgentRobot[];
  tradingRobots: TradingRobot[];
  departments: Department[];
  marketAssets: CryptoMarketAsset[];
  onSelectAgent: (agent: AgentRobot) => void;
  onSelectTradingRobot: (robot: TradingRobot) => void;
  onOpenMeetingRoom: () => void;
  onTriggerEmergencyModal: () => void;
  selectedAgentId?: string;
  selectedTradingRobotId?: string;
}

export const OfficeCanvas2D: React.FC<OfficeCanvas2DProps> = ({
  agents,
  tradingRobots,
  departments,
  marketAssets,
  onSelectAgent,
  onSelectTradingRobot,
  onOpenMeetingRoom,
  onTriggerEmergencyModal,
  selectedAgentId,
  selectedTradingRobotId,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFx.setMuted(nextMuted);
    if (!nextMuted) soundFx.playCoin();
  };

  const getDepartmentAgents = (deptId: number) => {
    return agents.filter((a) => a.departmentId === deptId);
  };

  const getMarketPrice = (assetSymbol: string) => {
    const found = marketAssets.find((m) => m.symbol === assetSymbol);
    return found ? found.price : undefined;
  };

  return (
    <div className="relative w-full flex flex-col bg-slate-950 border-2 border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Top HUD Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
        {/* Left: Office Title & Room Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-pixel text-amber-400 text-[11px] tracking-tight">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            ESCRITÓRIO 2D · HUMANO BOT HQ
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <span className="text-slate-500 text-[10px]">Filtrar Sala:</span>
            <select
              value={roomFilter}
              onChange={(e) => {
                soundFx.playWarp();
                setRoomFilter(e.target.value);
              }}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
            >
              <option value="all">Todo o Escritório (12 Salas)</option>
              <option value="dir">1. Sala da Direção</option>
              <option value="mkt">2. Análise de Mercado</option>
              <option value="tec">3. Análise Técnica</option>
              <option value="int">4. Investigação & Inteligência</option>
              <option value="str">5. Estratégias Quantitativas</option>
              <option value="rsk">6. Gestão de Risco</option>
              <option value="mem">7. Aprendizagem & Memória</option>
              <option value="exe">8. Execução & Monitorização</option>
              <option value="trading">9. SALA DE TRADING (8 Robôs)</option>
              <option value="meeting">10. Sala de Reuniões</option>
            </select>
          </div>
        </div>

        {/* Right: Sound, Zoom, and Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Reunião Quick Button */}
          <button
            onClick={() => {
              soundFx.playCoin();
              onOpenMeetingRoom();
            }}
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sala de Reuniões</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Ativar Efeitos 8-bit' : 'Silenciar Sons'}
            className="p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Zoom In / Out */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded px-1">
            <button
              onClick={() => {
                soundFx.playBlip(700);
                setZoomLevel((z) => Math.max(0.75, z - 0.1));
              }}
              className="p-1 text-slate-400 hover:text-white"
              title="Diminuir Zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 px-1">
              {(zoomLevel * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => {
                soundFx.playBlip(900);
                setZoomLevel((z) => Math.min(1.4, z + 0.1));
              }}
              className="p-1 text-slate-400 hover:text-white"
              title="Aumentar Zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                soundFx.playWarp();
                setZoomLevel(1);
              }}
              className="p-1 text-slate-400 hover:text-white"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Office Viewport (Scrollable with Zoom) */}
      <div className="relative w-full h-[640px] md:h-[720px] overflow-auto bg-slate-950 p-6 flex justify-center items-start">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
          }}
          className="w-[1240px] flex flex-col gap-5"
        >
          {/* ========================================================= */}
          {/* ANDAR SUPERIOR: SALA DA DIREÇÃO & SALA DE REUNIÕES & SUPERVISÃO */}
          {/* ========================================================= */}
          <div className="grid grid-cols-12 gap-5">
            {/* SALA 1: SALA DA DIREÇÃO (Central Command) */}
            <div
              className={`col-span-12 lg:col-span-7 bg-amber-950/20 border-4 border-amber-700/60 rounded-xl p-4 shadow-lg relative floor-tile-checker ${
                roomFilter !== 'all' && roomFilter !== 'dir' ? 'opacity-30' : ''
              }`}
            >
              {/* Retro Room Banner Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-amber-600/40">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="font-pixel text-[11px] text-amber-300">
                    SALA 1 · DIREÇÃO E COORDENAÇÃO
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-900/40 px-2 py-0.5 rounded border border-amber-700/50">
                  Supervisor: Robo-Diretor Alpha
                </span>
              </div>

              {/* Big Command Screen / Wall Projector */}
              <div className="w-full bg-slate-950/90 border-2 border-amber-500/50 rounded-lg p-2.5 mb-4 shadow-inner flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Mario Question Block indicator */}
                  <div className="w-6 h-6 bg-amber-400 border-2 border-amber-600 rounded flex items-center justify-center font-pixel text-slate-950 text-[10px] font-bold animate-bounce">
                    ?
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-100 font-pixel">
                      PAINEL CENTRAL DE OPERAÇÕES
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      30 Robôs Departamentos · 8 Robôs Traders · Zero Incidentes Não Resolvidos
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                    SISTEMA ATIVO
                  </span>
                </div>
              </div>

              {/* Workstations with the 3 Direction Robots */}
              <div className="grid grid-cols-3 gap-3">
                {getDepartmentAgents(1).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col items-center bg-slate-950/70 p-2.5 rounded-lg border border-amber-900/40 shadow-sm relative group"
                  >
                    {/* Mario Potted Plant decoration in corner */}
                    {agent.isSupervisor && (
                      <div className="absolute top-1 left-1.5 flex items-center text-[9px] text-amber-400">
                        <Crown className="w-3 h-3" />
                      </div>
                    )}
                    <RobotSprite
                      agent={agent}
                      onClick={onSelectAgent}
                      isSelected={selectedAgentId === agent.id}
                    />
                    <div className="w-16 h-2 bg-amber-900/60 rounded-full mt-1 border border-amber-700/40" />
                  </div>
                ))}
              </div>
            </div>

            {/* SALA 10: SALA DE REUNIÕES & ÁREA DE SUPERVISÃO */}
            <div
              className={`col-span-12 lg:col-span-5 bg-purple-950/20 border-4 border-purple-700/60 rounded-xl p-4 shadow-lg relative floor-tile-wood ${
                roomFilter !== 'all' && roomFilter !== 'meeting' ? 'opacity-30' : ''
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-purple-600/40">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-300" />
                  <span className="font-pixel text-[11px] text-purple-200">
                    SALA 10 · SALA DE REUNIÕES
                  </span>
                </div>
                <button
                  onClick={() => {
                    soundFx.playCoin();
                    onOpenMeetingRoom();
                  }}
                  className="px-2 py-0.5 rounded bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-[10px] font-pixel transition-colors"
                >
                  CONVOCAR
                </button>
              </div>

              {/* Conference Table Graphic */}
              <div className="w-full h-36 bg-amber-950 border-4 border-amber-700 rounded-2xl p-3 flex flex-col items-center justify-center relative shadow-xl">
                {/* Holographic Center Projector */}
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                  <Sparkles className="w-8 h-8 text-cyan-300 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <span className="text-[10px] font-pixel text-cyan-200 mt-2">
                  MESA DE CONSENSO
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  Deliberação Multidisciplinar
                </span>

                {/* Chairs around table */}
                <div className="absolute top-1 left-4 w-5 h-5 bg-amber-800 rounded border border-amber-600" />
                <div className="absolute top-1 right-4 w-5 h-5 bg-amber-800 rounded border border-amber-600" />
                <div className="absolute bottom-1 left-4 w-5 h-5 bg-amber-800 rounded border border-amber-600" />
                <div className="absolute bottom-1 right-4 w-5 h-5 bg-amber-800 rounded border border-amber-600" />
              </div>

              {/* Observation Deck summary */}
              <div className="mt-3 p-2 bg-slate-950/80 rounded border border-purple-800/60 text-[10px] text-slate-300 flex items-center justify-between">
                <span>Área de Supervisão Integrada</span>
                <span className="text-emerald-400 font-mono font-bold">8 Supervisores Conectados</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* ANDAR INTERMÉDIO: 4 SALAS ESPECIALIZADAS (Mercado, Técnica, Intel, Estratégias) */}
          {/* ========================================================= */}
          <div className="grid grid-cols-12 gap-5">
            {/* SALA 2: ANÁLISE DE MERCADO (6 Robôs) */}
            <div
              className={`col-span-12 lg:col-span-6 bg-cyan-950/20 border-4 border-cyan-700/60 rounded-xl p-4 shadow-lg floor-tile-trading relative ${
                roomFilter !== 'all' && roomFilter !== 'mkt' ? 'opacity-30' : ''
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-cyan-600/40">
                <span className="font-pixel text-[11px] text-cyan-300">
                  SALA 2 · ANÁLISE DE MERCADO (6 AGENTES)
                </span>
                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                  Lead: Robo-Market Lead
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {getDepartmentAgents(2).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col items-center bg-slate-950/70 p-2 rounded-lg border border-cyan-900/40 shadow-sm"
                  >
                    <RobotSprite
                      agent={agent}
                      onClick={onSelectAgent}
                      isSelected={selectedAgentId === agent.id}
                    />
                    <div className="w-14 h-1.5 bg-cyan-900/60 rounded-full mt-1 border border-cyan-700/40" />
                  </div>
                ))}
              </div>
            </div>

            {/* SALA 3: ANÁLISE TÉCNICA (4 Robôs) */}
            <div
              className={`col-span-12 lg:col-span-6 bg-emerald-950/20 border-4 border-emerald-700/60 rounded-xl p-4 shadow-lg floor-tile-trading relative ${
                roomFilter !== 'all' && roomFilter !== 'tec' ? 'opacity-30' : ''
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-emerald-600/40">
                <span className="font-pixel text-[11px] text-emerald-300">
                  SALA 3 · ANÁLISE TÉCNICA (4 AGENTES)
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  Lead: Robo-Chartist Prime
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {getDepartmentAgents(3).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col items-center bg-slate-950/70 p-2 rounded-lg border border-emerald-900/40 shadow-sm"
                  >
                    <RobotSprite
                      agent={agent}
                      onClick={onSelectAgent}
                      isSelected={selectedAgentId === agent.id}
                    />
                    <div className="w-14 h-1.5 bg-emerald-900/60 rounded-full mt-1 border border-emerald-700/40" />
                  </div>
                ))}
              </div>
            </div>

            {/* SALA 4: INVESTIGAÇÃO E INTELIGÊNCIA (4 Robôs) */}
            <div
              className={`col-span-12 lg:col-span-6 bg-violet-950/20 border-4 border-violet-700/60 rounded-xl p-4 shadow-lg floor-tile-intel relative ${
                roomFilter !== 'all' && roomFilter !== 'int' ? 'opacity-30' : ''
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-violet-600/40">
                <span className="font-pixel text-[11px] text-violet-300">
                  SALA 4 · INVESTIGAÇÃO & INTELIGÊNCIA (4 AGENTES)
                </span>
                <span className="text-[9px] font-mono text-violet-400 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-800">
                  Lead: Robo-Intel Overseer
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {getDepartmentAgents(4).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col items-center bg-slate-950/70 p-2 rounded-lg border border-violet-900/40 shadow-sm"
                  >
                    <RobotSprite
                      agent={agent}
                      onClick={onSelectAgent}
                      isSelected={selectedAgentId === agent.id}
                    />
                    <div className="w-14 h-1.5 bg-violet-900/60 rounded-full mt-1 border border-violet-700/40" />
                  </div>
                ))}
              </div>
            </div>

            {/* SALA 5: ESTRATÉGIAS QUANTITATIVAS (4 Robôs) */}
            <div
              className={`col-span-12 lg:col-span-6 bg-blue-950/20 border-4 border-blue-700/60 rounded-xl p-4 shadow-lg floor-tile-trading relative ${
                roomFilter !== 'all' && roomFilter !== 'str' ? 'opacity-30' : ''
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-blue-600/40">
                <span className="font-pixel text-[11px] text-blue-300">
                  SALA 5 · ESTRATÉGIAS QUANTITATIVAS (4 AGENTES)
                </span>
                <span className="text-[9px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                  Lead: Robo-Quant Master
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {getDepartmentAgents(5).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col items-center bg-slate-950/70 p-2 rounded-lg border border-blue-900/40 shadow-sm"
                  >
                    <RobotSprite
                      agent={agent}
                      onClick={onSelectAgent}
                      isSelected={selectedAgentId === agent.id}
                    />
                    <div className="w-14 h-1.5 bg-blue-900/60 rounded-full mt-1 border border-blue-700/40" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* ANDAR INFERIOR 1: RISCO, MEMÓRIA E EXECUÇÃO (9 Robôs) */}
          {/* ========================================================= */}
          <div className="grid grid-cols-12 gap-5">
            {/* SALA 6: GESTÃO DE RISCO (3 Robôs) */}
            <div
              className={`col-span-12 md:col-span-4 bg-rose-950/20 border-4 border-rose-700/60 rounded-xl p-4 shadow-lg floor-tile-risk relative ${
                roomFilter !== 'all' && roomFilter !== 'rsk' ? 'opacity-30' : ''
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-rose-600/40">
                <span className="font-pixel text-[10px] text-rose-300">
                  SALA 6 · GESTÃO DE RISCO (3)
                </span>
                <button
                  onClick={() => {
                    soundFx.playAlert();
                    onTriggerEmergencyModal();
                  }}
                  className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-pixel text-[8px]"
                  title="Abrir Travão de Emergência"
                >
                  TRAVÃO
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {getDepartmentAgents(6).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col items-center bg-slate-950/70 p-2 rounded-lg border border-rose-900/40 shadow-sm"
                  >
                    <RobotSprite
                      agent={agent}
                      onClick={onSelectAgent}
                      isSelected={selectedAgentId === agent.id}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* SALA 7: APRENDIZAGEM E MEMÓRIA (3 Robôs) */}
            <div
              className={`col-span-12 md:col-span-4 bg-pink-950/20 border-4 border-pink-700/60 rounded-xl p-4 shadow-lg floor-tile-checker relative ${
                roomFilter !== 'all' && roomFilter !== 'mem' ? 'opacity-30' : ''
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-pink-600/40">
                <span className="font-pixel text-[10px] text-pink-300">
                  SALA 7 · MEMÓRIA & APRENDIZAGEM (3)
                </span>
                <span className="text-[9px] font-mono text-pink-400">Synapse Core</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {getDepartmentAgents(7).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col items-center bg-slate-950/70 p-2 rounded-lg border border-pink-900/40 shadow-sm"
                  >
                    <RobotSprite
                      agent={agent}
                      onClick={onSelectAgent}
                      isSelected={selectedAgentId === agent.id}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* SALA 8: EXECUÇÃO E MONITORIZAÇÃO (3 Robôs) */}
            <div
              className={`col-span-12 md:col-span-4 bg-teal-950/20 border-4 border-teal-700/60 rounded-xl p-4 shadow-lg floor-tile-trading relative ${
                roomFilter !== 'all' && roomFilter !== 'exe' ? 'opacity-30' : ''
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-teal-600/40">
                <span className="font-pixel text-[10px] text-teal-300">
                  SALA 8 · EXECUÇÃO & ORDENS (3)
                </span>
                <span className="text-[9px] font-mono text-teal-400">Execution Nexus</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {getDepartmentAgents(8).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col items-center bg-slate-950/70 p-2 rounded-lg border border-teal-900/40 shadow-sm"
                  >
                    <RobotSprite
                      agent={agent}
                      onClick={onSelectAgent}
                      isSelected={selectedAgentId === agent.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* ANDAR INFERIOR 2: SALA DE TRADING DOS 8 ROBÔS TRADERS */}
          {/* ========================================================= */}
          <div
            className={`w-full bg-emerald-950/30 border-4 border-emerald-600 rounded-xl p-5 shadow-2xl relative floor-tile-trading ${
              roomFilter !== 'all' && roomFilter !== 'trading' ? 'opacity-30' : ''
            }`}
          >
            {/* Header of Trading Pit */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b-2 border-emerald-500/50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                <h3 className="font-pixel text-xs text-emerald-300 tracking-tight">
                  SALA 9 · SALA DE TRADING (8 ROBÔS TRADERS ESPECIALIZADOS)
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  Monitores Individuais CRT · Auditoria em Tempo Real
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-[10px]">
                  PAPER TRADING SIMULADO
                </span>
              </div>
            </div>

            {/* 8 Trading Robots CRT Monitors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {tradingRobots.map((robot) => (
                <TradingMonitor
                  key={robot.id}
                  robot={robot}
                  livePrice={getMarketPrice(robot.assignedAsset)}
                  onClick={onSelectTradingRobot}
                  isSelected={selectedTradingRobotId === robot.id}
                />
              ))}
            </div>

            {/* Trading Pit Warning Placard */}
            <div className="mt-4 p-2.5 bg-slate-950/90 rounded-lg border border-emerald-900/60 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  Nenhum robô trader pode inventar operações ou declarar lucros não confirmados. Trading Real desativado por padrão.
                </span>
              </div>
              <span className="font-mono text-emerald-400 font-bold shrink-0">
                8/8 ROBÔS MONITORIZADOS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Office Floor Legend & Status Bar */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>30 Agentes Robôs</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>8 Robôs Traders</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>8 Supervisores</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Travão de Risco</span>
          </span>
        </div>

        <div className="text-slate-500 font-mono text-[10px]">
          Clique em qualquer robô ou monitor para inspecionar memória e detalhes
        </div>
      </div>
    </div>
  );
};
