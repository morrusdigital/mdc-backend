import { Project } from "../domain/project.entity";
import { IProjectRepository } from "../repositories/project.repository";

export class GetProjectsUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(): Promise<Project[]> {
    return this.projectRepository.findAll();
  }
}
