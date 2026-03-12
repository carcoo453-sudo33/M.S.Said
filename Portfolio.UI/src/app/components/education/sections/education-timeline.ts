import { Component, Input, Output, EventEmitter, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, GraduationCap, MapPin, Pencil } from 'lucide-angular';
import { forkJoin } from 'rxjs';
import { EducationEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { EducationService } from '../../../services/education.service';
import { ToastService } from '../../../services/toast.service';
import { TranslationService } from '../../../services/translation.service';
import { TranslationUtil, ImageUtil } from '../../../utils';
import { EducationTimelineModalComponent } from './education-timeline-modal';
import { EducationTimelineLightboxComponent } from './education-timeline-lightbox';

@Component({
    selector: 'app-education-timeline',
    standalone: true,
    imports: [CommonModule, TranslateModule, LucideAngularModule, EducationTimelineModalComponent, EducationTimelineLightboxComponent],
    template: `
    <div class="relative">
        <!-- Edit Button -->
        <div class="flex items-center justify-end mb-8" *ngIf="auth.isLoggedIn()">
            <button (click)="openEditModal()"
                class="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-600 text-zinc-600 dark:text-zinc-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
                Manage {{ sectionCategory }}
            </button>
        </div>

        <div class="space-y-12 relative before:absolute before:top-0 before:bottom-0 before:ltr:left-1/2 before:rtl:right-1/2 before:ltr:-translate-x-1/2 before:rtl:translate-x-1/2 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-zinc-200 before:via-zinc-300 before:to-zinc-200 dark:before:from-zinc-800 dark:before:via-zinc-700 dark:before:to-zinc-800"
             [class.before:hidden]="continuousMode">
             
            <!-- Empty State Headline -->
            <div *ngIf="displayEducation().length === 0 && sectionTitle" class="w-full text-center py-8 relative z-10">
                <div class="inline-block bg-white dark:bg-zinc-950 px-8 py-6 rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 shadow-sm relative z-20">
                    <h2 class="text-2xl font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 drop-shadow-sm">{{ sectionTitle }}</h2>
                    <p class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 mt-2 uppercase">{{ 'education.emptyDesc' | translate }}</p>
                </div>
            </div>

            <div *ngFor="let item of displayEducation(); let i = index"
                class="relative flex items-center justify-between group animate-fade-in-up"
                [class.flex-row-reverse]="(i + layoutStartIndex) % 2 !== 0"
                [style.animation-delay]="(0.1 * i) + 's'">

                <!-- Connector Icon -->
                <div
                    class="absolute top-1/2 ltr:left-1/2 rtl:right-1/2 -translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 z-20 flex items-center justify-center w-14 h-14 rounded-xl border-4 bg-white dark:bg-zinc-950 transition-all duration-500 shadow-2xl"
                    [ngClass]="{
                        'border-indigo-600 shadow-indigo-500/40 group-hover:shadow-indigo-500/70 group-hover:scale-110': item.category === 'Education',
                        'border-emerald-600 shadow-emerald-500/40 group-hover:shadow-emerald-500/70 group-hover:scale-110': item.category === 'Training',
                        'border-violet-600 shadow-violet-500/40 group-hover:shadow-violet-500/70 group-hover:scale-110': item.category === 'Certification',
                        'border-amber-600 shadow-amber-500/40 group-hover:shadow-amber-500/70 group-hover:scale-110': item.category === 'Achievement'
                    }">
                    <div class="flex items-center justify-center w-full h-full rounded-xl transition-all duration-500"
                        [ngClass]="{
                            'text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white': item.category === 'Education',
                            'text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white': item.category === 'Training',
                            'text-violet-600 group-hover:bg-violet-600 group-hover:text-white': item.category === 'Certification',
                            'text-amber-600 group-hover:bg-amber-600 group-hover:text-white': item.category === 'Achievement'
                        }">
                        <img *ngIf="item.category === 'Education'" src="/education/education.png" class="w-8 h-8 object-contain">
                        <img *ngIf="item.category === 'Training'" src="/education/Training.png" class="w-8 h-8 object-contain">
                        <img *ngIf="item.category === 'Certification'" src="/education/Certification.png" class="w-8 h-8 object-contain">
                        <img *ngIf="item.category === 'Achievement'" src="/education/Acheivements.png" class="w-8 h-8 object-contain">
                    </div>
                </div>

                <!-- Details Container -->
                <div class="w-[calc(50%-3.5rem)] flex flex-col justify-center">
                    
                    <!-- Section Headline -->
                    <div *ngIf="i === 0 && sectionTitle" class="mb-6 relative z-10" [ngClass]="{ 'text-end': (i + layoutStartIndex) % 2 !== 0 }">
                        <h2 class="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-white drop-shadow-sm">{{ sectionTitle }}</h2>
                        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm" [ngClass]="{ 'ms-auto': (i + layoutStartIndex) % 2 !== 0 }">{{ sectionDesc }}</p>
                    </div>

                    <!-- Details Card -->
                    <div
                        class="bg-white/90 dark:bg-zinc-900/70 p-6 rounded-xl border-2 transition-all duration-500 backdrop-blur-xl relative hover:shadow-2xl"
                        [ngClass]="{
                            'border-indigo-500/30 group-hover:border-indigo-500/60 group-hover:shadow-indigo-500/20': item.category === 'Education',
                            'border-emerald-500/30 group-hover:border-emerald-500/60 group-hover:shadow-emerald-500/20': item.category === 'Training',
                            'border-violet-500/30 group-hover:border-violet-500/60 group-hover:shadow-violet-500/20': item.category === 'Certification',
                            'border-amber-500/30 group-hover:border-amber-500/60 group-hover:shadow-amber-500/20': item.category === 'Achievement'
                        }">
                        
                        <!-- Category Badge -->
                        <div class="flex items-center gap-2 mb-3 flex-wrap">
                            <span
                                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-bold tracking-widest uppercase border-2 shadow-sm"
                                [ngClass]="{
                                    'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-500/40': item.category === 'Education',
                                    'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-500/40': item.category === 'Training',
                                    'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border-violet-500/40': item.category === 'Certification',
                                    'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-500/40': item.category === 'Achievement'
                                }">
                                <img *ngIf="item.category === 'Education'" src="/education/education.png" class="w-3.5 h-3.5 object-contain">
                                <img *ngIf="item.category === 'Training'" src="/education/Training.png" class="w-3.5 h-3.5 object-contain">
                                <img *ngIf="item.category === 'Certification'" src="/education/Certification.png" class="w-3.5 h-3.5 object-contain">
                                <img *ngIf="item.category === 'Achievement'" src="/education/Acheivements.png" class="w-3.5 h-3.5 object-contain">
                                {{ item.category }}
                            </span>
                            <span
                                class="inline-block bg-red-50 dark:bg-red-950/30 px-3 py-1 rounded-lg text-red-700 dark:text-red-400 text-[9px] font-bold tracking-widest uppercase border-2 border-red-500/40 shadow-sm">
                                {{ item.duration }}
                            </span>
                        </div>

                        <h3 class="text-base font-black mb-2 uppercase tracking-tight leading-tight dark:text-white text-zinc-900">
                            {{ getDegree(item) }}</h3>
                        <p class="text-[10px] font-bold uppercase tracking-wide text-zinc-400 mb-3">{{ getInstitution(item) }}</p>
                        <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-3" *ngIf="item.description">"{{ getDescription(item) }}"</p>
                        <div class="flex items-center gap-2 text-zinc-400 transition-colors"
                            [ngClass]="{
                                'group-hover:text-indigo-600 dark:group-hover:text-indigo-400': item.category === 'Education',
                                'group-hover:text-emerald-600 dark:group-hover:text-emerald-400': item.category === 'Training',
                                'group-hover:text-violet-600 dark:group-hover:text-violet-400': item.category === 'Certification',
                                'group-hover:text-amber-600 dark:group-hover:text-amber-400': item.category === 'Achievement'
                            }">
                            <lucide-icon [img]="MapPinIcon" class="w-3 h-3"></lucide-icon>
                            <span class="text-[10px] uppercase tracking-wide font-bold">{{ getLocation(item) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Image Container -->
                <div class="w-[calc(50%-3.5rem)] flex flex-col justify-center">
                    
                    <!-- Image Card -->
                    <div class="bg-white/90 dark:bg-zinc-900/70 rounded-xl border-2 transition-all duration-500 backdrop-blur-xl relative hover:shadow-2xl overflow-hidden cursor-pointer"
                        (click)="openLightbox(item.imageUrl || getDefaultImage(item.category))"
                        [ngClass]="{
                            'border-indigo-500/30 group-hover:border-indigo-500/60 group-hover:shadow-indigo-500/20': item.category === 'Education',
                            'border-emerald-500/30 group-hover:border-emerald-500/60 group-hover:shadow-emerald-500/20': item.category === 'Training',
                            'border-violet-500/30 group-hover:border-violet-500/60 group-hover:shadow-violet-500/20': item.category === 'Certification',
                            'border-amber-500/30 group-hover:border-amber-500/60 group-hover:shadow-amber-500/20': item.category === 'Achievement'
                        }">
                        <!-- Image if available -->
                        <div *ngIf="item.imageUrl" class="aspect-video w-full">
                            <img [src]="getImageUrl(item.imageUrl)" [alt]="item.institution"
                                class="w-full h-full object-cover object-center">
                        </div>
                        <!-- Placeholder if no image -->
                        <div *ngIf="!item.imageUrl" class="aspect-video w-full flex items-center justify-center bg-gradient-to-br"
                            [ngClass]="{
                                'from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30': item.category === 'Education',
                                'from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30': item.category === 'Training',
                                'from-violet-50 to-violet-100 dark:from-violet-950/30 dark:to-violet-900/30': item.category === 'Certification',
                                'from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30': item.category === 'Achievement'
                            }">
                            <div class="text-center p-6">
                                <img *ngIf="item.category === 'Education'" src="/education/education.png" class="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto mb-3 opacity-60 transition-transform group-hover:scale-110">
                                <img *ngIf="item.category === 'Training'" src="/education/Training.png" class="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto mb-3 opacity-60 transition-transform group-hover:scale-110">
                                <img *ngIf="item.category === 'Certification'" src="/education/Certification.png" class="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto mb-3 opacity-60 transition-transform group-hover:scale-110">
                                <img *ngIf="item.category === 'Achievement'" src="/education/Acheivements.png" class="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto mb-3 opacity-60 transition-transform group-hover:scale-110">
                                <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">View Image</p>
                            </div>
                        </div>
                    </div>

                    <!-- View List Button -->
                    <div *ngIf="i === 0 && hasViewListBtn" class="mt-6 flex justify-start items-center" [ngClass]="{ 'justify-end': (i + layoutStartIndex) % 2 !== 0 }">
                        <button (click)="viewListClicked.emit()"
                            class="px-8 py-3 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-600/20 hover:border-red-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                            {{ viewListText }}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <!-- Lightbox Modal Component -->
    <app-education-timeline-lightbox
        [isOpen]="showLightbox"
        [images]="getAllEducationImages()"
        [currentIndex]="currentLightboxIndex"
        (closed)="closeLightbox()"
        (indexChanged)="currentLightboxIndex = $event">
    </app-education-timeline-lightbox>

    <!-- Modal Component -->
    <app-education-timeline-modal
        [isOpen]="showEditModal"
        [education]="education"
        [isSaving]="isSaving"
        [isDeleting]="isDeleting"
        (closed)="closeEditModal()"
        (saved)="saveEducation($event)"
        (deleted)="deleteEducation($event)">
    </app-education-timeline-modal>
  `
})


export class EducationTimelineComponent implements OnDestroy {
    public readonly auth = inject(AuthService);
    private readonly educationService = inject(EducationService);
    private readonly toast = inject(ToastService);
    private readonly translationService = inject(TranslationService);

    @Input() sectionCategory: 'Education' | 'Training' | 'Certification' | 'Achievement' = 'Education';
    @Input() sectionTitle?: string;
    @Input() sectionDesc?: string;
    @Input() hasViewListBtn = false;
    @Input() viewListText = 'View List';
    @Output() viewListClicked = new EventEmitter<void>();
    @Input() limitItems?: number;
    @Input() layoutStartIndex: number = 0;
    @Input() continuousMode = false;
    @Input() allEducation: EducationEntry[] = [];

    displayEducation(): EducationEntry[] {
        if (!this.education) return [];
        return this.limitItems ? this.education.slice(0, this.limitItems) : this.education;
    }

    @Input() set education(value: EducationEntry[]) {
        this._education = value;
        if (value && value.length > 0) {
            console.log('=== EDUCATION DATA RECEIVED ===');
            console.log('First entry:', value[0]);
            console.log('Arabic fields:', {
                institution_Ar: value[0]?.institution_Ar,
                degree_Ar: value[0]?.degree_Ar,
                description_Ar: value[0]?.description_Ar,
                location_Ar: value[0]?.location_Ar
            });
            console.log('isRTL:', this.translationService.isRTL());
            console.log('=== END ===');
        }
    }
    get education(): EducationEntry[] {
        // If allEducation is provided, filter by category; otherwise use the direct education input
        if (this.allEducation && this.allEducation.length > 0) {
            return this.allEducation.filter(e => e.category === this.sectionCategory);
        }
        return this._education;
    }
    private _education: EducationEntry[] = [];

    @Output() educationUpdated = new EventEmitter<EducationEntry[]>();

    GraduationCapIcon = GraduationCap;
    MapPinIcon = MapPin;
    EditIcon = Pencil;

    showEditModal = false;
    isSaving = false;
    isDeleting = false;

    // Lightbox state
    showLightbox = false;
    currentLightboxIndex = 0;

    openEditModal() {
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
    }

    deleteEducation(educationId: string) {
        this.isDeleting = true;
        this.educationService.deleteEducation(educationId).subscribe({
            next: () => {
                this.education = this.education.filter(e => e.id !== educationId);
                this.educationUpdated.emit(this.education);
                this.isDeleting = false;
                this.toast.success('Education entry deleted successfully');
            },
            error: (err) => {
                this.isDeleting = false;
                this.toast.error('Failed to delete: ' + (err.error?.message || err.statusText || 'Server error'));
            }
        });
    }

    saveEducation(editList: EducationEntry[]) {
        this.isSaving = true;

        if (editList.length === 0) {
            this.education = [];
            this.educationUpdated.emit(this.education);
            this.showEditModal = false;
            this.isSaving = false;
            return;
        }

        const requests = editList.map(item => {
            const isExisting = this.education.some(e => e.id === item.id);
            return isExisting
                ? this.educationService.updateEducation(item.id, item)
                : this.educationService.createEducation(item);
        });

        forkJoin(requests).subscribe({
            next: (savedEntries) => {
                this.education = [...savedEntries];
                this.educationUpdated.emit(this.education);
                this.isSaving = false;
                this.showEditModal = false;
                this.toast.success('Education entries saved successfully');
            },
            error: (err) => {
                this.isSaving = false;
                this.toast.error('Some entries could not be saved');
                console.error('Education Save Error:', err);
            }
        });
    }

    // Helper methods for translated fields
    getDegree(item: EducationEntry): string {
        const currentLang = this.translationService.currentLang$();
        return TranslationUtil.getTranslatedField(item, 'degree', currentLang);
    }

    getInstitution(item: EducationEntry): string {
        const currentLang = this.translationService.currentLang$();
        return TranslationUtil.getTranslatedField(item, 'institution', currentLang);
    }

    getDescription(item: EducationEntry): string {
        const currentLang = this.translationService.currentLang$();
        return TranslationUtil.getTranslatedField(item, 'description', currentLang);
    }

    getLocation(item: EducationEntry): string {
        const currentLang = this.translationService.currentLang$();
        return TranslationUtil.getTranslatedField(item, 'location', currentLang);
    }

    // Image handling methods
    getImageUrl(imageUrl: string): string {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('http')) return imageUrl;
        return ImageUtil.getFullImageUrl(imageUrl);
    }

    // Lightbox methods
    getDefaultImage(category: string): string {
        switch (category) {
            case 'Training': return '/education/Training.png';
            case 'Certification': return '/education/Certification.png';
            case 'Achievement': return '/education/Acheivements.png';
            default: return '/education/education.png';
        }
    }

    getAllEducationImages(): string[] {
        return this.education
            .map(item => item.imageUrl ? this.getImageUrl(item.imageUrl) : this.getDefaultImage(item.category));
    }

    openLightbox(imageUrl: string) {
        if (!imageUrl) return;
        const images = this.getAllEducationImages();
        const processedUrl = imageUrl.startsWith('/') ? imageUrl : this.getImageUrl(imageUrl);
        
        this.currentLightboxIndex = images.indexOf(processedUrl);
        if (this.currentLightboxIndex === -1) {
            this.currentLightboxIndex = 0;
        }

        this.showLightbox = true;
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.showLightbox = false;
        document.body.style.overflow = '';
    }

    ngOnDestroy() {
        document.body.style.overflow = '';
    }
}
