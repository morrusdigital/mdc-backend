import { IProjectRepository } from "../../domain/repositories/project.repository";
import { Project, ProjectProps } from "../../domain/entities/project.entity";

export class CreateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(props: ProjectProps): Promise<Project> {
    const existing = await this.projectRepository.findBySlug(props.slug);
    if (existing) {
      throw new Error(`Project with slug '${props.slug}' already exists`);
    }

    const project = new Project(props);
    return this.projectRepository.create(project);
  }
}
