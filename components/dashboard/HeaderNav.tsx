'use client';

import React from 'react';
import { soundFx } from '@/lib/audio';
import { AlertOctagon, Box, Layers } from 'lucide-react';

interface HeaderNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenEmergencyModal: () => void;
  onOpenOpenCodeModal: () => void;
  isEmergencyActive: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenEmergencyModal,
  onOpenOpenCodeModal,
  isEmergencyActive,
}) => {
  const navItems = [
    { id: 'pixel', label: '🎮 Pixel Agents HQ (Visualizador Oficial)' },
    { id: 'living', label: '🏢 Escritório 2.5D (Rotinas)' },
    { id: 'office3d', label: 'Escritório 3D' },
    { id: 'office', label: 'Planta 2D' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tasks', label: 'Tarefas' },
    { id: 'memory', label: 'Memória Coletiva' },
    { id: 'risk', label: 'Gestão de Risco' },
    { id: 'audit', label: '18 Fases' },
  ];

  return (
    <header className="flex items-center justify-between gap-6 px-6 py-3.5 bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            soundFx.playCoin();
            onSelectTab('living');
          }}
          className="text-base md:text-lg font-bold font-pixel tracking-tight text-amber-400 whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors"
        >
          HUMANO BOT
        </a>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          HQ VIVO
        </span>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-400">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              soundFx.playBlip(600);
              onSelectTab(item.id);
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === item.id
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Zone 3: Actions (Open Code Guide & Emergency Kill Switch) */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={() => {
            soundFx.playPowerup();
            onOpenOpenCodeModal();
          }}
          className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/80 transition-colors flex items-center gap-1.5 shadow-sm"
          title="Ver como colocar no seu projeto do Open Code"
        >
          <span>💻 Como Rodar no Open Code</span>
        </button>

        <button
          onClick={() => {
            soundFx.playAlert();
            onOpenEmergencyModal();
          }}
          className={`px-3 py-1.5 text-xs font-pixel rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm ${
            isEmergencyActive
              ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
              : 'bg-slate-900 hover:bg-rose-950/80 text-rose-400 border border-rose-800/80'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>{isEmergencyActive ? 'TRAVÃO ATIVADO' : 'TRAVÃO DE RISCO'}</span>
        </button>
      </div>
    </header>
  );
};
