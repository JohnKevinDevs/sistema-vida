export type LifeView = "Hoje" | "Semana" | "Focos";

export type TaskStatus = "Prioridade" | "Em andamento" | "Planejado";

export type ProjectSignal = "Verde" | "Amarelo" | "Azul";

export type DashboardTone = "cyan" | "emerald" | "amber";

export type LifeArea = {
  id: string;
  label: string;
  description: string;
};

export type Task = {
  id: string;
  title: string;
  area: string;
  time: string;
  status: TaskStatus;
};

export type Goal = {
  id: string;
  title: string;
  progress: number;
  note: string;
};

export type Project = {
  id: string;
  name: string;
  status: string;
  nextStep: string;
  signal: ProjectSignal;
};

export type RoutineBlock = {
  id: string;
  title: string;
  window: string;
  focus: string;
};

export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: DashboardTone;
};

export type DaySummary = {
  dateLabel: string;
  state: string;
  mainFocus: string;
  nextFocus: string;
};

export type ViewSummary = {
  view: LifeView;
  title: string;
  description: string;
};

export type AssistantPreview = {
  title: string;
  status: string;
  description: string;
};
