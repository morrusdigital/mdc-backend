import { NotFoundError } from "../../../shared/errors/app-error";
import { Project } from "../domain/project.entity";
import { IProjectRepository } from "../repositories/project.repository";

export class GetProjectByIdUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<Project> {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundError(`Project with ID '${id}' not found`);
    }

    return project;
  }
}
