export interface Reference {
    id: string;
    name: string;
    name_Ar?: string;
    role?: string;
    role_Ar?: string;
    company?: string;
    company_Ar?: string;
    content: string;
    content_Ar?: string;
    imagePath?: string;
    phone?: string;
    email?: string;
    socialLink?: string;
    publishedAt: Date;
    createdAt: Date;
    updatedAt?: Date;
}
