import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BioEntry, SkillEntry, ExperienceEntry, ServiceEntry, EducationEntry, Client, Testimonial } from '../models';
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
        return this.http.put<BioEntry>(`${this.apiUrl}/bio/${id}`, bio);
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
        return this.http.get<EducationEntry[]>(`${this.apiUrl}/education`).pipe(
            map(education => education.map(e => ({ ...e, id: e.id || (e as any).Id || (e as any).ID })))
        );
    }

    createEducation(education: EducationEntry) {
        return this.http.post<EducationEntry>(`${this.apiUrl}/education`, education).pipe(
            map(e => ({ ...e, id: e.id || (e as any).Id || (e as any).ID }))
        );
    }

    updateEducation(id: string, education: EducationEntry) {
        return this.http.put<EducationEntry>(`${this.apiUrl}/education/${id}`, education).pipe(
            map(e => ({ ...e, id: e.id || (e as any).Id || (e as any).ID }))
        );
    }

    deleteEducation(id: string) {
        return this.http.delete(`${this.apiUrl}/education/${id}`);
    }

    // Clients
    getClients() {
        return this.http.get<Client[]>(`${this.apiUrl}/clients`).pipe(
            map(clients => clients.map(c => ({ ...c, id: c.id || (c as any).Id || (c as any).ID })))
        );
    }

    createClient(client: Client) {
        return this.http.post<Client>(`${this.apiUrl}/clients`, client).pipe(
            map(c => ({ ...c, id: c.id || (c as any).Id || (c as any).ID }))
        );
    }

    updateClient(id: string, client: Client) {
        return this.http.put<Client>(`${this.apiUrl}/clients/${id}`, client).pipe(
            map(c => ({ ...c, id: c.id || (c as any).Id || (c as any).ID }))
        );
    }

    deleteClient(id: string) {
        return this.http.delete(`${this.apiUrl}/clients/${id}`);
    }

    // Testimonials
    getTestimonials() {
        return this.http.get<Testimonial[]>(`${this.apiUrl}/testimonials`).pipe(
            map(testimonials => testimonials.map(t => ({ ...t, id: t.id || (t as any).Id || (t as any).ID })))
        );
    }

    createTestimonial(testimonial: Testimonial) {
        return this.http.post<Testimonial>(`${this.apiUrl}/testimonials`, testimonial).pipe(
            map(t => ({ ...t, id: t.id || (t as any).Id || (t as any).ID }))
        );
    }

    updateTestimonial(id: string, testimonial: Testimonial) {
        return this.http.put<Testimonial>(`${this.apiUrl}/testimonials/${id}`, testimonial).pipe(
            map(t => ({ ...t, id: t.id || (t as any).Id || (t as any).ID }))
        );
    }

    deleteTestimonial(id: string) {
        return this.http.delete(`${this.apiUrl}/testimonials/${id}`);
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

    uploadSkillIcon(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(`${this.apiUrl}/uploads/skill-icon`, formData);
    }

    uploadImage(file: File, type: 'education' | 'project' | 'skill' = 'education') {
        const formData = new FormData();
        formData.append('file', file);
        const endpoint = type === 'skill' ? 'skill-icon' : 'project-image';
        return this.http.post<{ url: string }>(`${this.apiUrl}/uploads/${endpoint}`, formData);
    }

}
