'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AgentRobot, TradingRobot, Department, CryptoMarketAsset } from '@/lib/types';
import { soundFx } from '@/lib/audio';
import {
  Droplets,
  Activity,
  UserCheck,
  Coffee,
  Crown,
  Play,
  RotateCcw,
  Sparkles,
  Users,
  Compass,
  Footprints,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface LivingOfficeEngineProps {
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

interface SimulatedActor {
  id: string;
  name: string;
  role: string;
  isCEO: boolean;
  isSupervisor: boolean;
  isTrader: boolean;
  departmentId: number;
  chassisColor: string;
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  waypoints: { x: number; y: number }[];
  state: 'WORKING' | 'WALKING' | 'DRINKING' | 'BATHROOM' | 'INSPECTING' | 'COFFEE' | 'DELIVERING';
  stateTimer: number; // seconds remaining in current activity
  thought: string;
  thirst: number; // 0-100
  bathroom: number; // 0-100
  energy: number; // 0-100
  facing: 'left' | 'right' | 'up' | 'down';
  stepCycle: number;
  originalData: AgentRobot | TradingRobot;
}

// Coordinates of key office destinations (static coordinates)
const LOCATIONS = {
  waterCooler: { x: 520, y: 130 },
  coffeeMachine: { x: 570, y: 130 },
  restroomHall: { x: 740, y: 110 },
  restroomStall1: { x: 700, y: 80 },
  restroomStall2: { x: 740, y: 80 },
  restroomStall3: { x: 780, y: 80 },
  ceoDesk: { x: 130, y: 140 },
  ceoInspectionSpot: { x: 280, y: 340 },
  hallwayCentral: { x: 450, y: 220 },
  meetingTable: { x: 460, y: 440 },
} as const;

function createInitialActors(agents: AgentRobot[], tradingRobots: TradingRobot[]): SimulatedActor[] {
  const list: SimulatedActor[] = [];

  // 1. CEO (Robo-Diretor Alpha)
  const ceoAgent = agents.find((a) => a.id === 'agent-dir-1');
  if (ceoAgent) {
    list.push({
      id: ceoAgent.id,
      name: ceoAgent.name,
      role: 'CEO & Diretor Geral',
      isCEO: true,
      isSupervisor: true,
      isTrader: false,
      departmentId: 1,
      chassisColor: '#fbbf24',
      homeX: 130,
      homeY: 140,
      x: 130,
      y: 140,
      targetX: 130,
      targetY: 140,
      waypoints: [],
      state: 'WORKING',
      stateTimer: 18,
      thought: 'A supervisionar o roadmap e alocação de risco da empresa.',
      thirst: 20,
      bathroom: 15,
      energy: 95,
      facing: 'down',
      stepCycle: 0,
      originalData: ceoAgent,
    });
  }

  // 2. Department Agents (Desk layout)
  agents.forEach((ag, idx) => {
    if (ag.id === 'agent-dir-1') return; // CEO handled

    let deskX = 220;
    let deskY = 280;

    if (ag.departmentId === 1) {
      deskX = 170 + idx * 45;
      deskY = 170;
    } else if (ag.departmentId === 2) {
      const i = idx % 6;
      deskX = 140 + (i % 3) * 55;
      deskY = 270 + Math.floor(i / 3) * 65;
    } else if (ag.departmentId === 3) {
      const i = idx % 4;
      deskX = 330 + (i % 2) * 55;
      deskY = 270 + Math.floor(i / 2) * 65;
    } else if (ag.departmentId === 4) {
      const i = idx % 4;
      deskX = 470 + (i % 2) * 55;
      deskY = 270 + Math.floor(i / 2) * 65;
    } else if (ag.departmentId === 5) {
      const i = idx % 4;
      deskX = 610 + (i % 2) * 55;
      deskY = 270 + Math.floor(i / 2) * 65;
    } else if (ag.departmentId === 6) {
      const i = idx % 3;
      deskX = 140 + i * 55;
      deskY = 440;
    } else if (ag.departmentId === 7) {
      const i = idx % 3;
      deskX = 620 + i * 55;
      deskY = 440;
    } else if (ag.departmentId === 8) {
      const i = idx % 3;
      deskX = 750 + i * 55;
      deskY = 270;
    }

    list.push({
      id: ag.id,
      name: ag.name,
      role: ag.role,
      isCEO: false,
      isSupervisor: ag.isSupervisor,
      isTrader: false,
      departmentId: ag.departmentId,
      chassisColor: ag.chassisColor,
      homeX: deskX,
      homeY: deskY,
      x: deskX,
      y: deskY,
      targetX: deskX,
      targetY: deskY,
      waypoints: [],
      state: 'WORKING',
      stateTimer: 10 + (idx % 8) * 4,
      thought: ag.currentTask,
      thirst: 25 + (idx * 7) % 60,
      bathroom: 15 + (idx * 11) % 55,
      energy: 85,
      facing: 'down',
      stepCycle: 0,
      originalData: ag,
    });
  });

  // 3. The 8 Trading Robots in Trading Pit
  tradingRobots.forEach((tr, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const deskX = 260 + col * 85;
    const deskY = 540 + row * 65;

    list.push({
      id: tr.id,
      name: tr.name,
      role: tr.specialty,
      isCEO: false,
      isSupervisor: false,
      isTrader: true,
      departmentId: 9,
      chassisColor: '#10b981',
      homeX: deskX,
      homeY: deskY,
      x: deskX,
      y: deskY,
      targetX: deskX,
      targetY: deskY,
      waypoints: [],
      state: 'WORKING',
      stateTimer: 14 + idx * 3,
      thought: `A monitorizar livro de ordens em ${tr.assignedAsset}`,
      thirst: 30 + (idx * 9) % 50,
      bathroom: 20 + (idx * 8) % 45,
      energy: 90,
      facing: 'up',
      stepCycle: 0,
      originalData: tr,
    });
  });

  return list;
}

export const LivingOfficeEngine: React.FC<LivingOfficeEngineProps> = ({
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
  // Simulation speed multiplier: 1x, 2x, 5x
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);
  const [focusArea, setFocusArea] = useState<string>('all');
  const [restroomStalls, setRestroomStalls] = useState<[boolean, boolean, boolean]>([false, false, false]);

  // Build actors list lazily
  const [actorsState, setActorsState] = useState<SimulatedActor[]>(() =>
    createInitialActors(agents, tradingRobots)
  );
  const actorsRef = useRef<SimulatedActor[]>(actorsState);

  // Keep ref synchronized
  useEffect(() => {
    actorsRef.current = actorsState;
  }, [actorsState]);

  // Main Life Simulation Loop
  useEffect(() => {
    const tickInterval = 50; // 20 updates per second for smooth walking
    let lastTime = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const dt = ((now - lastTime) / 1000) * simSpeed;
      lastTime = now;

      const actors = actorsRef.current;
      if (!actors.length) return;

      const occupiedStalls: [boolean, boolean, boolean] = [false, false, false];

      actors.forEach((actor) => {
        // Check if currently inside a restroom stall
        if (actor.state === 'BATHROOM') {
          if (Math.abs(actor.x - LOCATIONS.restroomStall1.x) < 20) occupiedStalls[0] = true;
          else if (Math.abs(actor.x - LOCATIONS.restroomStall2.x) < 20) occupiedStalls[1] = true;
          else if (Math.abs(actor.x - LOCATIONS.restroomStall3.x) < 20) occupiedStalls[2] = true;
        }

        // If walking, move along waypoints towards target
        if (actor.state === 'WALKING' && actor.waypoints.length > 0) {
          const nextWp = actor.waypoints[0];
          const dx = nextWp.x - actor.x;
          const dy = nextWp.y - actor.y;
          const dist = Math.hypot(dx, dy);
          const walkSpeed = 55 * simSpeed; // pixels per second

          actor.stepCycle = (actor.stepCycle + dt * 10) % 2;

          if (dist < 4) {
            actor.x = nextWp.x;
            actor.y = nextWp.y;
            actor.waypoints.shift();

            // Arrived at final destination
            if (actor.waypoints.length === 0) {
              if (actor.targetX === LOCATIONS.waterCooler.x && actor.targetY === LOCATIONS.waterCooler.y) {
                actor.state = 'DRINKING';
                actor.stateTimer = 5;
                actor.thirst = 0;
                actor.thought = 'A beber água fresca no bebedouro...';
              } else if (
                Math.abs(actor.targetY - LOCATIONS.restroomStall2.y) < 15 &&
                actor.targetX >= 690 &&
                actor.targetX <= 800
              ) {
                actor.state = 'BATHROOM';
                actor.stateTimer = 7;
                actor.bathroom = 0;
                actor.thought = 'Na casa de banho a recarregar bateria e descarregar resíduos...';
              } else if (actor.targetX === LOCATIONS.coffeeMachine.x) {
                actor.state = 'COFFEE';
                actor.stateTimer = 6;
                actor.energy = 100;
                actor.thought = 'A tirar um café expresso bem quente...';
              } else if (actor.isCEO && actor.targetY > 250) {
                actor.state = 'INSPECTING';
                actor.stateTimer = 8;
                actor.thought = 'CEO a inspecionar as ordens e dar orientações de mercado...';
              } else {
                // Returned to home desk
                actor.state = 'WORKING';
                actor.stateTimer = 15 + Math.random() * 25;
                actor.thought = actor.isTrader
                  ? `A analisar ${((actor.originalData as TradingRobot).assignedAsset)} com IA.`
                  : actor.isCEO
                  ? 'A auditar as decisões executivas no seu gabinete.'
                  : `${(actor.originalData as AgentRobot).visorText} no posto de trabalho.`;
              }
            }
          } else {
            // Move smoothly towards waypoint
            const moveDist = Math.min(dist, walkSpeed * dt);
            actor.x += (dx / dist) * moveDist;
            actor.y += (dy / dist) * moveDist;

            if (Math.abs(dx) > Math.abs(dy)) {
              actor.facing = dx > 0 ? 'right' : 'left';
            } else {
              actor.facing = dy > 0 ? 'down' : 'up';
            }
          }
        } else {
          // Stationary in state (WORKING, DRINKING, BATHROOM, INSPECTING, etc.)
          actor.stateTimer -= dt;

          // Increase biological/routine meters slowly while working
          if (actor.state === 'WORKING') {
            actor.thirst = Math.min(100, actor.thirst + dt * 1.5);
            actor.bathroom = Math.min(100, actor.bathroom + dt * 1.2);
            actor.energy = Math.max(0, actor.energy - dt * 0.8);

            // Autonomous Decision Logic:
            // 1. Need bathroom urgently?
            if (actor.bathroom >= 90) {
              const freeStall =
                !occupiedStalls[0]
                  ? LOCATIONS.restroomStall1
                  : !occupiedStalls[1]
                  ? LOCATIONS.restroomStall2
                  : LOCATIONS.restroomStall3;

              actor.state = 'WALKING';
              actor.targetX = freeStall.x;
              actor.targetY = freeStall.y;
              actor.waypoints = [
                { x: actor.homeX, y: 220 }, // Step out into hallway
                { x: LOCATIONS.restroomHall.x, y: 220 }, // Walk to restroom entry
                { x: LOCATIONS.restroomHall.x, y: 130 },
                { x: freeStall.x, y: freeStall.y },
              ];
              actor.thought = 'A ir à casa de banho/descarga de resíduos...';
            }
            // 2. Thirsty? Walk to water cooler
            else if (actor.thirst >= 80) {
              actor.state = 'WALKING';
              actor.targetX = LOCATIONS.waterCooler.x;
              actor.targetY = LOCATIONS.waterCooler.y;
              actor.waypoints = [
                { x: actor.homeX, y: 220 },
                { x: LOCATIONS.waterCooler.x, y: 220 },
                { x: LOCATIONS.waterCooler.x, y: LOCATIONS.waterCooler.y },
              ];
              actor.thought = 'Muita sede! A ir ao bebedouro buscar água...';
            }
            // 3. CEO Autonomous Inspection Pacing
            else if (actor.isCEO && actor.stateTimer <= 0) {
              // Choose a department to inspect
              const inspectSpots = [
                { x: 200, y: 310, name: 'Análise de Mercado' },
                { x: 380, y: 310, name: 'Análise Técnica' },
                { x: 520, y: 310, name: 'Investigação On-Chain' },
                { x: 350, y: 520, name: 'Sala de Trading (BTC/ETH)' },
                { x: 220, y: 440, name: 'Gestão de Risco' },
              ];
              const spot = inspectSpots[Math.floor(Math.random() * inspectSpots.length)];

              actor.state = 'WALKING';
              actor.targetX = spot.x;
              actor.targetY = spot.y;
              actor.waypoints = [
                { x: 130, y: 220 },
                { x: spot.x, y: 220 },
                { x: spot.x, y: spot.y },
              ];
              actor.thought = `CEO a deslocar-se para inspecionar ${spot.name}...`;
            }
          }

          // If activity timer expired, return home to desk
          if (
            (actor.state === 'DRINKING' ||
              actor.state === 'BATHROOM' ||
              actor.state === 'COFFEE' ||
              actor.state === 'INSPECTING') &&
            actor.stateTimer <= 0
          ) {
            actor.state = 'WALKING';
            actor.targetX = actor.homeX;
            actor.targetY = actor.homeY;
            actor.waypoints = [
              { x: actor.x, y: 220 },
              { x: actor.homeX, y: 220 },
              { x: actor.homeX, y: actor.homeY },
            ];
            actor.thought = 'Tarefa concluída. A voltar para o posto de trabalho...';
          }
        }
      });

      setRestroomStalls(occupiedStalls);
      setActorsState([...actors]);
    }, tickInterval);

    return () => clearInterval(interval);
  }, [simSpeed]);

  // Manual Trigger: Send CEO to Inspect
  const triggerCEOInspection = () => {
    soundFx.playCoin();
    const actors = actorsRef.current;
    const ceo = actors.find((a) => a.isCEO);
    if (ceo) {
      ceo.state = 'WALKING';
      ceo.targetX = 350;
      ceo.targetY = 520;
      ceo.waypoints = [
        { x: 130, y: 220 },
        { x: 350, y: 220 },
        { x: 350, y: 520 },
      ];
      ceo.thought = 'CEO a inspecionar a Sala de Trading pessoalmente!';
      setActorsState([...actors]);
    }
  };

  // Manual Trigger: Send Random Worker to Water Cooler
  const triggerWaterBreak = () => {
    soundFx.playPowerup();
    const actors = actorsRef.current;
    const workers = actors.filter((a) => !a.isCEO && a.state === 'WORKING');
    if (workers.length > 0) {
      const chosen = workers[Math.floor(Math.random() * workers.length)];
      chosen.thirst = 95;
      chosen.state = 'WALKING';
      chosen.targetX = LOCATIONS.waterCooler.x;
      chosen.targetY = LOCATIONS.waterCooler.y;
      chosen.waypoints = [
        { x: chosen.homeX, y: 220 },
        { x: LOCATIONS.waterCooler.x, y: 220 },
        { x: LOCATIONS.waterCooler.x, y: LOCATIONS.waterCooler.y },
      ];
      chosen.thought = `${chosen.name.replace('Robo-', '')} foi buscar um copo de água fresca!`;
      setActorsState([...actors]);
    }
  };

  // Manual Trigger: Send Random Worker to Restroom
  const triggerRestroomBreak = () => {
    soundFx.playBlip(700);
    const actors = actorsRef.current;
    const workers = actors.filter((a) => !a.isCEO && a.state === 'WORKING');
    if (workers.length > 0) {
      const chosen = workers[Math.floor(Math.random() * workers.length)];
      chosen.bathroom = 95;
      chosen.state = 'WALKING';
      const stall = !restroomStalls[0]
        ? LOCATIONS.restroomStall1
        : !restroomStalls[1]
        ? LOCATIONS.restroomStall2
        : LOCATIONS.restroomStall3;

      chosen.targetX = stall.x;
      chosen.targetY = stall.y;
      chosen.waypoints = [
        { x: chosen.homeX, y: 220 },
        { x: LOCATIONS.restroomHall.x, y: 220 },
        { x: LOCATIONS.restroomHall.x, y: 130 },
        { x: stall.x, y: stall.y },
      ];
      chosen.thought = `${chosen.name.replace('Robo-', '')} foi à casa de banho/despejo de resíduos.`;
      setActorsState([...actors]);
    }
  };

  return (
    <div className="relative w-full flex flex-col bg-slate-950 border-2 border-slate-800 rounded-xl overflow-hidden shadow-2xl select-none">
      {/* Top Simulation Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-pixel text-amber-400 text-[11px] tracking-tight">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            ESCRITÓRIO VIVO · ROTINAS REAIS AUTÓNOMAS
          </div>
          <span className="text-slate-400 font-mono text-[10px] hidden md:inline">
            Robôs circulam para beber água, ir ao banheiro, café e o CEO inspeciona a empresa
          </span>
        </div>

        {/* Speed & Quick Dispatch Controls */}
        <div className="flex items-center gap-2">
          {/* Action Triggers */}
          <button
            onClick={triggerCEOInspection}
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-[11px] font-bold font-pixel flex items-center gap-1 transition-colors"
            title="Mandar o CEO sair do gabinete e inspecionar a empresa"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Passear CEO</span>
          </button>

          <button
            onClick={triggerWaterBreak}
            className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded text-[11px] font-bold font-pixel flex items-center gap-1 transition-colors"
            title="Mandar um robô ao bebedouro tomar água"
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Beber Água</span>
          </button>

          <button
            onClick={triggerRestroomBreak}
            className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded text-[11px] font-bold font-pixel flex items-center gap-1 transition-colors"
            title="Mandar um robô à casa de banho / recarga"
          >
            <span>🚽 Casa de Banho</span>
          </button>

          {/* Speed Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded p-0.5 text-[10px] font-mono">
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  soundFx.playBlip(600 + spd * 50);
                  setSimSpeed(spd);
                }}
                className={`px-2 py-0.5 rounded font-bold transition-colors ${
                  simSpeed === spd
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Living Architectural Office Floor (Scalable & Lightweight SVG/DOM Canvas) */}
      <div className="relative w-full h-[680px] md:h-[750px] overflow-auto bg-slate-950 p-4 flex justify-center items-start">
        <div className="relative w-[960px] h-[720px] bg-slate-900/90 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden">
          {/* Architectural Concrete Floor Grid */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* ======================================================== */}
          {/* ZONE 1: GABINETE DO CEO / ROBO-DIRETOR ALPHA (Top Left) */}
          {/* ======================================================== */}
          <div className="absolute top-4 left-4 w-[250px] h-[190px] bg-amber-950/25 border-2 border-amber-600/60 rounded-xl p-3 shadow-md">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-amber-600/40">
              <span className="font-pixel text-[10px] text-amber-300 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Gabinete Executivo (CEO)
              </span>
              <span className="text-[9px] font-mono text-amber-400">Diretor Alpha</span>
            </div>

            {/* CEO Mahogany Desk */}
            <div className="absolute top-[80px] left-[70px] w-[110px] h-[46px] bg-amber-900 border-2 border-amber-700 rounded-lg shadow-md flex items-center justify-between px-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
              <span className="text-[8px] font-pixel text-amber-200">MESA DO CEO</span>
              <span className="w-2 h-2 rounded bg-amber-300" />
            </div>

            {/* Executive Red Carpet */}
            <div className="absolute top-[65px] left-[55px] w-[140px] h-[110px] bg-rose-950/40 border border-rose-800/40 rounded-xl -z-0 pointer-events-none" />
          </div>

          {/* ======================================================== */}
          {/* ZONE 2: COPA, CAFÉ & BEBEDOURO D'ÁGUA (Top Center) */}
          {/* ======================================================== */}
          <div className="absolute top-4 left-[280px] w-[340px] h-[160px] bg-cyan-950/25 border-2 border-cyan-600/50 rounded-xl p-3 shadow-md">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-cyan-600/40">
              <span className="font-pixel text-[10px] text-cyan-300 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                Copa & Bebedouro d&apos;Água
              </span>
              <span className="text-[9px] font-mono text-cyan-400">Água Fresca & Café</span>
            </div>

            {/* Water Cooler Dispenser Appliance */}
            <div
              className="absolute top-[60px] left-[180px] w-[45px] h-[60px] bg-slate-800 border-2 border-cyan-400 rounded-lg p-1.5 flex flex-col items-center justify-between shadow-lg"
              title="Bebedouro d'Água Gelada"
            >
              {/* Blue Water Bottle on Top */}
              <div className="w-6 h-6 rounded-full bg-cyan-400/80 border border-cyan-200 animate-pulse flex items-center justify-center">
                <Droplets className="w-3 h-3 text-slate-900" />
              </div>
              <span className="text-[7px] font-bold font-mono text-cyan-300">ÁGUA</span>
              {/* Tap levers */}
              <div className="flex gap-1">
                <span className="w-1.5 h-2 bg-blue-500 rounded" />
                <span className="w-1.5 h-2 bg-rose-500 rounded" />
              </div>
            </div>

            {/* Espresso Coffee Machine */}
            <div
              className="absolute top-[65px] left-[245px] w-[42px] h-[55px] bg-slate-800 border-2 border-amber-500 rounded-lg p-1 flex flex-col items-center justify-between shadow-lg"
              title="Máquina de Café Expresso"
            >
              <Coffee className="w-4 h-4 text-amber-400 mt-1" />
              <span className="text-[7px] font-bold font-mono text-amber-300">CAFÉ</span>
              <span className="w-4 h-1 bg-amber-400 rounded" />
            </div>

            {/* High Counter Table */}
            <div className="absolute top-[75px] left-[20px] w-[130px] h-[36px] bg-slate-800 border-2 border-slate-700 rounded-lg shadow flex items-center justify-around px-2 text-[8px] font-mono text-slate-400">
              <span>☕ Mugs</span>
              <span>🍪 Snacks</span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ZONE 3: CASAS DE BANHO & CABINES DE RECARGA (Top Right) */}
          {/* ======================================================== */}
          <div className="absolute top-4 right-4 w-[280px] h-[160px] bg-rose-950/20 border-2 border-rose-600/50 rounded-xl p-3 shadow-md">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-rose-600/40">
              <span className="font-pixel text-[10px] text-rose-300 flex items-center gap-1.5">
                <span>🚽</span>
                Casas de Banho & Recarga
              </span>
              <span className="text-[9px] font-mono text-rose-400">3 Cabines</span>
            </div>

            {/* 3 Stalls */}
            <div className="flex justify-around items-center pt-2">
              {[0, 1, 2].map((idx) => {
                const isOccupied = restroomStalls[idx];
                return (
                  <div
                    key={idx}
                    className={`w-[70px] h-[78px] rounded-lg border-2 p-1.5 flex flex-col items-center justify-between transition-colors shadow-inner ${
                      isOccupied
                        ? 'bg-rose-950/80 border-rose-500'
                        : 'bg-emerald-950/60 border-emerald-500'
                    }`}
                  >
                    <span className="text-[9px] font-pixel text-slate-200">BOX {idx + 1}</span>
                    <span className="text-xl">{isOccupied ? '🚹' : '🚪'}</span>
                    <span
                      className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isOccupied ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isOccupied ? 'OCUPADO' : 'LIVRE'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* CENTRAL HALLWAY (Corredor de Circulação de Todos os Robôs) */}
          {/* ======================================================== */}
          <div className="absolute top-[205px] left-0 right-0 h-[46px] bg-slate-950/60 border-y border-slate-800 flex items-center justify-between px-8 text-[9px] font-mono text-slate-500">
            <span>← CORREDOR PRINCIPAL DE CIRCULAÇÃO →</span>
            <span>DIREÇÃO · COPAS · BANHEIROS · DEPARTAMENTOS · SALA DE TRADING</span>
          </div>

          {/* ======================================================== */}
          {/* ZONE 4: ILHAS DE DEPARTAMENTOS (Mercado, Técnica, Intel, Quant) */}
          {/* ======================================================== */}
          {/* Dept 2: Mercado */}
          <div className="absolute top-[260px] left-4 w-[210px] h-[140px] bg-cyan-950/15 border border-cyan-700/40 rounded-xl p-2">
            <span className="text-[8px] font-pixel text-cyan-400 block mb-1">MERCADO (6 ROBÔS)</span>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-800/80 rounded border border-cyan-900/60 flex items-center justify-center text-[8px] font-mono text-cyan-300"
                >
                  Desk {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Dept 3: Análise Técnica */}
          <div className="absolute top-[260px] left-[230px] w-[160px] h-[140px] bg-emerald-950/15 border border-emerald-700/40 rounded-xl p-2">
            <span className="text-[8px] font-pixel text-emerald-400 block mb-1">TÉCNICA (4 ROBÔS)</span>
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-800/80 rounded border border-emerald-900/60 flex items-center justify-center text-[8px] font-mono text-emerald-300"
                >
                  Desk {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Dept 4: Investigação On-Chain */}
          <div className="absolute top-[260px] left-[405px] w-[160px] h-[140px] bg-purple-950/15 border border-purple-700/40 rounded-xl p-2">
            <span className="text-[8px] font-pixel text-purple-400 block mb-1">INTEL (4 ROBÔS)</span>
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-800/80 rounded border border-purple-900/60 flex items-center justify-center text-[8px] font-mono text-purple-300"
                >
                  Desk {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Dept 5: Estratégias Quant */}
          <div className="absolute top-[260px] left-[580px] w-[160px] h-[140px] bg-blue-950/15 border border-blue-700/40 rounded-xl p-2">
            <span className="text-[8px] font-pixel text-blue-400 block mb-1">QUANT (4 ROBÔS)</span>
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-800/80 rounded border border-blue-900/60 flex items-center justify-center text-[8px] font-mono text-blue-300"
                >
                  Desk {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Dept 8: Execução & Redes */}
          <div className="absolute top-[260px] right-4 w-[170px] h-[140px] bg-teal-950/15 border border-teal-700/40 rounded-xl p-2">
            <span className="text-[8px] font-pixel text-teal-400 block mb-1">EXECUÇÃO (3)</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-800/80 rounded border border-teal-900/60 flex items-center justify-center text-[8px] font-mono text-teal-300"
                >
                  Desk {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* ZONE 5: SALA DE TRADING PRINCIPAL (8 ROBÔS TRADERS COM TELÃO) */}
          {/* ======================================================== */}
          <div className="absolute bottom-4 left-4 right-4 h-[195px] bg-emerald-950/25 border-2 border-emerald-600/60 rounded-xl p-3 shadow-lg">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-emerald-600/40">
              <span className="font-pixel text-[11px] text-emerald-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                SALA DE TRADING · 8 ROBÔS ESPECIALIZADOS (WALL ST TRADING FLOOR)
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                Paper Trading Ativo · Sem Risco de Capital Real
              </span>
            </div>

            {/* 8 Trading Desks Graphic */}
            <div className="grid grid-cols-4 gap-3 pt-1">
              {tradingRobots.slice(0, 4).map((tr, idx) => (
                <div
                  key={tr.id}
                  className="h-14 bg-slate-800/80 rounded-lg border-2 border-emerald-500/40 p-1.5 flex flex-col justify-between shadow"
                >
                  <div className="flex justify-between items-center text-[9px] font-bold font-mono">
                    <span className="text-amber-400">R{tr.number} {tr.assignedAsset.split('/')[0]}</span>
                    <span className="text-emerald-400">{tr.currentDecision}</span>
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono flex justify-between">
                    <span>Posição</span>
                    <span className="text-emerald-300">
                      {tr.currentPosition ? `+${tr.currentPosition.pnlPercent.toFixed(1)}%` : 'NEUTRO'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-3 pt-2">
              {tradingRobots.slice(4, 8).map((tr, idx) => (
                <div
                  key={tr.id}
                  className="h-14 bg-slate-800/80 rounded-lg border-2 border-emerald-500/40 p-1.5 flex flex-col justify-between shadow"
                >
                  <div className="flex justify-between items-center text-[9px] font-bold font-mono">
                    <span className="text-amber-400">R{tr.number} {tr.assignedAsset.split('/')[0]}</span>
                    <span className="text-emerald-400">{tr.currentDecision}</span>
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono flex justify-between">
                    <span>Posição</span>
                    <span className="text-emerald-300">
                      {tr.currentPosition ? `+${tr.currentPosition.pnlPercent.toFixed(1)}%` : 'NEUTRO'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* AUTONOMOUS WALKING ROBOTS & CHARACTERS LAYER */}
          {/* ======================================================== */}
          {actorsState.map((actor) => {
            const isSelected = selectedActorId === actor.id;
            const isWalking = actor.state === 'WALKING';

            return (
              <div
                key={actor.id}
                onClick={() => {
                  soundFx.playBlip(750);
                  setSelectedActorId(actor.id);
                  if (actor.isTrader) {
                    onSelectTradingRobot(actor.originalData as TradingRobot);
                  } else {
                    onSelectAgent(actor.originalData as AgentRobot);
                  }
                }}
                style={{
                  left: `${actor.x}px`,
                  top: `${actor.y}px`,
                  transform: 'translate(-50%, -50%)',
                  transition: isWalking ? 'none' : 'all 0.3s ease-out',
                }}
                className={`absolute z-30 flex flex-col items-center cursor-pointer group select-none ${
                  isSelected ? 'scale-110 z-40' : 'hover:scale-105'
                }`}
              >
                {/* Real-Time Overhead Thought / Activity Balloon */}
                <div
                  className={`mb-1 px-2 py-0.5 rounded text-[8px] font-bold font-mono whitespace-nowrap shadow-md max-w-[170px] truncate border ${
                    actor.isCEO
                      ? 'bg-amber-950 text-amber-300 border-amber-600 shadow-amber-500/40 animate-pulse'
                      : actor.state === 'BATHROOM'
                      ? 'bg-rose-950 text-rose-300 border-rose-600'
                      : actor.state === 'DRINKING'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                      : actor.state === 'COFFEE'
                      ? 'bg-amber-950 text-amber-300 border-amber-600'
                      : actor.state === 'WALKING'
                      ? 'bg-blue-950 text-blue-300 border-blue-600 animate-bounce'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  {actor.isCEO && actor.state === 'INSPECTING' ? (
                    '👔 CEO A INSPECIONAR'
                  ) : actor.state === 'DRINKING' ? (
                    '💧 A BEBER ÁGUA'
                  ) : actor.state === 'BATHROOM' ? (
                    '🚽 NA CASA DE BANHO'
                  ) : actor.state === 'COFFEE' ? (
                    '☕ A TOMAR CAFÉ'
                  ) : isWalking ? (
                    '🚶 A CAMINHAR...'
                  ) : (
                    actor.thought
                  )}
                </div>

                {/* Character Sprite & Walking Shadow */}
                <div className="relative flex flex-col items-center">
                  {/* Feet / Stepping Animation */}
                  <div
                    className={`absolute -bottom-1 w-6 h-1.5 bg-black/60 rounded-full transition-transform ${
                      isWalking && actor.stepCycle > 1 ? 'scale-x-125' : 'scale-x-100'
                    }`}
                  />

                  {/* CEO Crown or Robot Head */}
                  {actor.isCEO && (
                    <div className="w-4 h-2 bg-amber-400 border border-amber-600 rounded-t-sm flex justify-between px-0.5 -mb-0.5 z-10 shadow-sm animate-bounce">
                      <span className="w-0.5 h-0.5 bg-white rounded-full" />
                      <span className="w-0.5 h-1 bg-white rounded-full -mt-0.5" />
                      <span className="w-0.5 h-0.5 bg-white rounded-full" />
                    </div>
                  )}

                  {/* Robot Head with Glowing Visor */}
                  <div
                    style={{ backgroundColor: actor.chassisColor }}
                    className="w-5 h-4 rounded border-2 border-slate-950 flex items-center justify-center shadow-sm relative"
                  >
                    <div className="w-3.5 h-1.5 bg-slate-950 rounded-xs flex items-center justify-around px-0.5">
                      <span
                        className={`w-1 h-1 rounded-full ${
                          actor.state === 'BATHROOM'
                            ? 'bg-rose-400'
                            : actor.state === 'DRINKING'
                            ? 'bg-cyan-400'
                            : 'bg-emerald-400 animate-ping'
                        }`}
                      />
                      <span className="w-1 h-1 rounded-full bg-cyan-300" />
                    </div>
                  </div>

                  {/* Robot Body */}
                  <div
                    style={{ backgroundColor: actor.chassisColor }}
                    className="w-4 h-3.5 rounded-b border border-slate-950 flex items-center justify-center relative mt-0.5"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        actor.isCEO
                          ? 'bg-amber-400 animate-pulse'
                          : isWalking
                          ? 'bg-blue-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                  </div>

                  {/* Character Name Label */}
                  <span className="text-[7px] font-bold text-slate-300 bg-slate-950/80 px-1 rounded mt-0.5 font-mono max-w-[65px] truncate">
                    {actor.name.replace('Robo-', '')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Telemetry Legend */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-amber-400">
            <Crown className="w-3.5 h-3.5" />
            <span>CEO Circula Autonomamente</span>
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Droplets className="w-3.5 h-3.5" />
            <span>Bebedouro Funcional</span>
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span>🚽</span>
            <span>Casas de Banho com Ocupação Real</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Activity className="w-3.5 h-3.5" />
            <span>8 Robôs Traders no Pit</span>
          </span>
        </div>

        <div className="text-slate-500 font-mono text-[10px]">
          Clique em qualquer robô para ver sede, descanso e tarefa
        </div>
      </div>
    </div>
  );
};

export default LivingOfficeEngine;
