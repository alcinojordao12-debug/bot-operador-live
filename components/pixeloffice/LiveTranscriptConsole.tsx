'use client';

import React, { useState } from 'react';
import { TranscriptEvent } from '@/lib/types';
import { soundFx } from '@/lib/audio';
import {
  Terminal,
  Activity,
  Filter,
  Play,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Ghost,
  HelpCircle,
  Code,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface LiveTranscriptConsoleProps {
  events: TranscriptEvent[];
  onSimulateEvent: (type: TranscriptEvent['type']) => void;
  onClearEvents: () => void;
  selectedAgentId?: string;
}

export const LiveTranscriptConsole: React.FC<LiveTranscriptConsoleProps> = ({
  events,
  onSimulateEvent,
  onClearEvents,
  selectedAgentId,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEvents = events.filter((ev) => {
    if (filterType !== 'all' && ev.type !== filterType) return false;
    if (selectedAgentId && ev.agentId !== selectedAgentId) return false;
    return true;
  });

  const getEventBadge = (type: TranscriptEvent['type']) => {
    switch (type) {
      case 'SessionStart':
        return { label: 'SessionStart', bg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800' };
      case 'PreToolUse':
        return { label: 'PreToolUse', bg: 'bg-amber-950/80 text-amber-400 border-amber-800' };
      case 'PostToolUse':
        return { label: 'PostToolUse', bg: 'bg-cyan-950/80 text-cyan-400 border-cyan-800' };
      case 'PermissionRequest':
        return { label: 'PermissionRequest', bg: 'bg-purple-950/80 text-purple-400 border-purple-800' };
      case 'ContextCompaction':
        return { label: 'Compaction', bg: 'bg-rose-950/80 text-rose-400 border-rose-800' };
      case 'LifeRoutine':
        return { label: 'LifeRoutine', bg: 'bg-sky-950/80 text-sky-400 border-sky-800' };
      default:
        return { label: type, bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="w-full bg-slate-950/95 border-t border-slate-800 rounded-b-xl overflow-hidden font-mono text-xs">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-200">PIXEL AGENTS JSONL TRANSCRIPT FEED</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {filteredEvents.length} eventos
          </span>
        </div>

        {/* Quick Simulation Buttons (As documented in Pixel Agents) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => {
              soundFx.playPromptChime();
              onSimulateEvent('PermissionRequest');
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-700/60 text-[10px] transition-colors"
            title="Simula pedido de permissão com balão de fala e chime sonoro"
          >
            <HelpCircle className="w-3 h-3" />
            <span>+ Permissão</span>
          </button>

          <button
            onClick={() => {
              soundFx.playGhostWhoosh();
              onSimulateEvent('PreToolUse');
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-900/40 hover:bg-cyan-800/60 text-cyan-300 border border-cyan-700/60 text-[10px] transition-colors"
            title="Spawna um Sub-Agent Ghost transparente"
          >
            <Ghost className="w-3 h-3" />
            <span>+ Ghost Sub-Agent</span>
          </button>

          <button
            onClick={() => {
              soundFx.playAlert();
              onSimulateEvent('ContextCompaction');
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-rose-900/40 hover:bg-rose-800/60 text-rose-300 border border-rose-700/60 text-[10px] transition-colors"
            title="Simula compactação de 200k tokens"
          >
            <Sparkles className="w-3 h-3" />
            <span>+ Compactação LLM</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3" />
                <span>Minimizar</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                <span>Expandir Terminal</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Transcript Stream */}
      {isExpanded && (
        <div className="p-3 bg-slate-950 space-y-2">
          {/* Filter Bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filtrar:</span>
              {['all', 'PreToolUse', 'PostToolUse', 'PermissionRequest', 'ContextCompaction', 'LifeRoutine'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                    filterType === f ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {f === 'all' ? 'Todos' : f}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                soundFx.playBlip(400);
                onClearEvents();
              }}
              className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
            >
              Limpar Feed
            </button>
          </div>

          {/* Event Stream Log */}
          <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-6 text-slate-600 italic text-xs">
                Nenhum evento registrado no filtro selecionado. Os eventos de terminal aparecem aqui em tempo real.
              </div>
            ) : (
              filteredEvents.slice(0, 30).map((ev) => {
                const badge = getEventBadge(ev.type);
                return (
                  <div
                    key={ev.id}
                    className="flex items-start gap-2.5 p-2 rounded bg-slate-900/60 hover:bg-slate-900 border border-slate-800/50 transition-colors"
                  >
                    <span className="text-[10px] text-slate-500 whitespace-nowrap mt-0.5">{ev.timestamp.split(' ')[1] || ev.timestamp}</span>
                    <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-amber-400 font-semibold whitespace-nowrap">{ev.agentName}:</span>
                    <span className="text-slate-300 flex-1 break-words">{ev.summary}</span>
                    {ev.toolName && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 text-[10px] border border-slate-700">
                        {ev.toolName}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
