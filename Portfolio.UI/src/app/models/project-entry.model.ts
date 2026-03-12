import { BaseProject } from './base-project.model';
import { ProjectSummary } from './project-summary.model';

export interface ProjectEntry extends BaseProject {
    id: string;
    slug: string;
    isFeatured?: boolean;
    relatedProjects?: ProjectSummary[];
    createdAt?: Date;
    updatedAt?: Date;
}
