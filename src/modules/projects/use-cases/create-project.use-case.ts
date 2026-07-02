import { Project, ProjectProps } from "../domain/project.entity";
import { IProjectRepository } from "../repositories/project.repository";
import { ConflictError } from "../../../shared/errors/app-error";

export class CreateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(props: ProjectProps): Promise<Project> {
    const existing = await this.projectRepository.findBySlug(props.slug);

    if (existing) {
      throw new ConflictError(`Project with slug '${props.slug}' already exists`);
    }

    const project = new Project(props);
    return this.projectRepository.create(project);
  }
}
