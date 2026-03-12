export interface SkillEntry {
    id: string;
    name: string;
    name_Ar?: string;
    icon?: string; // Frontend alias for iconPath
    iconPath?: string; // Backend field name
    order: number;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any; // Allow dynamic property access for translation fields
}
