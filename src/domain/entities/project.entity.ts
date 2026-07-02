export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectProps {
  id?: string;
  slug: string;
  name: string;
  client: string;
  year: string;
  category: string;
  industry: string;
  serviceType: string;
  summary: string;
  challenge: string;
  objective: string;
  solution: string;
  outcome: string;
  deliverables: string[];
  technologies: string[];
  thumbnailLabel: string;
  thumbnailTone: string;
  gallery: GalleryItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Project {
  private props: ProjectProps;

  constructor(props: ProjectProps) {
    this.props = {
      ...props,
      deliverables: props.deliverables || [],
      technologies: props.technologies || [],
      gallery: props.gallery || [],
    };
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get slug(): string {
    return this.props.slug;
  }

  get name(): string {
    return this.props.name;
  }

  get client(): string {
    return this.props.client;
  }

  get year(): string {
    return this.props.year;
  }

  get category(): string {
    return this.props.category;
  }

  get industry(): string {
    return this.props.industry;
  }

  get serviceType(): string {
    return this.props.serviceType;
  }

  get summary(): string {
    return this.props.summary;
  }

  get challenge(): string {
    return this.props.challenge;
  }

  get objective(): string {
    return this.props.objective;
  }

  get solution(): string {
    return this.props.solution;
  }

  get outcome(): string {
    return this.props.outcome;
  }

  get deliverables(): string[] {
    return this.props.deliverables;
  }

  get technologies(): string[] {
    return this.props.technologies;
  }

  get thumbnailLabel(): string {
    return this.props.thumbnailLabel;
  }

  get thumbnailTone(): string {
    return this.props.thumbnailTone;
  }

  get gallery(): GalleryItem[] {
    return this.props.gallery;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  public toJSON() {
    return {
      id: this.props.id,
      slug: this.props.slug,
      name: this.props.name,
      client: this.props.client,
      year: this.props.year,
      category: this.props.category,
      industry: this.props.industry,
      serviceType: this.props.serviceType,
      summary: this.props.summary,
      challenge: this.props.challenge,
      objective: this.props.objective,
      solution: this.props.solution,
      outcome: this.props.outcome,
      deliverables: this.props.deliverables,
      technologies: this.props.technologies,
      thumbnailLabel: this.props.thumbnailLabel,
      thumbnailTone: this.props.thumbnailTone,
      gallery: this.props.gallery,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
