import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { LucideAngularModule, Edit3, X, Save, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-angular';
import { ExperienceEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';
import { TranslationHelperService } from '../../../services/translation-helper.service';

@Component({
    selector: 'app-home-timeline',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule, TranslateModule],
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

    <!-- Edit Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-lg" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
                <h3 class="text-base font-black dark:text-white text-zinc-900">{{ 'home.timeline.manageTitle' | translate }}</h3>
                <div class="flex items-center gap-2">
                    <button (click)="addNewExperience()" class="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all">
                        <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                    <button (click)="closeEditModal()" class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                        <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                </div>
            </div>

            <div class="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div *ngFor="let item of editList; let i = index"
                    class="p-4 rounded-xl border space-y-3"
                    [class]="submitted && !item.role.trim() ? 'border-red-500/50 bg-red-600/5' : 'border-zinc-200 dark:border-zinc-700'">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{{ 'home.timeline.experienceLabel' | translate }} {{ i + 1 }}</span>
                        <button (click)="confirmDelete(i)"
                            class="w-7 h-7 rounded-lg bg-red-600/10 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                            <lucide-icon [img]="TrashIcon" class="w-3.5 h-3.5"></lucide-icon>
                        </button>
                    </div>
                    <div>
                        <input [(ngModel)]="item.role" [placeholder]="'home.timeline.roleLabel' | translate"
                            [class]="submitted && !item.role.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700 focus:ring-red-500/30 focus:border-red-500'"
                            class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 transition-all border">
                        <p *ngIf="submitted && !item.role.trim()" class="text-red-500 text-[10px] font-bold mt-1.5 ms-1">{{ 'home.timeline.roleLabel' | translate }} {{ 'common.requiredField' | translate }}</p>
                    </div>
                    <div>
                        <input [ngModel]="item.role_Ar" (ngModelChange)="item.role_Ar = $event" placeholder="Role / Title (AR)" dir="rtl"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <input [(ngModel)]="item.company" [placeholder]="'home.timeline.companyLabel' | translate"
                                [class]="submitted && !item.company.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700 focus:ring-red-500/30 focus:border-red-500'"
                                class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 transition-all border">
                            <p *ngIf="submitted && !item.company.trim()" class="text-red-500 text-[10px] font-bold mt-1 ms-1">{{ 'home.timeline.required' | translate }}</p>
                        </div>
                        <div>
                            <input [ngModel]="item.company_Ar" (ngModelChange)="item.company_Ar = $event" placeholder="Company (AR)" dir="rtl"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <input [(ngModel)]="item.location" [placeholder]="'home.timeline.locationLabel' | translate"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        <input [ngModel]="item.location_Ar" (ngModelChange)="item.location_Ar = $event" placeholder="Location (AR)" dir="rtl"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>
                    <input [(ngModel)]="item.duration" [placeholder]="'home.timeline.durationLabel' | translate"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    <textarea [(ngModel)]="item.description" placeholder="Description (EN)" rows="2"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                    <textarea [ngModel]="item.description_Ar" (ngModelChange)="item.description_Ar = $event" placeholder="Description (AR)" rows="2" dir="rtl"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" [(ngModel)]="item.isCurrent" class="w-4 h-4 rounded border-zinc-300 text-red-600 focus:ring-red-500">
                        <span class="text-xs text-zinc-500">{{ 'home.timeline.currentPosition' | translate }}</span>
                    </label>
                </div>
            </div>
            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="closeEditModal()" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">{{ 'common.cancel' | translate }}</button>
                <button (click)="saveExperiences()" [disabled]="isSaving"
                    class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                    <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ isSaving ? ('common.saving' | translate) : ('common.saveAll' | translate) }}
                </button>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation -->
    <div *ngIf="deleteIndex !== null" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="deleteIndex = null"></div>
        <div class="relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-sm p-6 text-center animate-modal-enter">
            <div class="w-14 h-14 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <lucide-icon [img]="AlertIcon" class="w-7 h-7 text-red-500"></lucide-icon>
            </div>
            <h4 class="text-base font-black dark:text-white text-zinc-900 mb-2">{{ 'common.deleteConfirm' | translate }}</h4>
            <p class="text-sm text-zinc-500 mb-6">{{ 'common.deleteMessage' | translate }} <strong class="text-zinc-900 dark:text-white">{{ editList[deleteIndex!].role || 'this experience' }}</strong>? {{ 'common.deleteWarning' | translate }}</p>
            <div class="flex items-center justify-center gap-3">
                <button (click)="deleteIndex = null" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 transition-all">{{ 'common.cancel' | translate }}</button>
                <button (click)="executeDelete()" [disabled]="isDeleting"
                    class="px-6 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50">
                    {{ isDeleting ? ('common.deleting' | translate) : ('common.delete' | translate) }}
                </button>
            </div>
        </div>
    </div>
  `
})
export class HomeTimelineComponent {
    public auth = inject(AuthService);
    private profileService = inject(ProfileService);
    private toast = inject(ToastService);
    public translationHelper = inject(TranslationHelperService);

    @Input() experiences: ExperienceEntry[] = [];
    @Output() experiencesUpdated = new EventEmitter<ExperienceEntry[]>();

    EditIcon = Edit3; XIcon = X; SaveIcon = Save; PlusIcon = Plus; TrashIcon = Trash2;
    AlertIcon = AlertTriangle; CheckIcon = CheckCircle;

    showEditModal = false; isSaving = false; isDeleting = false; submitted = false;
    editList: ExperienceEntry[] = [];
    deleteIndex: number | null = null;

    get translatedExperiences(): ExperienceEntry[] {
        return this.translationHelper.translateArray(this.experiences, ['role', 'company', 'description', 'location']);
    }

    openEditModal() {
        this.editList = this.experiences.map(e => ({ ...e }));
        this.submitted = false;
        this.showEditModal = true;
    }

    closeEditModal() { this.showEditModal = false; }

    addNewExperience() {
        this.editList.push({ id: crypto.randomUUID(), role: '', company: '', duration: '', description: '', location: '', isCurrent: false });
    }

    confirmDelete(index: number) { this.deleteIndex = index; }

    executeDelete() {
        if (this.deleteIndex === null) return;
        const item = this.editList[this.deleteIndex];
        if (item.id) {
            console.log('HomeTimeline: Deleting experience with ID:', item.id);
            this.isDeleting = true;
            this.profileService.deleteExperience(item.id).subscribe({
                next: () => {
                    this.editList.splice(this.deleteIndex!, 1);
                    this.experiences = [...this.editList];
                    this.experiencesUpdated.emit(this.experiences);
                    this.deleteIndex = null; this.isDeleting = false;
                    this.toast.success('Experience deleted successfully');
                },
                error: (err) => {
                    this.isDeleting = false; this.deleteIndex = null;
                    this.toast.error('Failed to delete: ' + (err.error?.message || err.statusText || 'Server error'));
                }
            });
        } else {
            this.editList.splice(this.deleteIndex, 1);
            this.deleteIndex = null;
        }
    }

    saveExperiences() {
        this.submitted = true;
        if (this.editList.some(item => !item.role.trim() || !item.company.trim())) {
            this.toast.error('Please fill in all required fields'); return;
        }
        this.isSaving = true;

        if (this.editList.length === 0) {
            this.experiences = []; this.experiencesUpdated.emit(this.experiences);
            this.showEditModal = false; this.isSaving = false; return;
        }

        const requests = this.editList.map(item => {
            const isExisting = this.experiences.some(e => e.id === item.id);
            return isExisting
                ? this.profileService.updateExperience(item.id, item)
                : this.profileService.createExperience(item);
        });

        forkJoin(requests).subscribe({
            next: (savedExperiences) => {
                this.experiences = [...savedExperiences];
                this.experiencesUpdated.emit(this.experiences);
                this.isSaving = false;
                this.showEditModal = false;
                this.toast.success('Timeline saved successfully');
            },
            error: (err) => {
                this.isSaving = false;
                this.toast.error('Some entries could not be saved');
                console.error('Timeline Save Error:', err);
            }
        });
    }


}
