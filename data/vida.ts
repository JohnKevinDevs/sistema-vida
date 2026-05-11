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
  state: "Fase 0.5 em polimento",
  mainFocus: "Refinar microcopy, foco por teclado e clareza dos controles",
  nextFocus: "Manter a UI preparada para evoluir sem criar persistencia ainda",
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
    value: "0.5",
    detail: "UX e acessibilidade basica",
    tone: "emerald",
  },
  {
    id: "proximo-foco",
    label: "Proximo foco",
    value: "Clareza",
    detail: "controles mais legiveis",
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
    area: "Sistema",
    time: "Manha",
    status: "Prioridade",
  },
  {
    id: "estado-local",
    title: "Validar interacoes locais sem persistencia",
    area: "Vida e Tarefas",
    time: "Tarde",
    status: "Em andamento",
  },
  {
    id: "proximos-passos",
    title: "Registrar proximos passos da Fase 0.6",
    area: "Planejamento",
    time: "Noite",
    status: "Planejado",
  },
];

export const mainGoals: Goal[] = [
  {
    id: "segundo-cerebro",
    title: "Construir um segundo cerebro local confiavel",
    progress: 22,
    note: "Setup e interface base prontos; organizacao tecnica em progresso.",
  },
  {
    id: "revisao-diaria",
    title: "Criar uma rotina simples de revisao diaria",
    progress: 14,
    note: "Espaco visual existe antes de qualquer persistencia real.",
  },
  {
    id: "evolucao-controlada",
    title: "Manter o projeto pequeno e evolutivo",
    progress: 28,
    note: "Sem IA, banco, API ou CRUD nesta fase.",
  },
];

export const activeProjects: Project[] = [
  {
    id: "sistema-jk-v1",
    name: "Sistema JK v1",
    status: "Base tecnica visual",
    nextStep: "Separar estado local de persistencia futura",
    signal: "Verde",
  },
  {
    id: "vida-e-tarefas",
    name: "Vida e Tarefas",
    status: "Modelo inicial",
    nextStep: "Refinar tarefas, metas, projetos e revisoes",
    signal: "Azul",
  },
  {
    id: "rotina-estudos",
    name: "Rotina de estudos",
    status: "Mapa futuro",
    nextStep: "Organizar ciclos de estudo e revisao",
    signal: "Amarelo",
  },
];

export const routineBlocks: RoutineBlock[] = [
  {
    id: "abertura-dia",
    title: "Abertura do dia",
    window: "08:00",
    focus: "Ver prioridades, energia e primeira acao.",
  },
  {
    id: "execucao",
    title: "Bloco de execucao",
    window: "10:00",
    focus: "Trabalhar no foco principal sem trocar de contexto.",
  },
  {
    id: "estudos-revisao",
    title: "Estudos e revisao",
    window: "17:00",
    focus: "Consolidar aprendizados e preparar o proximo ciclo.",
  },
];

export const assistantPreview: AssistantPreview = {
  title: "Assistente futuro",
  status: "Reservado para uma etapa posterior",
  description:
    "Espaco reservado para o chat conversacional futuro. Nesta fase ele continua sem IA, API ou integracao externa.",
};
