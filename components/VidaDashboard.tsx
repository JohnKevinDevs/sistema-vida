"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ChatPanel } from "@/components/ChatPanel";
import { DashboardCard } from "@/components/DashboardCard";
import { GoalsSection } from "@/components/GoalsSection";
import { LifeAreasSection } from "@/components/LifeAreasSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { RoutineSection } from "@/components/RoutineSection";
import { TasksSection } from "@/components/TasksSection";
import { TodaySummary } from "@/components/TodaySummary";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import {
  activeProjects,
  assistantPreview,
  dashboardStats,
  daySummary,
  lifeAreas,
  mainGoals,
  routineBlocks,
  todayTasks,
  viewSummaries,
} from "@/data/vida";
import type { LifeView } from "@/lib/types";

const viewOptions: LifeView[] = ["Hoje", "Semana", "Focos"];

export function VidaDashboard() {
  const [activeView, setActiveView] = useState<LifeView>("Hoje");
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
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

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
              {daySummary.dateLabel}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-5xl">
              Sistema JK
            </h1>
            <p className="mt-3 text-xl font-medium text-neutral-300">
              Vida e Tarefas
            </p>
            <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-400">
              Central pessoal local para enxergar prioridades, estado atual e
              proximos focos com clareza, ainda sem IA, banco de dados ou
              automacoes.
            </p>
            <ViewSwitcher
              activeView={activeView}
              onChange={setActiveView}
              views={viewOptions}
            />
          </div>

          <TodaySummary
            daySummary={daySummary}
            selectedView={selectedView}
          />
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {dashboardStats.map((item) => (
            <DashboardCard
              detail={item.detail}
              key={item.id}
              label={item.label}
              tone={item.tone}
              value={item.value}
            />
          ))}
        </section>

        <LifeAreasSection areas={lifeAreas} />

        <section className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="space-y-8">
            <TasksSection
              completedTaskIds={completedTaskIds}
              onToggleTask={toggleTask}
              tasks={todayTasks}
            />
            <GoalsSection goals={mainGoals} />
            <ProjectsSection
              onSelectProject={setSelectedProjectId}
              projects={activeProjects}
              selectedProject={selectedProject}
              selectedProjectId={selectedProjectId}
            />
          </div>

          <div className="space-y-8">
            <RoutineSection blocks={routineBlocks} />
            <ChatPanel assistant={assistantPreview} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
