import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { ProfileService } from '../../services/profile.service';
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
        SharedFooterComponent
    ],
    templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
    private projectService = inject(ProjectService);
    private profileService = inject(ProfileService);
    private toast = inject(ToastService);
    public translationService = inject(TranslationService);

    bio = signal<BioEntry | undefined>(undefined);
    services = signal<ServiceEntry[]>([]);
    featuredProjects = signal<ProjectEntry[]>([]);
    experiences = signal<ExperienceEntry[]>([]);
    skills = signal<SkillEntry[]>([]);

    ngOnInit() {
        this.profileService.getBio().subscribe({
            next: data => {
                this.bio.set(data);
                console.log('HomeComponent: Bio loaded', data);
            },
            error: err => {
                console.error('HomeComponent: Failed to load bio', err);
                this.toast.error('Failed to load profile data. Please check your connection.');
            }
        });
        
        this.profileService.getServices().subscribe({
            next: data => this.services.set(data),
            error: err => console.error('HomeComponent: Failed to load services', err)
        });
        
        this.profileService.getSkills().subscribe({
            next: data => this.skills.set(data),
            error: err => console.error('HomeComponent: Failed to load skills', err)
        });
        
        this.profileService.getExperiences().subscribe({
            next: data => this.experiences.set(data.slice(0, 2)),
            error: err => console.error('HomeComponent: Failed to load experiences', err)
        });
        
        this.projectService.getFeaturedProjects().subscribe({
            next: data => this.featuredProjects.set(data),
            error: err => console.error('HomeComponent: Failed to load featured projects', err)
        });
    }
}
