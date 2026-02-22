import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExperienceEntry, ProjectEntry } from '../models/portfolio.models';

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
}
