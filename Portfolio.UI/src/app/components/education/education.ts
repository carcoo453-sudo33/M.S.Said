import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { EducationEntry, BioEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { LucideAngularModule } from 'lucide-angular';

// Section Components
import { EducationTimelineComponent } from './sections/education-timeline';
import { EducationSpecializationsComponent } from './sections/education-specializations';

// Shared Global Components
import { SharedPageHeaderComponent } from '../shared/page-header/page-header';
import { SharedFooterComponent } from '../shared/footer/footer';
import { SharedErrorStateComponent } from '../shared/error-state/error-state';
import { SharedEmptyStateComponent } from '../shared/empty-state/empty-state';
import { SharedSkeletonComponent } from '../shared/skeleton/skeleton';
import { SharedSignatureComponent } from '../shared/signature/signature';

@Component({
    selector: 'app-education',
    standalone: true,
    imports: [
        CommonModule,
        NavbarComponent,
        LucideAngularModule,
        EducationTimelineComponent,
        EducationSpecializationsComponent,
        SharedPageHeaderComponent,
        SharedFooterComponent,
        SharedErrorStateComponent,
        SharedEmptyStateComponent,
        SharedSkeletonComponent,
        SharedSignatureComponent
    ],
    templateUrl: './education.html'
})
export class EducationComponent implements OnInit {
    private profileService = inject(ProfileService);
    education: EducationEntry[] = [];
    bio: BioEntry | null = null;
    isLoading = true;
    hasError = false;

    ngOnInit() {
        this.profileService.getBio().subscribe(bio => this.bio = bio);
        this.profileService.getEducation().subscribe({
            next: (data) => {
                this.education = data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                this.hasError = true;
            }
        });
    }
}
