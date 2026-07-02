import { ConflictError, NotFoundError } from "../../../shared/errors/app-error";
import { Project, ProjectProps } from "../domain/project.entity";
import { IProjectRepository } from "../repositories/project.repository";

export class UpdateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string, props: Partial<ProjectProps>): Promise<Project> {
    const existing = await this.projectRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Project with ID '${id}' not found`);
    }

    if (props.slug && props.slug !== existing.slug) {
      const existingBySlug = await this.projectRepository.findBySlug(props.slug);

      if (existingBySlug) {
        throw new ConflictError(`Project with slug '${props.slug}' already exists`);
      }
    }

    return this.projectRepository.update(id, props);
  }
}
