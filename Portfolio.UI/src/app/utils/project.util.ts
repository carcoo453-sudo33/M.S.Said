import { ProjectEntry } from '../models';
import { environment } from '../../environments/environment';

/**
 * Project utility functions for normalization, highlights, and image handling
 * Static utility class - no instantiation needed
 */
export class ProjectUtil {
    /**
     * Normalize project data from backend response
     * Handles casing variations (camelCase vs PascalCase) and provides defaults
     * @param project Raw project data from backend
     * @returns Normalized ProjectEntry with consistent property names
     */
    static normalizeProject(project: any): ProjectEntry {
        if (!project) return project;

        // Defensive mapping for collection properties that might have casing variations
        const keyFeatures = project.keyFeatures || project.KeyFeatures || [];
        const changelog = project.changelog || project.Changelog || [];
        const responsibilities = project.responsibilities || project.Responsibilities || [];
        const comments = project.comments || project.Comments || [];
        const images = project.images || project.Images || [];

        return {
            ...project,
            id: project.id || project.Id || project.ID,
            summary: project.summary || '',
            gallery: this.getGallery(project),
            images: images,
            duration: project.duration || '',
            language: project.language || '',
            architecture: project.architecture || '',
            status: project.status || '',
            keyFeatures: keyFeatures,
            changelog: changelog,
            responsibilities: responsibilities,
            relatedProjects: project.relatedProjects || project.RelatedProjects || [],
            comments: comments,
            reactionsCount: project.reactionsCount || project.ReactionsCount || 0,
            projectUrl: project.projectUrl || project.ProjectUrl || '',
            gitHubUrl: project.gitHubUrl || project.GitHubUrl || ''
        };
    }

    /**
     * Get gallery array from project, handling various formats
     * @param project Project object
     * @returns Array of gallery image URLs
     */
    private static getGallery(project: any): string[] {
        if (project.gallery?.length) {
            return project.gallery;
        }
        if (project.Gallery?.length) {
            return project.Gallery;
        }
        return project.imageUrl ? [project.imageUrl] : [];
    }

    /**
     * Get highlighted projects (most visited, featured, latest)
     * Returns up to 3 projects: most viewed, featured, and newest
     * @param projects Array of projects to select highlights from
     * @returns Array of highlighted projects (max 3)
     */
    static getProjectHighlights(projects: ProjectEntry[]): ProjectEntry[] {
        if (!projects || projects.length === 0) return [];

        let mostVisited: ProjectEntry | null = null;
        let featured: ProjectEntry | null = null;
        let lastPublish: ProjectEntry | null = null;

        // Sort projects by views descending
        const byViews = [...projects].sort((a, b) => (b.views || 0) - (a.views || 0));
        mostVisited = byViews[0] || null;

        // Sort projects by featured, preferring newest, excluding mostVisited
        const featuredProjects = [...projects].filter(p => !!p.isFeatured && p.id !== mostVisited?.id);
        if (featuredProjects.length > 0) {
            const sorted = [...featuredProjects].sort((a: ProjectEntry, b: ProjectEntry) => 
                new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            );
            featured = sorted[0];
        } else {
            featured = byViews.find(p => p.id !== mostVisited?.id) || null;
        }

        // Sort projects by latest, excluding mostVisited and featured
        const byLatest = [...projects]
            .filter(p => p.id !== mostVisited?.id && p.id !== featured?.id)
            .sort((a: ProjectEntry, b: ProjectEntry) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        lastPublish = byLatest[0] || null;

        return [mostVisited, featured, lastPublish].filter((p): p is ProjectEntry => p != null);
    }

    /**
     * Get full image URL, handling relative and absolute paths
     * @param url Image URL (relative or absolute)
     * @returns Full image URL or placeholder if not provided
     */
    static getFullImageUrl(url?: string): string {
        if (!url) {
            return 'assets/project-placeholder.svg';
        }
        
        if (url.startsWith('http')) {
            return url;
        }
        
        return `${environment.apiUrl.replace('/api', '')}/${url}`;
    }
}
