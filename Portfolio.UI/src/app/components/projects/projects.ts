import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { ProjectEntry, ExperienceEntry, Testimonial, Client } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { LucideAngularModule } from 'lucide-angular';

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
    NavbarComponent,
    RouterLink,
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

  projects: ProjectEntry[] = [];
  experiences: ExperienceEntry[] = [];
  testimonials: Testimonial[] = [];
  clients: Client[] = [];
  isLoading = true;
  hasError = false;
  selectedFilter = 'All';

  filters = ['All', 'Full Stack', 'Angular', 'NET Core'];

  ngOnInit() {
    this.loadData();
    this.loadMockData();

    // Safety guard: Ensure skeleton doesn't hang forever
    setTimeout(() => {
      if (this.isLoading) {
        console.warn('Projects loading timed out. Clearing skeleton.');
        this.isLoading = false;
        // If we still have no projects, show error instead of empty if it was a real timeout
        if (this.projects.length === 0) {
          this.hasError = true;
        }
      }
    }, 8000);
  }

  loadData() {
    this.projectService.getProjects().subscribe({
      next: (data: ProjectEntry[]) => {
        this.projects = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      }
    });

    this.profileService.getExperiences().subscribe({
      next: (data) => this.experiences = data,
      error: (err) => console.error('Projects: Failed to load experiences', err)
    });
  }

  loadMockData() {
    this.clients = [
      { name: 'WE3DS', logoUrl: 'assets/brands/we3ds.png' },
      { name: 'CMS', logoUrl: 'assets/brands/cms.png' },
      { name: 'Google', logoUrl: 'assets/brands/google.png' },
      { name: 'Microsoft', logoUrl: 'assets/brands/microsoft.png' },
      { name: 'Amazon', logoUrl: 'assets/brands/amazon.png' },
    ];

    this.testimonials = [
      {
        name: 'Sarah Johnson',
        role: 'Senior Product Manager',
        company: 'TaskFlow',
        content: '"Mostafa is an exceptional developer who consistently delivers high-quality code. His ability to handle complex front-end challenges while maintaining meticulous attention to design detail is impressive. A true professional who adds immense value to any team."',
        avatarUrl: 'https://i.pravatar.cc/150?u=sarah'
      }
    ];
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  get filteredProjects() {
    if (this.selectedFilter === 'All') return this.projects;

    return this.projects.filter(p => {
      const tech = p.technologies?.toLowerCase() || '';
      const cat = p.category?.toLowerCase() || '';
      const filter = this.selectedFilter.toLowerCase();

      if (filter === 'full stack') return cat.includes('fullstack') || cat.includes('full-stack') || cat.includes('web');
      if (filter === 'angular') return tech.includes('angular');
      if (filter === 'net core') return tech.includes('.net') || tech.includes('core');

      return cat.includes(filter) || tech.includes(filter);
    });
  }
}
