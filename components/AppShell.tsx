import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

type AppShellProps = {
  activeConversationId: string | null;
  children: ReactNode;
  conversationListRefreshKey: number;
  onDeleteConversation: (conversationId: string) => void;
  onStartNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
};

export function AppShell({
  activeConversationId,
  children,
  conversationListRefreshKey,
  onDeleteConversation,
  onStartNewConversation,
  onSelectConversation,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] flex-col lg:flex-row">
        <Sidebar
          activeConversationId={activeConversationId}
          conversationListRefreshKey={conversationListRefreshKey}
          onDeleteConversation={onDeleteConversation}
          onStartNewConversation={onStartNewConversation}
          onSelectConversation={onSelectConversation}
        />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
