export interface ProjectProps {
  id: string;
  group: string;
  title: string;
  description: string;
  link: string;

  html: string;
  yaml: string;

  tags: string[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  group: string;
  title: string;
  description: string;
  link: string;
  html: File;
  yaml: File;
  tags: string[];
}

export interface UpdateProjectInput {
  group?: string;
  title?: string;
  description?: string;
  link?: string;
  html?: File;
  yaml?: File;
  tags?: string[];
}

export class Project {
  readonly id: string;
  readonly group: string;
  readonly title: string;
  readonly description: string;
  readonly link: string;

  readonly html: string;
  readonly yaml: string;

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
