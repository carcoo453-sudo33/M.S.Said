import { Injectable, inject } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { ProjectsPageService } from '../../../services/projects-page.service';
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
  type?: string;
  type_Ar?: string;
  developmentMethod?: string;
  developmentMethod_Ar?: string;

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
  private projectsPageService = inject(ProjectsPageService);
  private toast = inject(ToastService);

  /**
   * Create a new project
   */
  async createProject(formData: ProjectFormData): Promise<ProjectEntry> {
    try {
      const projectData = this.prepareProjectData(formData, true) as any;
      const result = await this.projectsPageService.createProject(projectData).toPromise();
      this.toast.success('Project created successfully');
      return result!;
    } catch (error) {
      if (!(error as any).notified) {
        this.toast.error('Failed to create project');
      }
      throw error;
    }
  }

  /**
   * Update an existing project
   */
  async updateProject(id: string, formData: ProjectFormData): Promise<ProjectEntry> {
    try {
      const projectData = this.prepareProjectData(formData, false);
      const result = await this.projectsPageService.updateProject(id, { ...projectData, id } as ProjectEntry).toPromise();
      this.toast.success('Project updated successfully');
      return result!;
    } catch (error) {
      if (!(error as any).notified) {
        this.toast.error('Failed to update project');
      }
      throw error;
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<void> {
    try {
      await this.projectsPageService.deleteProject(id).toPromise();
      this.toast.success('Project deleted successfully');
    } catch (error) {
      if (!(error as any).notified) {
        this.toast.error('Failed to delete project');
      }
      throw error;
    }
  }

  /**
   * Import project data from URL
   */
  async importFromUrl(url: string): Promise<Partial<ProjectFormData>> {
    try {
      const result = await this.projectService.importFromUrl(url).toPromise();
      return result!;
    } catch (error) {
      // Don't toast here, component or interceptor will handle it
      throw error;
    }
  }

  /**
   * Convert form data to project entry format
   */
  private prepareProjectData(formData: ProjectFormData, isCreate: boolean): any {
    const data: any = {
      title: formData.title || '',
      title_Ar: formData.title_Ar || '',
      description: formData.description || '',
      description_Ar: formData.description_Ar || '',
      summary: formData.summary || '',
      summary_Ar: formData.summary_Ar || '',
      category: formData.category || undefined,
      category_Ar: formData.category_Ar || '',
      niche: formData.niche || '',
      niche_Ar: formData.niche_Ar || '',
      company: formData.company || '',
      company_Ar: formData.company_Ar || '',
      techStack: formData.tags || '',
      imageUrl: formData.imageUrl || '',
      projectUrl: formData.projectUrl || '',
      gitHubUrl: formData.gitHubUrl || '',
      language: formData.language || undefined,
      language_Ar: formData.language_Ar || '',
      architecture: formData.architecture || undefined,
      architecture_Ar: formData.architecture_Ar || '',
      status: formData.status || 'InProgress',
      status_Ar: formData.status_Ar || '',
      type: formData.type || 'Initial',
      type_Ar: formData.type_Ar || '',
      developmentMethod: formData.developmentMethod || 'Manual',
      developmentMethod_Ar: formData.developmentMethod_Ar || '',
      isFeatured: formData.isFeatured || false,
      duration: formData.duration || '',
      duration_Ar: formData.duration_Ar || '',
      order: 0,
      images: formData.gallery?.map((url, i) => ({
        imageUrl: url || '',
        title: formData.title || '',
        title_Ar: formData.title_Ar || '',
        type: 'Real',
        order: i,
        description: '',
        description_Ar: ''
      })) || [],
      keyFeatures: formData.keyFeatures?.map(f => ({
        title: f.title || '',
        title_Ar: f.title_Ar || '',
        link: f.link || '',
        date: f.date || '',
        featureType: 'Added' // Default to string enum
      })) || [],
      responsibilities: formData.responsibilities?.map(r => ({
        title: r.title || '',
        title_Ar: r.title_Ar || '',
        description: r.description || '',
        description_Ar: r.description_Ar || ''
      })) || [],
      changelog: formData.changelog?.map(c => ({
        date: c.date || new Date().toISOString(),
        version: c.version || '',
        title: c.title || '',
        title_Ar: c.title_Ar || '',
        description: c.description || '',
        description_Ar: c.description_Ar || ''
      })) || []
    };

    if (isCreate) {
      // In Create DTO, ID is not usually sent if it's Client-generated but 
      // the backend might have it if it's a GUID. 
      // Looking at ProjectCreateDto, it DOES NOT have an Id.
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
      tags: project.techStack || project.tags || '',
      imageUrl: project.imageUrl || '',
      gallery: project.images?.length 
        ? Array.from(new Set(project.images.map(img => img.imageUrl))) 
        : (project.gallery ? [...new Set(project.gallery)] : []),
      projectUrl: project.projectUrl || '',
      gitHubUrl: project.gitHubUrl || '',
      language: project.language || '',
      language_Ar: project.language_Ar || '',
      duration: project.duration || '',
      duration_Ar: project.duration_Ar || '',
      architecture: project.architecture || '',
      architecture_Ar: project.architecture_Ar || '',
      status: project.status || 'InProgress',
      status_Ar: project.status_Ar || '',
      isFeatured: project.isFeatured || false,
      views: project.views || 0,
      keyFeatures: project.keyFeatures ? project.keyFeatures.map(f => ({
        ...f,
        title: f.title || '',
        title_Ar: f.title_Ar || '',
        link: f.link || '',
        date: f.date || '',
        featureType: f.featureType || 'Added'
      })) : [],
      responsibilities: project.responsibilities ? project.responsibilities.map(r => ({
        ...r,
        title: r.title || r.text || '',
        title_Ar: r.title_Ar || r.text_Ar || '',
        description: r.description || '',
        description_Ar: r.description_Ar || ''
      })) : [],
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
      status: 'InProgress',
      views: 0,
      isFeatured: false,
      gallery: [],
      keyFeatures: [],
      responsibilities: [],
      changelog: []
    };
  }
}