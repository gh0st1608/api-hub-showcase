export interface CreateProjectDto {
  group: string;
  title: string;
  description: string;
  link: string;
  html: File | string;
  yaml: File | string;
  tags: string[];
}

export interface UpdateProjectDto {
  group?: string;
  title?: string;
  description?: string;
  link?: string;
  html?: File | string;
  yaml?: File | string;
  tags?: string[];
}
