import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactMessage } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    sendContactMessage(message: ContactMessage) {
        return this.http.post(`${this.apiUrl}/contact`, message);
    }

    getMessageById(id: string) {
        return this.http.get<any>(`${this.apiUrl}/contact/${id}`);
    }
}
