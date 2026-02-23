import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { LucideAngularModule, Code2, Database, FileCode, Zap, Monitor, Terminal, Github, Edit3, X, Save, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-angular';
import { SkillEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-home-tech-stack',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    template: `
    <section class="animate-fade-in-up pt-12 border-t border-zinc-100 dark:border-zinc-900 relative">
        <button *ngIf="auth.isLoggedIn()" (click)="openEditModal()"
            class="absolute top-4 right-0 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-110 hover:text-red-500 transition-all z-20">
            <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
        </button>
        <p class="text-center text-[10px] font-black uppercase tracking-[0.6em] text-zinc-400 mb-10">TECH STACK & TOOLS</p>
        <div class="flex flex-wrap justify-center gap-6">
            <div *ngFor="let skill of skills"
                class="w-20 h-20 bg-white dark:bg-zinc-900/40 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center group hover:border-red-600/30 hover:scale-105 transition-all cursor-pointer">
                <lucide-icon [img]="getSkillIcon(skill.icon)" class="w-6 h-6 text-zinc-400 dark:text-zinc-600 group-hover:text-red-500 transition-colors mb-1.5"></lucide-icon>
                <span class="text-[9px] font-bold uppercase tracking-wide text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{{ skill.name }}</span>
            </div>
        </div>
    </section>

    <!-- Edit Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-lg" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
                <h3 class="text-base font-black dark:text-white text-zinc-900">Manage Tech Stack</h3>
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
                    [class]="submitted && !item.name?.trim() ? 'border-red-500/50 bg-red-600/5' : 'border-zinc-200 dark:border-zinc-700'">
                    <div class="flex-1 space-y-2">
                        <div>
                            <input [(ngModel)]="item.name" placeholder="Skill Name *"
                                [class]="submitted && !item.name?.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700 focus:ring-red-500/30 focus:border-red-500'"
                                class="w-full px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 transition-all border">
                            <p *ngIf="submitted && !item.name?.trim()" class="text-red-500 text-[10px] font-bold mt-1 ms-1">Name is required</p>
                        </div>
                        <div class="flex gap-2">
                            <input [(ngModel)]="item.icon" placeholder="Icon key"
                                class="flex-1 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                            <input [(ngModel)]="item.order" type="number" placeholder="#"
                                class="w-16 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all text-center">
                        </div>
                    </div>
                    <button (click)="confirmDelete(i)"
                        class="w-7 h-7 rounded-lg bg-red-600/10 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shrink-0">
                        <lucide-icon [img]="TrashIcon" class="w-3.5 h-3.5"></lucide-icon>
                    </button>
                </div>
            </div>
            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="closeEditModal()" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">Cancel</button>
                <button (click)="saveSkills()" [disabled]="isSaving"
                    class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                    <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ isSaving ? 'Saving...' : 'Save All' }}
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
            <h4 class="text-base font-black dark:text-white text-zinc-900 mb-2">Delete Skill?</h4>
            <p class="text-sm text-zinc-500 mb-6">Are you sure you want to delete <strong class="text-zinc-900 dark:text-white">{{ editList[deleteIndex!]?.name || 'this skill' }}</strong>?</p>
            <div class="flex items-center justify-center gap-3">
                <button (click)="deleteIndex = null" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 transition-all">Cancel</button>
                <button (click)="executeDelete()" [disabled]="isDeleting"
                    class="px-6 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50">
                    {{ isDeleting ? 'Deleting...' : 'Delete' }}
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

    @Input() skills: SkillEntry[] = [];
    @Output() skillsUpdated = new EventEmitter<SkillEntry[]>();

    EditIcon = Edit3; XIcon = X; SaveIcon = Save; PlusIcon = Plus; TrashIcon = Trash2;
    AlertIcon = AlertTriangle; CheckIcon = CheckCircle;

    showEditModal = false; isSaving = false; isDeleting = false; submitted = false;
    editList: SkillEntry[] = [];
    deleteIndex: number | null = null;

    getSkillIcon(iconName?: string): any {
        const icons: { [key: string]: any } = {
            'lucide-angular': Code2, 'lucide-dot-net': Database, 'lucide-javascript': FileCode,
            'lucide-database': Database, 'lucide-html5': Code2, 'lucide-css3': Zap,
            'lucide-layout': Monitor, 'lucide-terminal': Terminal, 'lucide-github': Github
        };
        return icons[iconName || ''] || Code2;
    }

    openEditModal() {
        this.editList = this.skills.map(s => ({ ...s }));
        this.submitted = false;
        this.showEditModal = true;
    }

    closeEditModal() { this.showEditModal = false; }

    addNewSkill() { this.editList.push({ id: crypto.randomUUID(), name: '', icon: '', order: this.editList.length }); }

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
        if (this.editList.some(item => !item.name?.trim())) {
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
