import { OfficeFurnitureItem, OfficeArea, OfficePet } from '../types';

export const DEFAULT_OFFICE_AREAS: OfficeArea[] = [
  {
    id: 'area-dir',
    name: 'Direção Executiva & CEO',
    color: '#fbbf24',
    bounds: { x1: 20, y1: 20, x2: 240, y2: 220 },
    description: 'Área do CEO e alocação estratégica de metas e prioridades.',
    assignedRole: 'Direção Geral',
  },
  {
    id: 'area-break',
    name: 'Copa & Lazer (Bebedouro & Café)',
    color: '#38bdf8',
    bounds: { x1: 260, y1: 20, x2: 600, y2: 220 },
    description: 'Bebedouro com água fresca, máquina espresso e área social.',
    assignedRole: 'Todos os Agentes',
  },
  {
    id: 'area-wc',
    name: 'Casas de Banho & Higiene',
    color: '#a855f7',
    bounds: { x1: 620, y1: 20, x2: 860, y2: 220 },
    description: 'Cabines individuais com indicador de livre/ocupado e lavatórios.',
    assignedRole: 'Geral',
  },
  {
    id: 'area-trading',
    name: 'Trading Floor & Monitores CRT',
    color: '#10b981',
    bounds: { x1: 20, y1: 240, x2: 440, y2: 520 },
    description: '8 Robôs Traders com feeds de Binance e CoinGecko.',
    assignedRole: 'Quant & Trading',
  },
  {
    id: 'area-eng',
    name: 'Engenharia, Risco & Memória',
    color: '#6366f1',
    bounds: { x1: 460, y1: 240, x2: 860, y2: 520 },
    description: 'Departamentos técnicos, heurísticas e governança.',
    assignedRole: 'Engenharia de IA',
  },
  {
    id: 'area-meet',
    name: 'Sala de Conferências & Whiteboard',
    color: '#f97316',
    bounds: { x1: 300, y1: 540, x2: 620, y2: 700 },
    description: 'Mesa oval para reuniões de emergência e deliberações.',
    assignedRole: 'Conselho Consultivo',
  },
];

export const DEFAULT_OFFICE_FURNITURE: OfficeFurnitureItem[] = [
  // Executive Desk & Chair (CEO)
  { id: 'f-ceo-desk', type: 'desk_glass', name: 'Secretária Executiva de Vidro', category: 'desk', col: 4, row: 4, width: 3, height: 2, rotation: 0, color: '#f59e0b', interactive: true, areaId: 'area-dir' },
  { id: 'f-ceo-chair', type: 'chair_leather', name: 'Cadeira Presidencial de Couro', category: 'seat', col: 5, row: 3, width: 1, height: 1, rotation: 180, color: '#b45309', interactive: true, areaId: 'area-dir' },
  { id: 'f-ceo-laptop', type: 'macbook_pro', name: 'MacBook Pro Gold M3', category: 'monitor', col: 5, row: 4, width: 1, height: 1, rotation: 0, color: '#fbbf24', interactive: true, areaId: 'area-dir' },
  
  // Breakroom: Water cooler & Coffee
  { id: 'f-water', type: 'water_cooler', name: 'Bebedouro de Galão Gelado', category: 'breakroom', col: 14, row: 3, width: 1, height: 2, rotation: 0, color: '#38bdf8', interactive: true, areaId: 'area-break' },
  { id: 'f-coffee', type: 'coffee_espresso', name: 'Máquina Espresso Italiana', category: 'breakroom', col: 16, row: 3, width: 1, height: 1, rotation: 0, color: '#d97706', interactive: true, areaId: 'area-break' },
  { id: 'f-snack', type: 'vending_machine', name: 'Máquina de Snacks & Energéticos', category: 'breakroom', col: 18, row: 3, width: 2, height: 2, rotation: 0, color: '#ec4899', interactive: true, areaId: 'area-break' },
  { id: 'f-break-table', type: 'cafe_table', name: 'Mesa de Pausa & Banquetas', category: 'seat', col: 15, row: 6, width: 2, height: 2, rotation: 0, color: '#64748b', interactive: true, areaId: 'area-break' },

  // Restroom Stalls
  { id: 'f-stall-1', type: 'wc_stall', name: 'Cabine Sanitária 1', category: 'restroom', col: 22, row: 2, width: 2, height: 2, rotation: 0, color: '#94a3b8', interactive: true, areaId: 'area-wc' },
  { id: 'f-stall-2', type: 'wc_stall', name: 'Cabine Sanitária 2', category: 'restroom', col: 24, row: 2, width: 2, height: 2, rotation: 0, color: '#94a3b8', interactive: true, areaId: 'area-wc' },
  { id: 'f-stall-3', type: 'wc_stall', name: 'Cabine Sanitária 3', category: 'restroom', col: 26, row: 2, width: 2, height: 2, rotation: 0, color: '#94a3b8', interactive: true, areaId: 'area-wc' },
  { id: 'f-wc-sink', type: 'wc_sink', name: 'Bancada com Lavatórios', category: 'restroom', col: 23, row: 5, width: 4, height: 1, rotation: 0, color: '#cbd5e1', interactive: true, areaId: 'area-wc' },

  // Server Room Racks
  { id: 'f-server-1', type: 'server_rack', name: 'Rack Central H100 (Blinking LEDs)', category: 'server', col: 28, row: 8, width: 1, height: 3, rotation: 0, color: '#10b981', interactive: true, areaId: 'area-eng' },
  { id: 'f-server-2', type: 'server_rack', name: 'Rack de Memória Vetorial', category: 'server', col: 28, row: 12, width: 1, height: 3, rotation: 0, color: '#6366f1', interactive: true, areaId: 'area-eng' },

  // Conference Room (Meeting Table + Whiteboard)
  { id: 'f-conf-table', type: 'conf_table', name: 'Mesa Oval de Reuniões', category: 'meeting', col: 12, row: 19, width: 6, height: 3, rotation: 0, color: '#0284c7', interactive: true, areaId: 'area-meet' },
  { id: 'f-whiteboard', type: 'whiteboard_arch', name: 'Quadro Branco de Arquitetura', category: 'meeting', col: 13, row: 17, width: 4, height: 1, rotation: 0, color: '#f8fafc', interactive: true, areaId: 'area-meet' },

  // Plants & Greenery
  { id: 'f-plant-1', type: 'plant_monstera', name: 'Monstera Deliciosa', category: 'decor', col: 2, row: 2, width: 1, height: 1, rotation: 0, color: '#22c55e', areaId: 'area-dir' },
  { id: 'f-plant-2', type: 'plant_palm', name: 'Palmeira de Escritório', category: 'decor', col: 20, row: 2, width: 1, height: 1, rotation: 0, color: '#16a34a', areaId: 'area-break' },
  { id: 'f-plant-3', type: 'plant_bonsai', name: 'Bonsai Tecnológico', category: 'decor', col: 1, row: 10, width: 1, height: 1, rotation: 0, color: '#15803d', areaId: 'area-trading' },

  // Pet Beds
  { id: 'f-petbed-1', type: 'pet_bed', name: 'Cama Aveludada do Buster', category: 'decor', col: 8, row: 5, width: 2, height: 2, rotation: 0, color: '#f43f5e', interactive: true, areaId: 'area-dir' },
  { id: 'f-petbed-2', type: 'pet_bed', name: 'Almofada da Whiskers', category: 'decor', col: 19, row: 7, width: 2, height: 2, rotation: 0, color: '#8b5cf6', interactive: true, areaId: 'area-break' },
];

export const DEFAULT_OFFICE_PETS: OfficePet[] = [
  {
    id: 'pet-corgi',
    name: 'Buster, o Corgi',
    species: 'corgi',
    x: 210,
    y: 160,
    targetX: 210,
    targetY: 160,
    facing: 'right',
    state: 'WANDER',
    happiness: 95,
    petCount: 14,
    thought: 'À espera de mimos do CEO Alpha!',
  },
  {
    id: 'pet-cat',
    name: 'Whiskers, a Gata Calico',
    species: 'cat',
    x: 480,
    y: 140,
    targetX: 480,
    targetY: 140,
    facing: 'left',
    state: 'SLEEP',
    happiness: 90,
    petCount: 22,
    thought: 'A dormir perto da máquina de café quentinha.',
  },
  {
    id: 'pet-cyber',
    name: 'Byte, o Robô-Cão',
    species: 'cyber_pup',
    x: 340,
    y: 360,
    targetX: 340,
    targetY: 360,
    facing: 'right',
    state: 'WANDER',
    happiness: 100,
    petCount: 38,
    thought: 'Bateria a 100%. A patrulhar a sala de trading!',
  },
  {
    id: 'pet-duck',
    name: 'Quackers, o Pato Debugger',
    species: 'duck',
    x: 470,
    y: 570,
    targetX: 470,
    targetY: 570,
    facing: 'left',
    state: 'PLAY',
    happiness: 99,
    petCount: 45,
    thought: 'Explica-me o teu código que eu encontro o bug!',
  },
];
