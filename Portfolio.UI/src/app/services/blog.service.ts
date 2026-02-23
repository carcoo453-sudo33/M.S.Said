import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BlogPost } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getBlogPosts() {
        return this.http.get<BlogPost[]>(`${this.apiUrl}/blog`);
    }

    getBlogPost(id: string) {
        return this.http.get<BlogPost>(`${this.apiUrl}/blog/${id}`);
    }
}
