import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * ProfileService - Shared upload utilities
 * 
 * NOTE: This service has been refactored into page-specific services:
 * - HomeService: Bio, Skills, Services (home page)
 * - EducationService: Education, Skills (education page)
 * - ProjectsPageService: Experiences, References (projects page)
 * 
 * This service now contains only shared upload methods used across multiple pages.
 */
@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    // Shared Uploads
    uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(`${this.apiUrl}/uploads/profile-image`, formData);
    }

    uploadCV(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(`${this.apiUrl}/uploads/cv`, formData);
    }

    uploadImage(file: File, type: 'education' | 'project' = 'education') {
        const formData = new FormData();
        formData.append('file', file);
        const endpoint = 'project-image';
        return this.http.post<{ url: string }>(`${this.apiUrl}/uploads/${endpoint}`, formData);
    }
}
