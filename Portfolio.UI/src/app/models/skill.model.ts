export interface SkillEntry {
    id: string;
    name: string;
    icon?: string; // Frontend alias for iconPath
    iconPath?: string; // Backend field name
    [key: string]: any; // Allow dynamic property access for translation fields
}
