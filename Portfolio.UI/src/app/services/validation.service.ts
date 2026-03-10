import { Injectable } from '@angular/core';
import DOMPurify from 'dompurify';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    /**
     * Sanitize HTML content to prevent XSS attacks
     */
    sanitizeHtml(content: string): string {
        if (!content) return '';
        return DOMPurify.sanitize(content, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
            ALLOWED_ATTR: []
        });
    }

    /**
     * Validate email format
     */
    isValidEmail(email: string): boolean {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    /**
     * Validate URL format
     */
    isValidUrl(url: string): boolean {
        if (!url) return false;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Validate GitHub URL format
     */
    isValidGitHubUrl(url: string): boolean {
        if (!url) return false;
        const githubRegex = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;
        return githubRegex.test(url);
    }

    /**
     * Sanitize and validate comment content
     */
    validateComment(content: string): { isValid: boolean; sanitized: string; errors: string[] } {
        const errors: string[] = [];
        
        if (!content || content.trim().length === 0) {
            errors.push('Comment content is required');
            return { isValid: false, sanitized: '', errors };
        }

        if (content.length > 1000) {
            errors.push('Comment must be less than 1000 characters');
        }

        // Check for potential spam patterns
        const spamPatterns = [
            /(.)\1{10,}/, // Repeated characters
            /https?:\/\/[^\s]+/gi, // URLs (might want to restrict)
        ];

        for (const pattern of spamPatterns) {
            if (pattern.test(content)) {
                errors.push('Comment contains suspicious content');
                break;
            }
        }

        const sanitized = this.sanitizeHtml(content);
        
        return {
            isValid: errors.length === 0,
            sanitized,
            errors
        };
    }

    /**
     * Validate project data
     */
    validateProject(project: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!project.title || project.title.trim().length === 0) {
            errors.push('Project title is required');
        }

        if (project.title && project.title.length > 200) {
            errors.push('Project title must be less than 200 characters');
        }

        if (project.description && project.description.length > 2000) {
            errors.push('Project description must be less than 2000 characters');
        }

        if (project.projectUrl && !this.isValidUrl(project.projectUrl)) {
            errors.push('Invalid project URL format');
        }

        if (project.gitHubUrl && !this.isValidGitHubUrl(project.gitHubUrl)) {
            errors.push('Invalid GitHub URL format');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate contact form data
     */
    validateContactForm(form: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!form.name || form.name.trim().length === 0) {
            errors.push('Name is required');
        }

        if (form.name && form.name.length > 100) {
            errors.push('Name must be less than 100 characters');
        }

        if (!form.email || !this.isValidEmail(form.email)) {
            errors.push('Valid email is required');
        }

        if (!form.message || form.message.trim().length === 0) {
            errors.push('Message is required');
        }

        if (form.message && form.message.length > 2000) {
            errors.push('Message must be less than 2000 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Rate limiting check (simple client-side implementation)
     */
    private rateLimitMap = new Map<string, { count: number; resetTime: number }>();

    checkRateLimit(key: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
        const now = Date.now();
        const record = this.rateLimitMap.get(key);

        if (!record || now > record.resetTime) {
            this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
            return true;
        }

        if (record.count >= maxRequests) {
            return false;
        }

        record.count++;
        return true;
    }
}