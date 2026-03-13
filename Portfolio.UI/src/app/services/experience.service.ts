import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExperienceEntry } from '../models';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ExperienceService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    getExperiences() {
        return this.http.get<ExperienceEntry[]>(`${this.apiUrl}/experiences`);
    }

    createExperience(exp: ExperienceEntry) {
        return this.http.post<ExperienceEntry>(`${this.apiUrl}/experiences`, exp);
    }

    updateExperience(id: string, exp: ExperienceEntry) {
        return this.http.put<ExperienceEntry>(`${this.apiUrl}/experiences/${id}`, exp);
    }

    deleteExperience(id: string) {
        return this.http.delete(`${this.apiUrl}/experiences/${id}`);
    }
}
