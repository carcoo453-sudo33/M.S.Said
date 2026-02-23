import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { ProfileService } from '../../services/profile.service';
import { ProjectEntry, BioEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { LucideAngularModule } from 'lucide-angular';

// Section Components
import { ProjectDetailsHeaderComponent } from './sections/project-details-header';
import { ProjectDetailsSpecsComponent } from './sections/project-details-specs';
import { ProjectDetailsGalleryComponent } from './sections/project-details-gallery';
import { ProjectDetailsFeaturesComponent } from './sections/project-details-features';
import { ProjectDetailsInteractionsComponent } from './sections/project-details-interactions';
import { ProjectDetailsSidebarComponent } from './sections/project-details-sidebar';

// Shared Global Components
import { SharedFooterComponent } from '../shared/footer/footer';
import { SharedErrorStateComponent } from '../shared/error-state/error-state';
import { SharedSkeletonComponent } from '../shared/skeleton/skeleton';
import { SharedSignatureComponent } from '../shared/signature/signature';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    RouterLink,
    LucideAngularModule,
    ProjectDetailsHeaderComponent,
    ProjectDetailsSpecsComponent,
    ProjectDetailsGalleryComponent,
    ProjectDetailsFeaturesComponent,
    ProjectDetailsInteractionsComponent,
    ProjectDetailsSidebarComponent,
    SharedFooterComponent,
    SharedErrorStateComponent,
    SharedSkeletonComponent,
    SharedSignatureComponent
  ],
  templateUrl: './project-details.html'
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private profileService = inject(ProfileService);

  project?: ProjectEntry;
  bio: BioEntry | null = null;
  isLoading = true;
  hasError = false;

  ngOnInit() {
    this.profileService.getBio().subscribe({
      next: (bio) => this.bio = bio,
      error: (err) => console.error('ProjectDetails: Failed to load bio', err)
    });
    this.loadProject();
  }

  loadProject() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.projectService.getProject(slug).subscribe({
        next: (data) => {
          this.project = this.enrichProjectData(data);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.hasError = true;
        }
      });
    } else {
      this.isLoading = false;
      this.hasError = true;
    }
  }

  enrichProjectData(project: ProjectEntry): ProjectEntry {
    return {
      ...project,
      summary: project.summary || 'Developing high-performance solutions with modern technologies.',
      gallery: project.gallery?.length ? project.gallery : [project.imageUrl || ''],
      duration: project.duration || 'In Progress',
      language: project.language || 'Multiple Languages',
      architecture: project.architecture || 'Scalable Architecture',
      status: project.status || 'Active',
      keyFeatures: project.keyFeatures?.length ? project.keyFeatures : [],
      changelog: project.changelog?.length ? project.changelog : [],
      responsibilities: project.responsibilities?.length ? project.responsibilities : [],
      metrics: project.metrics?.length ? project.metrics : [],
      relatedProjects: project.relatedProjects || [],
      comments: project.comments?.length ? project.comments : [],
      reactionsCount: project.reactionsCount || 0,
      projectUrl: project.projectUrl || '',
      gitHubUrl: project.gitHubUrl || ''
    };
  }

  onReact() {
    if (this.project) {
      this.project.reactionsCount = (this.project.reactionsCount || 0) + 1;
    }
  }

  onShare() {
    alert('Share functionality triggered!');
  }
}
