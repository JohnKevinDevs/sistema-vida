"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ChatPanel } from "@/components/ChatPanel";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import {
  activeProjects,
  assistantPreview,
  daySummary,
  mainGoals,
  routineBlocks,
  todayTasks,
  viewSummaries,
} from "@/data/vida";
import type {
  DaySummary,
  Goal,
  LifeView,
  Project,
  RoutineBlock,
  Task,
  ViewSummary,
} from "@/lib/types";

const viewOptions: LifeView[] = ["Dia", "Semana", "Metas"];

export function VidaDashboard() {
  const [activeView, setActiveView] = useState<LifeView>("Dia");
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [chatResetKey, setChatResetKey] = useState(0);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [conversationListRefreshKey, setConversationListRefreshKey] =
    useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState(
    activeProjects[0]?.id ?? "",
  );

  const selectedView = useMemo(
    () =>
      viewSummaries.find((summary) => summary.view === activeView) ??
      viewSummaries[0],
    [activeView],
  );

  const selectedProject = useMemo(
    () =>
      activeProjects.find((project) => project.id === selectedProjectId) ??
      activeProjects[0],
    [selectedProjectId],
  );

  function toggleTask(taskId: string) {
    setCompletedTaskIds((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId],
    );
  }

  function startNewConversation() {
    setActiveConversationId(null);
    setChatResetKey((current) => current + 1);
  }

  function handleConversationCreated(conversationId: string) {
    setActiveConversationId(conversationId);
    setConversationListRefreshKey((current) => current + 1);
  }

  function handleConversationDeleted(conversationId: string) {
    setConversationListRefreshKey((current) => current + 1);

    if (conversationId === activeConversationId) {
      startNewConversation();
    }
  }

  return (
    <AppShell
      activeConversationId={activeConversationId}
      conversationListRefreshKey={conversationListRefreshKey}
      onDeleteConversation={handleConversationDeleted}
      onSelectProject={setSelectedProjectId}
      onStartNewConversation={startNewConversation}
      onSelectConversation={setActiveConversationId}
      projects={activeProjects}
      selectedProjectId={selectedProjectId}
    >
      <div className="flex min-h-[calc(100vh-2rem)] flex-col gap-6">
        <header className="flex flex-col gap-6 border-b border-slate-800/80 pb-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-300">
              {daySummary.dateLabel}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Sistema JK
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Central pessoal local para conversar, decidir o próximo passo e
              manter o essencial visível.
            </p>
          </div>
          <ViewSwitcher
            activeView={activeView}
            onChange={setActiveView}
            views={viewOptions}
          />
        </header>

        <section className="grid flex-1 gap-6 xl:grid-cols-[minmax(320px,0.74fr)_minmax(480px,1.26fr)]">
          <ContextPanel
            activeView={activeView}
            completedTaskIds={completedTaskIds}
            daySummary={daySummary}
            goals={mainGoals}
            onSelectProject={setSelectedProjectId}
            onToggleTask={toggleTask}
            projects={activeProjects}
            routineBlocks={routineBlocks}
            selectedProject={selectedProject}
            selectedProjectId={selectedProjectId}
            selectedView={selectedView}
            tasks={todayTasks}
          />

          <ChatPanel
            activeConversationId={activeConversationId}
            assistant={assistantPreview}
            className="xl:min-h-[calc(100vh-12rem)]"
            resetKey={chatResetKey}
            onConversationChange={setActiveConversationId}
            onConversationCreated={handleConversationCreated}
          />
        </section>
      </div>
    </AppShell>
  );
}

type ContextPanelProps = {
  activeView: LifeView;
  completedTaskIds: string[];
  daySummary: DaySummary;
  goals: Goal[];
  onSelectProject: (projectId: string) => void;
  onToggleTask: (taskId: string) => void;
  projects: Project[];
  routineBlocks: RoutineBlock[];
  selectedProject?: Project;
  selectedProjectId: string;
  selectedView: ViewSummary;
  tasks: Task[];
};

function ContextPanel({
  activeView,
  completedTaskIds,
  daySummary,
  goals,
  onSelectProject,
  onToggleTask,
  projects,
  routineBlocks,
  selectedProject,
  selectedProjectId,
  selectedView,
  tasks,
}: ContextPanelProps) {
  return (
    <div className="surface-panel rounded-lg border p-4 shadow-2xl shadow-black/20 sm:p-5">
      <div className="border-b border-slate-800/80 pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {activeView}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          {selectedView.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {selectedView.description}
        </p>
      </div>

      {activeView === "Dia" ? (
        <DayContext
          completedTaskIds={completedTaskIds}
          daySummary={daySummary}
          onToggleTask={onToggleTask}
          tasks={tasks}
        />
      ) : activeView === "Semana" ? (
        <WeekContext
          onSelectProject={onSelectProject}
          projects={projects}
          routineBlocks={routineBlocks}
          selectedProject={selectedProject}
          selectedProjectId={selectedProjectId}
        />
      ) : (
        <GoalsContext goals={goals} />
      )}
    </div>
  );
}

type DayContextProps = {
  completedTaskIds: string[];
  daySummary: DaySummary;
  onToggleTask: (taskId: string) => void;
  tasks: Task[];
};

function DayContext({
  completedTaskIds,
  daySummary,
  onToggleTask,
  tasks,
}: DayContextProps) {
  return (
    <div className="mt-6 space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Foco principal
        </p>
        <p className="mt-2 text-base leading-7 text-slate-100">
          {daySummary.mainFocus}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white">3 prioridades</h3>
          <span className="rounded-full border border-slate-800/80 px-2 py-0.5 text-xs text-slate-500">
            {completedTaskIds.length}/{tasks.length}
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {tasks.map((task) => {
            const isDone = completedTaskIds.includes(task.id);

            return (
              <button
                aria-pressed={isDone}
                className={`focus-ring w-full rounded-md border px-3.5 py-3 text-left transition ${
                  isDone
                    ? "border-emerald-300/20 bg-emerald-300/10"
                    : "border-slate-800/80 bg-slate-950/45 hover:border-blue-400/20 hover:bg-blue-500/10"
                }`}
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                type="button"
              >
                <span
                  className={`block text-sm font-medium leading-5 ${
                    isDone ? "text-slate-400 line-through" : "text-white"
                  }`}
                >
                  {task.title}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  {task.timeWindow ?? "Sem horário"} • {task.areaLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-md border border-blue-400/20 bg-blue-500/10 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100/80">
          Próximo passo
        </p>
        <p className="mt-2 text-sm leading-6 text-blue-50">
          {daySummary.nextFocus}
        </p>
      </div>
    </div>
  );
}

type WeekContextProps = {
  onSelectProject: (projectId: string) => void;
  projects: Project[];
  routineBlocks: RoutineBlock[];
  selectedProject?: Project;
  selectedProjectId: string;
};

function WeekContext({
  onSelectProject,
  projects,
  routineBlocks,
  selectedProject,
  selectedProjectId,
}: WeekContextProps) {
  return (
    <div className="mt-6 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-white">
          Projetos em andamento
        </h3>
        <div className="mt-3 space-y-2">
          {projects.map((project) => {
            const isSelected = project.id === selectedProjectId;

            return (
              <button
                aria-pressed={isSelected}
                className={`focus-ring w-full rounded-md border px-3.5 py-3 text-left transition ${
                  isSelected
                    ? "border-blue-400/30 bg-blue-500/10 text-white"
                    : "border-slate-800/80 bg-slate-950/45 text-slate-200 hover:border-blue-400/20 hover:bg-blue-500/10"
                }`}
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                type="button"
              >
                <span className="block text-sm font-semibold">
                  {project.name}
                </span>
                <span
                  className={`mt-1 block text-xs ${
                    isSelected ? "text-blue-200/80" : "text-slate-500"
                  }`}
                >
                  {project.nextAction}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-md border border-slate-800/80 bg-slate-950/45 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Projeto em foco
        </p>
        <p className="mt-2 text-sm font-medium text-white">
          {selectedProject?.name ?? "Nenhum projeto selecionado"}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {selectedProject?.description ??
            "Selecione um projeto para destacar o próximo movimento."}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">Ritmo da semana</h3>
        <div className="mt-3 space-y-2">
          {routineBlocks.map((block) => (
            <div
              className="flex items-start justify-between gap-3 rounded-md border border-slate-800/80 bg-slate-950/45 px-3.5 py-3"
              key={block.id}
            >
              <div>
                <p className="text-sm font-medium text-white">{block.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {block.focus}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-slate-800/80 px-2 py-0.5 text-xs text-slate-500">
                {block.window}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type GoalsContextProps = {
  goals: Goal[];
};

function GoalsContext({ goals }: GoalsContextProps) {
  return (
    <div className="mt-6 space-y-3">
      {goals.map((goal) => (
        <article
          className="rounded-md border border-slate-800/80 bg-slate-950/45 p-4"
          key={goal.id}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold leading-6 text-white">
              {goal.title}
            </h3>
            <span className="shrink-0 rounded-full border border-blue-400/25 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-100">
              {goal.progress}%
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {goal.note}
          </p>
          <div className="mt-4 h-2 rounded-full bg-slate-800/80">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
