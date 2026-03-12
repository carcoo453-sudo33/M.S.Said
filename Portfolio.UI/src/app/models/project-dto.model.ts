import { BaseProject } from './base-project.model';

export interface ProjectDto extends BaseProject {
    id?: string;
    order: number;
    isFeatured: boolean;
}
