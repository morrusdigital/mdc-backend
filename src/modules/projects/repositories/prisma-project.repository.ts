import prisma from "../../../config/prisma";
import { GalleryItem, Project, ProjectProps } from "../domain/project.entity";
import { IProjectRepository } from "./project.repository";

export class PrismaProjectRepository implements IProjectRepository {
  private toDomain(raw: any): Project {
    return new Project({
      id: raw.id,
      slug: raw.slug,
      name: raw.name,
      client: raw.client,
      year: raw.year,
      category: raw.category,
      industry: raw.industry,
      serviceType: raw.serviceType,
      summary: raw.summary,
      challenge: raw.challenge,
      objective: raw.objective,
      solution: raw.solution,
      outcome: raw.outcome,
      deliverables: (raw.deliverables as string[]) || [],
      technologies: (raw.technologies as string[]) || [],
      thumbnailLabel: raw.thumbnailLabel,
      thumbnailTone: raw.thumbnailTone,
      gallery: (raw.gallery as GalleryItem[]) || [],
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async findAll(): Promise<Project[]> {
    const records = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    return records.map((record: any) => this.toDomain(record));
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const record = await prisma.project.findUnique({
      where: { slug },
    });

    if (!record) {
      return null;
    }

    return this.toDomain(record);
  }

  async findById(id: string): Promise<Project | null> {
    const record = await prisma.project.findUnique({
      where: { id },
    });

    if (!record) {
      return null;
    }

    return this.toDomain(record);
  }

  async create(project: Project): Promise<Project> {
    const record = await prisma.project.create({
      data: {
        slug: project.slug,
        name: project.name,
        client: project.client,
        year: project.year,
        category: project.category,
        industry: project.industry,
        serviceType: project.serviceType,
        summary: project.summary,
        challenge: project.challenge,
        objective: project.objective,
        solution: project.solution,
        outcome: project.outcome,
        deliverables: project.deliverables as any,
        technologies: project.technologies as any,
        thumbnailLabel: project.thumbnailLabel,
        thumbnailTone: project.thumbnailTone,
        gallery: project.gallery as any,
      },
    });

    return this.toDomain(record);
  }

  async update(id: string, projectProps: Partial<ProjectProps>): Promise<Project> {
    const data: any = {};

    if (projectProps.slug !== undefined) data.slug = projectProps.slug;
    if (projectProps.name !== undefined) data.name = projectProps.name;
    if (projectProps.client !== undefined) data.client = projectProps.client;
    if (projectProps.year !== undefined) data.year = projectProps.year;
    if (projectProps.category !== undefined) data.category = projectProps.category;
    if (projectProps.industry !== undefined) data.industry = projectProps.industry;
    if (projectProps.serviceType !== undefined) data.serviceType = projectProps.serviceType;
    if (projectProps.summary !== undefined) data.summary = projectProps.summary;
    if (projectProps.challenge !== undefined) data.challenge = projectProps.challenge;
    if (projectProps.objective !== undefined) data.objective = projectProps.objective;
    if (projectProps.solution !== undefined) data.solution = projectProps.solution;
    if (projectProps.outcome !== undefined) data.outcome = projectProps.outcome;
    if (projectProps.deliverables !== undefined) data.deliverables = projectProps.deliverables;
    if (projectProps.technologies !== undefined) data.technologies = projectProps.technologies;
    if (projectProps.thumbnailLabel !== undefined) data.thumbnailLabel = projectProps.thumbnailLabel;
    if (projectProps.thumbnailTone !== undefined) data.thumbnailTone = projectProps.thumbnailTone;
    if (projectProps.gallery !== undefined) data.gallery = projectProps.gallery;

    const record = await prisma.project.update({
      where: { id },
      data,
    });

    return this.toDomain(record);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.project.delete({
      where: { id },
    });

    return true;
  }
}
