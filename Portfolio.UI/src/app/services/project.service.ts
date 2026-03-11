import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProjectEntry, ProjectDto } from '../models';
import { environment } from '../../environments/environment';
import { ValidationService } from './validation.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private http = inject(HttpClient);
    private validationService = inject(ValidationService);
    private apiUrl = environment.apiUrl;

    getProjects(page: number = 1, pageSize: number = 10, category?: string, isFeatured?: boolean): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        if (category) {
            params = params.set('category', category);
        }

        if (isFeatured !== undefined) {
            params = params.set('isFeatured', isFeatured.toString());
        }

        return this.http.get<any>(`${this.apiUrl}/projects`, { params }).pipe(
            map(response => ({
                ...response,
                items: response.items?.map((p: ProjectEntry) => this.normalizeProject(p)) || []
            })),
            catchError(error => {
                console.error('Error fetching projects:', error);
                return throwError(() => error);
            })
        );
    }

    getProject(slug: string): Observable<ProjectEntry> {
        if (!slug || slug.trim().length === 0) {
            return throwError(() => new Error('Project slug is required'));
        }

        return this.http.get<ProjectEntry>(`${this.apiUrl}/projects/${encodeURIComponent(slug)}`).pipe(
            map(project => this.normalizeProject(project)),
            catchError(error => {
                console.error('Error fetching project:', error);
                return throwError(() => error);
            })
        );
    }

    getFeaturedProjects(): Observable<ProjectEntry[]> {
        return this.http.get<ProjectEntry[]>(`${this.apiUrl}/projects/featured`).pipe(
            map(projects => projects.map(p => this.normalizeProject(p))),
            catchError(error => {
                console.error('Error fetching featured projects:', error);
                return throwError(() => error);
            })
        );
    }

    createProject(project: ProjectDto): Observable<ProjectEntry> {
        // Validate project data
        const validation = this.validationService.validateProject(project);
        if (!validation.isValid) {
            return throwError(() => new Error(validation.errors.join(', ')));
        }

        // Sanitize project data
        const sanitizedProject = this.sanitizeProjectData(project);

        return this.http.post<ProjectEntry>(`${this.apiUrl}/projects`, sanitizedProject).pipe(
            map(p => this.normalizeProject(p)),
            catchError(error => {
                console.error('Error creating project:', error);
                return throwError(() => error);
            })
        );
    }

    updateProject(id: string, project: ProjectEntry): Observable<ProjectEntry> {
        if (!id) {
            return throwError(() => new Error('Project ID is required'));
        }

        // Validate project data
        const validation = this.validationService.validateProject(project);
        if (!validation.isValid) {
            return throwError(() => new Error(validation.errors.join(', ')));
        }

        // Sanitize project data
        const sanitizedProject = this.sanitizeProjectData(project);

        return this.http.put<ProjectEntry>(`${this.apiUrl}/projects/${encodeURIComponent(id)}`, sanitizedProject).pipe(
            map(p => this.normalizeProject(p)),
            catchError(error => {
                console.error('Error updating project:', error);
                return throwError(() => error);
            })
        );
    }

    deleteProject(id: string): Observable<void> {
        if (!id) {
            return throwError(() => new Error('Project ID is required'));
        }

        return this.http.delete<void>(`${this.apiUrl}/projects/${encodeURIComponent(id)}`).pipe(
            catchError(error => {
                console.error('Error deleting project:', error);
                return throwError(() => error);
            })
        );
    }

    addComment(projectId: string, comment: { author: string; avatarUrl: string; content: string }): Observable<any> {
        if (!projectId) {
            return throwError(() => new Error('Project ID is required to add a comment'));
        }

        // Validate and sanitize comment
        const validation = this.validationService.validateComment(comment.content);
        if (!validation.isValid) {
            return throwError(() => new Error(validation.errors.join(', ')));
        }

        // Check rate limiting
        const rateLimitKey = `comment_${projectId}`;
        if (!this.validationService.checkRateLimit(rateLimitKey, 3, 60000)) {
            return throwError(() => new Error('Too many comments. Please wait before commenting again.'));
        }

        const sanitizedComment = {
            ...comment,
            content: validation.sanitized,
            author: this.validationService.sanitizeHtml(comment.author)
        };

        return this.http.post(`${this.apiUrl}/projects/${encodeURIComponent(projectId)}/comments`, sanitizedComment).pipe(
            catchError(error => {
                console.error('Error adding comment:', error);
                return throwError(() => error);
            })
        );
    }

    likeComment(projectId: string, commentId: string): Observable<any> {
        if (!projectId || !commentId) {
            return throwError(() => new Error('Project ID and Comment ID are required'));
        }

        return this.http.post(`${this.apiUrl}/projects/${encodeURIComponent(projectId)}/comments/${encodeURIComponent(commentId)}/like`, {}).pipe(
            catchError(error => {
                console.error('Error liking comment:', error);
                return throwError(() => error);
            })
        );
    }

    addReply(projectId: string, commentId: string, reply: { author: string; avatarUrl: string; content: string }): Observable<any> {
        if (!projectId || !commentId) {
            return throwError(() => new Error('Project ID and Comment ID are required'));
        }

        // Validate and sanitize reply
        const validation = this.validationService.validateComment(reply.content);
        if (!validation.isValid) {
            return throwError(() => new Error(validation.errors.join(', ')));
        }

        const sanitizedReply = {
            ...reply,
            content: validation.sanitized,
            author: this.validationService.sanitizeHtml(reply.author)
        };

        return this.http.post(`${this.apiUrl}/projects/${encodeURIComponent(projectId)}/comments/${encodeURIComponent(commentId)}/reply`, sanitizedReply).pipe(
            catchError(error => {
                console.error('Error adding reply:', error);
                return throwError(() => error);
            })
        );
    }

    reactToProject(projectId: string): Observable<number> {
        if (!projectId) {
            return throwError(() => new Error('Project ID is required'));
        }

        return this.http.post<number>(`${this.apiUrl}/projects/${encodeURIComponent(projectId)}/react`, {}).pipe(
            catchError(error => {
                console.error('Error reacting to project:', error);
                return throwError(() => error);
            })
        );
    }

    private sanitizeProjectData(project: any): any {
        return {
            ...project,
            title: this.validationService.sanitizeHtml(project.title),
            description: this.validationService.sanitizeHtml(project.description),
            summary: this.validationService.sanitizeHtml(project.summary),
            category: this.validationService.sanitizeHtml(project.category),
            company: this.validationService.sanitizeHtml(project.company),
            // Sanitize nested objects
            keyFeatures: project.keyFeatures?.map((feature: any) => ({
                ...feature,
                title: this.validationService.sanitizeHtml(feature.title),
                description: this.validationService.sanitizeHtml(feature.description)
            })) || [],
            changelog: project.changelog?.map((item: any) => ({
                ...item,
                title: this.validationService.sanitizeHtml(item.title),
                description: this.validationService.sanitizeHtml(item.description)
            })) || [],
            responsibilities: project.responsibilities?.map((resp: any) => ({
                ...resp,
                title: this.validationService.sanitizeHtml(resp.title),
                description: this.validationService.sanitizeHtml(resp.description)
            })) || []
        };
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
