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
    this.profileService.getBio().subscribe(bio => this.bio = bio);
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
      summary: project.summary || 'A scalable, headless solution built for high-performance brands, featuring real-time 3D product rendering and integrated digital payments.',
      gallery: project.gallery || [project.imageUrl || '', project.imageUrl || '', project.imageUrl || ''],
      duration: project.duration || '4 Months',
      language: project.language || 'TypeScript',
      architecture: project.architecture || 'Microservices',
      status: project.status || 'Completed and Stable',
      keyFeatures: project.keyFeatures || [
        { icon: 'Layers', title: 'REAL-TIME INVENTORY', description: 'WebSockets implementation for live stock updates across multiple global nodes.' },
        { icon: 'Rocket', title: 'SECURE TRANSACTIONS', description: 'Integrated multi-currency payment gateways with advanced encryption protocols.' },
        { icon: 'Monitor', title: '3D MODEL VIEWER', description: 'Three.js viewer allowing customers to inspect architectural details in 360 degrees.' },
        { icon: 'Code', title: 'PERFORMANCE ENGINE', description: 'Optimized static generation achieving sub-second load times across devices.' }
      ],
      changelog: project.changelog || [
        { date: 'MAR 2023', version: 'v1.2', title: 'Interface Update', description: 'Refined dark mode aesthetics and accessibility compliance.' },
        { date: 'FEB 2023', version: 'v1.1', title: 'Core Optimization', description: 'Reduced server asset payload by 75% through advanced compression.' }
      ],
      responsibilities: project.responsibilities || [
        'System Architecture: Engineered a scalable cloud infrastructure to handle high-concurrency event-driven drops.',
        'Security Framework: Developed a custom authentication layer using state-of-the-art token management.'
      ],
      metrics: project.metrics || [
        { label: 'Total Commits', value: '452' },
        { label: 'Development Time', value: '120h' },
        { label: 'Status', value: 'DEPLOYED' }
      ],
      relatedProjects: [
        { title: 'FINTECH DASHBOARD', techStack: 'VUE, FIREBASE', imageUrl: 'assets/projects/fintech.jpg' },
        { title: 'VAULT SECURE', techStack: 'REACT, RUST', imageUrl: 'assets/projects/vault.jpg' }
      ],
      comments: project.comments || [
        { id: '1', author: 'JOHN DOE', date: '2 days ago', avatarUrl: 'https://i.pravatar.cc/150?u=john', content: 'The 3D model integration is exceptionally smooth. Did you use any specific optimization techniques for the GLTF assets?', likes: 4 }
      ],
      reactionsCount: project.reactionsCount || 124
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
