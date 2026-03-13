import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SkillEntry } from '../models';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SkillService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    getSkills() {
        return this.http.get<SkillEntry[]>(`${this.apiUrl}/skills`);
    }

    createSkill(skill: SkillEntry) {
        return this.http.post<SkillEntry>(`${this.apiUrl}/skills`, skill);
    }

    updateSkill(id: string, skill: SkillEntry) {
        return this.http.put<SkillEntry>(`${this.apiUrl}/skills/${id}`, skill);
    }

    deleteSkill(id: string) {
        return this.http.delete(`${this.apiUrl}/skills/${id}`);
    }

    uploadIcon(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(`${this.apiUrl}/uploads/skill-icon`, formData);
    }
}
