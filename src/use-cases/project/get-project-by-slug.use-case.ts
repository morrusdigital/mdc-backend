import { IProjectRepository } from "../../domain/repositories/project.repository";
import { Project } from "../../domain/entities/project.entity";

export class GetProjectBySlugUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(slug: string): Promise<Project | null> {
    return this.projectRepository.findBySlug(slug);
  }
}
