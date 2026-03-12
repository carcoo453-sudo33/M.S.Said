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
}
