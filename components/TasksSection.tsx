import { SectionHeader } from "@/components/SectionHeader";
import { TaskPreview } from "@/components/TaskPreview";
import type { Task } from "@/lib/types";

type TasksSectionProps = {
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  tasks: Task[];
};

export function TasksSection({
  completedTaskIds,
  onToggleTask,
  tasks,
}: TasksSectionProps) {
  return (
    <section>
      <SectionHeader
        description={`${completedTaskIds.length} de ${tasks.length} tarefas marcadas apenas nesta sessao.`}
        eyebrow="Prioridades"
        title="Tarefas do dia"
      />
      <div className="grid gap-3">
        {tasks.map((task) => (
          <TaskPreview
            isDone={completedTaskIds.includes(task.id)}
            key={task.id}
            onToggle={() => onToggleTask(task.id)}
            task={task}
          />
        ))}
      </div>
    </section>
  );
}
