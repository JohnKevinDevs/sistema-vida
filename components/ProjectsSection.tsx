import { ProjectPreview } from "@/components/ProjectPreview";
import { SectionHeader } from "@/components/SectionHeader";
import type { Project } from "@/lib/types";

type ProjectsSectionProps = {
  onSelectProject: (projectId: string) => void;
  projects: Project[];
  selectedProject?: Project;
  selectedProjectId: string;
};

export function ProjectsSection({
  onSelectProject,
  projects,
  selectedProject,
  selectedProjectId,
}: ProjectsSectionProps) {
  return (
    <section>
      <SectionHeader
        description={`Projeto destacado: ${selectedProject?.name ?? "nenhum"}. Clique em outro card para trocar o foco visual.`}
        eyebrow="Execucao"
        title="Projetos ativos"
      />
      <div className="grid gap-3 md:grid-cols-3">
        {projects.map((project) => (
          <ProjectPreview
            isSelected={project.id === selectedProjectId}
            key={project.id}
            onSelect={() => onSelectProject(project.id)}
            project={project}
          />
        ))}
      </div>
    </section>
  );
}
