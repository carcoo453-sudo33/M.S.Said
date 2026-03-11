import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectService } from '../../services/project.service';
import { ProjectEntry, ExperienceEntry, Testimonial, Client } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, Plus, ArrowRight } from 'lucide-angular';
import { TranslationService } from '../../services/translation.service';
import { ImageUtilsService } from '../../services/image-utils.service';

// Section Components
import { ProjectsWorkHistoryComponent } from './sections/projects-work-history';
import { ProjectsBrandSliderComponent } from './sections/projects-brand-slider';
import { ProjectsReferencesComponent } from './sections/projects-references';
import { ProjectsBottomCTAComponent } from './sections/projects-bottom-cta';

// Skeleton Components
import { ProjectsGridSkeletonComponent } from './sections/projects-grid-skeleton';
import { ProjectsWorkHistorySkeletonComponent } from './sections/projects-work-history-skeleton';
import { ProjectsBrandSliderSkeletonComponent } from './sections/projects-brand-slider-skeleton';
import { ProjectsReferencesSkeletonComponent } from './sections/projects-references-skeleton';
import { ProjectsBottomCTASkeletonComponent } from './sections/projects-bottom-cta-skeleton';

// Shared Global Components
import { SharedFooterComponent } from '../shared/footer/footer';
import { SharedPageHeaderComponent } from '../shared/page-header/page-header';
import { SharedEmptyStateComponent } from '../shared/empty-state/empty-state';
import { SharedErrorStateComponent } from '../shared/error-state/error-state';

// UI Components
import { ProjectCardComponent } from '../shared/project-card/project-card';

// Centralized CRUD
import { ProjectCrudModalComponent } from '../shared/project-crud/project-crud-modal';
import { ProjectDeleteModalComponent } from '../shared/project-crud/components/project-delete-modal';
import { ProjectCrudService } from '../shared/project-crud/project-crud.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NavbarComponent,
    LucideAngularModule,
    ProjectsWorkHistoryComponent,
    ProjectsBrandSliderComponent,
    ProjectsReferencesComponent,
    ProjectsBottomCTAComponent,
    ProjectsGridSkeletonComponent,
    ProjectsWorkHistorySkeletonComponent,
    ProjectsBrandSliderSkeletonComponent,
    ProjectsReferencesSkeletonComponent,
    ProjectsBottomCTASkeletonComponent,
    SharedFooterComponent,
    SharedPageHeaderComponent,
    SharedErrorStateComponent,
    SharedEmptyStateComponent,
    ProjectCardComponent,
    ProjectCrudModalComponent,
    ProjectDeleteModalComponent
  ],
  templateUrl: './projects.html'
})
export class ProjectsComponent implements OnInit {
  private projectService = inject(ProjectService);
  private profileService = inject(ProfileService);
  private crudService = inject(ProjectCrudService);
  public auth = inject(AuthService);
  public translationService = inject(TranslationService);
  private imageUtils = inject(ImageUtilsService);
  private titleService = inject(Title);
  private meta = inject(Meta);
  PlusIcon = Plus;
  ArrowRightIcon = ArrowRight;

  projects = signal<ProjectEntry[]>([]);
  experiences = signal<ExperienceEntry[]>([]);
  testimonials = signal<Testimonial[]>([]);
  clients = signal<Client[]>([]);
  totalProjectCount = signal(0);
  isLoading = signal(true);
  hasError = signal(false);
  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  editingProject = signal<ProjectEntry | null>(null);
  deletingProject = signal<ProjectEntry | null>(null);

  // Computed
  highlightedProjects = computed(() => {
    return this.projectService.getProjectHighlights(this.projects());
  });

  ngOnInit() {
    this.updateSeoTags();
    this.loadData();

    // Safety guard: Ensure skeleton doesn't hang forever
    setTimeout(() => {
      if (this.isLoading()) {
        console.warn('Projects loading timed out. Clearing skeleton.');
        this.isLoading.set(false);
        // If we still have no projects, show error instead of empty if it was a real timeout
        if (this.projects().length === 0) {
          this.hasError.set(true);
        }
      }
    }, 8000);
  }

  loadData() {
    // Load all projects for highlight logic and grid
    this.projectService.getProjects().subscribe({
      next: (data: ProjectEntry[]) => {
        console.log('Projects loaded:', data.length);
        this.projects.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Projects: Failed to load featured projects', err);
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });

    // Load total project count
    this.projectService.getProjects().subscribe({
      next: (data: ProjectEntry[]) => {
        this.totalProjectCount.set(data.length);
      },
      error: (err) => console.error('Projects: Failed to load project count', err)
    });

    this.profileService.getExperiences().subscribe({
      next: (data) => this.experiences.set(data),
      error: (err) => console.error('Projects: Failed to load experiences', err)
    });

    this.profileService.getClients().subscribe({
      next: (data) => this.clients.set(data),
      error: (err) => console.error('Projects: Failed to load clients', err)
    });

    this.profileService.getTestimonials().subscribe({
      next: (data) => this.testimonials.set(data),
      error: (err) => console.error('Projects: Failed to load testimonials', err)
    });
  }

  loadMockData() {
    // Removed - now loading from API
  }

  onCreateProject() {
    this.showCreateModal.set(true);
  }

  onEditProject(project: ProjectEntry) {
    this.editingProject.set(project);
    this.showEditModal.set(true);
  }

  onDeleteProject(project: ProjectEntry) {
    this.deletingProject.set(project);
    this.showDeleteModal.set(true);
  }

  onProjectDeleted(project: ProjectEntry) {
    // Remove from local state
    const updatedProjects = this.projects().filter(p => p.id !== project.id);
    this.projects.set(updatedProjects);
    this.totalProjectCount.set(updatedProjects.length);
    this.showDeleteModal.set(false);
    this.deletingProject.set(null);
  }

  onProjectSaved(project: ProjectEntry) {
    // Add to projects list if it's a new project, or update existing
    const existingIndex = this.projects().findIndex(p => p.id === project.id);
    if (existingIndex === -1) {
      this.projects.set([...this.projects(), project]);
      this.totalProjectCount.set(this.projects().length);
    } else {
      const updated = [...this.projects()];
      updated[existingIndex] = project;
      this.projects.set(updated);
    }
    this.showCreateModal.set(false);
    this.showEditModal.set(false);
    this.editingProject.set(null);
  }

  onModalClosed() {
    this.showCreateModal.set(false);
    this.showEditModal.set(false);
    this.showDeleteModal.set(false);
    this.editingProject.set(null);
    this.deletingProject.set(null);
  }

  onExperiencesUpdated(updatedExperiences: ExperienceEntry[]) {
    this.experiences.set(updatedExperiences);
    console.log('Experiences list updated:', this.experiences().length);
  }

  onClientsUpdated(updatedClients: Client[]) {
    this.clients.set(updatedClients);
    console.log('Clients list updated:', this.clients().length);
  }

  onTestimonialsUpdated(updatedTestimonials: Testimonial[]) {
    this.testimonials.set(updatedTestimonials);
    console.log('Testimonials list updated:', this.testimonials().length);
  }

  getFullImageUrl(url: string): string {
    return this.imageUtils.getFullImageUrl(url);
  }

  private updateSeoTags() {
    const isAr = this.translationService.isRTL();
    const title = isAr ? 'المشاريع | رحلة الابتكار والتميز التقني | Mostafa.Dev' : 'Projects | Journey of Innovation & Technical Excellence | Mostafa.Dev';
    const description = isAr 
        ? 'اكتشف أبرز المشاريع والحلول التقنية التي قمت بتطويرها. من تطبيقات الويب المعقدة إلى الأنظمة الهندسية المبتكرة.' 
        : 'Discover featured projects and technical solutions I have developed. From complex web applications to innovative engineering systems.';

    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    // Canonical link
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.href);
  }
}
