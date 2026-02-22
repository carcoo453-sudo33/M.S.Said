export interface ExperienceEntry {
    id: string;
    company: string;
    role: string;
    duration: string;
    description?: string;
    location?: string;
    isCurrent: boolean;
}

export interface ProjectEntry {
    id: string;
    title: string;
    description?: string;
    techStack?: string;
    imageUrl?: string;
    demoUrl?: string;
    repoUrl?: string;
}

export interface BioEntry {
    id: string;
    name: string;
    title: string;
    description: string;
    location: string;
    email: string;
    phone: string;
    avatarUrl?: string;
}

export interface ServiceEntry {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export interface AuthResponse {
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
}
