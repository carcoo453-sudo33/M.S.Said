export interface ServiceEntry {
    id: string;
    title: string;
    title_Ar?: string;
    description: string;
    description_Ar?: string;
    icon: string;
    [key: string]: any; // Allow dynamic property access for translation fields
}
