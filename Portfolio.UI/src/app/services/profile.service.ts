import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BioEntry, SkillEntry, ExperienceEntry, ServiceEntry, EducationEntry } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getBio() {
        return this.http.get<BioEntry>(`${this.apiUrl}/bio`);
    }

    getSkills() {
        return this.http.get<SkillEntry[]>(`${this.apiUrl}/skills`);
    }

    getExperiences() {
        return this.http.get<ExperienceEntry[]>(`${this.apiUrl}/experiences`);
    }

    getServices() {
        return this.http.get<ServiceEntry[]>(`${this.apiUrl}/services`);
    }

    getEducation() {
        return this.http.get<EducationEntry[]>(`${this.apiUrl}/education`);
    }
}
