import { Injectable, inject } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { ToastService } from '../../../services/toast.service';
import { ProjectEntry } from '../../../models';
import { KeyFeature, ChangelogItem, Responsibility } from '../../../models/project.model';

export interface ProjectFormData {
  // Basic Info
  id?: string;
  slug?: string;
  title: string;
  title_Ar?: string;
  description: string;
  description_Ar?: string;
  summary?: string;
  summary_Ar?: string;

  // Categorization
  category?: string;
  category_Ar?: string;
  niche?: string;
  niche_Ar?: string;
  company?: string;
  company_Ar?: string;
  tags?: string;

  // Media
  imageUrl?: string;
  gallery?: string[];

  // Links
  projectUrl?: string;
  gitHubUrl?: string;

  // Metadata
  language?: string;
  language_Ar?: string;
  duration?: string;
  duration_Ar?: string;
  architecture?: string;
  architecture_Ar?: string;
  status?: string;
  status_Ar?: string;

  // Features
  isFeatured?: boolean;
  views?: number;

  // Complex Data
  keyFeatures?: KeyFeature[];
  responsibilities?: Responsibility[];
  changelog?: ChangelogItem[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectCrudService {
  private projectService = inject(ProjectService);
  private toast = inject(ToastService);

  /**
   * Create a new project
   */
  async createProject(formData: ProjectFormData): Promise<ProjectEntry> {
    try {
      const projectData = this.prepareProjectData(formData, true) as any;
      const result = await this.projectService.createProject(projectData).toPromise();
      this.toast.success('Project created successfully');
      return result!;
    } catch (error) {
      this.toast.error('Failed to create project');
      throw error;
    }
  }

  /**
   * Update an existing project
   */
  async updateProject(id: string, formData: ProjectFormData): Promise<ProjectEntry> {
    try {
      const projectData = this.prepareProjectData(formData, false);
      const result = await this.projectService.updateProject(id, { ...projectData, id } as ProjectEntry).toPromise();
      this.toast.success('Project updated successfully');
      return result!;
    } catch (error) {
      this.toast.error('Failed to update project');
      throw error;
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<void> {
    try {
      await this.projectService.deleteProject(id).toPromise();
      this.toast.success('Project deleted successfully');
    } catch (error) {
      this.toast.error('Failed to delete project');
      throw error;
    }
  }

  /**
   * Import project data from URL
   */
  async importFromUrl(url: string): Promise<Partial<ProjectFormData>> {
    try {
      const result = await this.projectService.importFromUrl(url).toPromise();
      this.toast.success('Project data imported successfully');
      return result!;
    } catch (error) {
      this.toast.error('Failed to import project data');
      throw error;
    }
  }

  /**
   * Convert form data to project entry format
   */
  private prepareProjectData(formData: ProjectFormData, isCreate: boolean): Partial<ProjectEntry> {
    const data: Partial<ProjectEntry> = {
      title: formData.title,
      title_Ar: formData.title_Ar,
      description: formData.description,
      description_Ar: formData.description_Ar,
      summary: formData.summary,
      summary_Ar: formData.summary_Ar,
      category: formData.category || '',
      category_Ar: formData.category_Ar,
      niche: formData.niche,
      niche_Ar: formData.niche_Ar,
      company: formData.company,
      company_Ar: formData.company_Ar,
      tags: formData.tags,
      imageUrl: formData.imageUrl,
      gallery: formData.gallery?.length ? formData.gallery : undefined,
      projectUrl: formData.projectUrl,
      gitHubUrl: formData.gitHubUrl,
      language: formData.language,
      language_Ar: formData.language_Ar,
      duration: formData.duration,
      duration_Ar: formData.duration_Ar,
      architecture: formData.architecture,
      architecture_Ar: formData.architecture_Ar,
      status: formData.status || 'Active',
      status_Ar: formData.status_Ar,
      isFeatured: formData.isFeatured || false,
      views: formData.views || 0,
      keyFeatures: formData.keyFeatures?.length ? formData.keyFeatures : undefined,
      responsibilities: formData.responsibilities?.length ? formData.responsibilities : undefined,
      changelog: formData.changelog?.length ? formData.changelog : undefined
    };

    if (isCreate) {
      data.id = formData.id || crypto.randomUUID();
      data.slug = formData.slug || this.generateSlug(formData.title);
    }

    return data;
  }

  /**
   * Generate URL-friendly slug from title
   */
  private generateSlug(title: string): string {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Convert project entry to form data
   */
  projectToFormData(project: ProjectEntry): ProjectFormData {
    return {
      id: project.id,
      slug: project.slug,
      title: project.title || '',
      title_Ar: project.title_Ar || '',
      description: project.description || '',
      description_Ar: project.description_Ar || '',
      summary: project.summary || '',
      summary_Ar: project.summary_Ar || '',
      category: project.category || '',
      category_Ar: project.category_Ar || '',
      niche: project.niche || '',
      niche_Ar: project.niche_Ar || '',
      company: project.company || '',
      company_Ar: project.company_Ar || '',
      tags: project.tags || '',
      imageUrl: project.imageUrl || '',
      gallery: project.gallery ? [...project.gallery] : [],
      projectUrl: project.projectUrl || '',
      gitHubUrl: project.gitHubUrl || '',
      language: project.language || '',
      language_Ar: project.language_Ar || '',
      duration: project.duration || '',
      duration_Ar: project.duration_Ar || '',
      architecture: project.architecture || '',
      architecture_Ar: project.architecture_Ar || '',
      status: project.status || 'Active',
      status_Ar: project.status_Ar || '',
      isFeatured: project.isFeatured || false,
      views: project.views || 0,
      keyFeatures: project.keyFeatures ? JSON.parse(JSON.stringify(project.keyFeatures)) : [],
      responsibilities: project.responsibilities ? [...project.responsibilities] : [],
      changelog: project.changelog ? JSON.parse(JSON.stringify(project.changelog)) : []
    };
  }

  /**
   * Create empty form data for new project
   */
  createEmptyFormData(): ProjectFormData {
    return {
      title: '',
      description: '',
      category: '',
      tags: '',
      imageUrl: '',
      projectUrl: '',
      gitHubUrl: '',
      duration: new Date().getFullYear().toString(),
      status: 'Active',
      views: 0,
      isFeatured: false,
      gallery: [],
      keyFeatures: [],
      responsibilities: [],
      changelog: []
    };
  }
}