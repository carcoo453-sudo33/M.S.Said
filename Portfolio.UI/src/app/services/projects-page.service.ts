import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExperienceEntry, Reference, ProjectEntry, ProjectDto } from '../models';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ValidationUtil, ProjectUtil } from '../utils';

@Injectable({
    providedIn: 'root'
})
export class ProjectsPageService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    // References
    getReferences() {
        return this.http.get<Reference[]>(`${this.apiUrl}/references`);
    }

    createReference(reference: Reference) {
        return this.http.post<Reference>(`${this.apiUrl}/references`, reference);
    }

    updateReference(id: string, reference: Reference) {
        return this.http.put<Reference>(`${this.apiUrl}/references/${id}`, reference);
    }

    deleteReference(id: string) {
        return this.http.delete(`${this.apiUrl}/references/${id}`);
    }

    // Projects - for projects page
    getFeaturedProjects(): Observable<ProjectEntry[]> {
        return this.http.get<ProjectEntry[]>(`${this.apiUrl}/projects/featured`).pipe(
            map(projects => projects.map(p => ProjectUtil.normalizeProject(p))),
            catchError(error => {
                console.error('Error fetching featured projects:', error);
                return throwError(() => error);
            })
        );
    }

    trackProjectView(slug: string): Observable<void> {
        if (!slug || slug.trim().length === 0) {
            return throwError(() => new Error('Project slug is required'));
        }

        return this.http.post<void>(`${this.apiUrl}/projects/${encodeURIComponent(slug)}/views`, {}).pipe(
            catchError(error => {
                console.error('Error tracking project view:', error);
                return throwError(() => error);
            })
        );
    }

    createProject(project: ProjectDto): Observable<ProjectEntry> {
        // Validate project data
        const validation = ValidationUtil.validateProject(project);
        if (!validation.isValid) {
            return throwError(() => new Error(validation.errors.join(', ')));
        }

        // Sanitize project data
        const sanitizedProject = this.sanitizeProjectData(project);

        return this.http.post<ProjectEntry>(`${this.apiUrl}/projects`, sanitizedProject).pipe(
            map(p => ProjectUtil.normalizeProject(p)),
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
        const validation = ValidationUtil.validateProject(project);
        if (!validation.isValid) {
            return throwError(() => new Error(validation.errors.join(', ')));
        }

        // Sanitize project data
        const sanitizedProject = this.sanitizeProjectData(project);

        return this.http.put<ProjectEntry>(`${this.apiUrl}/projects/${encodeURIComponent(id)}`, sanitizedProject).pipe(
            map(p => ProjectUtil.normalizeProject(p)),
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

    private sanitizeProjectData(project: any): any {
        return {
            ...project,
            title: ValidationUtil.sanitizeHtml(project.title),
            description: ValidationUtil.sanitizeHtml(project.description),
            summary: ValidationUtil.sanitizeHtml(project.summary),
            category: ValidationUtil.sanitizeHtml(project.category),
            company: ValidationUtil.sanitizeHtml(project.company),
            // Sanitize nested objects
            keyFeatures: project.keyFeatures?.map((feature: any) => ({
                ...feature,
                title: ValidationUtil.sanitizeHtml(feature.title),
                description: ValidationUtil.sanitizeHtml(feature.description)
            })) || [],
            changelog: project.changelog?.map((item: any) => ({
                ...item,
                title: ValidationUtil.sanitizeHtml(item.title),
                description: ValidationUtil.sanitizeHtml(item.description)
            })) || [],
            responsibilities: project.responsibilities?.map((resp: any) => ({
                ...resp,
                title: ValidationUtil.sanitizeHtml(resp.title),
                description: ValidationUtil.sanitizeHtml(resp.description)
            })) || [],
            images: project.images?.map((img: any) => ({
                ...img,
                title: ValidationUtil.sanitizeHtml(img.title),
                description: ValidationUtil.sanitizeHtml(img.description)
            })) || []
        };
    }
}
