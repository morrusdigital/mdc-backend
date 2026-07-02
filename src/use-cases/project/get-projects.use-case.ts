import { IProjectRepository } from "../../domain/repositories/project.repository";
import { Project } from "../../domain/entities/project.entity";

export class GetProjectsUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(): Promise<Project[]> {
    return this.projectRepository.findAll();
  }
}
