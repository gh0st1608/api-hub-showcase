import { ValidationError } from "@domain/errors";

export interface ProjectProps {
  id: string;
  group: string;
  title: string;
  description: string;
  link: string;
  html: File | string;
  yaml: File | string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  group: string;
  title: string;
  description: string;
  link: string;
  html: File | string;
  yaml: File | string;
  tags: string[];
}

export interface UpdateProjectInput {
  group?: string;
  title?: string;
  description?: string;
  link?: string;
  html?: File | string;
  yaml?: File | string;
  tags?: string[];
}

export class Project {
  readonly id: string;
  readonly group: string;
  readonly title: string;
  readonly description: string;
  readonly link: string;
  readonly html: File | string;
  readonly yaml: File | string;
  readonly tags: string[];
  readonly createdAt: string;
  readonly updatedAt: string;

  private constructor(props: ProjectProps) {
    this.id = props.id;
    this.group = props.group;
    this.title = props.title;
    this.description = props.description;
    this.link = props.link;
    this.html = props.html;
    this.yaml = props.yaml;
    this.tags = props.tags;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static validate(input: CreateProjectInput): void {
    if (!input.title?.trim()) {
      throw new ValidationError("Title is required");
    }
    if (!input.group?.trim()) {
      throw new ValidationError("Group is required");
    }
    if (!input.link?.trim()) {
      throw new ValidationError("Link is required");
    }
  }

  static hydrate(props: ProjectProps): Project {
    return new Project(props);
  }

  toPrimitives(): ProjectProps {
    return {
      id: this.id,
      group: this.group,
      title: this.title,
      description: this.description,
      link: this.link,
      html: this.html,
      yaml: this.yaml,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
