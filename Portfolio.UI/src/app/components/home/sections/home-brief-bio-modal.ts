import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, X, Save } from 'lucide-angular';
import { BioEntry } from '../../../models';
import { TranslationService } from '../../../services/translation.service';

@Component({
    selector: 'app-home-brief-bio-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
    template: `
        <!-- Edit Modal -->
        <div *ngIf="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="onClose()">
            <div class="relative bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-modal-enter max-w-lg" (click)="$event.stopPropagation()">
                <!-- Header -->
                <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between z-20">
                    <h3 class="text-base font-black dark:text-white text-zinc-900">{{ 'home.bio.editTitle' | translate }}</h3>
                    <button (click)="onClose()"
                        class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                        <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">{{ 'home.bio.descriptionLabel' | translate }} (EN)</label>
                        <textarea [(ngModel)]="editForm.description" rows="5"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">{{ 'home.bio.descriptionLabel' | translate }} (AR)</label>
                        <textarea [ngModel]="editForm.description_Ar" (ngModelChange)="editForm.description_Ar = $event" rows="5" dir="rtl"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                    </div>
                    <div class="grid grid-cols-3 gap-6 pb-4">
                        <div>
                            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">{{ 'home.bio.yearsLabel' | translate }}</label>
                            <input [(ngModel)]="editForm.yearsOfExperience" type="text"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                        <div>
                            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">{{ 'home.bio.projectsLabel' | translate }}</label>
                            <input [(ngModel)]="editForm.projectsCompleted" type="text"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                        <div>
                            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">{{ 'home.bio.commitsLabel' | translate }}</label>
                            <input [(ngModel)]="editForm.codeCommits" type="text"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                    <button (click)="onClose()"
                        class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">
                        {{ 'common.cancel' | translate }}
                    </button>
                    <button (click)="onSave()" [disabled]="isSaving"
                        class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                        <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                        {{ isSaving ? ('common.saving' | translate) : ('common.saveChanges' | translate) }}
                    </button>
                </div>
            </div>
        </div>
    `
})
export class HomeBriefBioModalComponent implements OnChanges {
    private readonly translationService = inject(TranslationService);

    @Input() isOpen = false;
    @Input() bio?: BioEntry;
    @Input() isSaving = false;
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<BioEntry>();

    XIcon = X;
    SaveIcon = Save;

    editForm: BioEntry = {} as BioEntry;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && this.isOpen && this.bio) {
            // Reconcile ID casing
            const id = this.bio.id || (this.bio as any).Id || (this.bio as any).ID || crypto.randomUUID();
            this.editForm = { ...this.bio, id };
        }
    }

    onClose(): void {
        this.close.emit();
    }

    onSave(): void {
        this.save.emit(this.editForm);
    }
}
