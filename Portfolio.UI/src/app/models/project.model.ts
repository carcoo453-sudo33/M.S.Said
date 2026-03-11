export interface ProjectImage {
    id?: string;
    projectId?: string;
    imageUrl: string;
    title: string;
    title_Ar?: string;
    type?: number;
    order?: number;
    description?: string;
    description_Ar?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface KeyFeature {
    id?: string;
    icon?: string;
    title: string;
    title_Ar?: string;
    description?: string;
    description_Ar?: string;
    link?: string;
    date?: string;
    featureType?: number;
    [key: string]: any;
}

export interface Responsibility {
    id?: string;
    title?: string;
    title_Ar?: string;
    description?: string;
    description_Ar?: string;
    text?: string;
    text_Ar?: string;
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
    tags?: string;
    category?: string;
}

export interface BaseProject {
    title: string;
    title_Ar?: string;
    description: string;
    description_Ar?: string;
    summary?: string;
    summary_Ar?: string;
    category: string;
    category_Ar?: string;
    tags?: string;
    tags_Ar?: string;
    niche?: string;
    niche_Ar?: string;
    company?: string;
    company_Ar?: string;
    imageUrl?: string;
    gallery?: string[];
    images?: ProjectImage[];
    projectUrl?: string;
    gitHubUrl?: string;
    duration?: string;
    duration_Ar?: string;
    language?: string;
    language_Ar?: string;
    architecture?: string;
    architecture_Ar?: string;
    status?: string;
    status_Ar?: string;
    type?: string;
    type_Ar?: string;
    developmentMethod?: string;
    developmentMethod_Ar?: string;
    techStack?: string;
    keyFeatures?: KeyFeature[];
    changelog?: ChangelogItem[];
    responsibilities?: Responsibility[];
    comments?: Comment[];
    reactionsCount?: number;
    views: number;
    [key: string]: any;
}

export interface ProjectEntry extends BaseProject {
    id: string;
    slug: string;
    isFeatured?: boolean;
    relatedProjects?: ProjectSummary[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProjectDto extends BaseProject {
    id?: string;
    order: number;
    isFeatured: boolean;
}
