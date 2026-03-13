import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BlogPost, PagedResult } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;


    getBlogPosts(page: number = 1, pageSize: number = 100) {
        return this.http.get<PagedResult<BlogPost>>(`${this.apiUrl}/blog`, {
            params: { page: page.toString(), pageSize: pageSize.toString() }
        });
    }

    getBlogPost(id: string) {
        return this.http.get<BlogPost>(`${this.apiUrl}/blog/${id}`);
    }

    createBlogPost(post: Partial<BlogPost>) {
        return this.http.post<BlogPost>(`${this.apiUrl}/blog`, post);
    }

    updateBlogPost(id: string, post: Partial<BlogPost>) {
        return this.http.put<BlogPost>(`${this.apiUrl}/blog/${id}`, post);
    }

    deleteBlogPost(id: string) {
        return this.http.delete(`${this.apiUrl}/blog/${id}`);
    }

    importFromUrl(url: string) {
        return this.http.post<BlogPost>(`${this.apiUrl}/blog/import-from-url`, { url });
    }
}
