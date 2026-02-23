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

export interface ProjectSummary {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string;
    technologies?: string;
    category?: string;
}

export interface BaseProject {
    title: string;
    description: string;
    summary?: string;
    technologies: string;
    category: string;
    tags?: string;
    niche?: string;
    imageUrl?: string;
    gallery?: string[];
    projectUrl?: string;
    gitHubUrl?: string;
    duration?: string;
    language?: string;
    architecture?: string;
    status?: string;
    keyFeatures?: KeyFeature[];
    changelog?: ChangelogItem[];
    responsibilities?: string[];
    metrics?: Metric[];
    comments?: Comment[];
    reactionsCount?: number;
    views: number;
}

export interface ProjectEntry extends BaseProject {
    id: string;
    slug: string;
    relatedProjects?: ProjectSummary[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProjectDto extends BaseProject {
    id?: string;
    order: number;
    isFeatured: boolean;
}
