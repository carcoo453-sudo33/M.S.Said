import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { LucideAngularModule, Edit3 } from 'lucide-angular';
import { ExperienceEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ProjectsPageService } from '../../../services/projects-page.service';
import { ToastService } from '../../../services/toast.service';
import { TranslationService } from '../../../services/translation.service';
import { TranslationUtil } from '../../../utils';
import { HomeTimelineModalComponent } from './home-timeline-modal';

@Component({
    selector: 'app-home-timeline',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, TranslateModule, HomeTimelineModalComponent],
    template: `
    <section class="animate-fade-in-up pt-10">
        <div class="flex items-center justify-between gap-6 mb-10">
            <div class="flex items-center gap-4">
                <div class="w-1 h-8 bg-red-600 rounded-full"></div>
                <h2 class="text-2xl font-black dark:text-white text-zinc-900 tracking-tight">{{ 'home.timeline.title' | translate }}</h2>
            </div>
            <div class="flex items-center gap-2">
                <button *ngIf="auth.isLoggedIn()" (click)="openEditModal()"
                    class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-110 hover:text-red-500 transition-all">
                    <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
                </button>
            </div>
        </div>
        <div class="space-y-8">
            <div *ngFor="let exp of translatedExperiences" class="relative pl-10 group">
                <div class="absolute left-0 top-0 bottom-0 w-[1px] bg-zinc-100 dark:bg-zinc-800"></div>
                <div class="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-zinc-950"></div>
                <div class="flex items-start justify-between gap-4 mb-1">
                    <h3 class="text-base font-black dark:text-white text-zinc-900">{{ exp.role }}</h3>
                    <span class="text-[9px] font-bold text-red-500 bg-red-600/5 px-3 py-1 rounded-lg border border-red-600/10 shrink-0 whitespace-nowrap">{{ exp.duration }}</span>
                </div>
                <div class="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-3">
                    <span>{{ exp.company }}</span>
                    <span class="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                    <span>{{ exp.location }}</span>
                </div>
                <p class="text-zinc-500 text-sm leading-relaxed">{{ exp.description }}</p>
            </div>
        </div>
    </section>

    <!-- Modal Component -->
    <app-home-timeline-modal
        [isOpen]="showEditModal"
        [experiences]="experiences"
        [isSaving]="isSaving"
        [isDeleting]="isDeleting"
        (close)="closeEditModal()"
        (save)="saveExperiences($event)"
        (delete)="deleteExperience($event)">
    </app-home-timeline-modal>
  `
})
export class HomeTimelineComponent {
    public readonly auth = inject(AuthService);
    private readonly projectsPageService = inject(ProjectsPageService);
    private readonly toast = inject(ToastService);
    private readonly translationService = inject(TranslationService);

    @Input() experiences: ExperienceEntry[] = [];
    @Output() experiencesUpdated = new EventEmitter<ExperienceEntry[]>();

    EditIcon = Edit3;

    showEditModal = false;
    isSaving = false;
    isDeleting = false;

    get translatedExperiences(): ExperienceEntry[] {
        const currentLang = this.translationService.currentLang$();
        return TranslationUtil.translateArray(this.experiences, ['role', 'company', 'description', 'location'], currentLang);
    }

    openEditModal() {
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
    }

    deleteExperience(experienceId: string) {
        this.isDeleting = true;
        this.projectsPageService.deleteExperience(experienceId).subscribe({
            next: () => {
                this.experiences = this.experiences.filter(e => e.id !== experienceId);
                this.experiencesUpdated.emit(this.experiences);
                this.isDeleting = false;
                this.toast.success('Experience deleted successfully');
            },
            error: (err: any) => {
                this.isDeleting = false;
                this.toast.error('Failed to delete: ' + (err.error?.message || err.statusText || 'Server error'));
            }
        });
    }

    saveExperiences(editList: ExperienceEntry[]) {
        this.isSaving = true;

        if (editList.length === 0) {
            this.experiences = [];
            this.experiencesUpdated.emit(this.experiences);
            this.showEditModal = false;
            this.isSaving = false;
            return;
        }

        const requests = editList.map(item => {
            const isExisting = this.experiences.some(e => e.id === item.id);
            return isExisting
                ? this.projectsPageService.updateExperience(item.id, item)
                : this.projectsPageService.createExperience(item);
        });

        forkJoin(requests).subscribe({
            next: (savedExperiences) => {
                this.experiences = [...savedExperiences];
                this.experiencesUpdated.emit(this.experiences);
                this.isSaving = false;
                this.showEditModal = false;
                this.toast.success('Timeline saved successfully');
            },
            error: (err: any) => {
                this.isSaving = false;
                this.toast.error('Some entries could not be saved');
                console.error('Timeline Save Error:', err);
            }
        });
    }
}
