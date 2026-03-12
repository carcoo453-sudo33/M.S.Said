export interface ChangelogItem {
    date: string;
    version: string;
    title: string;
    title_Ar?: string;
    description: string;
    description_Ar?: string;
    [key: string]: any;
}
