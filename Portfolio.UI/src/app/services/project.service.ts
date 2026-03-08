import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectEntry, ProjectDto } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getProjects(): Observable<ProjectEntry[]> {
        return this.http.get<ProjectEntry[]>(`${this.apiUrl}/projects`).pipe(
            map(projects => projects.map(p => this.normalizeProject(p)))
        );
    }

    getProject(slug: string): Observable<ProjectEntry> {
        return this.http.get<ProjectEntry>(`${this.apiUrl}/projects/${slug}`).pipe(
            map(project => this.normalizeProject(project))
        );
    }

    getFeaturedProjects(): Observable<ProjectEntry[]> {
        return this.http.get<ProjectEntry[]>(`${this.apiUrl}/projects/featured`).pipe(
            map(projects => projects.map(p => this.normalizeProject(p)))
        );
    }

    createProject(project: ProjectDto): Observable<ProjectEntry> {
        return this.http.post<ProjectEntry>(`${this.apiUrl}/projects`, project).pipe(
            map(p => this.normalizeProject(p))
        );
    }

    updateProject(id: string, project: ProjectEntry): Observable<ProjectEntry> {
        return this.http.put<ProjectEntry>(`${this.apiUrl}/projects/${id}`, project).pipe(
            map(p => this.normalizeProject(p))
        );
    }

    deleteProject(id: string) {
        return this.http.delete(`${this.apiUrl}/projects/${id}`);
    }

    addComment(projectId: string, comment: { author: string; avatarUrl: string; content: string }): Observable<any> {
        console.log('ProjectService.addComment called with projectId:', projectId);
        console.log('API URL will be:', `${this.apiUrl}/projects/${projectId}/comments`);

        if (!projectId) {
            throw new Error('Project ID is required to add a comment');
        }

        return this.http.post(`${this.apiUrl}/projects/${projectId}/comments`, comment);
    }

    likeComment(projectId: string, commentId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/projects/${projectId}/comments/${commentId}/like`, {});
    }

    addReply(projectId: string, commentId: string, reply: { author: string; avatarUrl: string; content: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/projects/${projectId}/comments/${commentId}/reply`, reply);
    }

    reactToProject(projectId: string): Observable<number> {
        return this.http.post<number>(`${this.apiUrl}/projects/${projectId}/react`, {});
    }

    importFromGitHub(projectId: string, githubUrl: string): Observable<ProjectEntry> {
        console.log('[ProjectService] importFromGitHub called');
        console.log('[ProjectService] Project ID:', projectId);
        console.log('[ProjectService] GitHub URL:', githubUrl);
        console.log('[ProjectService] Full API URL:', `${this.apiUrl}/projects/${projectId}/import-from-github`);

        return this.http.post<ProjectEntry>(`${this.apiUrl}/projects/${projectId}/import-from-github`, {
            gitHubUrl: githubUrl,
            url: githubUrl
        });
    }

    importFromUrl(url: string): Observable<ProjectDto> {
        return this.http.post<ProjectDto>(`${this.apiUrl}/projects/import-from-url`, {
            gitHubUrl: url,
            url: url
        });
    }

    testCors(): Observable<any> {
        return this.http.get(`${this.apiUrl}/projects/test-cors`);
    }

    getTagSuggestions(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/projects/suggestions/tags`);
    }

    getCategorySuggestions(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/projects/suggestions/categories`);
    }

    getNicheSuggestions(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/projects/suggestions/niches`);
    }

    getCompanySuggestions(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/projects/suggestions/companies`);
    }

    // Category Management
    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/categories`);
    }

    createCategory(category: { name: string; name_Ar?: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/categories`, category);
    }

    updateCategory(id: string, category: { name: string; name_Ar?: string }): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/categories/${id}`, category);
    }

    deleteCategory(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/categories/${id}`);
    }

    // Niche Management
    getNiches(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/niches`);
    }

    createNiche(niche: { name: string; name_Ar?: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/niches`, niche);
    }

    updateNiche(id: string, niche: { name: string; name_Ar?: string }): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/niches/${id}`, niche);
    }

    deleteNiche(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/niches/${id}`);
    }

    /**
     * Data Normalization
     */
    normalizeProject(project: any): ProjectEntry {
        if (!project) return project;

        // Defensive mapping for collection properties that might have casing variations
        const keyFeatures = project.keyFeatures || project.KeyFeatures || [];
        const changelog = project.changelog || project.Changelog || [];
        const responsibilities = project.responsibilities || project.Responsibilities || [];
        const comments = project.comments || project.Comments || [];

        return {
            ...project,
            id: project.id || project.Id || project.ID,
            summary: project.summary || '',
            gallery: project.gallery?.length ? project.gallery : (project.Gallery?.length ? project.Gallery : [project.imageUrl || '']),
            duration: project.duration || '',
            language: project.language || '',
            architecture: project.architecture || '',
            status: project.status || '',
            keyFeatures: keyFeatures,
            changelog: changelog,
            responsibilities: responsibilities,
            relatedProjects: project.relatedProjects || project.RelatedProjects || [],
            comments: comments,
            reactionsCount: project.reactionsCount || project.ReactionsCount || 0,
            projectUrl: project.projectUrl || project.ProjectUrl || '',
            gitHubUrl: project.gitHubUrl || project.GitHubUrl || ''
        };
    }

    /**
     * Statistics & Highlights
     */
    getProjectHighlights(projects: ProjectEntry[]): ProjectEntry[] {
        if (!projects || projects.length === 0) return [];

        let mostVisited: ProjectEntry | null = null;
        let featured: ProjectEntry | null = null;
        let lastPublish: ProjectEntry | null = null;

        // Sort projects by views descending
        const byViews = [...projects].sort((a, b) => (b.views || 0) - (a.views || 0));
        mostVisited = byViews[0] || null;

        // Sort projects by featured, preferring newest, excluding mostVisited
        const featuredProjects = [...projects].filter(p => !!p.isFeatured && p.id !== mostVisited?.id);
        if (featuredProjects.length > 0) {
            featured = featuredProjects.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
        } else {
            featured = byViews.find(p => p.id !== mostVisited?.id) || null;
        }

        // Sort projects by latest, excluding mostVisited and featured
        const byLatest = [...projects]
            .filter(p => p.id !== mostVisited?.id && p.id !== featured?.id)
            .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        lastPublish = byLatest[0] || null;

        return [mostVisited, featured, lastPublish].filter(p => p != null) as ProjectEntry[];
    }
}
