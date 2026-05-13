export type EntityId = string;

export type ISODateString = string;

export type LifeView = "Dia" | "Semana" | "Metas";

export type LifeAreaId =
  | "vida"
  | "tarefas"
  | "metas"
  | "projetos"
  | "rotina"
  | "estudos"
  | "revisoes"
  | "sistema"
  | "planejamento";

export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";

export type TaskPriority = "low" | "medium" | "high";

export type ProjectStatus = "planned" | "active" | "paused" | "completed";

export type StoredProjectStatus = "active" | "paused" | "archived";

export type GoalStatus = "planned" | "active" | "paused" | "completed";

export type ReviewType = "daily" | "weekly";

export type MessageRole = "user" | "assistant" | "system";

export type MemoryCategory =
  | "identity"
  | "preference"
  | "project"
  | "routine"
  | "lesson"
  | "note";

export type MemoryImportance = "low" | "medium" | "high";

export type ProjectSignal = "Verde" | "Amarelo" | "Azul";

export type DashboardTone = "cyan" | "emerald" | "amber";

export type LifeArea = {
  id: LifeAreaId;
  label: string;
  description: string;
};

export type Task = {
  id: EntityId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  area: LifeAreaId;
  areaLabel: string;
  dueDate?: ISODateString;
  timeWindow?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type Project = {
  id: EntityId;
  name: string;
  description: string;
  status: ProjectStatus;
  area: LifeAreaId;
  nextAction: string;
  signal: ProjectSignal;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type StoredProject = {
  id: EntityId;
  name: string;
  description: string | null;
  status: StoredProjectStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type CreateProjectInput = {
  name: string;
  description?: string | null;
  status?: StoredProjectStatus;
};

export type UpdateProjectInput = {
  name?: string;
  description?: string | null;
  status?: StoredProjectStatus;
};

export type Goal = {
  id: EntityId;
  title: string;
  area: LifeAreaId;
  status: GoalStatus;
  progress: number;
  targetDate?: ISODateString;
  note: string;
};

export type RoutineBlock = {
  id: EntityId;
  title: string;
  window: string;
  focus: string;
  area: LifeAreaId;
};

export type Review = {
  id: EntityId;
  type: ReviewType;
  date: ISODateString;
  wins: string[];
  challenges: string[];
  lessons: string[];
  nextActions: string[];
};

export type Conversation = {
  id: EntityId;
  projectId: EntityId | null;
  title: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type CreateConversationInput = {
  projectId?: EntityId | null;
  title?: string;
};

export type Message = {
  id: EntityId;
  conversationId: EntityId;
  role: MessageRole;
  content: string;
  createdAt: ISODateString;
};

export type CreateMessageInput = {
  conversationId: EntityId;
  role: MessageRole;
  content: string;
  createdAt?: ISODateString;
};

export type Memory = {
  id: EntityId;
  content: string;
  category: MemoryCategory;
  importance: MemoryImportance;
  createdAt: ISODateString;
};

export type SystemState = {
  currentFocus: string;
  activeProjects: EntityId[];
  pendingTasks: EntityId[];
  weeklyPriorities: string[];
  updatedAt: ISODateString;
};

export type DashboardStat = {
  id: EntityId;
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

export type AssistantMessage = {
  role: Extract<MessageRole, "user" | "assistant">;
  content: string;
};

export type AssistantRequest = {
  userMessage: string;
};

export type AssistantErrorCode =
  | "INVALID_REQUEST"
  | "MISSING_API_KEY"
  | "INVALID_API_KEY"
  | "QUOTA_EXCEEDED"
  | "MODEL_UNAVAILABLE"
  | "EMPTY_RESPONSE"
  | "TEMPORARY_ERROR"
  | "UNKNOWN_ERROR";

export type AssistantError = {
  code: AssistantErrorCode;
  message: string;
};

export type AssistantResponse = {
  content: string;
  createdAt: ISODateString;
  model: string;
  error?: string;
  errorCode?: AssistantErrorCode;
};

export type LocalChatMessage = {
  id: EntityId;
  role: Extract<MessageRole, "user" | "assistant">;
  content: string;
  createdAt: ISODateString;
  status?: "sending" | "sent" | "error";
};
