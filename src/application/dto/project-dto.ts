export interface CreateProjectDto {
  group: string;
  title: string;
  description: string;
  link: string;

  html: File;
  yaml: File;

  tags: string[];
}

export interface UpdateProjectDto {
  group?: string;
  title?: string;
  description?: string;
  link?: string;

  html?: File;
  yaml?: File;

  tags?: string[];
}
