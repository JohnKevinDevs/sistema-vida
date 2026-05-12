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
    <aside className="border-b border-slate-800/80 bg-[#030711]/95 px-4 py-5 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[340px] lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex items-start justify-between gap-4 lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md border border-blue-400/25 bg-blue-500/10 text-sm font-semibold text-blue-100">
            JK
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-300">
              Sistema JK
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-normal text-white">
              Vida e Tarefas
            </h1>
          </div>
        </div>
        <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-2.5 py-1 text-xs font-medium text-slate-400 lg:mt-5 lg:inline-flex">
          v1 local
        </span>
      </div>

      <button
        className="focus-ring mt-6 w-full rounded-md border border-blue-400/30 bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:border-blue-300/50 hover:bg-blue-500 active:scale-[0.99]"
        onClick={onStartNewConversation}
        type="button"
      >
        Nova conversa
      </button>

      <section aria-labelledby="sidebar-projects-title" className="mt-8">
        <div className="flex items-center justify-between gap-3 px-1">
          <h2
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500"
            id="sidebar-projects-title"
          >
            Projetos
          </h2>
          <span className="text-xs text-slate-600">{projects.length}</span>
        </div>

        <div className="mt-3 space-y-1">
          {projects.map((project) => {
            const isSelected = project.id === selectedProjectId;

            return (
              <button
                aria-pressed={isSelected}
                className={`focus-ring w-full rounded-md border px-3 py-2.5 text-left transition ${
                  isSelected
                    ? "border-blue-400/30 bg-blue-500/10 text-white"
                    : "border-transparent text-slate-300 hover:border-slate-700/70 hover:bg-slate-900/70 hover:text-white"
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
                    isSelected ? "text-blue-200/90" : "text-slate-500"
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

      <div className="mt-8 border-t border-slate-800/80 pt-4 text-xs leading-5 text-slate-500 lg:mt-auto">
        <p>Local • SQLite • Gemini</p>
        <p className="mt-1 text-slate-600">Fase 3.1</p>
      </div>
    </aside>
  );
}
