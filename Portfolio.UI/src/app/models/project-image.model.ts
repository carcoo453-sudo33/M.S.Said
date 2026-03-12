export interface ProjectImage {
    id?: string;
    projectId?: string;
    imageUrl: string;
    title: string;
    title_Ar?: string;
    type?: number;
    order?: number;
    description?: string;
    description_Ar?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
