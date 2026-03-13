import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Zap, Edit3 } from 'lucide-angular';
import { BioEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { HomeService } from '../../../services/home.service';
import { ToastService } from '../../../services/toast.service';
import { TranslationService } from '../../../services/translation.service';
import { TranslationUtil } from '../../../utils';
import { HomeBriefBioModalComponent } from './home-brief-bio-modal';

@Component({
    selector: 'app-home-brief-bio',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, TranslateModule, HomeBriefBioModalComponent],
    template: `
    <section class="animate-fade-in-up">
        <div class="flex items-center gap-4 mb-6 relative">
            <h1 class="text-3xl md:text-5xl font-black dark:text-white text-zinc-900 tracking-tighter leading-tight">
                {{ 'home.bio.heading1' | translate }} <span class="text-[#f20d0d]">{{ 'home.bio.headingHighlight' | translate }}</span><br>
                {{ 'home.bio.heading2' | translate }}
            </h1>
            <button *ngIf="auth.isLoggedIn()" (click)="openEditModal()"
                class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-110 hover:text-red-500 transition-all ml-4">
                <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
            </button>
        </div>

        <p class="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl mb-10 font-medium">
            {{ translatedDescription }}
        </p>

        <div class="grid grid-cols-3 gap-6 md:gap-6 max-w-xl">
            <div class="p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-red-600/20 transition-all group">
                <div class="text-2xl md:text-3xl font-black text-[#f20d0d] mb-1 group-hover:scale-110 transition-transform origin-left">{{ bio?.yearsOfExperience }}</div>
                <div class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{{ 'home.bio.yearsExp' | translate }}</div>
            </div>
            <div class="p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-red-600/20 transition-all group">
                <div class="text-2xl md:text-3xl font-black text-[#f20d0d] mb-1 group-hover:scale-110 transition-transform origin-left">{{ bio?.projectsCompleted }}</div>
                <div class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{{ 'home.bio.projectsCompleted' | translate }}</div>
            </div>
            <div class="p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-red-600/20 transition-all group">
                <div class="text-2xl md:text-3xl font-black text-[#f20d0d] mb-1 group-hover:scale-110 transition-transform origin-left">{{ formatCodeCommits(bio?.codeCommits) }}</div>
                <div class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{{ 'home.bio.codeCommits' | translate }}</div>
            </div>
        </div>
    </section>

    <!-- Edit Modal Component -->
    <app-home-brief-bio-modal
        [isOpen]="showEditModal"
        [bio]="bio"
        [isSaving]="isSaving"
        (closeModal)="closeEditModal()"
        (save)="saveBio($event)">
    </app-home-brief-bio-modal>
  `
})
export class HomeBriefBioComponent {
    public readonly auth = inject(AuthService);
    private readonly homeService = inject(HomeService);
    private readonly toast = inject(ToastService);
    private readonly translationService = inject(TranslationService);

    @Input() bio?: BioEntry;
    @Output() bioUpdated = new EventEmitter<BioEntry>();

    // Icons
    ZapIcon = Zap;
    EditIcon = Edit3;

    // Edit modal state
    showEditModal = false;
    isSaving = false;

    get translatedDescription(): string {
        const currentLang = this.translationService.currentLang$();
        return TranslationUtil.getTranslatedField(this.bio, 'description', currentLang);
    }

    openEditModal() {
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
    }

    saveBio(editForm: BioEntry) {
        if (!editForm.id) {
            this.toast.error('System error: Bio ID is missing. Please refresh.');
            return;
        }
        this.isSaving = true;
        this.homeService.updateBio(editForm.id, editForm).subscribe({
            next: (updatedBio: BioEntry) => {
                // Merge API response with local form data to ensure all fields are present
                this.bio = { ...editForm, ...updatedBio };
                this.bioUpdated.emit(this.bio);
                this.showEditModal = false;
                this.isSaving = false;
                this.toast.success('Bio section updated successfully');
            },
            error: (err: any) => {
                this.isSaving = false;
                if (!err.notified) {
                    this.toast.error('Failed to save: ' + (err.error?.message || err.statusText || 'Server error'));
                }
            }
        });
    }

    formatCodeCommits(commits?: string): string {
        if (!commits || commits === '0') return '0';
        const num = Number.parseInt(commits, 10);
        if (Number.isNaN(num) || num <= 0) return '0';
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }
}
