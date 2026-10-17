'use client';

import React, { useState } from 'react';
import { TaskItem, Department, AgentRobot } from '@/lib/types';
import { soundFx } from '@/lib/audio';
import {
  Layers,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface TasksManagerProps {
  tasks: TaskItem[];
  departments: Department[];
  agents: AgentRobot[];
  onAddTask: (task: TaskItem) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskItem['status']) => void;
}

export const TasksManager: React.FC<TasksManagerProps> = ({
  tasks,
  departments,
  agents,
  onAddTask,
  onUpdateTaskStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskItem['priority']>('NORMAL');
  const [selectedDeptId, setSelectedDeptId] = useState<number>(1);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-dir-1');

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundFx.playPowerup();

    const selectedDept = departments.find((d) => d.id === selectedDeptId);
    const newTask: TaskItem = {
      id: `TASK-${String(tasks.length + 1).padStart(3, '0')}`,
      title: title.trim(),
      description: description.trim() || 'Tarefa operacional definida pelo utilizador.',
      priority,
      departmentId: selectedDeptId as any,
      agentId: selectedAgentId,
      supervisorId: selectedDept?.supervisorId || 'agent-dir-1',
      status: 'EM EXECUÇÃO',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      startedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      dependencies: [],
      evidences: 'Tarefa criada e em monitorização pelo supervisor responsável.',
    };

    onAddTask(newTask);
    setTitle('');
    setDescription('');
    setIsCreatingTask(false);
  };

  const getPriorityBadge = (p: TaskItem['priority']) => {
    switch (p) {
      case 'CRÍTICA':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'ALTA':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'NORMAL':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Bar with Filter & Create Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-xs font-bold font-pixel text-slate-100">
              SISTEMA DE TAREFAS & AUTOMAÇÃO
            </h3>
            <p className="text-xs text-slate-400">
              Distribuição rastreável de objetivos para os 30 agentes robôs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              soundFx.playBlip(500);
              setFilterStatus(e.target.value);
            }}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas as Tarefas ({tasks.length})</option>
            <option value="EM EXECUÇÃO">Em Execução</option>
            <option value="CONCLUÍDA">Concluídas</option>
            <option value="PLANEADA">Planeadas</option>
            <option value="À ESPERA">À Espera</option>
            <option value="BLOQUEADA">Bloqueadas</option>
          </select>

          <button
            onClick={() => {
              soundFx.playCoin();
              setIsCreatingTask(!isCreatingTask);
            }}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Create Task Form */}
      {isCreatingTask && (
        <form
          onSubmit={handleCreateTask}
          className="p-5 bg-slate-900 border-2 border-amber-500/60 rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-150"
        >
          <div className="text-xs font-bold font-pixel text-amber-300">
            CRIAR NOVA TAREFA OPERACIONAL
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Título da Tarefa</label>
              <input
                type="text"
                required
                placeholder="Ex: Auditoria de liquidez em pares SOL/USDC..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Prioridade</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="BAIXA">Baixa</option>
                  <option value="NORMAL">Normal</option>
                  <option value="ALTA">Alta</option>
                  <option value="CRÍTICA">Crítica</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Departamento</label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedDeptId(id);
                    const firstAgent = agents.find((a) => a.departmentId === id);
                    if (firstAgent) setSelectedAgentId(firstAgent.id);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.shortName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-400 mb-1 font-medium">Descrição Detalhada</label>
            <textarea
              rows={2}
              placeholder="Especificar os critérios de validação e fontes a serem consultadas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => setIsCreatingTask(false)}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
            >
              Atribuir Tarefa
            </button>
          </div>
        </form>
      )}

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const dept = departments.find((d) => d.id === task.departmentId);
          const agent = agents.find((a) => a.id === task.agentId);

          return (
            <div
              key={task.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {task.id}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded border ${getPriorityBadge(
                      task.priority
                    )}`}
                  >
                    PRIORIDADE {task.priority}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {dept?.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      task.status === 'CONCLUÍDA'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : task.status === 'EM EXECUÇÃO'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-700 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {task.status}
                  </span>

                  {task.status !== 'CONCLUÍDA' && (
                    <button
                      onClick={() => {
                        soundFx.playPowerup();
                        onUpdateTaskStatus(task.id, 'CONCLUÍDA');
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    >
                      Concluir
                    </button>
                  )}
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-100 font-pixel mb-1">{task.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">{task.description}</p>

              {/* Evidences or Result */}
              {(task.evidences || task.result) && (
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1 mb-2">
                  {task.result && (
                    <div className="text-emerald-400">
                      <span className="font-bold">Resultado:</span> {task.result}
                    </div>
                  )}
                  {task.evidences && (
                    <div className="text-cyan-400/90">
                      <span className="font-bold">Evidência:</span> {task.evidences}
                    </div>
                  )}
                </div>
              )}

              {/* Footer info */}
              <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/60 pt-2">
                <span>Agente Responsável: {agent?.name || 'Robo-Alocado'}</span>
                <span>Criada em: {task.createdAt}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
