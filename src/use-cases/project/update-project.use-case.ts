import { IProjectRepository } from "../../domain/repositories/project.repository";
import { Project, ProjectProps } from "../../domain/entities/project.entity";

export class UpdateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string, props: Partial<ProjectProps>): Promise<Project> {
    const existing = await this.projectRepository.findById(id);
    if (!existing) {
      throw new Error(`Project with ID '${id}' not found`);
    }

    if (props.slug && props.slug !== existing.slug) {
      const existingBySlug = await this.projectRepository.findBySlug(props.slug);
      if (existingBySlug) {
        throw new Error(`Project with slug '${props.slug}' already exists`);
      }
    }

    return this.projectRepository.update(id, props);
  }
}
