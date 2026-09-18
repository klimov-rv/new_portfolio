export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  year: number;
  title: string;
  subtitle: string;
  type: string;
  description: string;
  details: string;
  preview: string;
  video_preview?: string;
  video?: string;
  links?: ProjectLink[];
  demo_links?: ProjectLink[];
  tags: string[];
}
