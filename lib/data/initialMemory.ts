import { CollectiveMemoryReport } from '../types';

export const COLLECTIVE_MEMORY_REPORTS: CollectiveMemoryReport[] = [
  {
    id: 'MEM-REP-01',
    timestamp: '2026-10-16 12:00:00',
    departmentId: 1,
    departmentName: 'Direção e Coordenação',
    supervisor: 'Robo-Diretor Alpha',
    title: 'Diretiva de Operação Segura e Prevenção de Risco',
    summary: 'Aprovação do protocolo de bloqueio automático para ativos com liquidez abaixo de 100k USD e obrigatoriedade de paper trading.',
    keyFindings: [
      'O modo de execução real deve permanecer estritamente bloqueado por padrão',
      'Todas as decisões dos robôs traders devem registrar o motivo e critérios de invalidação',
    ],
    confirmedLessons: [
      'Modelos quantitativos precisam de validação cruzada contínua para evitar overfitting em regimes de alta volatilidade',
    ],
    approvedStrategies: [
      'Trend Following EMA 50/200 com Trailing Stop ATR',
      'Solana Breakout com filtro de volume DEX',
    ],
    rejectedStrategies: [
      'Martingale ou aumento de posição em perdas',
      'Scalping agressivo em tokens com menos de 24h sem liquidez bloqueada',
    ],
    incidentsReported: [],
  },
  {
    id: 'MEM-REP-02',
    timestamp: '2026-10-16 11:30:00',
    departmentId: 4,
    departmentName: 'Investigação e Inteligência',
    supervisor: 'Robo-Intel Overseer',
    title: 'Relatório de Triagem On-Chain em Novos Tokens Solana',
    summary: 'Auditoria de 34 novos pares criados em Raydium. 26 pares foram classificados com risco crítico de honeypot ou mint oculto.',
    keyFindings: [
      'Tokens com freeze authority ativa foram imediatamente incluídos na lista de exclusão',
      'A concentração das 10 principais carteiras excedeu 65% na maioria dos tokens descartados',
    ],
    confirmedLessons: [
      'Apenas confiar em pools com liquidez comprovadamente queimada ou bloqueada via contrato auditado',
    ],
    approvedStrategies: ['Anti-Rug Scanner Filter v2.1'],
    rejectedStrategies: ['Entrada prematura no primeiro minuto de listagem sem dados de contrato'],
    incidentsReported: ['Tentativa de simulação de compra em token malicioso bloqueada pelo Sentinela'],
  },
  {
    id: 'MEM-REP-03',
    timestamp: '2026-10-16 10:45:00',
    departmentId: 6,
    departmentName: 'Gestão de Risco',
    supervisor: 'Robo-Risk Sentinel',
    title: 'Auditoria de Exposição de Portfólio e Drawdown Máximo',
    summary: 'Conferência de saldo e ordens abertas em modo simulado. Exposição total calculada em 14.2%, respeitando o teto de 30%.',
    keyFindings: [
      'Nenhum ativo individual ultrapassou 10% do patrimônio',
      'O slippage médio das ordens simuladas situou-se em 0.04% para BTC e 0.12% para SOL',
    ],
    confirmedLessons: [
      'O travão de emergência deve permanecer testável e funcional a qualquer instante',
    ],
    approvedStrategies: ['Limites dinâmicos baseados no High-Water Mark'],
    rejectedStrategies: ['Aumento de alavancagem em fins de semana devido à menor profundidade de mercado'],
    incidentsReported: [],
  },
];
