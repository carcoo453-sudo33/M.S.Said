import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BioEntry, SkillEntry, ServiceEntry } from '../models';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    // Bio
    getBio() {
        return this.http.get<BioEntry | null>(`${this.apiUrl}/bio`).pipe(
            map(bio => {
                if (!bio?.id) {
                    return null;
                }
                
                if (bio.technicalFocus?.items) {
                    bio.technicalFocusItems = bio.technicalFocus.items;
                }
                
                // Convert careerStartDate from ISO string to YYYY-MM-DD format for date input
                if (bio.careerStartDate && typeof bio.careerStartDate === 'string') {
                    const dateObj = new Date(bio.careerStartDate);
                    bio.careerStartDate = dateObj.toISOString().split('T')[0];
                }
                
                return {
                    ...bio,
                    id: bio.id || (bio as any).Id || (bio as any).ID
                };
            })
        );
    }

    updateBio(id: string, bio: BioEntry) {
        return this.http.put<BioEntry>(`${this.apiUrl}/bio/${id}`, bio).pipe(
            map(updatedBio => {
                // Convert careerStartDate from ISO string to YYYY-MM-DD format for date input
                if (updatedBio.careerStartDate && typeof updatedBio.careerStartDate === 'string') {
                    const dateObj = new Date(updatedBio.careerStartDate);
                    updatedBio.careerStartDate = dateObj.toISOString().split('T')[0];
                }
                return updatedBio;
            })
        );
    }

    // Skills
    getSkills() {
        return this.http.get<SkillEntry[]>(`${this.apiUrl}/skills`).pipe(
            map(skills => skills.map(s => ({ ...s, id: s.id || (s as any).Id || (s as any).ID })))
        );
    }

    createSkill(skill: SkillEntry) {
        return this.http.post<SkillEntry>(`${this.apiUrl}/skills`, skill).pipe(
            map(s => ({ ...s, id: s.id || (s as any).Id || (s as any).ID }))
        );
    }

    updateSkill(id: string, skill: SkillEntry) {
        return this.http.put<SkillEntry>(`${this.apiUrl}/skills/${id}`, skill).pipe(
            map(s => ({ ...s, id: s.id || (s as any).Id || (s as any).ID }))
        );
    }

    deleteSkill(id: string) {
        return this.http.delete(`${this.apiUrl}/skills/${id}`);
    }

    // Services
    getServices() {
        return this.http.get<ServiceEntry[]>(`${this.apiUrl}/services`).pipe(
            map(services => services.map(s => ({ ...s, id: s.id || (s as any).Id || (s as any).ID })))
        );
    }

    createService(service: ServiceEntry) {
        return this.http.post<ServiceEntry>(`${this.apiUrl}/services`, service).pipe(
            map(s => ({ ...s, id: s.id || (s as any).Id || (s as any).ID }))
        );
    }

    updateService(id: string, service: ServiceEntry) {
        return this.http.put<ServiceEntry>(`${this.apiUrl}/services/${id}`, service).pipe(
            map(s => ({ ...s, id: s.id || (s as any).Id || (s as any).ID }))
        );
    }

    deleteService(id: string) {
        return this.http.delete(`${this.apiUrl}/services/${id}`);
    }

    // Uploads
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
}
