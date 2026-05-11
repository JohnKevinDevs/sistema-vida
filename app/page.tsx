import { AppShell } from "@/components/AppShell";
import { DashboardCard } from "@/components/DashboardCard";
import { ProjectPreview } from "@/components/ProjectPreview";
import { SectionHeader } from "@/components/SectionHeader";
import { TaskPreview } from "@/components/TaskPreview";
import {
  activeProjects,
  assistantPreview,
  dashboardStats,
  daySummary,
  mainGoals,
  routineBlocks,
  todayTasks,
} from "@/data/vida";

export default function Home() {
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
          </div>

          <aside className="rounded-md border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Resumo do dia
            </p>
            <h2 className="mt-3 text-lg font-semibold text-white">
              {daySummary.state}
            </h2>
            <p className="mt-4 text-sm leading-6 text-neutral-300">
              {daySummary.mainFocus}
            </p>
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                Proximo foco
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                {daySummary.nextFocus}
              </p>
            </div>
          </aside>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {dashboardStats.map((item) => (
            <DashboardCard
              detail={item.detail}
              key={item.label}
              label={item.label}
              tone={item.tone}
              value={item.value}
            />
          ))}
        </section>

        <section className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="space-y-8">
            <section>
              <SectionHeader
                description="Lista estatica para visualizar a hierarquia do dia antes de existir CRUD."
                eyebrow="Prioridades"
                title="Tarefas do dia"
              />
              <div className="grid gap-3">
                {todayTasks.map((task) => (
                  <TaskPreview key={task.title} task={task} />
                ))}
              </div>
            </section>

            <section>
              <SectionHeader
                description="Metas exibidas como referencia visual, sem persistencia real nesta etapa."
                eyebrow="Direcao"
                title="Metas principais"
              />
              <div className="grid gap-4 md:grid-cols-3">
                {mainGoals.map((goal) => (
                  <article
                    className="rounded-md border border-white/10 bg-neutral-900/70 p-4"
                    key={goal.title}
                  >
                    <h3 className="text-sm font-medium leading-6 text-white">
                      {goal.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-400">
                      {goal.note}
                    </p>
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span>Progresso visual</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-cyan-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <SectionHeader
                description="Projetos ativos aparecem como contexto para proximas decisoes."
                eyebrow="Execucao"
                title="Projetos ativos"
              />
              <div className="grid gap-3 md:grid-cols-3">
                {activeProjects.map((project) => (
                  <ProjectPreview key={project.name} project={project} />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <SectionHeader
                description="Blocos de rotina e estudos para orientar o ritmo do dia."
                eyebrow="Ritmo"
                title="Rotina e estudos"
              />
              <div className="space-y-3">
                {routineBlocks.map((block) => (
                  <article
                    className="rounded-md border border-white/10 bg-neutral-900/70 p-4"
                    key={block.title}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-white">
                          {block.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-neutral-400">
                          {block.focus}
                        </p>
                      </div>
                      <span className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-neutral-400">
                        {block.window}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                Area futura
              </p>
              <h2 className="mt-3 text-lg font-semibold text-white">
                {assistantPreview.title}
              </h2>
              <p className="mt-2 text-sm font-medium text-cyan-100">
                {assistantPreview.status}
              </p>
              <p className="mt-4 text-sm leading-6 text-neutral-300">
                {assistantPreview.description}
              </p>
            </section>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
