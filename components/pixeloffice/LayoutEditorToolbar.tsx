'use client';

import React, { useState } from 'react';
import { OfficeFurnitureItem, OfficeArea } from '@/lib/types';
import { soundFx } from '@/lib/audio';
import {
  Wrench,
  RotateCw,
  Trash2,
  Plus,
  Download,
  Upload,
  Check,
  Copy,
  LayoutGrid,
  Sparkles,
  Layers,
  X,
  Palette,
} from 'lucide-react';

interface LayoutEditorToolbarProps {
  isEditorActive: boolean;
  onToggleEditor: () => void;
  selectedFurniture: OfficeFurnitureItem | null;
  onRotateSelected: () => void;
  onDeleteSelected: () => void;
  onAddFurniture: (type: string, name: string, category: OfficeFurnitureItem['category'], w: number, h: number, color: string) => void;
  floorTheme: string;
  onChangeFloorTheme: (theme: string) => void;
  onExportLayout: () => void;
  onImportLayout: (jsonString: string) => void;
  onResetLayout: () => void;
  furnitureCount: number;
}

export const LayoutEditorToolbar: React.FC<LayoutEditorToolbarProps> = ({
  isEditorActive,
  onToggleEditor,
  selectedFurniture,
  onRotateSelected,
  onDeleteSelected,
  onAddFurniture,
  floorTheme,
  onChangeFloorTheme,
  onExportLayout,
  onImportLayout,
  onResetLayout,
  furnitureCount,
}) => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  const FURNITURE_CATALOG = [
    { type: 'desk_glass', name: 'Secretária de Vidro', category: 'desk' as const, w: 3, h: 2, color: '#f59e0b' },
    { type: 'chair_leather', name: 'Cadeira Ergonómica', category: 'seat' as const, w: 1, h: 1, color: '#b45309' },
    { type: 'macbook_pro', name: 'Monitor Duplo / Laptop', category: 'monitor' as const, w: 1, h: 1, color: '#38bdf8' },
    { type: 'water_cooler', name: 'Bebedouro de Galão', category: 'breakroom' as const, w: 1, h: 2, color: '#38bdf8' },
    { type: 'coffee_espresso', name: 'Máquina Espresso', category: 'breakroom' as const, w: 1, h: 1, color: '#d97706' },
    { type: 'vending_machine', name: 'Máquina de Snacks', category: 'breakroom' as const, w: 2, h: 2, color: '#ec4899' },
    { type: 'server_rack', name: 'Rack de Servidores LED', category: 'server' as const, w: 1, h: 3, color: '#10b981' },
    { type: 'whiteboard_arch', name: 'Quadro Branco', category: 'meeting' as const, w: 4, h: 1, color: '#f8fafc' },
    { type: 'conf_table', name: 'Mesa de Reunião', category: 'meeting' as const, w: 6, h: 3, color: '#0284c7' },
    { type: 'wc_stall', name: 'Cabine de Casa de Banho', category: 'restroom' as const, w: 2, h: 2, color: '#94a3b8' },
    { type: 'plant_monstera', name: 'Planta de Escritório', category: 'decor' as const, w: 1, h: 1, color: '#22c55e' },
    { type: 'pet_bed', name: 'Caminha para Pets', category: 'decor' as const, w: 2, h: 2, color: '#f43f5e' },
  ];

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
      {/* Left: Mode toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            soundFx.playBlip(700);
            onToggleEditor();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm ${
            isEditorActive
              ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>{isEditorActive ? 'Modo Editor Ativo (Arquiteto)' : 'Abrir Editor de Layout'}</span>
        </button>

        {isEditorActive && (
          <span className="text-[11px] text-amber-300 font-mono hidden sm:inline">
            Clique na mobília para selecionar, rodar ou reposicionar.
          </span>
        )}
      </div>

      {/* Editor Action Controls (Active when Editor is open) */}
      {isEditorActive && (
        <div className="flex items-center gap-2 flex-wrap">
          {/* Add furniture button */}
          <button
            onClick={() => {
              soundFx.playBlip(600);
              setIsCatalogOpen(!isCatalogOpen);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Mobília</span>
          </button>

          {/* Rotate selected */}
          <button
            onClick={() => {
              soundFx.playWarp();
              onRotateSelected();
            }}
            disabled={!selectedFurniture}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded transition-colors ${
              selectedFurniture
                ? 'bg-sky-600 hover:bg-sky-500 text-white'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title="Rodar mobília selecionada 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Rodar (90°)</span>
          </button>

          {/* Delete selected */}
          <button
            onClick={() => {
              soundFx.playAlert();
              onDeleteSelected();
            }}
            disabled={!selectedFurniture}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded transition-colors ${
              selectedFurniture
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title="Eliminar mobília selecionada"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar</span>
          </button>

          {/* Floor Theme selector */}
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={floorTheme}
              onChange={(e) => {
                soundFx.playBlip(500);
                onChangeFloorTheme(e.target.value);
              }}
              className="bg-transparent text-slate-300 text-xs focus:outline-none"
            >
              <option value="parquet">Piso: Parquet Madeira</option>
              <option value="carpet">Piso: Alcatifa Escura</option>
              <option value="tech">Piso: Grelha Cyberpunk</option>
              <option value="checker">Piso: Xadrez Retro</option>
            </select>
          </div>

          {/* Export / Import JSON */}
          <button
            onClick={() => {
              soundFx.playCoin();
              onExportLayout();
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Exportar layout.json para Pixel Agents"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>Exportar JSON</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Importar layout.json"
          >
            <Upload className="w-3 h-3 text-cyan-400" />
            <span>Importar</span>
          </button>

          <button
            onClick={() => {
              soundFx.playWarp();
              onResetLayout();
            }}
            className="text-[10px] text-slate-500 hover:text-slate-300 underline"
          >
            Restaurar Padrão
          </button>
        </div>
      )}

      {/* Furniture Catalog Dropdown/Modal */}
      {isCatalogOpen && (
        <div className="w-full bg-slate-950 p-3 rounded-lg border border-slate-800 mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 animate-fadeIn">
          {FURNITURE_CATALOG.map((item) => (
            <button
              key={item.type}
              onClick={() => {
                soundFx.playCoin();
                onAddFurniture(item.type, item.name, item.category, item.w, item.h, item.color);
                setIsCatalogOpen(false);
              }}
              className="flex flex-col items-start p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-400/50 transition-all text-left group"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-semibold text-slate-200 text-xs group-hover:text-amber-400">{item.name}</span>
                <span
                  style={{ backgroundColor: item.color }}
                  className="w-2.5 h-2.5 rounded-full border border-black/50"
                />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {item.w}x{item.h} blocos · {item.category}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-400 font-mono text-sm">IMPORTAR LAYOUT (LAYOUT.JSON)</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Cole aqui o JSON gerado pelo Pixel Agents ou pelo editor para carregar o seu mapa de escritório personalizado:
            </p>
            <textarea
              rows={6}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Cole o array de furniture ou o objeto layout.json aqui..."
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-amber-400"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onImportLayout(importJsonText);
                  setIsImportModalOpen(false);
                  setImportJsonText('');
                }}
                className="px-3 py-1.5 rounded bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Carregar Layout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
