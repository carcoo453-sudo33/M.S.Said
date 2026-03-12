import { SignatureDto } from './signature.model';
import { TechnicalFocusDto } from './technical-focus.model';

export interface BioEntry {
    id: string;
    name: string;
    name_Ar?: string;
    title?: string;
    title_Ar?: string;
    description?: string;
    description_Ar?: string;
    location?: string;
    location_Ar?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    yearsOfExperience?: string;
    projectsCompleted?: string;
    codeCommits?: string;
    linkedInUrl?: string;
    gitHubUrl?: string;
    whatsAppUrl?: string;
    cvUrl?: string;
    twitterUrl?: string;
    facebookUrl?: string;
    devToUrl?: string;
    pinterestUrl?: string;
    stackOverflowUrl?: string;
    educationQuote?: string;
    educationQuote_Ar?: string;
    signature?: SignatureDto;
    technicalFocus?: TechnicalFocusDto;
    technicalFocusItems?: string; // Convenience field for comma-separated items
    [key: string]: any; // Allow dynamic property access for translation fields
}
