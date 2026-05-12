import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import type { Project } from "@/lib/types";

type AppShellProps = {
  activeConversationId: string | null;
  children: ReactNode;
  conversationListRefreshKey: number;
  onDeleteConversation: (conversationId: string) => void;
  onSelectProject: (projectId: string) => void;
  onStartNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
  projects: Project[];
  selectedProjectId: string;
};

export function AppShell({
  activeConversationId,
  children,
  conversationListRefreshKey,
  onDeleteConversation,
  onSelectProject,
  onStartNewConversation,
  onSelectConversation,
  projects,
  selectedProjectId,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
        <Sidebar
          activeConversationId={activeConversationId}
          conversationListRefreshKey={conversationListRefreshKey}
          onDeleteConversation={onDeleteConversation}
          onSelectProject={onSelectProject}
          onStartNewConversation={onStartNewConversation}
          onSelectConversation={onSelectConversation}
          projects={projects}
          selectedProjectId={selectedProjectId}
        />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
