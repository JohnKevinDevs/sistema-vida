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
  state: "Fase 3.1 com polish visual",
  mainFocus: "Começar pelo chat e transformar o dia em decisões claras.",
  nextFocus: "Evoluir tarefas reais sem perder a clareza da central.",
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
    value: "3.1",
    detail: "polish visual de UI e UX",
    tone: "emerald",
  },
  {
    id: "proximo-foco",
    label: "Próximo foco",
    value: "Tarefas",
    detail: "persistência real com interface limpa",
    tone: "amber",
  },
];

export const viewSummaries: ViewSummary[] = [
  {
    view: "Dia",
    title: "Dia em foco",
    description:
      "Prioridades essenciais, próximo passo e conversa para organizar a ação.",
  },
  {
    view: "Semana",
    title: "Semana em andamento",
    description:
      "Projetos, ritmo e pontos de atenção para distribuir energia com calma.",
  },
  {
    view: "Metas",
    title: "Metas principais",
    description:
      "Direções maiores do Sistema JK, sem transformar tudo em painel pesado.",
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
    title: "Validar o polish visual",
    description: "Conferir hierarquia, espaçamento e legibilidade da central.",
    status: "todo",
    priority: "high",
    area: "sistema",
    areaLabel: "Sistema",
    timeWindow: "Manhã",
    createdAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-05-10T09:00:00.000Z",
  },
  {
    id: "estado-local",
    title: "Testar fluxo de conversas",
    description: "Selecionar, renomear, excluir e continuar uma conversa salva.",
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
    title: "Registrar o próximo ciclo",
    description: "Definir o início das tarefas reais sem criar excesso visual.",
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
    note: "Chat, histórico local e conversas já estão estáveis.",
  },
  {
    id: "revisao-diaria",
    title: "Criar uma rotina simples de revisão diária",
    area: "revisoes",
    status: "planned",
    progress: 14,
    targetDate: "2026-06-15T00:00:00.000Z",
    note: "A rotina ainda é visual, mas já tem um lugar claro na central.",
  },
  {
    id: "evolucao-controlada",
    title: "Manter o projeto pequeno e evolutivo",
    area: "sistema",
    status: "active",
    progress: 28,
    note: "Cada fase adiciona só o necessário para o próximo passo.",
  },
];

export const activeProjects: Project[] = [
  {
    id: "sistema-jk-v1",
    name: "Sistema JK v1",
    description: "Aplicação local para organizar vida, tarefas e revisões.",
    status: "active",
    area: "sistema",
    nextAction: "Consolidar a experiência antes de criar tarefas reais",
    signal: "Verde",
    createdAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-05-10T09:00:00.000Z",
  },
  {
    id: "vida-e-tarefas",
    name: "Vida e Tarefas",
    description: "Módulo inicial para rotina, prioridades e projetos.",
    status: "active",
    area: "tarefas",
    nextAction: "Preparar tarefas com persistência local",
    signal: "Azul",
    createdAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-05-10T09:00:00.000Z",
  },
  {
    id: "rotina-estudos",
    name: "Rotina de estudos",
    description: "Espaço futuro para ciclos de estudo e revisão.",
    status: "planned",
    area: "estudos",
    nextAction: "Organizar ciclos de estudo e revisão",
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
    focus: "Ver prioridades, energia e primeira ação.",
    area: "rotina",
  },
  {
    id: "execucao",
    title: "Bloco de execução",
    window: "10:00",
    focus: "Trabalhar no foco principal sem trocar de contexto.",
    area: "tarefas",
  },
  {
    id: "estudos-revisao",
    title: "Estudos e revisão",
    window: "17:00",
    focus: "Consolidar aprendizados e preparar o próximo ciclo.",
    area: "estudos",
  },
];

export const assistantPreview: AssistantPreview = {
  title: "Assistente do Sistema JK",
  status: "Chat com histórico local ativo",
  description:
    "Organize ideias soltas, prioridades e próximos passos em poucos minutos.",
};
