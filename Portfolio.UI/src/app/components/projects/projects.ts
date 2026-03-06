import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectService } from '../../services/project.service';
import { ProjectEntry, ExperienceEntry, Testimonial, Client } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { LucideAngularModule, Plus, ArrowRight, Eye, Star, Rocket, Clock, Image } from 'lucide-angular';
import { TranslationService } from '../../services/translation.service';
import { ImageUtilsService } from '../../services/image-utils.service';

// Section Components
import { ProjectsGridComponent } from './sections/projects-grid';
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
import { ButtonComponent } from '../../ui/button';
import { CardComponent, CardContentComponent } from '../../ui/card';
import { BadgeComponent } from '../../ui/badge';
import { OptimizedImageComponent } from '../shared/optimized-image/optimized-image';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NavbarComponent,
    LucideAngularModule,
    ProjectsGridComponent,
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
    ButtonComponent,
    CardComponent,
    CardContentComponent,
    BadgeComponent,
    OptimizedImageComponent
  ],
  templateUrl: './projects.html'
})
export class ProjectsComponent implements OnInit {
  private projectService = inject(ProjectService);
  private profileService = inject(ProfileService);
  public auth = inject(AuthService);
  private toast = inject(ToastService);
  public translationService = inject(TranslationService);
  private router = inject(Router);
  private imageUtils = inject(ImageUtilsService);
  PlusIcon = Plus;
  ArrowRightIcon = ArrowRight;
  EyeIcon = Eye;
  StarIcon = Star;
  RocketIcon = Rocket;
  ClockIcon = Clock;
  ImageIcon = Image;

  projects = signal<ProjectEntry[]>([]);
  experiences = signal<ExperienceEntry[]>([]);
  testimonials = signal<Testimonial[]>([]);
  clients = signal<Client[]>([]);
  totalProjectCount = signal(0);
  isLoading = signal(true);
  hasError = signal(false);
  selectedFilter = signal('All');
  triggerCreateProject = signal(false);

  // Computed
  highlightedProjects = computed(() => {
    const projects = this.projects();
    if (!projects || projects.length === 0) return [];

    let mostVisited: ProjectEntry | null = null;
    let featured: ProjectEntry | null = null;
    let lastPublish: ProjectEntry | null = null;

    // Sort projects by views descending
    const byViews = [...projects].sort((a, b) => (b.views || 0) - (a.views || 0));
    mostVisited = byViews[0] || null;

    // Sort projects by featured, preferring highest views or newest, excluding mostVisited
    const featuredProjects = [...projects].filter(p => !!(p as any).isFeatured && p.id !== mostVisited?.id);
    if (featuredProjects.length > 0) {
      featured = featuredProjects.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
    } else {
      // Fallback if no featured
      featured = byViews.find(p => p.id !== mostVisited?.id) || null;
    }

    // Sort projects by latest, excluding mostVisited and featured
    const byLatest = [...projects]
      .filter(p => p.id !== mostVisited?.id && p.id !== featured?.id)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    lastPublish = byLatest[0] || null;

    const highlights = [
      { type: 'most-visited', label: 'Highest Visits', project: mostVisited, icon: this.EyeIcon, color: 'from-blue-600 to-cyan-500', shadow: 'shadow-blue-500/20', labelKey: 'projects.highlights.mostVisited' },
      { type: 'featured', label: 'Featured ✨', project: featured, icon: this.StarIcon, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20', labelKey: 'projects.highlights.featured' },
      { type: 'last-publish', label: 'Latest Release', project: lastPublish, icon: this.RocketIcon, color: 'from-red-600 to-pink-500', shadow: 'shadow-red-500/20', labelKey: 'projects.highlights.latest' }
    ];

    return highlights.filter(h => h.project != null) as any[];
  });

  filters = ['All', 'Full Stack', 'Angular', 'NET Core'];

  ngOnInit() {
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

  setFilter(filter: string) {
    this.selectedFilter.set(filter);
  }

  onCreateProject() {
    this.triggerCreateProject.set(!this.triggerCreateProject());
  }

  get filteredProjects() {
    const highlights = this.highlightedProjects()
      .map(h => h.project?.id)
      .filter(id => !!id);

    let all = this.projects();

    if (this.selectedFilter() !== 'All') {
      all = all.filter(p => {
        const tags = p.tags?.toLowerCase() || '';
        const cat = p.category?.toLowerCase() || '';
        const filter = this.selectedFilter().toLowerCase();

        if (filter === 'full stack') return cat.includes('fullstack') || cat.includes('full-stack') || cat.includes('web');
        if (filter === 'angular') return tags.includes('angular');
        if (filter === 'net core') return tags.includes('.net') || tags.includes('core');

        return cat.includes(filter) || tags.includes(filter);
      });
    }

    return all.filter(p => !highlights.includes(p.id));
  }

  onEditProject(project: ProjectEntry) {
    // Navigate to project details page for editing
    window.location.href = `/projects/${project.slug}`;
  }

  onProjectsUpdated(_updatedProjects: ProjectEntry[]) {
    // Reload from API to get fresh full list (the grid was initialized with [] so its emitted data is incomplete)
    this.projectService.getProjects().subscribe({
      next: (data) => this.projects.set(data),
      error: (err) => console.error('Failed to refresh projects after create:', err)
    });
  }

  onDeleteProject(project: ProjectEntry) {
    if (!project.id) return;

    if (!this.auth.isLoggedIn()) {
      this.toast.error('You must be logged in to delete projects. Please log in first');
      return;
    }

    this.projectService.deleteProject(project.id).subscribe({
      next: () => {
        this.projects.set(this.projects().filter(p => p.id !== project.id));
        console.log('Project deleted successfully');
      },
      error: (err) => {
        console.error('Failed to delete project:', err);
        if (err.status === 401) {
          this.toast.error('Authentication failed. Please log in again');
          this.auth.logout();
          window.location.href = '/login';
        } else {
          this.toast.error('Failed to delete project. Please try again');
        }
      }
    });
  }

  onEditExperience(experience: ExperienceEntry) {
    // Navigate to home page experiences section for editing
    window.location.href = '/#experiences';
  }

  onExperiencesUpdated(updatedExperiences: ExperienceEntry[]) {
    this.experiences.set(updatedExperiences);
    console.log('Experiences list updated:', this.experiences().length);
  }

  onDeleteExperience(experience: ExperienceEntry) {
    if (!experience.id) return;

    if (!this.auth.isLoggedIn()) {
      this.toast.error('You must be logged in to delete experiences. Please log in first');
      return;
    }

    this.profileService.deleteExperience(experience.id).subscribe({
      next: () => {
        this.experiences.set(this.experiences().filter(e => e.id !== experience.id));
        console.log('Experience deleted successfully');
      },
      error: (err) => {
        console.error('Failed to delete experience:', err);
        if (err.status === 401) {
          this.toast.error('Authentication failed. Please log in again');
          this.auth.logout();
          window.location.href = '/login';
        } else {
          this.toast.error('Failed to delete experience. Please try again');
        }
      }
    });
  }

  onEditClient(client: Client) {
    const newName = prompt('Edit client name:', client.name);
    if (newName && newName.trim() && client.id) {
      const updated = { ...client, name: newName.trim() };
      this.profileService.updateClient(client.id, updated).subscribe({
        next: () => {
          const currentClients = this.clients();
          const index = currentClients.findIndex(c => c.id === client.id);
          if (index !== -1) {
            currentClients[index] = updated;
            this.clients.set([...currentClients]);
          }
          console.log('Client updated successfully');
        },
        error: (err) => {
          console.error('Failed to update client:', err);
          this.toast.error('Failed to update client. Please try again');
        }
      });
    }
  }

  onClientsUpdated(updatedClients: Client[]) {
    this.clients.set(updatedClients);
    console.log('Clients list updated:', this.clients().length);
  }

  onDeleteClient(client: Client) {
    if (!client.id) return;

    if (!this.auth.isLoggedIn()) {
      this.toast.error('You must be logged in to delete clients. Please log in first');
      return;
    }

    this.profileService.deleteClient(client.id).subscribe({
      next: () => {
        this.clients.set(this.clients().filter(c => c.id !== client.id));
        console.log('Client deleted successfully');
      },
      error: (err) => {
        console.error('Failed to delete client:', err);
        if (err.status === 401) {
          this.toast.error('Authentication failed. Please log in again');
          this.auth.logout();
          window.location.href = '/login';
        } else {
          this.toast.error('Failed to delete client. Please try again');
        }
      }
    });
  }

  onEditTestimonial(testimonial: Testimonial) {
    const newContent = prompt('Edit testimonial content:', testimonial.content);
    if (newContent && newContent.trim() && testimonial.id) {
      const updated = { ...testimonial, content: newContent.trim() };
      this.profileService.updateTestimonial(testimonial.id, updated).subscribe({
        next: () => {
          const currentTestimonials = this.testimonials();
          const index = currentTestimonials.findIndex(t => t.id === testimonial.id);
          if (index !== -1) {
            currentTestimonials[index] = updated;
            this.testimonials.set([...currentTestimonials]);
          }
          console.log('Testimonial updated successfully');
        },
        error: (err) => {
          console.error('Failed to update testimonial:', err);
          this.toast.error('Failed to update testimonial. Please try again');
        }
      });
    }
  }

  onTestimonialsUpdated(updatedTestimonials: Testimonial[]) {
    this.testimonials.set(updatedTestimonials);
    console.log('Testimonials list updated:', this.testimonials().length);
  }

  onDeleteTestimonial(testimonial: Testimonial) {
    if (!testimonial.id) return;

    if (!this.auth.isLoggedIn()) {
      this.toast.error('You must be logged in to delete testimonials. Please log in first');
      return;
    }

    this.profileService.deleteTestimonial(testimonial.id).subscribe({
      next: () => {
        this.testimonials.set(this.testimonials().filter(t => t.id !== testimonial.id));
        console.log('Testimonial deleted successfully');
      },
      error: (err) => {
        console.error('Failed to delete testimonial:', err);
        if (err.status === 401) {
          this.toast.error('Authentication failed. Please log in again');
          this.auth.logout();
          window.location.href = '/login';
        } else {
          this.toast.error('Failed to delete testimonial. Please try again');
        }
      }
    });
  }

  getFullImageUrl(url: string): string {
    return this.imageUtils.getFullImageUrl(url);
  }

  getTitle(project: ProjectEntry | any): string {
    return this.translationService.isRTL() && project.title_Ar ? project.title_Ar : project.title;
  }

  getDescription(project: ProjectEntry | any): string {
    return this.translationService.isRTL() && project.description_Ar ? project.description_Ar : project.description;
  }
}
