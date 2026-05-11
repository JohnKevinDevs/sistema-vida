export type TaskPreviewItem = {
  title: string;
  area: string;
  time: string;
  status: "Prioridade" | "Em andamento" | "Planejado";
};

export type GoalPreviewItem = {
  title: string;
  progress: number;
  note: string;
};

export type ProjectPreviewItem = {
  name: string;
  status: string;
  nextStep: string;
  signal: "Verde" | "Amarelo" | "Azul";
};

export type RoutineBlock = {
  title: string;
  window: string;
  focus: string;
};

export const daySummary = {
  dateLabel: "Hoje",
  state: "Fase 0.2 em construcao",
  mainFocus: "Organizar a base visual do modulo Vida e Tarefas",
  nextFocus: "Transformar blocos estaticos em fluxos reais nas proximas fases",
};

export const dashboardStats = [
  {
    label: "Prioridades",
    value: "3",
    detail: "focos para manter o dia claro",
    tone: "cyan",
  },
  {
    label: "Estado",
    value: "0.2",
    detail: "estrutura visual base",
    tone: "emerald",
  },
  {
    label: "Proximo foco",
    value: "UI",
    detail: "blocos prontos para evoluir",
    tone: "amber",
  },
] as const;

export const todayTasks: TaskPreviewItem[] = [
  {
    title: "Finalizar base visual do Sistema JK",
    area: "Sistema",
    time: "Manha",
    status: "Prioridade",
  },
  {
    title: "Revisar clareza das secoes principais",
    area: "Vida e Tarefas",
    time: "Tarde",
    status: "Em andamento",
  },
  {
    title: "Registrar proximos passos da Fase 0.3",
    area: "Planejamento",
    time: "Noite",
    status: "Planejado",
  },
];

export const mainGoals: GoalPreviewItem[] = [
  {
    title: "Construir um segundo cerebro local confiavel",
    progress: 18,
    note: "Setup inicial pronto; interface base em progresso.",
  },
  {
    title: "Criar uma rotina simples de revisao diaria",
    progress: 10,
    note: "Espaco visual criado antes de qualquer persistencia real.",
  },
  {
    title: "Manter o projeto pequeno e evolutivo",
    progress: 24,
    note: "Sem IA, banco ou CRUD nesta fase.",
  },
];

export const activeProjects: ProjectPreviewItem[] = [
  {
    name: "Sistema JK v1",
    status: "Fundacao visual",
    nextStep: "Definir blocos editaveis na Fase 0.3",
    signal: "Verde",
  },
  {
    name: "Vida e Tarefas",
    status: "Modelo inicial",
    nextStep: "Separar tarefas, metas, projetos e revisoes",
    signal: "Azul",
  },
  {
    name: "Rotina de estudos",
    status: "Mapa futuro",
    nextStep: "Organizar ciclos de estudo e revisao",
    signal: "Amarelo",
  },
];

export const routineBlocks: RoutineBlock[] = [
  {
    title: "Abertura do dia",
    window: "08:00",
    focus: "Ver prioridades, energia e primeira acao.",
  },
  {
    title: "Bloco de execucao",
    window: "10:00",
    focus: "Trabalhar no foco principal sem trocar de contexto.",
  },
  {
    title: "Estudos e revisao",
    window: "17:00",
    focus: "Consolidar aprendizados e preparar o proximo ciclo.",
  },
];

export const assistantPreview = {
  title: "Assistente futuro",
  status: "Reservado para uma etapa posterior",
  description:
    "Este espaco mostra onde o chat conversacional podera aparecer, mas ainda nao possui IA, API ou integracao externa.",
};
