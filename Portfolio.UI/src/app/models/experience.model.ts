export interface ExperienceEntry {
    id: string;
    company: string;
    company_Ar?: string;
    role: string;
    role_Ar?: string;
    duration: string;
    description?: string;
    description_Ar?: string;
    location?: string;
    location_Ar?: string;
    isCurrent: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
