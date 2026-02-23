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

    getProjects() {
        return this.http.get<ProjectEntry[]>(`${this.apiUrl}/projects`);
    }

    getProject(slug: string): Observable<ProjectEntry> {
        return this.http.get<ProjectEntry>(`${this.apiUrl}/projects/${slug}`).pipe(
            map(project => ({
                ...project,
                id: project.id || (project as any).Id || (project as any).ID
            }))
        );
    }

    getFeaturedProjects(): Observable<ProjectEntry[]> {
        return this.http.get<ProjectEntry[]>(`${this.apiUrl}/projects/featured`);
    }

    createProject(project: ProjectDto): Observable<ProjectEntry> {
        return this.http.post<ProjectEntry>(`${this.apiUrl}/projects`, project);
    }

    updateProject(id: string, project: ProjectEntry): Observable<ProjectEntry> {
        return this.http.put<ProjectEntry>(`${this.apiUrl}/projects/${id}`, project);
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

    reactToProject(projectId: string): Observable<number> {
        return this.http.post<number>(`${this.apiUrl}/projects/${projectId}/react`, {});
    }

}
