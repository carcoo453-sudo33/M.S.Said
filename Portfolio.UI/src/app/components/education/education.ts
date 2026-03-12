import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { EducationService } from '../../services/education.service';
import { HomeService } from '../../services/home.service';
import { AuthService } from '../../services/auth.service';
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
    private readonly educationService = inject(EducationService);
    private readonly homeService = inject(HomeService);
    private readonly router = inject(Router);
    public readonly auth = inject(AuthService);
    public readonly translationService = inject(TranslationService);
    private readonly translate = inject(TranslateService);
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);
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
        this.homeService.getBio().subscribe({
            next: (bio) => this.bio.set(bio),
            error: (err: any) => console.error('Education: Failed to load bio', err)
        });
        this.loadEducation();
        this.updateSeoTags();
    }

    private updateSeoTags() {
        const isAr = this.translationService.isRTL();
        const title = isAr ? 'التعليم والخبرة الأكاديمية | Dev.M.Said' : 'Education & Academic Specialization | Dev.M.Said';
        const description = isAr 
            ? 'اكتشف الرحلة الأكاديمية والشهادات والتدريب التقني لـ مصطفى صادق. تخصص في هندسة البرمجيات والأنظمة الموزعة.'
            : 'Explore the academic journey, certifications, and technical training of Mostafa Said. Specializing in Software Engineering and Distributed Systems.';

        this.titleService.setTitle(title);
        this.metaService.updateTag({ name: 'description', content: description });

        // OpenGraph
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: description });
        this.metaService.updateTag({ property: 'og:type', content: 'website' });
        this.metaService.updateTag({ property: 'og:url', content: window.location.href });

        // Twitter
        this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.metaService.updateTag({ name: 'twitter:title', content: title });
        this.metaService.updateTag({ name: 'twitter:description', content: description });

        // Canonical
        let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', window.location.href);
    }

    loadEducation() {
        this.isLoading.set(true);
        this.hasError.set(false);
        this.educationService.getEducation().subscribe({
            next: (data: any) => {
                const categoryOrder: Record<string, number> = { 'Education': 1, 'Training': 2, 'Certification': 3, 'Achievement': 4 };
                this.allEducation.set(data.sort((a: any, b: any) =>
                    (categoryOrder[a.category] || 999) - (categoryOrder[b.category] || 999)
                ));
                this.isLoading.set(false);
            },
            error: (err: any) => {
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
