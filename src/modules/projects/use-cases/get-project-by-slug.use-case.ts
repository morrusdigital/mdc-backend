import { NotFoundError } from "../../../shared/errors/app-error";
import { Project } from "../domain/project.entity";
import { IProjectRepository } from "../repositories/project.repository";

export class GetProjectBySlugUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(slug: string): Promise<Project> {
    const project = await this.projectRepository.findBySlug(slug);

    if (!project) {
      throw new NotFoundError(`Project with slug '${slug}' not found`);
    }

    return project;
  }
}
