export interface BlogPost {
    id: string;
    title: string;
    title_Ar?: string;
    summary: string;
    summary_Ar?: string;
    content: string;
    content_Ar?: string;
    imageUrl?: string;
    socialUrl?: string;
    socialType?: string;
    publishedAt: string;
    tags?: string;
    tags_Ar?: string;
    author: string;
    likesCount?: number;
    commentsCount?: number;
    starsCount?: number;
    forksCount?: number;
    version?: string;
    [key: string]: any;
}
