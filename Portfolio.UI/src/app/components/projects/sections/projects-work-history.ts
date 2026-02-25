import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ExperienceEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';
import { LucideAngularModule, Edit3, Trash2, X, Save, Plus, AlertTriangle } from 'lucide-angular';

@Component({
    selector: 'app-projects-work-history',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule, TranslateModule],
    template: `
    <section class="mt-10 animate-fade-in-up">
        <div class="flex items-center gap-6 mb-20">
            <div class="w-2 h-12 bg-red-600 rounded-full"></div>
            <h2 class="text-5xl font-black dark:text-white text-zinc-900 tracking-tighter uppercase italic">{{ 'projects.workHistory.title' | translate }}</h2>
            <button *ngIf="auth.isLoggedIn()" (click)="openCreateModal()"
                class="ms-auto px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center gap-2">
                <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                {{ 'projects.workHistory.addExperience' | translate }}
            </button>
        </div>

        <div class="space-y-5 relative">
            <div *ngFor="let exp of experiences" class="relative pl-16 group">
                <!-- Timeline Line -->
                <div class="absolute left-0 top-0 bottom-0 w-[1px] bg-zinc-100 dark:bg-zinc-800 group-last:bg-gradient-to-b group-last:from-zinc-100 dark:group-last:from-zinc-800 group-last:to-transparent"></div>
                <!-- Timeline Dot -->
                <div class="absolute left-[-6px] top-3 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800 group-hover:bg-red-600 group-hover:scale-150 transition-all shadow-xl"></div>

                <!-- Admin Actions -->
                <div *ngIf="auth.isLoggedIn()" class="absolute right-0 top-0 flex gap-2">
                    <button (click)="onEdit(exp)"
                        class="w-10 h-10 rounded-lg bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center text-white hover:text-red-500 border border-zinc-700 transition-all">
                        <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                    <button (click)="onDelete(exp)"
                        class="w-10 h-10 rounded-lg bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center text-white hover:text-red-600 border border-zinc-700 transition-all">
                        <lucide-icon [img]="DeleteIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                </div>

                <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div class="space-y-4">
                        <h3 class="text-3xl font-black dark:text-white text-zinc-900 uppercase tracking-tight flex items-center gap-4 italic">
                            {{ exp.role }} <span class="text-red-600 text-sm font-black tracking-[0.2em] uppercase">@ {{ exp.company }}</span>
                        </h3>
                        <p class="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed max-w-3xl font-medium">
                            {{ exp.description }}
                        </p>
                    </div>
                    <div class="text-left shrink-0">
                        <span class="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 block mb-2">{{ exp.duration }}</span>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">{{ exp.location }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Edit/Create Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-2xl max-h-[90vh]" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
                <h3 class="text-base font-black dark:text-white text-zinc-900">{{ isCreating ? 'Add Experience' : 'Edit Experience' }}</h3>
                <button (click)="closeEditModal()"
                    class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                    <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                </button>
            </div>

            <div class="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Company *</label>
                        <input [(ngModel)]="editingExperience.company" placeholder="Company name"
                            [class]="submitted && editingExperience.company && !editingExperience.company.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700'"
                            class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all border">
                        <p *ngIf="submitted && editingExperience.company && !editingExperience.company.trim()" class="text-red-500 text-[10px] font-bold mt-1.5">Company is required</p>
                    </div>

                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Role *</label>
                        <input [(ngModel)]="editingExperience.role" placeholder="Job title"
                            [class]="submitted && editingExperience.role && !editingExperience.role.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700'"
                            class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all border">
                        <p *ngIf="submitted && editingExperience.role && !editingExperience.role.trim()" class="text-red-500 text-[10px] font-bold mt-1.5">Role is required</p>
                    </div>

                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Duration *</label>
                        <input [(ngModel)]="editingExperience.duration" placeholder="e.g. 2023 - Present"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Location</label>
                        <input [(ngModel)]="editingExperience.location" placeholder="e.g. Remote, Cairo"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description</label>
                        <textarea [(ngModel)]="editingExperience.description" placeholder="Job responsibilities and achievements" rows="4"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                    </div>

                    <div class="col-span-2">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" [(ngModel)]="editingExperience.isCurrent"
                                class="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-red-600 focus:ring-red-500">
                            <span class="text-sm text-zinc-900 dark:text-white font-medium">Currently working here</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="closeEditModal()"
                    class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">Cancel</button>
                <button (click)="saveExperience()" [disabled]="isSaving"
                    class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                    <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ isSaving ? 'Saving...' : 'Save' }}
                </button>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation -->
    <div *ngIf="deleteExperience" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="deleteExperience = null"></div>
        <div class="relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-sm p-6 text-center animate-modal-enter">
            <div class="w-14 h-14 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <lucide-icon [img]="AlertIcon" class="w-7 h-7 text-red-500"></lucide-icon>
            </div>
            <h4 class="text-base font-black dark:text-white text-zinc-900 mb-2">Delete Experience?</h4>
            <p class="text-sm text-zinc-500 mb-6">Are you sure you want to delete <strong class="text-zinc-900 dark:text-white">{{ deleteExperience.role }} @ {{ deleteExperience.company }}</strong>?</p>
            <div class="flex items-center justify-center gap-3">
                <button (click)="deleteExperience = null"
                    class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 transition-all">Cancel</button>
                <button (click)="executeDelete()" [disabled]="isDeleting"
                    class="px-6 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50">
                    {{ isDeleting ? 'Deleting...' : 'Delete' }}
                </button>
            </div>
        </div>
    </div>
  `
})
export class ProjectsWorkHistoryComponent {
    public auth = inject(AuthService);
    private profileService = inject(ProfileService);
    private toast = inject(ToastService);

    @Input() experiences: ExperienceEntry[] = [];
    @Output() experiencesUpdated = new EventEmitter<ExperienceEntry[]>();

    EditIcon = Edit3;
    DeleteIcon = Trash2;
    XIcon = X;
    SaveIcon = Save;
    PlusIcon = Plus;
    AlertIcon = AlertTriangle;

    showEditModal = false;
    isSaving = false;
    isDeleting = false;
    submitted = false;
    isCreating = false;
    deleteExperience: ExperienceEntry | null = null;
    editingExperience: Partial<ExperienceEntry> = {};

    onEdit(experience: ExperienceEntry) {
        this.editingExperience = { ...experience };
        this.isCreating = false;
        this.submitted = false;
        this.showEditModal = true;
    }

    onDelete(experience: ExperienceEntry) {
        this.deleteExperience = experience;
    }

    openCreateModal() {
        this.editingExperience = {
            company: '',
            role: '',
            duration: '',
            description: '',
            location: '',
            isCurrent: false
        };
        this.isCreating = true;
        this.submitted = false;
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
        this.editingExperience = {};
    }

    saveExperience() {
        this.submitted = true;

        if (!this.editingExperience.company || !this.editingExperience.company.trim() || 
            !this.editingExperience.role || !this.editingExperience.role.trim()) {
            this.toast.error('Please fill in all required fields');
            return;
        }

        this.isSaving = true;

        const experienceData: any = {
            id: this.editingExperience.id || crypto.randomUUID(),
            company: this.editingExperience.company,
            role: this.editingExperience.role,
            duration: this.editingExperience.duration || '',
            description: this.editingExperience.description,
            location: this.editingExperience.location,
            isCurrent: this.editingExperience.isCurrent || false
        };

        const request = this.isCreating
            ? this.profileService.createExperience(experienceData)
            : this.profileService.updateExperience(this.editingExperience.id!, experienceData);

        request.subscribe({
            next: (savedExperience: ExperienceEntry) => {
                if (this.isCreating) {
                    this.experiences = [...this.experiences, savedExperience];
                } else {
                    const index = this.experiences.findIndex(e => e.id === savedExperience.id);
                    if (index !== -1) {
                        this.experiences[index] = savedExperience;
                        this.experiences = [...this.experiences];
                    }
                }
                this.experiencesUpdated.emit(this.experiences);
                this.isSaving = false;
                this.showEditModal = false;
                this.toast.success(`Experience ${this.isCreating ? 'created' : 'updated'} successfully`);
            },
            error: (err) => {
                this.isSaving = false;
                this.toast.error(`Failed to ${this.isCreating ? 'create' : 'update'} experience`);
                console.error('Experience Save Error:', err);
            }
        });
    }

    executeDelete() {
        if (!this.deleteExperience?.id) return;

        this.isDeleting = true;
        this.profileService.deleteExperience(this.deleteExperience.id).subscribe({
            next: () => {
                this.experiences = this.experiences.filter(e => e.id !== this.deleteExperience!.id);
                this.experiencesUpdated.emit(this.experiences);
                this.deleteExperience = null;
                this.isDeleting = false;
                this.toast.success('Experience deleted successfully');
            },
            error: (err) => {
                this.isDeleting = false;
                this.deleteExperience = null;
                if (err.status === 401) {
                    this.toast.error('Authentication failed. Please log in again.');
                    this.auth.logout();
                    window.location.href = '/login';
                } else {
                    this.toast.error('Failed to delete experience');
                }
                console.error('Experience Delete Error:', err);
            }
        });
    }
}
