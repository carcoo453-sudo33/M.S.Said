import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { ProjectEntry, BioEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { LucideAngularModule } from 'lucide-angular';
import { TranslationService } from '../../services/translation.service';

// Section Components
import { ProjectDetailsHeaderComponent } from './sections/project-details-header';
import { ProjectDetailsSpecsComponent } from './sections/project-details-specs';
import { ProjectDetailsGalleryComponent } from './sections/project-details-gallery';
import { ProjectDetailsFeaturesComponent } from './sections/project-details-features';
import { ProjectDetailsInteractionsComponent } from './sections/project-details-interactions';
import { ProjectDetailsSidebarComponent } from './sections/project-details-sidebar';
import { ProjectDetailsManageComponent } from './sections/project-details-manage';

// Skeleton Components
import { ProjectDetailsHeaderSkeletonComponent } from './sections/project-details-header-skeleton';
import { ProjectDetailsGallerySkeletonComponent } from './sections/project-details-gallery-skeleton';
import { ProjectDetailsSpecsSkeletonComponent } from './sections/project-details-specs-skeleton';
import { ProjectDetailsFeaturesSkeletonComponent } from './sections/project-details-features-skeleton';
import { ProjectDetailsSidebarSkeletonComponent } from './sections/project-details-sidebar-skeleton';
import { ProjectDetailsInteractionsSkeletonComponent } from './sections/project-details-interactions-skeleton';

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
    TranslateModule,
    NavbarComponent,
    LucideAngularModule,
    ProjectDetailsHeaderComponent,
    ProjectDetailsSpecsComponent,
    ProjectDetailsGalleryComponent,
    ProjectDetailsFeaturesComponent,
    ProjectDetailsInteractionsComponent,
    ProjectDetailsSidebarComponent,
    ProjectDetailsManageComponent,
    ProjectDetailsHeaderSkeletonComponent,
    ProjectDetailsGallerySkeletonComponent,
    ProjectDetailsSpecsSkeletonComponent,
    ProjectDetailsFeaturesSkeletonComponent,
    ProjectDetailsSidebarSkeletonComponent,
    ProjectDetailsInteractionsSkeletonComponent,
    SharedFooterComponent,
    SharedErrorStateComponent,
    SharedSkeletonComponent,
    SharedSignatureComponent
  ],
  templateUrl: './project-details.html'
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  public translationService = inject(TranslationService);

  project = signal<ProjectEntry | undefined>(undefined);
  bio = signal<BioEntry | null>(null);
  isLoading = signal(true);
  hasError = signal(false);
  isAuthenticated = signal(false);
  triggerEditModal = signal(false);
  triggerShareModal = signal(false);

  ngOnInit() {
    this.profileService.getBio().subscribe({
      next: (bio) => this.bio.set(bio),
      error: (err) => console.error('ProjectDetails: Failed to load bio', err)
    });
    this.checkAuth();
    this.loadProject();
  }

  checkAuth() {
    const token = localStorage.getItem('auth_token');
    this.isAuthenticated.set(!!token);
  }

  loadProject() {
    const slug = this.route.snapshot.paramMap.get('slug');
    console.log('Loading project with slug:', slug);
    
    if (slug) {
      this.projectService.getProject(slug).subscribe({
        next: (data) => {
          console.log('Project loaded from API:', data);
          console.log('Project ID from API:', data.id);
          const enriched = this.enrichProjectData(data);
          this.project.set(enriched);
          console.log('Enriched project:', enriched);
          console.log('Final project ID:', enriched.id);
          // Wrap state changes in setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => {
            this.isLoading.set(false);
          }, 0);
        },
        error: (err) => {
          console.error('Failed to load project:', err);
          // Wrap state changes in setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => {
            this.isLoading.set(false);
            this.hasError.set(true);
          }, 0);
        }
      });
    } else {
      setTimeout(() => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }, 0);
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
    const currentProject = this.project();
    if (currentProject && currentProject.id) {
      console.log('Reacting to project:', currentProject.id);
      this.projectService.reactToProject(currentProject.id).subscribe({
        next: (newCount) => {
          console.log('React successful, new count:', newCount);
          this.project.set({ ...currentProject, reactionsCount: newCount });
        },
        error: (err) => {
          console.error('Failed to react to project:', err);
        }
      });
    } else {
      console.error('Cannot react: project or project.id is missing', currentProject);
    }
  }

  onShare() {
    // Trigger share modal via flag
    this.triggerShareModal.set(true);
    setTimeout(() => this.triggerShareModal.set(false), 100);
  }

  onProjectUpdate(updatedProject: ProjectEntry) {
    this.project.set(updatedProject);
  }

  onEditProject() {
    // Trigger the management modal
    this.triggerEditModal.set(true);
    setTimeout(() => this.triggerEditModal.set(false), 100);
  }

  onDeleteProject() {
    const currentProject = this.project();
    if (!currentProject || !currentProject.id) return;
    
    if (!this.authService.isLoggedIn()) {
      alert('You must be logged in to delete projects.');
      return;
    }

    this.projectService.deleteProject(currentProject.id).subscribe({
      next: () => {
        console.log('Project deleted successfully');
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        console.error('Failed to delete project:', err);
        if (err.status === 401) {
          alert('Authentication failed. Please log in again.');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          alert('Failed to delete project. Please try again.');
        }
      }
    });
  }
}
