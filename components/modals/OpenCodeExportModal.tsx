'use client';

import React, { useState } from 'react';
import { soundFx } from '@/lib/audio';
import {
  X,
  Copy,
  Check,
  Code2,
  Terminal,
  FolderTree,
  FileCode,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

interface OpenCodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenCodeExportModal: React.FC<OpenCodeExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quick' | 'install' | 'structure' | 'code'>('quick');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    soundFx.playCoin();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const npmInstallCommand = `npm install motion lucide-react clsx tailwind-merge`;

  const componentSnippet = `import React from 'react';
import { PixelAgentsOfficeEngine } from '@/components/pixeloffice/PixelAgentsOfficeEngine';
import { AGENT_ROBOTS } from '@/lib/data/agents';
import { TRADING_ROBOTS } from '@/lib/data/tradingRobots';
import { DEPARTMENTS } from '@/lib/data/departments';

export default function PixelOfficePage() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-6 flex flex-col items-center">
      <h1 className="text-xl font-bold text-amber-400 mb-4 font-pixel tracking-tight">
        Pixel Agents HQ · Escritório Virtual
      </h1>
      <PixelAgentsOfficeEngine
        agents={AGENT_ROBOTS}
        tradingRobots={TRADING_ROBOTS}
        departments={DEPARTMENTS}
        marketAssets={[]}
        onSelectAgent={(agent) => console.log('Selecionou agente:', agent.name)}
        onSelectTradingRobot={(robot) => console.log('Selecionou trader:', robot.name)}
        onOpenMeetingRoom={() => console.log('Abrir Reunião')}
        onTriggerEmergencyModal={() => console.log('Travar Trading')}
      />
    </main>
  );
}`;

  const directoryTree = `meu-projeto-opencode/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  <-- Importe o PixelAgentsOfficeEngine aqui
│   └── globals.css
├── components/
│   ├── pixeloffice/
│   │   ├── PixelAgentsOfficeEngine.tsx  <-- Motor principal Pixel Agents v1.5
│   │   ├── LayoutEditorToolbar.tsx      <-- Editor de mobília e piso
│   │   └── LiveTranscriptConsole.tsx    <-- Feed de transcrição JSONL
│   ├── simulation/
│   │   └── LivingOfficeEngine.tsx       <-- Motor 2.5D alternativo
│   ├── dashboard/
│   │   └── HeaderNav.tsx
│   └── modals/
├── lib/
│   ├── audio.ts                  <-- Efeitos sonoros 8-bit sintetizados
│   ├── types.ts                  <-- Tipos com Ghosts, Pets e ContextGauges
│   └── data/
│       ├── defaultPixelLayout.ts <-- Mobília, áreas e pets padrão
│       ├── agents.ts             <-- 30 agentes robôs
│       ├── tradingRobots.ts      <-- 8 robôs de trading
│       └── departments.ts        <-- 8 departamentos
└── package.json`;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-amber-500/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-pixel text-amber-400 flex items-center gap-2">
                COMO COLOCAR ESTE ESCRITÓRIO NO SEU OPEN CODE
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Guia passo a passo para integrar a simulação realista no seu projeto Open Code ou VS Code local
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playBlip(500);
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-2 pt-2">
          {[
            { id: 'quick', label: '1. Passo a Passo Rápido', icon: Sparkles },
            { id: 'install', label: '2. Instalar Pacotes', icon: Terminal },
            { id: 'structure', label: '3. Estrutura de Pastas', icon: FolderTree },
            { id: 'code', label: '4. Código para Inserir', icon: FileCode },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playBlip(600);
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-amber-400 text-amber-300 bg-slate-800/80'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: QUICK START */}
          {activeTab === 'quick' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
                <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  O componente é 100% autônomo, leve e não trava o computador!
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Ele funciona com React e Tailwind puro no Next.js. Não requer WebGL pesado nem servidores externos; os robôs andam, bebem água, vão ao banheiro e o CEO passeia de forma totalmente reativa no navegador.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl space-y-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold font-mono text-xs flex items-center justify-center border border-amber-500/40">
                    1
                  </span>
                  <h4 className="text-xs font-bold text-slate-200">Copie as Pastas</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Copie a pasta <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">components/simulation</code> e <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">lib/</code> para dentro do seu projeto Open Code.
                  </p>
                </div>

                <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl space-y-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold font-mono text-xs flex items-center justify-center border border-amber-500/40">
                    2
                  </span>
                  <h4 className="text-xs font-bold text-slate-200">Instale Dependências</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    No terminal do Open Code, execute o comando <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">npm install motion lucide-react</code>.
                  </p>
                </div>

                <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl space-y-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold font-mono text-xs flex items-center justify-center border border-amber-500/40">
                    3
                  </span>
                  <h4 className="text-xs font-bold text-slate-200">Importe na sua Página</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Adicione <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">&lt;LivingOfficeEngine /&gt;</code> no seu <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">page.tsx</code> e veja tudo funcionando imediatamente!
                  </p>
                </div>
              </div>

              {/* Direct Download / Copy Action */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">
                    Comando rápido para copiar o pacote essencial:
                  </span>
                  <span className="text-xs font-mono text-cyan-400 block mt-0.5">
                    {npmInstallCommand}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(npmInstallCommand, 'quick-install')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'quick-install' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-900" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Comando</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PACKAGES */}
          {activeTab === 'install' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Abra o terminal integrado do seu <strong>Open Code</strong> (atalho <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono text-[10px]">Ctrl + `</kbd> ou menu Terminal &gt; Novo Terminal) e execute:
              </p>

              <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-500 pb-2 mb-2 border-b border-slate-900">
                  <span>TERMINAL DO OPEN CODE (BASH / POWERSHELL)</span>
                  <button
                    onClick={() => copyToClipboard(npmInstallCommand, 'install-cmd')}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-[11px]"
                  >
                    {copiedKey === 'install-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'install-cmd' ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="text-emerald-400 select-all">{npmInstallCommand}</pre>
              </div>

              <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2 text-xs text-slate-300">
                <h4 className="font-bold text-slate-100">Por que esses pacotes?</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                  <li><strong className="text-slate-200">lucide-react:</strong> Ícones da copa (água, café), coroa do CEO, botões de velocidade e estado.</li>
                  <li><strong className="text-slate-200">motion:</strong> Transições fluidas de balões e movimentação.</li>
                  <li><strong className="text-slate-200">clsx & tailwind-merge:</strong> Utilitários padrão do Tailwind para mesclar classes sem conflito.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: STRUCTURE */}
          {activeTab === 'structure' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Mantenha a seguinte estrutura no seu projeto Open Code para que as referências <code className="text-amber-300">@/components/...</code> e <code className="text-amber-300">@/lib/...</code> funcionem direto:
              </p>

              <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300/90 leading-relaxed overflow-x-auto">
                <div className="flex justify-between items-center text-slate-500 pb-2 mb-2 border-b border-slate-900">
                  <span>ESTRUTURA DE PASTAS RECOMENDADA</span>
                  <button
                    onClick={() => copyToClipboard(directoryTree, 'tree-cmd')}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-[11px]"
                  >
                    {copiedKey === 'tree-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'tree-cmd' ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <pre>{directoryTree}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: CODE */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Copie este trecho e cole diretamente no arquivo <code className="text-amber-300 font-mono">app/page.tsx</code> do seu projeto Open Code:
              </p>

              <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs leading-relaxed overflow-x-auto">
                <div className="flex justify-between items-center text-slate-500 pb-2 mb-2 border-b border-slate-900">
                  <span>app/page.tsx</span>
                  <button
                    onClick={() => copyToClipboard(componentSnippet, 'code-snippet')}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-[11px]"
                  >
                    {copiedKey === 'code-snippet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'code-snippet' ? 'Copiado' : 'Copiar Código'}</span>
                  </button>
                </div>
                <pre className="text-cyan-300">{componentSnippet}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Pronto para usar no Open Code, VS Code, Cursor ou qualquer ambiente Next.js 14/15.
          </span>
          <button
            onClick={() => {
              soundFx.playBlip(500);
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Entendido, Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
