import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExperienceEntry, ProjectEntry, BioEntry, ServiceEntry } from '../models/portfolio.models';

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

    getBio() {
        return this.http.get<BioEntry>(`${this.apiUrl}/bio`);
    }

    getServices() {
        return this.http.get<ServiceEntry[]>(`${this.apiUrl}/services`);
    }
}
