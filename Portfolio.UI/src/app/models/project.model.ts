export interface KeyFeature {
    icon: string;
    title: string;
    description: string;
}

export interface ChangelogItem {
    date: string;
    version: string;
    title: string;
    description: string;
}

export interface Metric {
    label: string;
    value: string | number;
    trend?: 'up' | 'down';
}

export interface Comment {
    id: string;
    author: string;
    avatarUrl: string;
    date: string;
    content: string;
    likes: number;
}

export interface ProjectEntry {
    id: string;
    title: string;
    slug: string;
    description?: string;
    summary?: string;
    techStack?: string;
    category?: string;
    tags?: string;
    niche?: string;
    imageUrl?: string;
    gallery?: string[];
    demoUrl?: string;
    repoUrl?: string;
    duration?: string;
    language?: string;
    architecture?: string;
    status?: string;
    keyFeatures?: KeyFeature[];
    changelog?: ChangelogItem[];
    responsibilities?: string[];
    metrics?: Metric[];
    relatedProjects?: Partial<ProjectEntry>[];
    comments?: Comment[];
    reactionsCount?: number;
    views: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProjectDto {
    id?: string;
    title: string;
    description: string;
    imageUrl?: string;
    projectUrl?: string;
    gitHubUrl?: string;
    category: string;
    technologies: string;
    order: number;
    isFeatured: boolean;
    views: number;
}
