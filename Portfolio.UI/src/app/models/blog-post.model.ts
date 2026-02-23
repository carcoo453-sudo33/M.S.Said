export interface BlogPost {
    id: string;
    title: string;
    summary: string;
    content: string;
    imageUrl?: string;
    socialUrl?: string;
    socialType?: string;
    publishedAt: string;
    tags?: string;
    author: string;
    likesCount?: number;
    commentsCount?: number;
    starsCount?: number;
    forksCount?: number;
    version?: string;
}
