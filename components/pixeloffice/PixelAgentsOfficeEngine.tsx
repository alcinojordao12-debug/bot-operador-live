'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AgentRobot,
  TradingRobot,
  Department,
  CryptoMarketAsset,
  GhostSubAgent,
  OfficePet,
  OfficeFurnitureItem,
  OfficeArea,
  TranscriptEvent,
  ContextGaugeData,
} from '@/lib/types';
import { soundFx } from '@/lib/audio';
import {
  DEFAULT_OFFICE_AREAS,
  DEFAULT_OFFICE_FURNITURE,
  DEFAULT_OFFICE_PETS,
} from '@/lib/data/defaultPixelLayout';
import { LayoutEditorToolbar } from './LayoutEditorToolbar';
import { LiveTranscriptConsole } from './LiveTranscriptConsole';
import {
  Activity,
  Droplets,
  Coffee,
  Crown,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Users,
  Compass,
  Footprints,
  Eye,
  CheckCircle2,
  Terminal,
  Ghost as GhostIcon,
  HelpCircle,
  Code2,
  Cpu,
  Layers,
  Heart,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Crosshair,
} from 'lucide-react';

interface PixelAgentsOfficeEngineProps {
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

interface PixelActor {
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
  facing: 'left' | 'right' | 'up' | 'down';
  state: 'WORKING' | 'WALKING' | 'DRINKING' | 'BATHROOM' | 'INSPECTING' | 'COFFEE' | 'WAITING_INPUT';
  stateTimer: number;
  thought: string;
  thirst: number; // 0-100
  bathroom: number; // 0-100
  energy: number; // 0-100
  contextTokens: number; // 0 - 200,000
  maxTokens: number;
  isCompacting: boolean;
  stepCycle: number;
  originalData: AgentRobot | TradingRobot;
}

// Key waypoint coordinates
const WAYPOINTS = {
  waterCooler: { x: 380, y: 110 },
  coffeeMachine: { x: 440, y: 110 },
  breakTable: { x: 420, y: 170 },
  restroomHall: { x: 670, y: 110 },
  restroomStall1: { x: 650, y: 70 },
  restroomStall2: { x: 710, y: 70 },
  restroomStall3: { x: 770, y: 70 },
  ceoDesk: { x: 130, y: 130 },
  centralCorridor: { x: 440, y: 230 },
  confTable: { x: 440, y: 580 },
  serverRoom: { x: 780, y: 350 },
} as const;

function createInitialPixelActors(agents: AgentRobot[], tradingRobots: TradingRobot[]): PixelActor[] {
  const actors: PixelActor[] = [];

  // 1. CEO (Robo-Diretor Alpha)
  const ceo = agents.find((a) => a.id === 'agent-dir-1');
  if (ceo) {
    actors.push({
      id: ceo.id,
      name: ceo.name,
      role: 'CEO & Diretor Geral',
      isCEO: true,
      isSupervisor: true,
      isTrader: false,
      departmentId: 1,
      chassisColor: '#fbbf24',
      homeX: 130,
      homeY: 130,
      x: 130,
      y: 130,
      targetX: 130,
      targetY: 130,
      facing: 'down',
      state: 'WORKING',
      stateTimer: 15,
      thought: 'A supervisionar o roadmap, alocação de liquidez e governança.',
      thirst: 25,
      bathroom: 10,
      energy: 95,
      contextTokens: 42500,
      maxTokens: 200000,
      isCompacting: false,
      stepCycle: 0,
      originalData: ceo,
    });
  }

  // 2. Department Agents (Desk layout in engineering / analysis zones)
  agents.forEach((ag, idx) => {
    if (ag.id === 'agent-dir-1') return;

    let deskX = 520 + (idx % 6) * 55;
    let deskY = 270 + Math.floor(idx / 6) * 45;

    if (ag.departmentId === 1) {
      deskX = 180 + (idx % 2) * 50;
      deskY = 130;
    } else if (ag.departmentId === 2) {
      deskX = 500 + (idx % 3) * 50;
      deskY = 270;
    } else if (ag.departmentId === 3) {
      deskX = 660 + (idx % 3) * 50;
      deskY = 270;
    } else if (ag.departmentId === 4) {
      deskX = 500 + (idx % 4) * 48;
      deskY = 325;
    } else if (ag.departmentId === 5) {
      deskX = 660 + (idx % 3) * 50;
      deskY = 325;
    } else if (ag.departmentId === 6) {
      deskX = 500 + (idx % 3) * 50;
      deskY = 380;
    } else if (ag.departmentId === 7) {
      deskX = 660 + (idx % 3) * 50;
      deskY = 380;
    } else if (ag.departmentId === 8) {
      deskX = 580 + (idx % 3) * 50;
      deskY = 435;
    }

    actors.push({
      id: ag.id,
      name: ag.name,
      role: ag.role,
      isCEO: false,
      isSupervisor: ag.isSupervisor,
      isTrader: false,
      departmentId: ag.departmentId,
      chassisColor: ag.chassisColor || '#38bdf8',
      homeX: deskX,
      homeY: deskY,
      x: deskX,
      y: deskY,
      targetX: deskX,
      targetY: deskY,
      facing: 'down',
      state: 'WORKING',
      stateTimer: 10 + (idx % 8) * 3,
      thought: ag.currentTask,
      thirst: 20 + (idx * 7) % 60,
      bathroom: 15 + (idx * 9) % 60,
      energy: 85 - (idx * 3) % 40,
      contextTokens: 25000 + (idx * 4800) % 150000,
      maxTokens: 200000,
      isCompacting: false,
      stepCycle: 0,
      originalData: ag,
    });
  });

  // 3. Quant Trading Robots (Floor on left)
  tradingRobots.forEach((tr, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const deskX = 90 + col * 90;
    const deskY = 280 + row * 60;

    actors.push({
      id: tr.id,
      name: tr.name,
      role: tr.specialty,
      isCEO: false,
      isSupervisor: false,
      isTrader: true,
      departmentId: 5,
      chassisColor: '#10b981',
      homeX: deskX,
      homeY: deskY,
      x: deskX,
      y: deskY,
      targetX: deskX,
      targetY: deskY,
      facing: 'down',
      state: 'WORKING',
      stateTimer: 8 + idx * 4,
      thought: `Monitorizando ${tr.assignedAsset} (${tr.status}) - ${tr.activeStrategy}`,
      thirst: 30 + (idx * 8) % 50,
      bathroom: 20 + (idx * 11) % 50,
      energy: 90 - idx * 4,
      contextTokens: 60000 + idx * 12000,
      maxTokens: 200000,
      isCompacting: false,
      stepCycle: 0,
      originalData: tr,
    });
  });

  return actors;
}

export const PixelAgentsOfficeEngine: React.FC<PixelAgentsOfficeEngineProps> = ({
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
  // Actors simulation state
  const [actors, setActors] = useState<PixelActor[]>(() => createInitialPixelActors(agents, tradingRobots));
  const [pets, setPets] = useState<OfficePet[]>(DEFAULT_OFFICE_PETS);
  const [ghosts, setGhosts] = useState<GhostSubAgent[]>([
    {
      id: 'ghost-1',
      parentAgentId: 'agent-dir-1',
      parentAgentName: 'Robo-Diretor Alpha',
      task: 'Linter & TypeCheck em segundo plano',
      x: 220,
      y: 190,
      targetX: 780,
      targetY: 350,
      progress: 45,
      opacity: 0.85,
      glowColor: '#38bdf8',
      status: 'RUNNING',
      toolUsed: 'npm run lint',
    },
    {
      id: 'ghost-2',
      parentAgentId: 'trader-1',
      parentAgentName: 'Trader 01 BTC',
      task: 'Backtesting histórico 5000 candles',
      x: 180,
      y: 330,
      targetX: 300,
      targetY: 420,
      progress: 72,
      opacity: 0.8,
      glowColor: '#a855f7',
      status: 'RUNNING',
      toolUsed: 'QuantSimulator',
    },
  ]);

  // Furniture and areas (Layout Editor)
  const [furniture, setFurniture] = useState<OfficeFurnitureItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('pixel_agents_layout');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_OFFICE_FURNITURE;
  });
  const [areas] = useState<OfficeArea[]>(DEFAULT_OFFICE_AREAS);
  const [floorTheme, setFloorTheme] = useState<string>('parquet');
  const [isEditorActive, setIsEditorActive] = useState<boolean>(false);
  const [selectedFurniture, setSelectedFurniture] = useState<OfficeFurnitureItem | null>(null);

  // Transcript Events Stream
  const [transcriptEvents, setTranscriptEvents] = useState<TranscriptEvent[]>([
    {
      id: 'ev-init-1',
      timestamp: '2026-10-16 16:35:02',
      agentId: 'agent-dir-1',
      agentName: 'Robo-Diretor Alpha',
      type: 'SessionStart',
      summary: 'Inicializou a sessão principal do Pixel Agents HQ.',
      toolName: 'HooksProvider',
    },
    {
      id: 'ev-init-2',
      timestamp: '2026-10-16 16:35:05',
      agentId: 'trader-1',
      agentName: 'Trader 01 BTC',
      type: 'PreToolUse',
      summary: 'A consultar livros de ordens e liquidez em Binance Futures.',
      toolName: 'BinanceAPI',
    },
  ]);

  // UI state & controls
  const [zoom, setZoom] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [cameraFollowId, setCameraFollowId] = useState<string | null>(null);
  const [showAreas, setShowAreas] = useState<boolean>(true);
  const [activeSpeechActorId, setActiveSpeechActorId] = useState<string | null>('agent-dir-1');
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const [occupiedStalls, setOccupiedStalls] = useState<Record<number, string | null>>({ 1: null, 2: null, 3: null });

  // Sound toggle
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
    if (!next) soundFx.playCoin();
  };

  // Restroom vacancy check
  const getFreeStall = () => {
    if (!occupiedStalls[1]) return { num: 1, ...WAYPOINTS.restroomStall1 };
    if (!occupiedStalls[2]) return { num: 2, ...WAYPOINTS.restroomStall2 };
    if (!occupiedStalls[3]) return { num: 3, ...WAYPOINTS.restroomStall3 };
    return null;
  };

  // Add event helper
  const addTranscriptEvent = (ev: Omit<TranscriptEvent, 'id' | 'timestamp'>) => {
    const newEv: TranscriptEvent = {
      ...ev,
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTranscriptEvents((prev) => [newEv, ...prev.slice(0, 99)]);
  };

  // Main Simulation Loop (1 second tick)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActors((prevActors) => {
        return prevActors.map((actor) => {
          let updated = { ...actor };

          // Step 1: Update physiological needs
          updated.thirst = Math.min(100, updated.thirst + 1.2 * speedMultiplier);
          updated.bathroom = Math.min(100, updated.bathroom + 0.8 * speedMultiplier);
          updated.energy = Math.max(0, updated.energy - 0.5 * speedMultiplier);
          updated.contextTokens = Math.min(200000, updated.contextTokens + 180 * speedMultiplier);

          // Step 2: Auto-compaction if nearing 200k tokens
          if (updated.contextTokens >= 190000 && !updated.isCompacting) {
            updated.isCompacting = true;
            soundFx.playAlert();
            addTranscriptEvent({
              agentId: updated.id,
              agentName: updated.name,
              type: 'ContextCompaction',
              summary: `Contexto do agente atingiu 190k/200k tokens. Executando Compactação de Memória!`,
              toolName: 'ContextCompactor',
            });
            setTimeout(() => {
              setActors((acts) =>
                acts.map((a) => (a.id === updated.id ? { ...a, contextTokens: 38000, isCompacting: false } : a))
              );
            }, 3000);
          }

          // Step 3: Decrement current state timer
          updated.stateTimer -= 1 * speedMultiplier;

          // State Machine: Actions when timer runs out
          if (updated.stateTimer <= 0) {
            if (updated.state === 'WORKING') {
              // Decide next action based on needs
              if (updated.thirst >= 75) {
                // Go to water cooler
                updated.state = 'WALKING';
                updated.targetX = WAYPOINTS.waterCooler.x + (Math.random() * 20 - 10);
                updated.targetY = WAYPOINTS.waterCooler.y + 20;
                updated.thought = 'A caminhar até ao bebedouro para beber água fresca...';
                updated.stateTimer = 14;
              } else if (updated.energy <= 40) {
                // Go to coffee machine
                updated.state = 'WALKING';
                updated.targetX = WAYPOINTS.coffeeMachine.x;
                updated.targetY = WAYPOINTS.coffeeMachine.y + 20;
                updated.thought = 'A caminhar para a máquina de café espresso.';
                updated.stateTimer = 14;
              } else if (updated.bathroom >= 80) {
                // Check free restroom stall
                const stall = getFreeStall();
                if (stall) {
                  updated.state = 'WALKING';
                  updated.targetX = stall.x;
                  updated.targetY = stall.y;
                  updated.thought = `A dirigir-se à casa de banho (Cabine ${stall.num}).`;
                  updated.stateTimer = 18;
                  setOccupiedStalls((prev) => ({ ...prev, [stall.num]: updated.id }));
                }
              } else if (updated.isCEO && Math.random() < 0.4) {
                // CEO strolls to inspect a department or whiteboard
                const targetArea = Math.random() < 0.5 ? WAYPOINTS.serverRoom : WAYPOINTS.confTable;
                updated.state = 'WALKING';
                updated.targetX = targetArea.x + (Math.random() * 40 - 20);
                updated.targetY = targetArea.y + (Math.random() * 30 - 15);
                updated.thought = 'Em ronda de supervisão pelas equipas e métricas.';
                updated.stateTimer = 20;
              } else {
                // Stay working at desk, refresh thought
                updated.stateTimer = 12 + Math.floor(Math.random() * 12);
                if (Math.random() < 0.25) {
                  soundFx.playKeyboard();
                }
              }
            } else if (updated.state === 'WALKING') {
              // Check proximity to destination
              const dist = Math.hypot(updated.targetX - updated.x, updated.targetY - updated.y);
              if (dist < 20) {
                // Arrived at destination!
                if (Math.hypot(updated.x - WAYPOINTS.waterCooler.x, updated.y - (WAYPOINTS.waterCooler.y + 20)) < 40) {
                  updated.state = 'DRINKING';
                  updated.stateTimer = 8;
                  updated.thirst = 0;
                  updated.thought = 'A encher o copo e a beber água no bebedouro. Glug glug!';
                  soundFx.playWaterGulp();
                  addTranscriptEvent({
                    agentId: updated.id,
                    agentName: updated.name,
                    type: 'LifeRoutine',
                    summary: 'Pausa para beber água no bebedouro de galão gelado.',
                    toolName: 'WaterCooler',
                  });
                } else if (Math.hypot(updated.x - WAYPOINTS.coffeeMachine.x, updated.y - (WAYPOINTS.coffeeMachine.y + 20)) < 40) {
                  updated.state = 'COFFEE';
                  updated.stateTimer = 9;
                  updated.energy = 95;
                  updated.thought = 'A tirar um café espresso duplo quentinho!';
                  soundFx.playCoffee();
                  addTranscriptEvent({
                    agentId: updated.id,
                    agentName: updated.name,
                    type: 'LifeRoutine',
                    summary: 'Preparou um café espresso na copa.',
                    toolName: 'EspressoMaker',
                  });
                } else if (updated.y < 120 && updated.x > 620) {
                  // Inside bathroom
                  updated.state = 'BATHROOM';
                  updated.stateTimer = 10;
                  updated.bathroom = 0;
                  updated.thought = 'Na cabine sanitária. Porta trancada com indicador ocupado.';
                } else {
                  // Reached temporary spot, walk back home
                  updated.state = 'WALKING';
                  updated.targetX = updated.homeX;
                  updated.targetY = updated.homeY;
                  updated.thought = 'A regressar à secretária de trabalho.';
                  updated.stateTimer = 16;
                }
              }
            } else if (updated.state === 'DRINKING' || updated.state === 'COFFEE' || updated.state === 'BATHROOM') {
              // Finish routine and return home
              if (updated.state === 'BATHROOM') {
                // Free any stall occupied by this actor
                setOccupiedStalls((prev) => {
                  const nextStalls = { ...prev };
                  if (nextStalls[1] === updated.id) nextStalls[1] = null;
                  if (nextStalls[2] === updated.id) nextStalls[2] = null;
                  if (nextStalls[3] === updated.id) nextStalls[3] = null;
                  return nextStalls;
                });
              }

              updated.state = 'WALKING';
              updated.targetX = updated.homeX;
              updated.targetY = updated.homeY;
              updated.thought = 'A regressar à secretária para retomar tarefas.';
              updated.stateTimer = 16;
            }
          }

          // Step 4: Step movement towards targetX/targetY
          if (updated.x !== updated.targetX || updated.y !== updated.targetY) {
            const dx = updated.targetX - updated.x;
            const dy = updated.targetY - updated.y;
            const dist = Math.hypot(dx, dy);
            const stepSpeed = 3.8 * speedMultiplier;

            if (dist <= stepSpeed) {
              updated.x = updated.targetX;
              updated.y = updated.targetY;
            } else {
              updated.x += (dx / dist) * stepSpeed;
              updated.y += (dy / dist) * stepSpeed;

              // Facing orientation
              if (Math.abs(dx) > Math.abs(dy)) {
                updated.facing = dx > 0 ? 'right' : 'left';
              } else {
                updated.facing = dy > 0 ? 'down' : 'up';
              }
            }
            updated.stepCycle = (updated.stepCycle + 1) % 4;
          }

          return updated;
        });
      });

      // Step 5: Update Pets wandering
      setPets((prevPets) =>
        prevPets.map((pet) => {
          let updatedPet = { ...pet };
          if (Math.random() < 0.25) {
            // Pick new gentle target
            const ox = 200 + Math.random() * 450;
            const oy = 140 + Math.random() * 400;
            updatedPet.targetX = ox;
            updatedPet.targetY = oy;
            updatedPet.facing = ox > updatedPet.x ? 'right' : 'left';
          }
          const dx = updatedPet.targetX - updatedPet.x;
          const dy = updatedPet.targetY - updatedPet.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 2) {
            updatedPet.x += (dx / dist) * 1.5;
            updatedPet.y += (dy / dist) * 1.5;
          }
          return updatedPet;
        })
      );

      // Step 6: Update Ghosts progress
      setGhosts((prevGhosts) =>
        prevGhosts.map((g) => {
          let updatedG = { ...g, progress: Math.min(100, g.progress + 6) };
          const dx = g.targetX - g.x;
          const dy = g.targetY - g.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 3) {
            updatedG.x += (dx / dist) * 2.5;
            updatedG.y += (dy / dist) * 2.5;
          }
          if (updatedG.progress >= 100) {
            // Completed! Reposition to random parent
            updatedG.progress = 10;
            updatedG.x = 200 + Math.random() * 300;
            updatedG.y = 200 + Math.random() * 200;
            updatedG.targetX = 600 + Math.random() * 200;
            updatedG.targetY = 250 + Math.random() * 200;
          }
          return updatedG;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, speedMultiplier]);

  // Pet interaction
  const handlePetThePet = (petId: string) => {
    soundFx.playPet();
    setPets((prev) =>
      prev.map((p) => {
        if (p.id === petId) {
          const nextCount = p.petCount + 1;
          addTranscriptEvent({
            agentId: p.id,
            agentName: p.name,
            type: 'LifeRoutine',
            summary: `Recebeu festinhas! Nível de felicidade atingiu 100%. Mimos totais: ${nextCount}.`,
            toolName: 'PetInteraction',
          });
          return {
            ...p,
            happiness: 100,
            petCount: nextCount,
            thought: 'Ronrom / au-au feliz! Obrigado pelos mimos!',
          };
        }
        return p;
      })
    );
  };

  // Layout Editor Handlers
  const handleToggleEditor = () => {
    setIsEditorActive(!isEditorActive);
    if (!isEditorActive) {
      setSelectedFurniture(null);
    }
  };

  const handleRotateSelectedFurniture = () => {
    if (!selectedFurniture) return;
    setFurniture((prev) =>
      prev.map((f) => {
        if (f.id === selectedFurniture.id) {
          const nextRot = ((f.rotation + 90) % 360) as OfficeFurnitureItem['rotation'];
          const updated = { ...f, rotation: nextRot };
          setSelectedFurniture(updated);
          return updated;
        }
        return f;
      })
    );
  };

  const handleDeleteSelectedFurniture = () => {
    if (!selectedFurniture) return;
    setFurniture((prev) => prev.filter((f) => f.id !== selectedFurniture.id));
    setSelectedFurniture(null);
  };

  const handleAddFurniture = (
    type: string,
    name: string,
    category: OfficeFurnitureItem['category'],
    w: number,
    h: number,
    color: string
  ) => {
    const newItem: OfficeFurnitureItem = {
      id: `f-${Date.now()}`,
      type,
      name,
      category,
      col: 10 + Math.floor(Math.random() * 5),
      row: 8 + Math.floor(Math.random() * 5),
      width: w,
      height: h,
      rotation: 0,
      color,
      interactive: true,
    };
    setFurniture((prev) => [...prev, newItem]);
    setSelectedFurniture(newItem);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pixel_agents_layout', JSON.stringify([...furniture, newItem]));
    }
  };

  const handleExportLayout = () => {
    const layoutJson = JSON.stringify({ areas, furniture, floorTheme, version: '1.5.0' }, null, 2);
    navigator.clipboard.writeText(layoutJson);
    alert('Layout exportado! O JSON foi copiado para a sua área de transferência para uso no Pixel Agents.');
  };

  const handleImportLayout = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) {
        setFurniture(parsed);
      } else if (parsed.furniture) {
        setFurniture(parsed.furniture);
        if (parsed.floorTheme) setFloorTheme(parsed.floorTheme);
      }
      soundFx.playPowerup();
      alert('Layout importado com sucesso!');
    } catch {
      alert('Erro ao interpretar JSON. Verifique a sintaxe.');
    }
  };

  const handleResetLayout = () => {
    setFurniture(DEFAULT_OFFICE_FURNITURE);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pixel_agents_layout');
    }
  };

  // Simulate event trigger
  const handleSimulateEvent = (type: TranscriptEvent['type']) => {
    if (type === 'PermissionRequest') {
      soundFx.playPromptChime();
      addTranscriptEvent({
        agentId: 'agent-dir-1',
        agentName: 'Robo-Diretor Alpha',
        type: 'PermissionRequest',
        summary: 'Requer aprovação manual para rebalancear 1,500 USDT em SOL/USDT.',
        toolName: 'ConsensusOrchestrator',
      });
      setActiveSpeechActorId('agent-dir-1');
    } else if (type === 'PreToolUse') {
      soundFx.playGhostWhoosh();
      const newGhost: GhostSubAgent = {
        id: `ghost-${Date.now()}`,
        parentAgentId: 'agent-tech-1',
        parentAgentName: 'Robo-Engenheiro Master',
        task: 'Otimização de gas em smart contracts',
        x: 440,
        y: 300,
        targetX: 780,
        targetY: 340,
        progress: 10,
        opacity: 0.9,
        glowColor: '#a855f7',
        status: 'RUNNING',
        toolUsed: 'SmartContractAuditor',
      };
      setGhosts((prev) => [...prev, newGhost]);
      addTranscriptEvent({
        agentId: 'agent-tech-1',
        agentName: 'Robo-Engenheiro Master',
        type: 'PreToolUse',
        summary: 'Invocou Ghost Sub-Agent para auditoria assíncrona de Smart Contracts.',
        toolName: 'SmartContractAuditor',
      });
    } else if (type === 'ContextCompaction') {
      soundFx.playAlert();
      addTranscriptEvent({
        agentId: 'trader-1',
        agentName: 'Trader 01 BTC',
        type: 'ContextCompaction',
        summary: 'Janela de contexto excedeu 185k tokens. Memória compactada para 35k tokens.',
        toolName: 'ContextCompactor',
      });
      setActors((prev) =>
        prev.map((a) => (a.id === 'trader-1' ? { ...a, contextTokens: 35000, isCompacting: true } : a))
      );
      setTimeout(() => {
        setActors((prev) => prev.map((a) => (a.id === 'trader-1' ? { ...a, isCompacting: false } : a)));
      }, 2500);
    }
  };

  return (
    <div className="relative w-full flex flex-col bg-slate-950 border-2 border-amber-500/80 rounded-2xl overflow-hidden shadow-2xl select-none">
      {/* Top HUD Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
        {/* Title & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-pixel text-amber-400 text-xs tracking-tight">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>PIXEL AGENTS HQ · ESCRITÓRIO VIRTUAL V1.5</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">
              30 Agentes + 8 Traders + 4 Pets + {ghosts.length} Ghosts
            </span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Areas overlay toggle */}
          <button
            onClick={() => setShowAreas(!showAreas)}
            className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors ${
              showAreas
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Exibir/Ocultar delimitações de áreas do escritório"
          >
            Áreas: {showAreas ? 'ON' : 'OFF'}
          </button>

          {/* Speed & Pause */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              isPaused ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Retomar' : 'Pausar'}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[11px]">
            <span>Velocidade:</span>
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => setSpeedMultiplier(spd)}
                className={`px-1.5 py-0.5 rounded font-mono ${
                  speedMultiplier === spd ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-950 px-1.5 py-1 rounded border border-slate-800">
            <button
              onClick={() => setZoom(Math.max(0.75, zoom - 0.15))}
              className="p-1 hover:text-amber-400 text-slate-400"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-300 w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(Math.min(1.5, zoom + 0.15))}
              className="p-1 hover:text-amber-400 text-slate-400"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded transition-colors ${
              isMuted ? 'bg-rose-900/50 text-rose-300 border border-rose-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title={isMuted ? 'Ativar Efeitos Sonoros 8-Bit' : 'Desativar Som'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Reunião de emergência */}
          <button
            onClick={() => {
              soundFx.playAlert();
              onOpenMeetingRoom();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-pixel transition-all"
          >
            <Users className="w-3 h-3 text-amber-400" />
            <span>SALA DE REUNIÃO</span>
          </button>
        </div>
      </div>

      {/* Layout Editor Toolbar (Built-in customization like Pixel Agents) */}
      <LayoutEditorToolbar
        isEditorActive={isEditorActive}
        onToggleEditor={handleToggleEditor}
        selectedFurniture={selectedFurniture}
        onRotateSelected={handleRotateSelectedFurniture}
        onDeleteSelected={handleDeleteSelectedFurniture}
        onAddFurniture={handleAddFurniture}
        floorTheme={floorTheme}
        onChangeFloorTheme={setFloorTheme}
        onExportLayout={handleExportLayout}
        onImportLayout={handleImportLayout}
        onResetLayout={handleResetLayout}
        furnitureCount={furniture.length}
      />

      {/* Main Office Canvas Viewport */}
      <div className="relative w-full h-[640px] md:h-[720px] overflow-auto bg-slate-950 flex items-center justify-center p-4">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out',
            width: '880px',
            height: '680px',
          }}
          className={`relative shrink-0 rounded-xl overflow-hidden border-4 border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] ${
            floorTheme === 'parquet'
              ? 'bg-[#1e1b18]'
              : floorTheme === 'carpet'
              ? 'bg-[#0f172a]'
              : floorTheme === 'tech'
              ? 'bg-[#050b14]'
              : 'bg-[#18181b]'
          }`}
        >
          {/* FLOOR PATTERNS & TILE GRID (24px grid cells) */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {floorTheme === 'parquet' && (
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(245, 158, 11, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(245, 158, 11, 0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px',
                }}
              />
            )}
            {floorTheme === 'carpet' && (
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px',
                }}
              />
            )}
            {floorTheme === 'tech' && (
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    radial-gradient(circle, rgba(16, 185, 129, 0.2) 1px, transparent 1px),
                    linear-gradient(to right, rgba(16, 185, 129, 0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px',
                }}
              />
            )}
            {floorTheme === 'checker' && (
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #18181b 25%, transparent 25%),
                    linear-gradient(-45deg, #18181b 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #18181b 75%),
                    linear-gradient(-45deg, transparent 75%, #18181b 75%)
                  `,
                  backgroundSize: '32px 32px',
                }}
              />
            )}
          </div>

          {/* AREAS OVERLAY (Pixel Agents Named Areas) */}
          {showAreas &&
            areas.map((area) => (
              <div
                key={area.id}
                style={{
                  left: area.bounds.x1,
                  top: area.bounds.y1,
                  width: area.bounds.x2 - area.bounds.x1,
                  height: area.bounds.y2 - area.bounds.y1,
                  borderColor: `${area.color}40`,
                  backgroundColor: `${area.color}08`,
                }}
                className="absolute border border-dashed rounded-lg pointer-events-none z-0"
              >
                <div
                  style={{ backgroundColor: `${area.color}25`, color: area.color }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 m-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider backdrop-blur-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: area.color }} />
                  <span>{area.name}</span>
                </div>
              </div>
            ))}

          {/* ROOM WALLS & CORRIDORS */}
          {/* Main Horizontal Divider Wall */}
          <div className="absolute top-[225px] left-0 right-0 h-2 bg-slate-800 border-y border-slate-700 shadow-md z-1" />
          {/* Vertical Wall Left (CEO & Trading Floor partition) */}
          <div className="absolute top-0 bottom-[160px] left-[250px] w-2 bg-slate-800 border-x border-slate-700 shadow-md z-1" />
          {/* Vertical Wall Right (Breakroom / Restroom partition) */}
          <div className="absolute top-0 bottom-[160px] left-[610px] w-2 bg-slate-800 border-x border-slate-700 shadow-md z-1" />
          {/* Meeting Room Bottom Partition */}
          <div className="absolute top-[530px] left-[270px] right-[230px] h-2 bg-slate-800 border-y border-slate-700 shadow-md z-1" />

          {/* FURNITURE RENDERING */}
          {furniture.map((item) => {
            const isSelected = selectedFurniture?.id === item.id;
            const x = item.col * 24;
            const y = item.row * 24;
            const w = item.width * 24;
            const h = item.height * 24;

            return (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playBlip(550);
                  setSelectedFurniture(item);
                }}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${w}px`,
                  height: `${h}px`,
                  transform: `rotate(${item.rotation}deg)`,
                  transformOrigin: 'center center',
                }}
                className={`absolute rounded transition-all cursor-pointer z-10 flex items-center justify-center select-none ${
                  isSelected
                    ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 shadow-[0_0_15px_#f59e0b]'
                    : 'hover:brightness-125'
                }`}
                title={`${item.name} (${item.type})`}
              >
                {/* Custom rendering based on furniture type */}
                {item.type === 'water_cooler' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-between p-1 bg-sky-950/80 border-2 border-sky-500 rounded-md shadow-lg">
                    {/* Blue Water Bottle with bubbles */}
                    <div className="w-4 h-6 rounded-t-full bg-cyan-400/80 border border-cyan-200 relative overflow-hidden shadow-inner flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce -mt-1" />
                    </div>
                    {/* Dispenser Taps */}
                    <div className="w-full flex justify-around px-1 py-0.5 bg-slate-900 rounded">
                      <span className="w-1.5 h-2 bg-blue-500 rounded-t" />
                      <span className="w-1.5 h-2 bg-red-500 rounded-t" />
                    </div>
                    {/* Label */}
                    <span className="text-[7px] font-mono text-cyan-300 font-bold uppercase">ÁGUA</span>
                  </div>
                )}

                {item.type === 'coffee_espresso' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-1 bg-amber-950 border-2 border-amber-600 rounded shadow-md">
                    <Coffee className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="text-[6px] font-mono text-amber-300 font-bold uppercase mt-0.5">CAFÉ</span>
                  </div>
                )}

                {item.type === 'vending_machine' && (
                  <div className="w-full h-full bg-pink-950 border-2 border-pink-500 rounded-lg p-1 flex flex-col justify-between shadow-lg">
                    <div className="w-full h-5 bg-slate-900 rounded border border-pink-700/60 flex items-center justify-around px-0.5">
                      <span className="w-1 h-2 bg-amber-400 rounded-xs" />
                      <span className="w-1 h-2 bg-cyan-400 rounded-xs" />
                      <span className="w-1 h-2 bg-emerald-400 rounded-xs" />
                      <span className="w-1 h-2 bg-rose-400 rounded-xs" />
                    </div>
                    <span className="text-[7px] font-mono text-pink-300 text-center font-bold">SNACKS</span>
                  </div>
                )}

                {item.type === 'wc_stall' && (
                  <div className="w-full h-full bg-slate-900 border-2 border-slate-600 rounded-lg p-1.5 flex flex-col justify-between relative shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono text-slate-400 font-bold">WC</span>
                      {/* Occupied / Free LED Indicator */}
                      {Object.values(occupiedStalls).some(Boolean) ? (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e] animate-pulse" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                      )}
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded border border-slate-700" />
                  </div>
                )}

                {item.type === 'server_rack' && (
                  <div className="w-full h-full bg-slate-950 border-2 border-emerald-500 rounded-md p-1 flex flex-col justify-around shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    {[1, 2, 3].map((slot) => (
                      <div key={slot} className="w-full h-2 bg-slate-900 rounded flex items-center justify-between px-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        <span className="w-1 h-1 rounded-full bg-amber-400" />
                      </div>
                    ))}
                    <span className="text-[6px] font-mono text-emerald-400 text-center font-bold">H100 GPU</span>
                  </div>
                )}

                {item.type === 'whiteboard_arch' && (
                  <div className="w-full h-full bg-slate-100 border-2 border-slate-400 rounded p-1 flex flex-col justify-between shadow-md">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-[7px] font-mono text-slate-900 font-bold">ARQUITETURA & HEURÍSTICAS</span>
                    </div>
                    <div className="w-full h-1 bg-blue-300 rounded" />
                  </div>
                )}

                {item.type === 'conf_table' && (
                  <div className="w-full h-full bg-sky-950 border-2 border-sky-500 rounded-3xl flex items-center justify-center p-2 shadow-xl">
                    <span className="text-[10px] font-mono text-sky-300 font-bold tracking-wider">
                      MESA DE REUNIÃO DE CONSENSO
                    </span>
                  </div>
                )}

                {item.type === 'plant_monstera' && (
                  <div className="w-full h-full rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center shadow-lg">
                    <span className="text-emerald-400 text-xs">🌿</span>
                  </div>
                )}

                {item.type === 'pet_bed' && (
                  <div className="w-full h-full rounded-xl bg-rose-950/70 border-2 border-rose-500 flex items-center justify-center p-1 shadow-inner">
                    <Heart className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  </div>
                )}

                {/* Generic Desk & Electronics Fallback */}
                {item.type.includes('desk') && (
                  <div className="w-full h-full bg-amber-950/80 border-2 border-amber-600 rounded-lg flex flex-col items-center justify-center p-1 shadow-md">
                    <span className="text-[8px] font-mono text-amber-200 font-bold">{item.name}</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* GHOST SUB-AGENTS (Headless Asynchronous Task Runners) */}
          {ghosts.map((ghost) => (
            <div
              key={ghost.id}
              style={{
                left: `${ghost.x}px`,
                top: `${ghost.y}px`,
                opacity: ghost.opacity,
              }}
              className="absolute z-25 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-300"
            >
              {/* Ethereal Glow & Ghost Aura */}
              <div
                style={{
                  boxShadow: `0 0 20px ${ghost.glowColor}`,
                  borderColor: ghost.glowColor,
                }}
                className="w-7 h-7 rounded-full bg-slate-950/80 border-2 flex items-center justify-center animate-pulse"
              >
                <GhostIcon style={{ color: ghost.glowColor }} className="w-4 h-4 animate-bounce" />
              </div>

              {/* Task Tag Floating */}
              <div
                style={{ borderColor: ghost.glowColor }}
                className="mt-1 px-1.5 py-0.5 rounded bg-slate-950/90 border text-[8px] font-mono text-cyan-300 whitespace-nowrap shadow-md flex items-center gap-1"
              >
                <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
                <span>{ghost.task}</span>
              </div>
            </div>
          ))}

          {/* OFFICE PETS (Interactive & Pettable) */}
          {pets.map((pet) => (
            <div
              key={pet.id}
              onClick={(e) => {
                e.stopPropagation();
                handlePetThePet(pet.id);
              }}
              style={{
                left: `${pet.x}px`,
                top: `${pet.y}px`,
              }}
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group select-none"
              title={`${pet.name} — Clique para fazer mimos!`}
            >
              {/* Pet Speech Bubble on Click/Thought */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-amber-400 px-2 py-0.5 rounded text-[8px] font-mono text-amber-300 whitespace-nowrap shadow-lg z-30 pointer-events-none">
                {pet.thought} ({pet.petCount} mimos)
              </div>

              {/* Pet Pixel Sprites */}
              <div className="relative flex items-center justify-center p-1 rounded-full hover:scale-125 transition-transform bg-slate-900/60 border border-slate-700">
                {pet.species === 'corgi' && <span className="text-base">🐕</span>}
                {pet.species === 'cat' && <span className="text-base">🐈</span>}
                {pet.species === 'cyber_pup' && <span className="text-base">🤖</span>}
                {pet.species === 'duck' && <span className="text-base">🦆</span>}

                {/* Heart on hover / happy */}
                <Heart className="w-2.5 h-2.5 text-rose-500 absolute -top-1 -right-1 opacity-80 animate-ping" />
              </div>
            </div>
          ))}

          {/* LIVING AI AGENTS & TRADERS */}
          {actors.map((actor) => {
            const isSelected = selectedAgentId === actor.id || selectedTradingRobotId === actor.id;
            const isCEO = actor.isCEO;
            const isTrader = actor.isTrader;
            const isWalking = actor.state === 'WALKING';
            const contextPercent = Math.round((actor.contextTokens / actor.maxTokens) * 100);

            // Context window gauge color
            const getGaugeColor = (pct: number) => {
              if (pct < 50) return '#10b981'; // Green
              if (pct < 80) return '#f59e0b'; // Amber
              return '#f43f5e'; // Red warning
            };

            return (
              <div
                key={actor.id}
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playBlip(700);
                  setActiveSpeechActorId(actor.id);
                  if (actor.isTrader) {
                    onSelectTradingRobot(actor.originalData as TradingRobot);
                  } else {
                    onSelectAgent(actor.originalData as AgentRobot);
                  }
                }}
                style={{
                  left: `${actor.x}px`,
                  top: `${actor.y}px`,
                }}
                className={`absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center transition-all duration-300 group select-none ${
                  isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                }`}
                title={`${actor.name} (${actor.role})`}
              >
                {/* SPEECH BUBBLE (Pixel Agents Live Action Bubble) */}
                {(activeSpeechActorId === actor.id || actor.state !== 'WORKING') && (
                  <div className="absolute -top-11 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-fadeIn">
                    <div className="relative px-2 py-1 rounded-md bg-slate-900 border-2 border-amber-400 shadow-[0_4px_12px_rgba(0,0,0,0.8)] flex items-center gap-1.5 whitespace-nowrap text-[9px] font-mono text-slate-100">
                      {/* Dynamic Icon */}
                      {actor.state === 'DRINKING' && <Droplets className="w-3 h-3 text-cyan-400 animate-bounce" />}
                      {actor.state === 'COFFEE' && <Coffee className="w-3 h-3 text-amber-400 animate-pulse" />}
                      {actor.state === 'BATHROOM' && <span className="text-[10px]">🚻</span>}
                      {actor.state === 'WALKING' && <Footprints className="w-3 h-3 text-slate-300 animate-pulse" />}
                      {actor.state === 'WORKING' && <Code2 className="w-3 h-3 text-emerald-400" />}

                      <span className="font-semibold text-amber-300 truncate max-w-[170px]">{actor.thought}</span>

                      {/* Speech bubble pointy arrow */}
                      <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 border-r-2 border-b-2 border-amber-400 rotate-45" />
                    </div>
                  </div>
                )}

                {/* LLM CONTEXT WINDOW GAUGE (Circular or Pill Indicator above head) */}
                <div
                  className="mb-0.5 px-1 py-0.2 rounded-full bg-slate-950/90 border border-slate-700 flex items-center gap-1 shadow-sm"
                  title={`Janela de Contexto LLM: ${(actor.contextTokens / 1000).toFixed(1)}k / 200k tokens (${contextPercent}%)`}
                >
                  <span
                    style={{ backgroundColor: getGaugeColor(contextPercent) }}
                    className="w-1.5 h-1.5 rounded-full"
                  />
                  <span className="text-[7px] font-mono text-slate-300 font-bold">{contextPercent}%</span>
                </div>

                {/* SPRITE BODY */}
                <div className="relative flex flex-col items-center">
                  {/* Crown for CEO / Golden Supervisor */}
                  {isCEO ? (
                    <div className="w-4 h-2 bg-amber-400 border border-amber-600 rounded-t-sm flex justify-between px-0.5 -mb-0.5 z-10 shadow-sm">
                      <span className="w-0.5 h-0.5 bg-white rounded-full" />
                      <span className="w-0.5 h-1 bg-white rounded-full -mt-0.5" />
                      <span className="w-0.5 h-0.5 bg-white rounded-full" />
                    </div>
                  ) : actor.isSupervisor ? (
                    <div className="w-3 h-1.5 bg-amber-300 border border-amber-500 rounded-t-xs -mb-0.5 z-10" />
                  ) : (
                    <div className="w-0.5 h-1.5 bg-slate-400 -mb-0.5" />
                  )}

                  {/* Head */}
                  <div
                    style={{ backgroundColor: actor.chassisColor }}
                    className="w-6 h-4 rounded-sm border-2 border-slate-950 flex items-center justify-center relative overflow-hidden shadow-sm"
                  >
                    {/* Glowing Eyes / Screen */}
                    <div className="w-4 h-2 bg-slate-950 rounded-xs flex items-center justify-around px-0.5">
                      {actor.state === 'DRINKING' ? (
                        <span className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
                      ) : actor.state === 'COFFEE' ? (
                        <span className="w-1 h-1 bg-amber-400 rounded-full animate-ping" />
                      ) : (
                        <>
                          <span className="w-1 h-1 bg-cyan-300 rounded-full shadow-[0_0_4px_#38bdf8]" />
                          <span className="w-1 h-1 bg-cyan-300 rounded-full shadow-[0_0_4px_#38bdf8]" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Torso & Feet (walking animation) */}
                  <div
                    style={{ backgroundColor: actor.chassisColor }}
                    className="w-5 h-3 rounded-b-xs border-2 border-t-0 border-slate-950 flex items-center justify-center relative shadow-inner"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
                  </div>

                  {/* Feet step cycle */}
                  {isWalking && (
                    <div className="flex justify-between w-4 -mt-0.5">
                      <span
                        className={`w-1.5 h-1 bg-slate-900 rounded-xs ${actor.stepCycle % 2 === 0 ? '-translate-y-0.5' : ''}`}
                      />
                      <span
                        className={`w-1.5 h-1 bg-slate-900 rounded-xs ${actor.stepCycle % 2 !== 0 ? '-translate-y-0.5' : ''}`}
                      />
                    </div>
                  )}
                </div>

                {/* Name Tag */}
                <div className="mt-0.5 px-1 rounded bg-slate-950/80 border border-slate-800 text-[7px] font-mono text-slate-300 truncate max-w-[70px]">
                  {actor.name.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Live JSONL Transcript Console */}
      <LiveTranscriptConsole
        events={transcriptEvents}
        onSimulateEvent={handleSimulateEvent}
        onClearEvents={() => setTranscriptEvents([])}
        selectedAgentId={selectedAgentId}
      />
    </div>
  );
};
