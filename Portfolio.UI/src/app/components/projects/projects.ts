import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectService } from '../../services/project.service';
import { ProjectEntry, ExperienceEntry, Testimonial, Client } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { TranslationService } from '../../services/translation.service';

// Section Components
// Section Components
import { ProjectsHeaderComponent } from './sections/projects-header';
import { ProjectsGridComponent } from './sections/projects-grid';
import { ProjectsWorkHistoryComponent } from './sections/projects-work-history';
import { ProjectsBrandSliderComponent } from './sections/projects-brand-slider';
import { ProjectsReferencesComponent } from './sections/projects-references';
import { ProjectsBottomCTAComponent } from './sections/projects-bottom-cta';

// Shared Global Components
import { SharedFooterComponent } from '../shared/footer/footer';
import { SharedErrorStateComponent } from '../shared/error-state/error-state';
import { SharedEmptyStateComponent } from '../shared/empty-state/empty-state';
import { SharedSkeletonComponent } from '../shared/skeleton/skeleton';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NavbarComponent,
    LucideAngularModule,
    ProjectsHeaderComponent,
    ProjectsGridComponent,
    ProjectsWorkHistoryComponent,
    ProjectsBrandSliderComponent,
    ProjectsReferencesComponent,
    ProjectsBottomCTAComponent,
    SharedFooterComponent,
    SharedErrorStateComponent,
    SharedEmptyStateComponent,
    SharedSkeletonComponent
  ],
  templateUrl: './projects.html'
})
export class ProjectsComponent implements OnInit {
  private projectService = inject(ProjectService);
  private profileService = inject(ProfileService);
  public auth = inject(AuthService);
  public translationService = inject(TranslationService);

  projects = signal<ProjectEntry[]>([]);
  experiences = signal<ExperienceEntry[]>([]);
  testimonials = signal<Testimonial[]>([]);
  clients = signal<Client[]>([]);
  totalProjectCount = signal(0);
  isLoading = signal(true);
  hasError = signal(false);
  selectedFilter = signal('All');
  triggerCreateProject = signal(false);

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
    // Load featured projects (Latest, Most Viewed, Trending)
    this.projectService.getFeaturedProjects().subscribe({
      next: (data: ProjectEntry[]) => {
        console.log('Featured projects loaded:', data.length);
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
    if (this.selectedFilter() === 'All') return this.projects();

    return this.projects().filter(p => {
      const tech = p.technologies?.toLowerCase() || '';
      const cat = p.category?.toLowerCase() || '';
      const filter = this.selectedFilter().toLowerCase();

      if (filter === 'full stack') return cat.includes('fullstack') || cat.includes('full-stack') || cat.includes('web');
      if (filter === 'angular') return tech.includes('angular');
      if (filter === 'net core') return tech.includes('.net') || tech.includes('core');

      return cat.includes(filter) || tech.includes(filter);
    });
  }

  onEditProject(project: ProjectEntry) {
    // Navigate to project details page for editing
    window.location.href = `/projects/${project.slug}`;
  }

  onProjectsUpdated(updatedProjects: ProjectEntry[]) {
    this.projects.set(updatedProjects);
    console.log('Projects list updated:', this.projects().length);
  }

  onDeleteProject(project: ProjectEntry) {
    if (!project.id) return;
    
    if (!this.auth.isLoggedIn()) {
      alert('You must be logged in to delete projects. Please log in first.');
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
          alert('Authentication failed. Please log in again.');
          this.auth.logout();
          window.location.href = '/login';
        } else {
          alert('Failed to delete project. Please try again.');
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
      alert('You must be logged in to delete experiences. Please log in first.');
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
          alert('Authentication failed. Please log in again.');
          this.auth.logout();
          window.location.href = '/login';
        } else {
          alert('Failed to delete experience. Please try again.');
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
          alert('Failed to update client. Please try again.');
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
      alert('You must be logged in to delete clients. Please log in first.');
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
          alert('Authentication failed. Please log in again.');
          this.auth.logout();
          window.location.href = '/login';
        } else {
          alert('Failed to delete client. Please try again.');
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
          alert('Failed to update testimonial. Please try again.');
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
      alert('You must be logged in to delete testimonials. Please log in first.');
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
          alert('Authentication failed. Please log in again.');
          this.auth.logout();
          window.location.href = '/login';
        } else {
          alert('Failed to delete testimonial. Please try again.');
        }
      }
    });
  }
}
