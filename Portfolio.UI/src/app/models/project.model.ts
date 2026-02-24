export interface KeyFeature {
    icon: string;
    title: string;
    title_Ar?: string;
    description: string;
    description_Ar?: string;
    [key: string]: any;
}

export interface ChangelogItem {
    date: string;
    version: string;
    title: string;
    title_Ar?: string;
    description: string;
    description_Ar?: string;
    [key: string]: any;
}

export interface Metric {
    label: string;
    label_Ar?: string;
    value: string | number;
    trend?: 'up' | 'down';
    [key: string]: any;
}

export interface Comment {
    id: string;
    author: string;
    avatarUrl: string;
    date: string;
    content: string;
    likes: number;
    replies: CommentReply[];
}

export interface CommentReply {
    id: string;
    author: string;
    avatarUrl: string;
    date: string;
    content: string;
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
    title_Ar?: string;
    description: string;
    description_Ar?: string;
    summary?: string;
    summary_Ar?: string;
    technologies: string;
    category: string;
    category_Ar?: string;
    tags?: string;
    tags_Ar?: string;
    niche?: string;
    niche_Ar?: string;
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
    [key: string]: any;
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
