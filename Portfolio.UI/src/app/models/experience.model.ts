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
    [key: string]: any; // Allow dynamic property access for translation fields
}
