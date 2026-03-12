import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ValidationUtil, RateLimitUtil } from '../utils';

/**
 * Service for project details page
 * Handles: comments, replies, reactions
 */
@Injectable({
    providedIn: 'root'
})
export class ProjectDetailsService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    // Comments
    addComment(projectId: string, comment: { author: string; avatarUrl: string; content: string }): Observable<any> {
        if (!projectId) {
            return throwError(() => new Error('Project ID is required to add a comment'));
        }

        // Validate and sanitize comment
        const validation = ValidationUtil.validateComment(comment.content);
        if (!validation.isValid) {
            return throwError(() => new Error(validation.errors.join(', ')));
        }

        // Check rate limiting
        const rateLimitKey = `comment_${projectId}`;
        if (!RateLimitUtil.checkRateLimit(rateLimitKey, 3, 60000)) {
            return throwError(() => new Error('Too many comments. Please wait before commenting again.'));
        }

        const sanitizedComment = {
            ...comment,
            content: validation.sanitized,
            author: ValidationUtil.sanitizeHtml(comment.author)
        };

        return this.http.post(`${this.apiUrl}/projects/${encodeURIComponent(projectId)}/comments`, sanitizedComment).pipe(
            catchError(error => {
                console.error('Error adding comment:', error);
                return throwError(() => error);
            })
        );
    }

    likeComment(projectId: string, commentId: string): Observable<any> {
        if (!projectId || !commentId) {
            return throwError(() => new Error('Project ID and Comment ID are required'));
        }

        return this.http.post(`${this.apiUrl}/projects/${encodeURIComponent(projectId)}/comments/${encodeURIComponent(commentId)}/like`, {}).pipe(
            catchError(error => {
                console.error('Error liking comment:', error);
                return throwError(() => error);
            })
        );
    }

    addReply(projectId: string, commentId: string, reply: { author: string; avatarUrl: string; content: string }): Observable<any> {
        if (!projectId || !commentId) {
            return throwError(() => new Error('Project ID and Comment ID are required'));
        }

        // Validate and sanitize reply
        const validation = ValidationUtil.validateComment(reply.content);
        if (!validation.isValid) {
            return throwError(() => new Error(validation.errors.join(', ')));
        }

        const sanitizedReply = {
            ...reply,
            content: validation.sanitized,
            author: ValidationUtil.sanitizeHtml(reply.author)
        };

        return this.http.post(`${this.apiUrl}/projects/${encodeURIComponent(projectId)}/comments/${encodeURIComponent(commentId)}/reply`, sanitizedReply).pipe(
            catchError(error => {
                console.error('Error adding reply:', error);
                return throwError(() => error);
            })
        );
    }

    // Reactions
    reactToProject(projectId: string): Observable<number> {
        if (!projectId) {
            return throwError(() => new Error('Project ID is required'));
        }

        return this.http.post<number>(`${this.apiUrl}/projects/${encodeURIComponent(projectId)}/react`, {}).pipe(
            catchError(error => {
                console.error('Error reacting to project:', error);
                return throwError(() => error);
            })
        );
    }

    removeReaction(projectId: string, userId: string): Observable<void> {
        if (!projectId || !userId) {
            return throwError(() => new Error('Project ID and User ID are required'));
        }

        return this.http.delete<void>(`${this.apiUrl}/projects/${encodeURIComponent(projectId)}/react/${encodeURIComponent(userId)}`).pipe(
            catchError(error => {
                console.error('Error removing reaction:', error);
                return throwError(() => error);
            })
        );
    }

    getProjectReactions(projectId: string): Observable<any[]> {
        if (!projectId) {
            return throwError(() => new Error('Project ID is required'));
        }

        return this.http.get<any[]>(`${this.apiUrl}/projects/${encodeURIComponent(projectId)}/reactions`).pipe(
            catchError(error => {
                console.error('Error fetching reactions:', error);
                return throwError(() => error);
            })
        );
    }
}
