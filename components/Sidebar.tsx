import { ConversationList } from "@/components/ConversationList";
import type { Project } from "@/lib/types";

type SidebarProps = {
  activeConversationId: string | null;
  conversationListRefreshKey: number;
  onDeleteConversation: (conversationId: string) => void;
  onSelectProject: (projectId: string) => void;
  onStartNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
  projects: Project[];
  selectedProjectId: string;
};

const projectStatusLabels: Record<Project["status"], string> = {
  active: "Ativo",
  completed: "Concluído",
  paused: "Pausado",
  planned: "Planejado",
};

export function Sidebar({
  activeConversationId,
  conversationListRefreshKey,
  onDeleteConversation,
  onSelectProject,
  onStartNewConversation,
  onSelectConversation,
  projects,
  selectedProjectId,
}: SidebarProps) {
  return (
    <aside className="border-b border-white/10 bg-neutral-950/95 px-4 py-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-80 lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex items-start justify-between gap-4 lg:block">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Sistema JK
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal text-white">
            Vida e Tarefas
          </h1>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-medium text-neutral-400 lg:mt-4 lg:inline-flex">
          v1 local
        </span>
      </div>

      <button
        className="focus-ring mt-6 w-full rounded-md border border-cyan-300/30 bg-cyan-300/15 px-3 py-2.5 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20 active:scale-[0.99]"
        onClick={onStartNewConversation}
        type="button"
      >
        Nova conversa
      </button>

      <section aria-labelledby="sidebar-projects-title" className="mt-7">
        <div className="flex items-center justify-between gap-3">
          <h2
            className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500"
            id="sidebar-projects-title"
          >
            Projetos
          </h2>
          <span className="text-xs text-neutral-600">{projects.length}</span>
        </div>

        <div className="mt-3 space-y-1.5">
          {projects.map((project) => {
            const isSelected = project.id === selectedProjectId;

            return (
              <button
                aria-pressed={isSelected}
                className={`focus-ring w-full rounded-md px-3 py-2 text-left transition ${
                  isSelected
                    ? "bg-white text-neutral-950"
                    : "text-neutral-300 hover:bg-white/[0.06] hover:text-white"
                }`}
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                type="button"
              >
                <span className="block truncate text-sm font-medium">
                  {project.name}
                </span>
                <span
                  className={`mt-0.5 block text-xs ${
                    isSelected ? "text-neutral-700" : "text-neutral-500"
                  }`}
                >
                  {projectStatusLabels[project.status]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <ConversationList
        activeConversationId={activeConversationId}
        refreshKey={conversationListRefreshKey}
        onDeleteConversation={onDeleteConversation}
        onSelectConversation={onSelectConversation}
      />

      <div className="mt-6 border-t border-white/10 pt-4 text-xs leading-5 text-neutral-500 lg:mt-auto">
        <p>Local • SQLite • Gemini</p>
        <p className="mt-1">Fase 3.0</p>
      </div>
    </aside>
  );
}
