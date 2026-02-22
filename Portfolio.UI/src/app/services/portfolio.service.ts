import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExperienceEntry, ProjectEntry, BioEntry, ServiceEntry, BlogPost, EducationEntry, ContactMessage } from '../models/portfolio.models';

@Injectable({
    providedIn: 'root'
})
export class PortfolioService {
    private http = inject(HttpClient);
    private apiUrl = 'https://localhost:7252/api';

    getExperiences() {
        return this.http.get<ExperienceEntry[]>(`${this.apiUrl}/experiences`);
    }

    getProjects() {
        return this.http.get<ProjectEntry[]>(`${this.apiUrl}/projects`);
    }

    getProject(id: string) {
        return this.http.get<ProjectEntry>(`${this.apiUrl}/projects/${id}`);
    }

    getBio() {
        return this.http.get<BioEntry>(`${this.apiUrl}/bio`);
    }

    getServices() {
        return this.http.get<ServiceEntry[]>(`${this.apiUrl}/services`);
    }

    getBlogPosts() {
        return this.http.get<BlogPost[]>(`${this.apiUrl}/blog`);
    }

    getBlogPost(id: string) {
        return this.http.get<BlogPost>(`${this.apiUrl}/blog/${id}`);
    }

    getEducation() {
        return this.http.get<EducationEntry[]>(`${this.apiUrl}/education`);
    }

    sendContactMessage(message: ContactMessage) {
        return this.http.post(`${this.apiUrl}/contact`, message);
    }
}
