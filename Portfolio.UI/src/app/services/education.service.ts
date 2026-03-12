import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EducationEntry, SkillEntry } from '../models';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EducationService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

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

    uploadImage(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(`${this.apiUrl}/uploads/skill-icon`, formData);
    }
}
