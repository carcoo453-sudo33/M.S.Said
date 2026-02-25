import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../services/profile.service';
import { EducationEntry, BioEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { LucideAngularModule } from 'lucide-angular';
import { TranslationService } from '../../services/translation.service';

// Section Components
import { EducationTimelineComponent } from './sections/education-timeline';
import { EducationSpecializationsComponent } from './sections/education-specializations';

// Skeleton Components
import { EducationTimelineSkeletonComponent } from './sections/education-timeline-skeleton';
import { EducationSpecializationsSkeletonComponent } from './sections/education-specializations-skeleton';

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
        TranslateModule,
        NavbarComponent,
        LucideAngularModule,
        EducationTimelineComponent,
        EducationSpecializationsComponent,
        EducationTimelineSkeletonComponent,
        EducationSpecializationsSkeletonComponent,
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
    public translationService = inject(TranslationService);
    allEducation = signal<EducationEntry[]>([]);
    bio = signal<BioEntry | null>(null);
    isLoading = signal(true);
    hasError = signal(false);

    // Toggle states
    showEducation = signal(false);
    showTraining = signal(false);
    showCertification = signal(false);
    showAchievement = signal(false);

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

    toggleSection(section: 'education' | 'training' | 'certification' | 'achievement') {
        switch(section) {
            case 'education':
                this.showEducation.set(!this.showEducation());
                break;
            case 'training':
                this.showTraining.set(!this.showTraining());
                break;
            case 'certification':
                this.showCertification.set(!this.showCertification());
                break;
            case 'achievement':
                this.showAchievement.set(!this.showAchievement());
                break;
        }
    }

    onEducationUpdated(updatedEducation: EducationEntry[]) {
        const categoryOrder: Record<string, number> = { 'Education': 1, 'Training': 2, 'Certification': 3, 'Achievement': 4 };
        this.allEducation.set(updatedEducation.sort((a, b) => 
            (categoryOrder[a.category] || 999) - (categoryOrder[b.category] || 999)
        ));
    }

    onBioUpdated(updatedBio: BioEntry) {
        this.bio.set(updatedBio);
    }
}
