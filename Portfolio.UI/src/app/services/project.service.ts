import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProjectEntry, ProjectDto } from '../models';
import { environment } from '../../environments/environment';
import { ValidationUtil, RateLimitUtil, ProjectUtil } from '../utils';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getProject(slug: string): Observable<ProjectEntry> {
        if (!slug || slug.trim().length === 0) {
            return throwError(() => new Error('Project slug is required'));
        }

        return this.http.get<ProjectEntry>(`${this.apiUrl}/projects/${encodeURIComponent(slug)}`).pipe(
            map(project => ProjectUtil.normalizeProject(project)),
            catchError(error => {
                console.error('Error fetching project:', error);
                return throwError(() => error);
            })
        );
    }

    getRelatedProjects(slug: string): Observable<ProjectEntry[]> {
        if (!slug || slug.trim().length === 0) {
            return throwError(() => new Error('Project slug is required'));
        }

        return this.http.get<ProjectEntry[]>(`${this.apiUrl}/projects/${encodeURIComponent(slug)}/related`).pipe(
            map(projects => projects.map(p => ProjectUtil.normalizeProject(p))),
            catchError(error => {
                console.error('Error fetching related projects:', error);
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

    importFromUrl(url: string): Observable<ProjectDto> {
        return this.http.post<ProjectDto>(`${this.apiUrl}/projects/import-from-url`, {
            gitHubUrl: url,
            url: url
        });
    }

    testCors(): Observable<any> {
        return this.http.get(`${this.apiUrl}/projects/test-cors`);
    }

    /**
     * Data Normalization - moved to ProjectUtil
     */

    /**
     * Statistics & Highlights - moved to ProjectUtil
     */
}
