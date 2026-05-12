import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

type AppShellProps = {
  activeConversationId: string | null;
  children: ReactNode;
  conversationListRefreshKey: number;
  onStartNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
};

export function AppShell({
  activeConversationId,
  children,
  conversationListRefreshKey,
  onStartNewConversation,
  onSelectConversation,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
        <Sidebar
          activeConversationId={activeConversationId}
          conversationListRefreshKey={conversationListRefreshKey}
          onStartNewConversation={onStartNewConversation}
          onSelectConversation={onSelectConversation}
        />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
