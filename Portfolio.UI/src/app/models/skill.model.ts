export interface SkillEntry {
    id: string;
    name: string;
    name_Ar?: string;
    icon?: string;
    order: number;
    [key: string]: any; // Allow dynamic property access for translation fields
}
