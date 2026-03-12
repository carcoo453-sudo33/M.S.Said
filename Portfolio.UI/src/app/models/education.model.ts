export interface EducationEntry {
    id: string;
    institution: string;
    institution_Ar?: string;
    degree: string;
    degree_Ar?: string;
    duration: string;
    description?: string;
    description_Ar?: string;
    location?: string;
    location_Ar?: string;
    imageUrl?: string;
    isCompleted: boolean;
    category: 'Education' | 'Training' | 'Certification' | 'Achievement';
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
