import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { ProfileService } from '../../services/profile.service';
import { BioEntry, ServiceEntry, ProjectEntry, ExperienceEntry, SkillEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../services/toast.service';

// Section Components
import { HomeHeroComponent } from './sections/home-hero';
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
        RouterLink,
        LucideAngularModule,
        HomeHeroComponent,
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

    bio?: BioEntry;
    services: ServiceEntry[] = [];
    featuredProjects: ProjectEntry[] = [];
    experiences: ExperienceEntry[] = [];
    skills: SkillEntry[] = [];

    ngOnInit() {
        this.profileService.getBio().subscribe({
            next: data => {
                this.bio = data;
                console.log('HomeComponent: Bio loaded', data);
            },
            error: err => {
                console.error('HomeComponent: Failed to load bio', err);
                this.toast.error('Failed to load profile data. Please check your connection.');
            }
        });
        
        this.profileService.getServices().subscribe({
            next: data => this.services = data,
            error: err => console.error('HomeComponent: Failed to load services', err)
        });
        
        this.profileService.getSkills().subscribe({
            next: data => this.skills = data,
            error: err => console.error('HomeComponent: Failed to load skills', err)
        });
        
        this.profileService.getExperiences().subscribe({
            next: data => this.experiences = data.slice(0, 2),
            error: err => console.error('HomeComponent: Failed to load experiences', err)
        });
        
        this.projectService.getFeaturedProjects().subscribe({
            next: data => this.featuredProjects = data,
            error: err => console.error('HomeComponent: Failed to load featured projects', err)
        });
    }
}
