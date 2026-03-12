import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, X, Save, Plus, Trash2, Image as LucideImage, AlertTriangle } from 'lucide-angular';
import { SkillEntry } from '../../../models';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';
import { ImageUtil } from '../../../utils';

@Component({
    selector: 'app-home-tech-stack-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
    template: `
        <!-- Edit Modal -->
        <div *ngIf="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="onClose()">
            <div class="relative bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl w-2/3 max-h-[90vh] overflow-hidden flex flex-col animate-modal-enter mt-20" (click)="$event.stopPropagation()">
                <!-- Header -->
                <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between z-20">
                    <h3 class="text-base font-black dark:text-white text-zinc-900">{{ 'home.techStack.manageTitle' | translate }}</h3>
                    <div class="flex items-center gap-2">
                        <button (click)="addNewSkill()" class="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all">
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
                        class="p-4 rounded-xl border flex items-center gap-3"
                        [class]="submitted && !item.name.trim() ? 'border-red-500/50 bg-red-600/5' : 'border-zinc-200 dark:border-zinc-700'">
                        <div class="flex-1 space-y-3">
                            <div>
                                <input [(ngModel)]="item.name" placeholder="Skill Name (EN) *"
                                    [class]="submitted && !item.name.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700 focus:ring-red-500/30 focus:border-red-500'"
                                    class="w-full px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 transition-all border">
                                <p *ngIf="submitted && !item.name.trim()" class="text-red-500 text-[10px] font-bold mt-1 ms-1">{{ 'home.techStack.skillLabel' | translate }} {{ 'common.requiredField' | translate }}</p>
                            </div>

                            
                            <div class="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <span class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{{ 'home.techStack.skillIcon' | translate }}</span>
                                
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                                        <img *ngIf="isImageUrl(item.icon)" [src]="getFullUrl(item.icon)" class="w-full h-full object-contain">
                                        <lucide-icon *ngIf="!isImageUrl(item.icon)" [img]="ImageIcon" class="w-4 h-4 text-zinc-300"></lucide-icon>
                                    </div>
                                    <label class="flex-1 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-red-500 hover:text-red-500 transition-all text-center">
                                        {{ uploadingIndex === i ? ('home.techStack.uploading' | translate) : (item.icon ? ('home.techStack.changeImage' | translate) : ('home.techStack.uploadImage' | translate)) }}
                                        <input type="file" class="hidden" (change)="onIconFileSelected($event, i)" accept="image/*">
                                    </label>
                                </div>
                            </div>


                        </div>
                        <button (click)="confirmDelete(i)"
                            class="w-7 h-7 rounded-lg bg-red-600/10 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shrink-0">
                            <lucide-icon [img]="TrashIcon" class="w-3.5 h-3.5"></lucide-icon>
                        </button>
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
                <p class="text-sm text-zinc-500 mb-6">{{ 'common.deleteMessage' | translate }} <strong class="text-zinc-900 dark:text-white">{{ editList[deleteIndex!]?.name || 'this skill' }}</strong>?</p>
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
export class HomeTechStackModalComponent implements OnChanges {
    private readonly profileService = inject(ProfileService);
    private readonly toast = inject(ToastService);

    @Input() isOpen = false;
    @Input() skills: SkillEntry[] = [];
    @Input() isSaving = false;
    @Input() isDeleting = false;
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<SkillEntry[]>();
    @Output() delete = new EventEmitter<string>();
    @Output() uploadIcon = new EventEmitter<{ index: number; url: string }>();

    XIcon = X;
    SaveIcon = Save;
    PlusIcon = Plus;
    TrashIcon = Trash2;
    ImageIcon = LucideImage;
    AlertIcon = AlertTriangle;

    editList: SkillEntry[] = [];
    submitted = false;
    deleteIndex: number | null = null;
    uploadingIndex: number | null = null;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && this.isOpen && this.skills) {
            // Map iconPath from backend to icon for frontend display
            this.editList = this.skills.map(s => ({ 
                ...s, 
                icon: s.iconPath || s.icon // Use iconPath from backend, fallback to icon
            }));
            this.submitted = false;
        }
    }

    onClose(): void {
        this.close.emit();
    }

    onSave(): void {
        this.submitted = true;
        if (this.editList.some(item => !item.name.trim())) {
            return;
        }
        
        // Map frontend 'icon' field to backend 'iconPath' field
        const skillsToSave = this.editList.map(skill => ({
            ...skill,
            iconPath: skill.icon || skill.iconPath, // Use icon if set, otherwise use iconPath
            icon: undefined // Remove the frontend-only field
        }));
        
        console.log('📤 Sending skills to backend:', skillsToSave);
        this.save.emit(skillsToSave);
    }

    isImageUrl(icon?: string): boolean {
        if (!icon || typeof icon !== 'string' || icon.trim() === '') return false;
        return icon.includes('/') || icon.includes('.') || icon.startsWith('http');
    }

    getFullUrl(path?: string): string {
        return ImageUtil.getFullImageUrl(path);
    }

    onIconFileSelected(event: any, index: number): void {
        const file = event.target.files[0];
        if (!file) return;

        this.uploadingIndex = index;
        this.profileService.uploadSkillIcon(file).subscribe({
            next: (res) => {
                this.editList[index].icon = res.url;
                this.editList[index].iconPath = res.url; // Also set iconPath for backend
                this.uploadIcon.emit({ index, url: res.url });
                this.uploadingIndex = null;
                this.toast.success('Icon uploaded! Click Save to persist changes.');
            },
            error: (err) => {
                this.uploadingIndex = null;
                this.toast.error('Upload failed: ' + (err.error?.message || 'Server error'));
            }
        });
    }

    addNewSkill(): void {
        const newItem = { id: crypto.randomUUID(), name: '', icon: '' };
        this.editList.push(newItem);
        this.submitted = false;
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
