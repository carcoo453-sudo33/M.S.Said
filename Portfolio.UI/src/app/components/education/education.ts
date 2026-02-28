import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { EducationEntry, BioEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { LucideAngularModule } from 'lucide-angular';
import { TranslationService } from '../../services/translation.service';

// Section Components
import { EducationTimelineComponent } from './sections/education-timeline';
import { EducationSpecializationsComponent } from './sections/education-specializations';

// Skeleton Components
import { EducationSpecializationsSkeletonComponent } from './sections/education-specializations-skeleton';

// Shared Global Components
import { SharedPageHeaderComponent } from '../shared/page-header/page-header';
import { SharedFooterComponent } from '../shared/footer/footer';
import { SharedErrorStateComponent } from '../shared/error-state/error-state';
import { SharedEmptyStateComponent } from '../shared/empty-state/empty-state';
import { SharedSignatureComponent } from '../shared/signature/signature';

@Component({
    selector: 'app-education',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        RouterLink,
        NavbarComponent,
        LucideAngularModule,
        EducationTimelineComponent,
        EducationSpecializationsComponent,
        EducationSpecializationsSkeletonComponent,
        SharedPageHeaderComponent,
        SharedFooterComponent,
        SharedErrorStateComponent,
        SharedEmptyStateComponent,
        SharedSignatureComponent
    ],
    templateUrl: './education.html'
})
export class EducationComponent implements OnInit {
    private profileService = inject(ProfileService);
    private router = inject(Router);
    public translationService = inject(TranslationService);
    allEducation = signal<EducationEntry[]>([]);
    bio = signal<BioEntry | null>(null);
    isLoading = signal(true);
    hasError = signal(false);

    // Filtered lists
    get educationList(): EducationEntry[] {
        return this.allEducation().filter(e => e.category === 'Education');
    }

    get trainingList(): EducationEntry[] {
        return this.allEducation().filter(e => e.category === 'Training');
    }

    get certificationList(): EducationEntry[] {
        return this.allEducation().filter(e => e.category === 'Certification');
    }

    get achievementList(): EducationEntry[] {
        return this.allEducation().filter(e => e.category === 'Achievement');
    }

    get trainingStartIndex(): number {
        return this.educationList.length;
    }

    get certificationStartIndex(): number {
        return this.educationList.length + (this.trainingList.length > 0 ? 1 : 0);
    }

    get achievementStartIndex(): number {
        return this.educationList.length + (this.trainingList.length > 0 ? 1 : 0) + (this.certificationList.length > 0 ? 1 : 0);
    }

    ngOnInit() {
        this.profileService.getBio().subscribe({
            next: (bio) => this.bio.set(bio),
            error: (err) => console.error('Education: Failed to load bio', err)
        });
        this.loadEducation();
    }

    loadEducation() {
        this.isLoading.set(true);
        this.hasError.set(false);
        this.profileService.getEducation().subscribe({
            next: (data) => {
                const categoryOrder: Record<string, number> = { 'Education': 1, 'Training': 2, 'Certification': 3, 'Achievement': 4 };
                this.allEducation.set(data.sort((a, b) =>
                    (categoryOrder[a.category] || 999) - (categoryOrder[b.category] || 999)
                ));
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Education: Failed to load education entries', err);
                this.isLoading.set(false);
                this.hasError.set(true);
            }
        });
    }

    onEducationUpdated(event: any) {
        // Re-load the full guaranteed list from the backend to prevent array destructuring bugs
        // when moving items between categories in the edit modal
        this.loadEducation();
    }

    onBioUpdated(updatedBio: BioEntry) {
        this.bio.set(updatedBio);
    }

    navigateToList(category: string) {
        this.router.navigate(['/education', category]);
    }
}
