import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, X, Save, Plus, Trash2, AlertTriangle } from 'lucide-angular';
import { ExperienceEntry } from '../../../models';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-home-timeline-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
    template: `
        <!-- Edit Modal -->
        <div *ngIf="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="onClose()">
            <div class="relative bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl w-2/3 max-h-[90vh] overflow-hidden flex flex-col animate-modal-enter mt-20" (click)="$event.stopPropagation()">
                <!-- Header -->
                <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between z-20">
                    <h3 class="text-base font-black dark:text-white text-zinc-900">{{ 'home.timeline.manageTitle' | translate }}</h3>
                    <div class="flex items-center gap-2">
                        <button (click)="addNewExperience()" class="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all">
                            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                        </button>
                        <button (click)="onClose()" class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                            <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                        </button>
                    </div>
                </div>

                <!-- Body -->
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

                <!-- Footer -->
                <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                    <button (click)="onClose()" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">{{ 'common.cancel' | translate }}</button>
                    <button (click)="onSave()" [disabled]="isSaving"
                        class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                        <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                        {{ isSaving ? ('common.saving' | translate) : ('common.saveAll' | translate) }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div *ngIf="deleteIndex !== null" class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div class="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-sm p-6 text-center" (click)="$event.stopPropagation()">
                <div class="w-14 h-14 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <lucide-icon [img]="AlertIcon" class="w-7 h-7 text-red-500"></lucide-icon>
                </div>
                <h4 class="text-base font-black dark:text-white text-zinc-900 mb-2">{{ 'common.deleteConfirm' | translate }}</h4>
                <p class="text-sm text-zinc-500 mb-6">{{ 'common.deleteMessage' | translate }} <strong class="text-zinc-900 dark:text-white">{{ editList[deleteIndex!]?.role || 'this experience' }}</strong>? {{ 'common.deleteWarning' | translate }}</p>
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
export class HomeTimelineModalComponent implements OnChanges {
    private readonly toast = inject(ToastService);

    @Input() isOpen = false;
    @Input() experiences: ExperienceEntry[] = [];
    @Input() isSaving = false;
    @Input() isDeleting = false;
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<ExperienceEntry[]>();
    @Output() delete = new EventEmitter<string>();

    XIcon = X;
    SaveIcon = Save;
    PlusIcon = Plus;
    TrashIcon = Trash2;
    AlertIcon = AlertTriangle;

    editList: ExperienceEntry[] = [];
    submitted = false;
    deleteIndex: number | null = null;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && this.isOpen && this.experiences) {
            this.editList = this.experiences.map(e => ({ ...e }));
            this.submitted = false;
        }
    }

    onClose(): void {
        this.close.emit();
    }

    onSave(): void {
        this.submitted = true;
        if (this.editList.some(item => !item.role.trim() || !item.company.trim())) {
            this.toast.error('Please fill in all required fields');
            return;
        }
        this.save.emit(this.editList);
    }

    addNewExperience(): void {
        this.editList.push({ 
            id: crypto.randomUUID(), 
            role: '', 
            company: '', 
            duration: '', 
            description: '', 
            location: '', 
            isCurrent: false 
        });
    }

    confirmDelete(index: number): void {
        this.deleteIndex = index;
    }

    executeDelete(): void {
        if (this.deleteIndex === null) return;
        const item = this.editList[this.deleteIndex];
        if (item.id) {
            this.delete.emit(item.id);
            this.editList.splice(this.deleteIndex, 1);
        } else {
            this.editList.splice(this.deleteIndex, 1);
        }
        this.deleteIndex = null;
    }
}
