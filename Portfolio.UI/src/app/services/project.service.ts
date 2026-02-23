import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
        return this.http.get<ProjectEntry>(`${this.apiUrl}/projects/${slug}`);
    }

    getFeaturedProjects(): Observable<ProjectEntry[]> {
        return this.http.get<ProjectEntry[]>(`${this.apiUrl}/projects/featured`);
    }

    createProject(project: ProjectDto): Observable<ProjectEntry> {
        return this.http.post<ProjectEntry>(`${this.apiUrl}/projects`, project);
    }

    updateProject(id: string, project: ProjectEntry) {
        return this.http.put(`${this.apiUrl}/projects/${id}`, project);
    }

    deleteProject(id: string) {
        return this.http.delete(`${this.apiUrl}/projects/${id}`);
    }
}
