import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { LucideAngularModule, Edit3, X, Save, Plus, Trash2, AlertTriangle, Image as LucideImage } from 'lucide-angular';
import { environment } from '../../../../environments/environment';
import { SkillEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';
import { TranslationHelperService } from '../../../services/translation-helper.service';

@Component({
    selector: 'app-home-tech-stack',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule, TranslateModule],
    template: `
    <section class="animate-fade-in-up pt-12 border-t border-zinc-100 dark:border-zinc-900 relative">
        <button *ngIf="auth.isLoggedIn()" (click)="openEditModal()"
            class="absolute top-4 right-0 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-110 hover:text-red-500 transition-all z-20">
            <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
        </button>
        <p class="text-center text-[10px] font-black uppercase tracking-[0.6em] text-zinc-400 mb-10">{{ 'home.techStack.title' | translate }}</p>
        <div class="flex flex-wrap justify-center gap-6">
            <div *ngFor="let skill of translatedSkills"
                class="w-20 h-20 bg-white dark:bg-zinc-900/40 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center group hover:border-red-600/30 hover:scale-105 transition-all cursor-pointer">
                <img *ngIf="skill.icon" [src]="getFullUrl(skill.icon)" class="w-8 h-8 object-contain mb-1.5 filter grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100">
                <lucide-icon *ngIf="!skill.icon" [img]="ImageIcon" class="w-6 h-6 text-zinc-400 dark:text-zinc-600 group-hover:text-red-500 transition-colors mb-1.5"></lucide-icon>
                <span class="text-[9px] font-bold uppercase tracking-wide text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{{ skill.name }}</span>
            </div>
        </div>
    </section>

    <!-- Edit Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-lg" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
                <h3 class="text-base font-black dark:text-white text-zinc-900">{{ 'home.techStack.manageTitle' | translate }}</h3>
                <div class="flex items-center gap-2">
                    <button (click)="addNewSkill()" class="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all">
                        <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                    <button (click)="closeEditModal()" class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                        <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                </div>
            </div>

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
                        <div>
                            <input [ngModel]="item.name_Ar" (ngModelChange)="item.name_Ar = $event" placeholder="Skill Name (AR)" dir="rtl"
                                class="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                        
                        <div class="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            <span class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{{ 'home.techStack.skillIcon' | translate }}</span>
                            
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                                    <img *ngIf="item.icon" [src]="getFullUrl(item.icon)" class="w-full h-full object-contain">
                                    <lucide-icon *ngIf="!item.icon" [img]="ImageIcon" class="w-4 h-4 text-zinc-300"></lucide-icon>
                                </div>
                                <label class="flex-1 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-red-500 hover:text-red-500 transition-all text-center">
                                    {{ uploadingIndex === i ? ('home.techStack.uploading' | translate) : (item.icon ? ('home.techStack.changeImage' | translate) : ('home.techStack.uploadImage' | translate)) }}
                                    <input type="file" class="hidden" (change)="onIconFileSelected($event, i)" accept="image/*">
                                </label>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{{ 'home.techStack.displayOrder' | translate }}</span>
                            <input [(ngModel)]="item.order" type="number"
                                class="w-16 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 text-center">
                        </div>
                    </div>
                    <button (click)="confirmDelete(i)"
                        class="w-7 h-7 rounded-lg bg-red-600/10 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shrink-0">
                        <lucide-icon [img]="TrashIcon" class="w-3.5 h-3.5"></lucide-icon>
                    </button>
                </div>
            </div>
            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="closeEditModal()" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">{{ 'common.cancel' | translate }}</button>
                <button (click)="saveSkills()" [disabled]="isSaving"
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
            <p class="text-sm text-zinc-500 mb-6">{{ 'common.deleteMessage' | translate }} <strong class="text-zinc-900 dark:text-white">{{ editList[deleteIndex!].name || 'this skill' }}</strong>?</p>
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
export class HomeTechStackComponent {
    public auth = inject(AuthService);
    private profileService = inject(ProfileService);
    private toast = inject(ToastService);
    public translationHelper = inject(TranslationHelperService);

    @Input() skills: SkillEntry[] = [];
    @Output() skillsUpdated = new EventEmitter<SkillEntry[]>();

    EditIcon = Edit3; XIcon = X; SaveIcon = Save; PlusIcon = Plus; TrashIcon = Trash2; ImageIcon = LucideImage;
    AlertIcon = AlertTriangle;

    showEditModal = false; isSaving = false; isDeleting = false; submitted = false;
    editList: SkillEntry[] = [];
    uploadingIndex: number | null = null;
    deleteIndex: number | null = null;

    get translatedSkills(): SkillEntry[] {
        return this.translationHelper.translateArray(this.skills, ['name']);
    }

    getFullUrl(path?: string): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const baseUrl = environment.apiUrl.replace('/api', '');
        return `${baseUrl}${path}`;
    }

    openEditModal() {
        this.editList = this.skills.map(s => ({ ...s }));
        this.submitted = false;
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
    }

    onIconFileSelected(event: any, index: number) {
        const file = event.target.files[0];
        if (!file) return;

        this.uploadingIndex = index;
        this.profileService.uploadSkillIcon(file).subscribe({
            next: (res) => {
                this.editList[index].icon = res.url;
                this.uploadingIndex = null;
                this.toast.success('Icon uploaded!');
            },
            error: (err) => {
                this.uploadingIndex = null;
                this.toast.error('Upload failed: ' + (err.error?.message || 'Server error'));
            }
        });
    }

    addNewSkill() {
        const newItem = { id: crypto.randomUUID(), name: '', icon: '', order: this.editList.length };
        this.editList.push(newItem);
    }

    confirmDelete(index: number) { this.deleteIndex = index; }

    executeDelete() {
        if (this.deleteIndex === null) return;
        const item = this.editList[this.deleteIndex];
        if (item.id) {
            console.log('HomeTechStack: Deleting skill with ID:', item.id);
            this.isDeleting = true;
            this.profileService.deleteSkill(item.id).subscribe({
                next: () => {
                    this.editList.splice(this.deleteIndex!, 1);
                    this.skills = [...this.editList].sort((a, b) => (a.order || 0) - (b.order || 0));
                    this.skillsUpdated.emit(this.skills);
                    this.deleteIndex = null; this.isDeleting = false;
                    this.toast.success('Skill deleted successfully');
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

    saveSkills() {
        this.submitted = true;
        if (this.editList.some(item => !item.name.trim())) {
            this.toast.error('Please fill in all required fields'); return;
        }
        this.isSaving = true;

        if (this.editList.length === 0) {
            this.skills = []; this.skillsUpdated.emit(this.skills);
            this.showEditModal = false; this.isSaving = false; return;
        }

        const requests = this.editList.map(item => {
            // If it was newly added (starts with a UUID from frontend) but we don't know if it exists,
            // we check the original skills list.
            const isExisting = this.skills.some(s => s.id === item.id);
            return isExisting
                ? this.profileService.updateSkill(item.id, item)
                : this.profileService.createSkill(item);
        });

        forkJoin(requests).subscribe({
            next: (savedSkills) => {
                this.skills = [...savedSkills].sort((a, b) => a.order - b.order);
                this.skillsUpdated.emit(this.skills);
                this.isSaving = false;
                this.showEditModal = false;
                this.toast.success('Tech stack saved successfully');
            },
            error: (err) => {
                this.isSaving = false;
                this.toast.error('Some skills could not be saved. Please try again.');
                console.error('Skill Save Error:', err);
            }
        });
    }


}
