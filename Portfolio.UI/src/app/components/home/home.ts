import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { ProfileService } from '../../services/profile.service';
import { BioEntry, ServiceEntry, ProjectEntry, ExperienceEntry, SkillEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

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

    bio?: BioEntry;
    services: ServiceEntry[] = [];
    featuredProjects: ProjectEntry[] = [];
    experiences: ExperienceEntry[] = [];
    skills: SkillEntry[] = [];

    ngOnInit() {
        this.profileService.getBio().subscribe(data => this.bio = data);
        this.profileService.getServices().subscribe(data => this.services = data);
        this.profileService.getSkills().subscribe(data => this.skills = data);
        this.profileService.getExperiences().subscribe(data => {
            this.experiences = data.slice(0, 2);
        });
        this.projectService.getProjects().subscribe(data => {
            this.featuredProjects = data.slice(0, 4);
        });
    }
}
