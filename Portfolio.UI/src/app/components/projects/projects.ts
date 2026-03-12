import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectService } from '../../services/project.service';
import { ProjectsPageService } from '../../services/projects-page.service';
import { ProjectsListService } from '../../services/projects-list.service';
import { ProjectEntry, ExperienceEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, Plus, ArrowRight } from 'lucide-angular';
import { TranslationService } from '../../services/translation.service';
import { ProjectUtil } from '../../utils';

// Section Components
import { ProjectsWorkHistoryComponent } from './sections/projects-work-history';
import { ProjectsReferencesComponent } from './sections/projects-references';
import { ProjectsBottomCTAComponent } from './sections/projects-bottom-cta';

// Skeleton Components
import { ProjectsGridSkeletonComponent } from './sections/projects-grid-skeleton';
import { ProjectsWorkHistorySkeletonComponent } from './sections/projects-work-history-skeleton';
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
    ProjectsReferencesComponent,
    ProjectsBottomCTAComponent,
    ProjectsGridSkeletonComponent,
    ProjectsWorkHistorySkeletonComponent,
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
  private readonly projectService = inject(ProjectService);
  private readonly projectsPageService = inject(ProjectsPageService);
  private readonly projectsListService = inject(ProjectsListService);
  private readonly crudService = inject(ProjectCrudService);
  public readonly auth = inject(AuthService);
  public readonly translationService = inject(TranslationService);
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  PlusIcon = Plus;
  ArrowRightIcon = ArrowRight;

  projects = signal<ProjectEntry[]>([]);
  experiences = signal<ExperienceEntry[]>([]);
  references = signal<any[]>([]);
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
    return ProjectUtil.getProjectHighlights(this.projects());
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
    this.projectsListService.getProjects().subscribe({
      next: (data: any) => {
        console.log('Projects loaded:', data.items?.length || 0);
        this.projects.set(data.items || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Projects: Failed to load featured projects', err);
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });

    // Load total project count
    this.projectsListService.getProjects().subscribe({
      next: (data: any) => {
        this.totalProjectCount.set(data.items?.length || 0);
      },
      error: (err) => console.error('Projects: Failed to load project count', err)
    });

    this.projectsPageService.getExperiences().subscribe({
      next: (data) => this.experiences.set(data),
      error: (err) => console.error('Projects: Failed to load experiences', err)
    });

    this.projectsPageService.getReferences().subscribe({
      next: (data) => this.references.set(data),
      error: (err) => console.error('Projects: Failed to load references', err)
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

  onReferencesUpdated(updatedReferences: any[]) {
    this.references.set(updatedReferences);
    console.log('References list updated:', this.references().length);
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
    this.meta.updateTag({ property: 'og:url', content: globalThis.location.href });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    // Canonical link
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', globalThis.location.href);
  }
}
