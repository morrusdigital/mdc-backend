import { Project, ProjectProps } from "../domain/project.entity";

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findBySlug(slug: string): Promise<Project | null>;
  findById(id: string): Promise<Project | null>;
  create(project: Project): Promise<Project>;
  update(id: string, projectProps: Partial<ProjectProps>): Promise<Project>;
  delete(id: string): Promise<boolean>;
}
