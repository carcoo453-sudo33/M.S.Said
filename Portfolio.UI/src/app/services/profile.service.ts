import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BioEntry, SkillEntry, ExperienceEntry, ServiceEntry, EducationEntry } from '../models';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    // Bio
    getBio() {
        return this.http.get<BioEntry>(`${this.apiUrl}/bio`).pipe(
            map(bio => {
                if (!bio) return bio;
                return {
                    ...bio,
                    id: bio.id || (bio as any).Id || (bio as any).ID
                };
            })
        );
    }

    updateBio(id: string, bio: BioEntry) {
        return this.http.put(`${this.apiUrl}/bio/${id}`, bio);
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

    // Experiences
    getExperiences() {
        return this.http.get<ExperienceEntry[]>(`${this.apiUrl}/experiences`).pipe(
            map(exps => exps.map(e => ({ ...e, id: e.id || (e as any).Id || (e as any).ID })))
        );
    }

    createExperience(exp: ExperienceEntry) {
        return this.http.post<ExperienceEntry>(`${this.apiUrl}/experiences`, exp).pipe(
            map(e => ({ ...e, id: e.id || (e as any).Id || (e as any).ID }))
        );
    }

    updateExperience(id: string, exp: ExperienceEntry) {
        return this.http.put<ExperienceEntry>(`${this.apiUrl}/experiences/${id}`, exp).pipe(
            map(e => ({ ...e, id: e.id || (e as any).Id || (e as any).ID }))
        );
    }

    deleteExperience(id: string) {
        return this.http.delete(`${this.apiUrl}/experiences/${id}`);
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

    // Education
    getEducation() {
        return this.http.get<EducationEntry[]>(`${this.apiUrl}/education`);
    }
}
