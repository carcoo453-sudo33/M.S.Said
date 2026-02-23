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
    allEducation: EducationEntry[] = [];
    bio: BioEntry | null = null;
    isLoading = true;
    hasError = false;

    ngOnInit() {
        this.profileService.getBio().subscribe({
            next: (bio) => this.bio = bio,
            error: (err) => console.error('Education: Failed to load bio', err)
        });
        this.loadEducation();
    }

    loadEducation() {
        this.isLoading = true;
        this.hasError = false;
        this.profileService.getEducation().subscribe({
            next: (data) => {
                const categoryOrder: Record<string, number> = { 'Education': 1, 'Training': 2, 'Certification': 3 };
                this.allEducation = data.sort((a, b) => 
                    (categoryOrder[a.category] || 999) - (categoryOrder[b.category] || 999)
                );
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Education: Failed to load education entries', err);
                this.isLoading = false;
                this.hasError = true;
            }
        });
    }

    onEducationUpdated(updatedEducation: EducationEntry[]) {
        const categoryOrder: Record<string, number> = { 'Education': 1, 'Training': 2, 'Certification': 3 };
        this.allEducation = updatedEducation.sort((a, b) => 
            (categoryOrder[a.category] || 999) - (categoryOrder[b.category] || 999)
        );
    }
}
