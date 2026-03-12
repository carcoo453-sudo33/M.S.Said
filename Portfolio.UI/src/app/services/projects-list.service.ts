import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProjectEntry } from '../models';
import { environment } from '../../environments/environment';

/**
 * Service for projects list page
 * Handles: fetching projects with pagination, filtering, sorting, suggestions
 */
@Injectable({
    providedIn: 'root'
})
export class ProjectsListService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    getProjects(page: number = 1, pageSize: number = 10, category?: string, isFeatured?: boolean, search?: string, sortBy?: string, sortDirection?: string): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        if (category) params = params.set('category', category);
        if (isFeatured !== undefined) params = params.set('isFeatured', isFeatured.toString());
        if (search) params = params.set('search', search);
        if (sortBy) params = params.set('sortBy', sortBy);
        if (sortDirection) params = params.set('sortDirection', sortDirection);

        return this.http.get<any>(`${this.apiUrl}/projects`, { params }).pipe(
            catchError(error => {
                console.error('Error fetching projects:', error);
                return throwError(() => error);
            })
        );
    }

    getFeaturedProjects(): Observable<ProjectEntry[]> {
        return this.http.get<ProjectEntry[]>(`${this.apiUrl}/projects/featured`).pipe(
            catchError(error => {
                console.error('Error fetching featured projects:', error);
                return throwError(() => error);
            })
        );
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
}
