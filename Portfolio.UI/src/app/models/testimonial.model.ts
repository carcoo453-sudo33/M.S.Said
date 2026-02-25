export interface Testimonial {
    id?: string;
    name: string;
    role: string;
    role_Ar?: string;
    content: string;
    content_Ar?: string;
    avatarUrl?: string;
    company?: string;
    company_Ar?: string;
    [key: string]: any;
}
