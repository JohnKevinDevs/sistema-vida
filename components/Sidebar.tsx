import { ConversationList } from "@/components/ConversationList";
import { ProjectList } from "@/components/ProjectList";

type SidebarProps = {
  activeConversationId: string | null;
  activeProjectId: string | null;
  conversationListRefreshKey: number;
  onDeleteConversation: (conversationId: string) => void;
  onSelectProject: (projectId: string | null) => void;
  onStartNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
};

export function Sidebar({
  activeConversationId,
  activeProjectId,
  conversationListRefreshKey,
  onDeleteConversation,
  onSelectProject,
  onStartNewConversation,
  onSelectConversation,
}: SidebarProps) {
  return (
    <aside className="border-b border-slate-800/80 bg-[#030711]/95 px-4 py-5 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[340px] lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex items-start gap-3">
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
      </div>

      <button
        className="focus-ring mt-6 w-full rounded-md border border-blue-400/30 bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:border-blue-300/50 hover:bg-blue-500 active:scale-[0.99]"
        onClick={onStartNewConversation}
        type="button"
      >
        Nova conversa
      </button>

      <ProjectList
        activeProjectId={activeProjectId}
        onSelectProject={onSelectProject}
      />

      <ConversationList
        activeConversationId={activeConversationId}
        refreshKey={conversationListRefreshKey}
        onDeleteConversation={onDeleteConversation}
        onSelectConversation={onSelectConversation}
      />

      <div className="mt-8 border-t border-slate-800/70 pt-4 lg:mt-auto" />
    </aside>
  );
}
