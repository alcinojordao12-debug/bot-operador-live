export type DepartmentId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type RobotStatus = 
  | 'IDLE' 
  | 'BUSY' 
  | 'WAITING' 
  | 'ERROR' 
  | 'PAUSED' 
  | 'LEARNING'
  | 'ANALYZING'
  | 'VERIFYING';

export type VisorStatus =
  | 'ANALISAR BTC'
  | 'A INVESTIGAR SOL'
  | 'A VALIDAR DADOS'
  | 'A TESTAR ESTRATÉGIA'
  | 'A ESTUDAR ERROS'
  | 'A TREINAR MODELO'
  | 'A VERIFICAR RISCO'
  | 'MONITORIZAR ORDEM'
  | 'À ESPERA DE DADOS'
  | 'BLOQUEADO POR ERRO'
  | 'TAREFA CONCLUÍDA'
  | 'INATIVO'
  | 'PAUSADO'
  | 'EM REUNIÃO';

export interface AgentMemoryItem {
  id: string;
  timestamp: string;
  category: 'APRENDIZAGEM' | 'ERRO_CORRIGIDO' | 'HEURISTICA' | 'FONTE';
  title: string;
  description: string;
  confidenceScore: number;
}

export interface AgentRobot {
  id: string;
  name: string;
  departmentId: DepartmentId;
  role: string;
  isSupervisor: boolean;
  visorText: string;
  status: RobotStatus;
  currentTask: string;
  taskProgress: number | null; // null if continuous
  memory: AgentMemoryItem[];
  recentLearnings: string[];
  recentErrors: string[];
  dataSources: string[];
  tools: string[];
  deskPosition: {
    room: string;
    col: number; // grid column within room
    row: number; // grid row within room
    direction: 'up' | 'down' | 'left' | 'right';
  };
  chassisColor: string;
  antennaType: 'crown' | 'radar' | 'light' | 'dual' | 'quant';
  lifeActivity?: 'WORKING' | 'WALKING' | 'DRINKING' | 'BATHROOM' | 'INSPECTING' | 'CHATTING';
  currentThought?: string;
  hydrationLevel?: number; // 0-100
  bathroomLevel?: number; // 0-100
  energyLevel?: number; // 0-100
}

export type TradingDecision = 'BUY' | 'SELL' | 'HOLD' | 'NO_TRADE' | 'EXIT' | 'BLOCKED';

export interface DecisionLog {
  id: string;
  timestamp: string;
  action: TradingDecision;
  asset: string;
  price: number;
  reason: string;
  confidence: number;
  risksIdentified: string[];
  invalidationCriteria: string;
  authorizationState: 'APPROVED' | 'AUTO_REJECTED' | 'MANUAL_PENDING' | 'EXECUTED_SIM';
}

export interface TradingRobot {
  id: string;
  number: number;
  name: string;
  specialty: string;
  assignedAsset: string;
  status: 'ANALYZING' | 'WAITING' | 'HOLDING' | 'ORDER_OPEN' | 'ALERT' | 'SAFE_LOCKED';
  activeStrategy: string;
  currentDecision: TradingDecision;
  dataSource: string;
  lastUpdate: string;
  currentPosition: {
    size: number;
    side: 'LONG' | 'SHORT';
    entryPrice: number;
    currentPrice: number;
    pnl: number;
    pnlPercent: number;
    isSimulated: boolean;
  } | null;
  decisionHistory: DecisionLog[];
  tradesHistory: Array<{
    id: string;
    timestamp: string;
    asset: string;
    side: 'BUY' | 'SELL';
    price: number;
    amount: number;
    pnl: number;
    fees: number;
    isSimulated: boolean;
  }>;
  realConfirmedResults: {
    winRate: number;
    totalPnl: number;
    tradeCount: number;
    isVerified: boolean;
  };
  simulatedResults: {
    winRate: number;
    totalPnl: number;
    tradeCount: number;
  };
  feesPaid: number;
  currentExposure: number; // in USD
  riskLimits: {
    maxDrawdownPct: number;
    maxOrderSizeUSD: number;
    maxAssetExposureUSD: number;
    minLiquidityUSD: number;
    maxSlippagePct: number;
  };
  recentErrors: string[];
  learningState: string;
  supervisor: string;
  deskPosition: {
    col: number;
    row: number;
  };
  screenColor: string;
}

export interface Department {
  id: DepartmentId;
  code: string;
  name: string;
  shortName: string;
  agentCount: number;
  supervisorName: string;
  supervisorId: string;
  description: string;
  responsibilities: string[];
  color: string;
  badgeBg: string;
  roomName: string;
  iconName: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: 'BAIXA' | 'NORMAL' | 'ALTA' | 'CRÍTICA';
  departmentId: DepartmentId;
  agentId: string;
  supervisorId: string;
  status: 'PENDENTE' | 'PLANEADA' | 'EM EXECUÇÃO' | 'À ESPERA' | 'BLOQUEADA' | 'FALHOU' | 'CONCLUÍDA' | 'CANCELADA';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  dependencies: string[];
  result?: string;
  errors?: string[];
  evidences?: string;
}

export interface CollectiveMemoryReport {
  id: string;
  timestamp: string;
  departmentId: DepartmentId;
  departmentName: string;
  supervisor: string;
  title: string;
  summary: string;
  keyFindings: string[];
  confirmedLessons: string[];
  approvedStrategies: string[];
  rejectedStrategies: string[];
  incidentsReported: string[];
}

export interface CryptoMarketAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  lastUpdated: string;
  source: 'COINGECKO_API' | 'BINANCE_API' | 'SIMULATION_FALLBACK';
  dataQuality: 'DADOS AO VIVO' | 'DADOS EM CACHE' | 'DADOS HISTÓRICOS' | 'DADOS DE SIMULAÇÃO';
}

export type SystemMode = 'RESEARCH' | 'TRAINING' | 'BACKTEST' | 'PAPER' | 'LIVE' | 'SAFE';

export interface AuditPhase {
  number: number;
  name: string;
  description: string;
  status: 'IMPLEMENTADA E TESTADA' | 'IMPLEMENTADA, MAS NÃO TOTALMENTE VALIDADA' | 'PARCIALMENTE IMPLEMENTADA' | 'BLOQUEADA' | 'NÃO IMPLEMENTADA';
  progressPct: number;
  verifiedEvidence: string;
}

// ==================== PIXEL AGENTS ARCHITECTURE TYPES ====================

export interface GhostSubAgent {
  id: string;
  parentAgentId: string;
  parentAgentName: string;
  task: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  opacity: number;
  glowColor: string;
  status: 'SPAWNING' | 'RUNNING' | 'COMPLETING' | 'DONE';
  toolUsed?: string;
}

export interface OfficePet {
  id: string;
  name: string;
  species: 'corgi' | 'cat' | 'cyber_pup' | 'duck';
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  facing: 'left' | 'right';
  state: 'WANDER' | 'SLEEP' | 'PLAY' | 'PETTED';
  happiness: number; // 0-100
  petCount: number;
  thought: string;
}

export type FurnitureCategory = 'desk' | 'seat' | 'monitor' | 'breakroom' | 'server' | 'decor' | 'restroom' | 'meeting';

export interface OfficeFurnitureItem {
  id: string;
  type: string;
  name: string;
  category: FurnitureCategory;
  col: number;
  row: number;
  width: number;
  height: number;
  rotation: 0 | 90 | 180 | 270;
  color?: string;
  interactive?: boolean;
  areaId?: string;
}

export interface OfficeArea {
  id: string;
  name: string;
  color: string;
  bounds: { x1: number; y1: number; x2: number; y2: number };
  description: string;
  assignedRole: string;
}

export interface ContextGaugeData {
  currentTokens: number;
  maxTokens: number; // e.g. 200,000 tokens
  percentage: number;
  compactionCount: number;
  isCompacting: boolean;
}

export interface TranscriptEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  type: 'SessionStart' | 'PreToolUse' | 'PostToolUse' | 'PermissionRequest' | 'ContextCompaction' | 'Stop' | 'LifeRoutine';
  summary: string;
  details?: string;
  toolName?: string;
  bubbleIcon?: 'code' | 'search' | 'tool' | 'prompt' | 'water' | 'coffee' | 'restroom' | 'ghost' | 'chat';
}

