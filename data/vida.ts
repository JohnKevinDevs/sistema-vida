import type {
  AssistantPreview,
  DashboardStat,
  DaySummary,
  Goal,
  LifeArea,
  Project,
  RoutineBlock,
  Task,
  ViewSummary,
} from "@/lib/types";

export const daySummary: DaySummary = {
  dateLabel: "Hoje",
  state: "Fase 1.5 com chat refinado",
  mainFocus: "Testar a conversa mínima conectada à API do assistente",
  nextFocus: "Manter o chat sem histórico salvo até existir persistência real",
};

export const dashboardStats: DashboardStat[] = [
  {
    id: "prioridades",
    label: "Prioridades",
    value: "3",
    detail: "focos para manter o dia claro",
    tone: "cyan",
  },
  {
    id: "estado",
    label: "Estado",
    value: "1.5",
    detail: "chat local com UX refinada",
    tone: "emerald",
  },
  {
    id: "proximo-foco",
    label: "Proximo foco",
    value: "Chat",
    detail: "fluxo sem persistencia real",
    tone: "amber",
  },
];

export const viewSummaries: ViewSummary[] = [
  {
    view: "Hoje",
    title: "Prioridades do dia",
    description:
      "Visao curta para escolher a primeira acao e reduzir ruido mental.",
  },
  {
    view: "Semana",
    title: "Mapa da semana",
    description:
      "Panorama visual para distribuir energia entre projetos, rotina e estudos.",
  },
  {
    view: "Focos",
    title: "Focos ativos",
    description:
      "Recorte simples do que merece atencao antes de adicionar qualquer automacao.",
  },
];

export const lifeAreas: LifeArea[] = [
  {
    id: "vida",
    label: "Vida",
    description: "Rotina, energia, revisoes e organizacao pessoal.",
  },
  {
    id: "tarefas",
    label: "Tarefas",
    description: "Proximas acoes visiveis sem CRUD real nesta etapa.",
  },
  {
    id: "estudos",
    label: "Estudos",
    description: "Blocos de aprendizado e revisao para ciclos futuros.",
  },
];

export const todayTasks: Task[] = [
  {
    id: "base-visual",
    title: "Finalizar organizacao tecnica da base visual",
    description: "Revisar contratos e manter a tela atual funcionando.",
    status: "todo",
    priority: "high",
    area: "sistema",
    areaLabel: "Sistema",
    timeWindow: "Manha",
    createdAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-05-10T09:00:00.000Z",
  },
  {
    id: "estado-local",
    title: "Validar interacoes locais sem persistencia",
    description: "Garantir que os mocks tipados continuam alimentando a UI.",
    status: "in_progress",
    priority: "medium",
    area: "tarefas",
    areaLabel: "Vida e Tarefas",
    timeWindow: "Tarde",
    createdAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-05-10T09:00:00.000Z",
  },
  {
    id: "proximos-passos",
    title: "Registrar proximos passos da Fase 0.7",
    description: "Documentar decisoes antes de qualquer persistencia real.",
    status: "todo",
    priority: "medium",
    area: "planejamento",
    areaLabel: "Planejamento",
    timeWindow: "Noite",
    createdAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-05-10T09:00:00.000Z",
  },
];

export const mainGoals: Goal[] = [
  {
    id: "segundo-cerebro",
    title: "Construir um segundo cerebro local confiavel",
    area: "vida",
    status: "active",
    progress: 22,
    targetDate: "2026-06-30T00:00:00.000Z",
    note: "Setup e interface base prontos; organizacao tecnica em progresso.",
  },
  {
    id: "revisao-diaria",
    title: "Criar uma rotina simples de revisao diaria",
    area: "revisoes",
    status: "planned",
    progress: 14,
    targetDate: "2026-06-15T00:00:00.000Z",
    note: "Espaco visual existe antes de qualquer persistencia real.",
  },
  {
    id: "evolucao-controlada",
    title: "Manter o projeto pequeno e evolutivo",
    area: "sistema",
    status: "active",
    progress: 28,
    note: "Sem IA, banco, API ou CRUD nesta fase.",
  },
];

export const activeProjects: Project[] = [
  {
    id: "sistema-jk-v1",
    name: "Sistema JK v1",
    description: "Aplicacao local para organizar vida, tarefas e revisoes.",
    status: "active",
    area: "sistema",
    nextAction: "Separar estado local de persistencia futura",
    signal: "Verde",
    createdAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-05-10T09:00:00.000Z",
  },
  {
    id: "vida-e-tarefas",
    name: "Vida e Tarefas",
    description: "Modulo inicial para rotina, prioridades e projetos.",
    status: "active",
    area: "tarefas",
    nextAction: "Refinar tarefas, metas, projetos e revisoes",
    signal: "Azul",
    createdAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-05-10T09:00:00.000Z",
  },
  {
    id: "rotina-estudos",
    name: "Rotina de estudos",
    description: "Espaco futuro para ciclos de estudo e revisao.",
    status: "planned",
    area: "estudos",
    nextAction: "Organizar ciclos de estudo e revisao",
    signal: "Amarelo",
    createdAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-05-10T09:00:00.000Z",
  },
];

export const routineBlocks: RoutineBlock[] = [
  {
    id: "abertura-dia",
    title: "Abertura do dia",
    window: "08:00",
    focus: "Ver prioridades, energia e primeira acao.",
    area: "rotina",
  },
  {
    id: "execucao",
    title: "Bloco de execucao",
    window: "10:00",
    focus: "Trabalhar no foco principal sem trocar de contexto.",
    area: "tarefas",
  },
  {
    id: "estudos-revisao",
    title: "Estudos e revisao",
    window: "17:00",
    focus: "Consolidar aprendizados e preparar o proximo ciclo.",
    area: "estudos",
  },
];

export const assistantPreview: AssistantPreview = {
  title: "Assistente do Sistema JK",
  status: "Conectado à API local, sem histórico salvo",
  description:
    "Use para pedir ajuda com rotina, tarefas, estudos e projetos. A conversa fica apenas nesta sessão.",
};
