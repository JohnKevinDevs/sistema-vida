import { ConversationList } from "@/components/ConversationList";

const navigationItems = [
  "Hoje",
  "Semana",
  "Metas",
  "Projetos",
  "Rotina",
  "Estudos",
  "Revisoes",
];

export function Sidebar() {
  return (
    <aside className="border-b border-white/10 bg-neutral-950/95 px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
      <div className="flex items-center justify-between gap-4 lg:block">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Sistema JK
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal text-white">
            Vida e Tarefas
          </h1>
        </div>
        <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200 lg:mt-6 lg:inline-flex">
          Fase 2.5
        </div>
      </div>

      <nav aria-label="Mapa visual do modulo" className="mt-6 lg:mt-10">
        <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {navigationItems.map((item, index) => (
          <li
            aria-current={index === 0 ? "page" : undefined}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm transition ${
              index === 0
                ? "bg-white text-neutral-950"
                : "text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
            }`}
            key={item}
          >
            {item}
          </li>
        ))}
        </ul>
      </nav>

      <div className="mt-6 hidden rounded-md border border-white/10 bg-white/[0.03] p-4 lg:block">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Estado atual
        </p>
        <p className="mt-3 text-sm leading-6 text-neutral-300">
          Chat conectado ao Gemini com conversas e mensagens salvas no SQLite
          local.
        </p>
      </div>

      <ConversationList />
    </aside>
  );
}
