'use client';

import React from 'react';
import { AgentRobot } from '@/lib/types';

interface RobotSpriteProps {
  agent: AgentRobot;
  onClick: (agent: AgentRobot) => void;
  isSelected?: boolean;
}

export const RobotSprite: React.FC<RobotSpriteProps> = ({ agent, onClick, isSelected }) => {
  // Color palette for the robot based on chassis and status
  const chassis = agent.chassisColor || '#38bdf8';

  // Visor color based on status
  const getVisorColor = () => {
    switch (agent.status) {
      case 'ERROR':
        return 'bg-rose-500 text-white border-rose-300 shadow-rose-500/50';
      case 'IDLE':
      case 'PAUSED':
        return 'bg-slate-700 text-slate-300 border-slate-500 shadow-slate-500/30';
      case 'LEARNING':
        return 'bg-fuchsia-600 text-white border-fuchsia-300 shadow-fuchsia-500/50';
      case 'ANALYZING':
        return 'bg-amber-500 text-slate-950 border-amber-200 shadow-amber-500/50';
      default:
        return 'bg-cyan-500 text-slate-950 border-cyan-200 shadow-cyan-500/50';
    }
  };

  return (
    <div
      onClick={() => onClick(agent)}
      className={`group relative flex flex-col items-center cursor-pointer transition-all duration-150 select-none ${
        isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-10'
      }`}
      title={`${agent.name} (${agent.role})`}
    >
      {/* Head Visor HUD (Visor na cabeça com status real) */}
      <div
        className={`mb-1 px-1.5 py-0.5 rounded border text-[9px] font-bold font-mono tracking-wider whitespace-nowrap shadow-sm transition-all duration-200 max-w-[130px] truncate ${getVisorColor()} ${
          agent.status === 'BUSY' ? 'animate-pulse' : ''
        }`}
      >
        {agent.visorText}
      </div>

      {/* Retro 2D Pixel Robot Body */}
      <div className="relative w-10 h-11 flex flex-col items-center">
        {/* Antenna / Supervisor Decoration */}
        {agent.isSupervisor ? (
          <div className="absolute -top-3 flex items-center justify-center">
            {/* Mario-style 8-bit Golden Crown for Supervisors */}
            <div className="w-5 h-2.5 bg-amber-400 border border-amber-600 rounded-t-sm flex justify-between px-0.5 shadow-sm">
              <span className="w-1 h-1 bg-amber-200 rounded-full" />
              <span className="w-1 h-1.5 bg-amber-100 rounded-full -mt-0.5" />
              <span className="w-1 h-1 bg-amber-200 rounded-full" />
            </div>
          </div>
        ) : (
          <div className="absolute -top-2 w-1 h-2 bg-slate-400 border-t-2 border-red-500" />
        )}

        {/* Robot Head (Rounded Box) */}
        <div
          style={{ backgroundColor: chassis }}
          className="w-8 h-5 rounded-md border-2 border-slate-900 shadow-sm flex items-center justify-center relative overflow-hidden"
        >
          {/* Eye Screen / Visor Screen */}
          <div className="w-6 h-3 bg-slate-950 rounded-sm border border-slate-800 flex items-center justify-around px-0.5">
            {agent.status === 'ERROR' ? (
              <span className="text-rose-500 text-[8px] font-pixel font-bold">X X</span>
            ) : agent.status === 'IDLE' ? (
              <span className="text-slate-500 text-[8px] font-pixel font-bold">- -</span>
            ) : (
              <>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-75" />
                <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_4px_#38bdf8]" />
              </>
            )}
          </div>
          {/* Subtle metallic reflection highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />
        </div>

        {/* Robot Torso / Chassis */}
        <div
          style={{ backgroundColor: chassis }}
          className="w-7 h-4 rounded-b-md border-2 border-t-0 border-slate-900 flex items-center justify-center relative shadow-inner"
        >
          {/* Heart Core / Battery LED */}
          <div
            className={`w-2 h-2 rounded-full border border-slate-950 shadow-sm ${
              agent.status === 'ERROR'
                ? 'bg-rose-500 animate-ping'
                : agent.status === 'BUSY'
                ? 'bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]'
                : 'bg-amber-400'
            }`}
          />
          {/* Left & Right Mechanical Arms */}
          <div className="absolute -left-1.5 top-0.5 w-1.5 h-3 bg-slate-800 rounded-sm border border-slate-950" />
          <div className="absolute -right-1.5 top-0.5 w-1.5 h-3 bg-slate-800 rounded-sm border border-slate-950" />
        </div>

        {/* Robot Tread / Base */}
        <div className="w-8 h-2 bg-slate-900 rounded-full border border-slate-950 flex justify-around px-1 mt-0.5">
          <span className="w-1 h-1 bg-slate-700 rounded-full" />
          <span className="w-1 h-1 bg-slate-600 rounded-full" />
          <span className="w-1 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Selection indicator ring */}
        {isSelected && (
          <div className="absolute -bottom-1 w-9 h-1 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b] animate-bounce" />
        )}
      </div>

      {/* Agent short name underneath */}
      <span className="text-[10px] font-semibold text-slate-300 group-hover:text-amber-300 transition-colors mt-1 max-w-[90px] truncate text-center bg-slate-950/80 px-1 rounded">
        {agent.name.replace('Robo-', '')}
      </span>
    </div>
  );
};
