import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { HomeService } from '../../services/home.service';
import { ProjectsPageService } from '../../services/projects-page.service';
import { BioEntry, ServiceEntry, ProjectEntry, ExperienceEntry, SkillEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../services/toast.service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../services/translation.service';

// Section Components
import { HomeSidebarProfileComponent } from './sections/home-sidebar-profile';
import { HomeBriefBioComponent } from './sections/home-brief-bio';
import { HomeServicesComponent } from './sections/home-services';
import { HomeTechStackComponent } from './sections/home-tech-stack';
import { HomeFeaturedProjectsComponent } from './sections/home-featured-projects';
import { HomeTimelineComponent } from './sections/home-timeline';
import { HomeFinalCTAComponent } from './sections/home-final-cta';

// Skeleton Components
import { HomeSidebarProfileSkeletonComponent } from './sections/home-sidebar-profile-skeleton';
import { HomeBriefBioSkeletonComponent } from './sections/home-brief-bio-skeleton';
import { HomeServicesSkeletonComponent } from './sections/home-services-skeleton';
import { HomeTechStackSkeletonComponent } from './sections/home-tech-stack-skeleton';
import { HomeFeaturedProjectsSkeletonComponent } from './sections/home-featured-projects-skeleton';
import { HomeTimelineSkeletonComponent } from './sections/home-timeline-skeleton';
import { HomeFinalCTASkeletonComponent } from './sections/home-final-cta-skeleton';

// Shared Global Components
import { SharedFooterComponent } from '../shared/footer/footer';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        NavbarComponent,
        LucideAngularModule,
        TranslateModule,
        HomeSidebarProfileComponent,
        HomeBriefBioComponent,
        HomeServicesComponent,
        HomeTechStackComponent,
        HomeFeaturedProjectsComponent,
        HomeTimelineComponent,
        HomeFinalCTAComponent,
        HomeSidebarProfileSkeletonComponent,
        HomeBriefBioSkeletonComponent,
        HomeServicesSkeletonComponent,
        HomeTechStackSkeletonComponent,
        HomeFeaturedProjectsSkeletonComponent,
        HomeTimelineSkeletonComponent,
        HomeFinalCTASkeletonComponent,
        SharedFooterComponent
    ],
    templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
    private readonly projectService = inject(ProjectService);
    private readonly homeService = inject(HomeService);
    private readonly projectsPageService = inject(ProjectsPageService);
    private readonly toast = inject(ToastService);
    public readonly translationService = inject(TranslationService);

    bio = signal<BioEntry | undefined>(undefined);
    services = signal<ServiceEntry[]>([]);
    featuredProjects = signal<ProjectEntry[]>([]);
    experiences = signal<ExperienceEntry[]>([]);
    skills = signal<SkillEntry[]>([]);

    ngOnInit() {
        // Load bio data
        this.homeService.getBio().subscribe({
            next: (data: any) => {
                if (data) {
                    this.bio.set(data);
                    console.log('✅ Bio loaded successfully:', data);
                } else {
                    console.log('⚠️ No bio data found - user needs to create profile');
                }
            },
            error: (err: any) => {
                console.error('❌ Failed to load bio:', err);
                // Toast is shown by error interceptor
            }
        });
        
        // Load services data
        this.homeService.getServices().subscribe({
            next: (data: any) => {
                this.services.set(data);
                console.log('✅ Services loaded successfully');
            },
            error: (err: any) => {
                console.error('❌ Failed to load services:', err);
                // Toast is shown by error interceptor
            }
        });
        
        // Load skills data
        this.homeService.getSkills().subscribe({
            next: (data: any) => {
                this.skills.set(data);
                console.log('✅ Skills loaded successfully');
            },
            error: (err: any) => {
                console.error('❌ Failed to load skills:', err);
                // Toast is shown by error interceptor
            }
        });
        
        // Load experiences data
        this.projectsPageService.getExperiences().subscribe({
            next: (data: any) => {
                this.experiences.set(data.slice(0, 2));
                console.log('✅ Experiences loaded successfully');
            },
            error: (err: any) => {
                console.error('❌ Failed to load experiences:', err);
                // Toast is shown by error interceptor
            }
        });
        
        // Load featured projects
        this.projectsPageService.getFeaturedProjects().subscribe({
            next: (data: any) => {
                this.featuredProjects.set(data);
                console.log('✅ Featured projects loaded successfully');
            },
            error: (err: any) => {
                console.error('❌ Failed to load featured projects:', err);
                // Toast is shown by error interceptor
            }
        });
    }
}
