import { IProjectRepository } from "../../domain/repositories/project.repository";

export class DeleteProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<boolean> {
    const existing = await this.projectRepository.findById(id);
    if (!existing) {
      throw new Error(`Project with ID '${id}' not found`);
    }

    return this.projectRepository.delete(id);
  }
}
