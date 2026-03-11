import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
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

// Skeleton Components
import { ProjectDetailsHeaderSkeletonComponent } from './sections/project-details-header-skeleton';
import { ProjectDetailsGallerySkeletonComponent } from './sections/project-details-gallery-skeleton';
import { ProjectDetailsSpecsSkeletonComponent } from './sections/project-details-specs-skeleton';
import { ProjectDetailsFeaturesSkeletonComponent } from './sections/project-details-features-skeleton';
import { ProjectDetailsSidebarSkeletonComponent } from './sections/project-details-sidebar-skeleton';
import { ProjectDetailsInteractionsSkeletonComponent } from './sections/project-details-interactions-skeleton';

// Centralized CRUD
import { ProjectCrudModalComponent } from '../shared/project-crud/project-crud-modal';
import { ProjectDeleteModalComponent } from '../shared/project-crud/components/project-delete-modal';
import { ProjectCrudService } from '../shared/project-crud/project-crud.service';

// Shared Global Components
import { SharedFooterComponent } from '../shared/footer/footer';
import { SharedErrorStateComponent } from '../shared/error-state/error-state';
import { SharedSignatureComponent } from '../shared/signature/signature';

// UI Components

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
    ProjectDetailsHeaderSkeletonComponent,
    ProjectDetailsGallerySkeletonComponent,
    ProjectDetailsSpecsSkeletonComponent,
    ProjectDetailsFeaturesSkeletonComponent,
    ProjectDetailsSidebarSkeletonComponent,
    ProjectDetailsInteractionsSkeletonComponent,
    SharedFooterComponent,
    SharedErrorStateComponent,
    SharedSignatureComponent,
    ProjectCrudModalComponent,
    ProjectDeleteModalComponent
  ],
  templateUrl: './project-details.html'
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private crudService = inject(ProjectCrudService);
  private toast = inject(ToastService);
  public translationService = inject(TranslationService);
  private meta = inject(Meta);
  private titleService = inject(Title);
  private translate = inject(TranslateService);

  project = signal<ProjectEntry | undefined>(undefined);
  bio = signal<BioEntry | null>(null);
  isLoading = signal(true);
  hasError = signal(false);
  isAuthenticated = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
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
          this.project.set(data);
          this.updateSeoTags(data);
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
    console.log('Project updated:', updatedProject);
  }

  onEditProject() {
    this.showEditModal.set(true);
  }

  onProjectSaved(updatedProject: ProjectEntry) {
    // Re-fetch from server to get the fully normalized data with all collections populated
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.projectService.getProject(slug).subscribe({
        next: (freshProject) => {
          this.project.set(freshProject);
        },
        error: () => {
          // Fallback to the returned project if reload fails
          this.project.set(this.projectService.normalizeProject(updatedProject));
        }
      });
    } else {
      this.project.set(this.projectService.normalizeProject(updatedProject));
    }
    this.showEditModal.set(false);
  }

  onModalClosed() {
    this.showEditModal.set(false);
    this.showDeleteModal.set(false);
  }

  onDeleteProject() {
    this.showDeleteModal.set(true);
  }

  onProjectDeleted(project: ProjectEntry) {
    this.showDeleteModal.set(false);
    this.router.navigate(['/projects']);
  }

  private updateSeoTags(project: ProjectEntry) {
    const isAr = this.translationService.isRTL();
    const title = isAr && project.title_Ar ? project.title_Ar : project.title;
    const description = isAr && project.summary_Ar ? project.summary_Ar : (project.summary || project.description);
    const imageUrl = project.imageUrl ? this.projectService.getFullImageUrl(project.imageUrl) : '';
    const siteTitle = `Mostafa.Dev | ${title}`;

    this.titleService.setTitle(siteTitle);

    const tags = [
      { name: 'description', content: description },
      { property: 'og:title', content: siteTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: imageUrl },
      { property: 'og:url', content: window.location.href },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: siteTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl }
    ];

    tags.forEach(tag => {
      if ((tag as any).name) {
        this.meta.updateTag({ name: (tag as any).name, content: tag.content });
      } else {
        this.meta.updateTag({ property: (tag as any).property, content: tag.content });
      }
    });

    // Add canonical link
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.href);
  }
}
