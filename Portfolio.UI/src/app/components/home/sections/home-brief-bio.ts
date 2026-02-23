import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Code2, Zap, Edit3, X, Save, AlertTriangle, CheckCircle } from 'lucide-angular';
import { BioEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-home-brief-bio',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    template: `
    <section class="animate-fade-in-up">
        <div class="flex items-center gap-4 mb-6 relative">
            <h1 class="text-3xl md:text-5xl font-black dark:text-white text-zinc-900 tracking-tighter leading-tight">
                {{ headingPart1 }} <span class="text-[#f20d0d]">{{ headingHighlight }}</span><br>
                {{ headingPart2 }}
            </h1>
            <button *ngIf="auth.isLoggedIn()" (click)="openEditModal()"
                class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-110 hover:text-red-500 transition-all ml-4">
                <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
            </button>
        </div>

        <p class="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl mb-10 font-medium">
            {{ bio?.description }}
        </p>

        <div class="grid grid-cols-3 gap-4 md:gap-8 max-w-xl">
            <div class="p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 hover:border-red-600/20 transition-all group">
                <div class="text-2xl md:text-3xl font-black text-[#f20d0d] mb-1 group-hover:scale-110 transition-transform origin-left">{{ bio?.yearsOfExperience }}+</div>
                <div class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Years of Experience</div>
            </div>
            <div class="p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 hover:border-red-600/20 transition-all group">
                <div class="text-2xl md:text-3xl font-black text-[#f20d0d] mb-1 group-hover:scale-110 transition-transform origin-left">{{ bio?.projectsCompleted }}</div>
                <div class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Projects Completed</div>
            </div>
            <div class="p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 hover:border-red-600/20 transition-all group">
                <div class="text-2xl md:text-3xl font-black text-[#f20d0d] mb-1 group-hover:scale-110 transition-transform origin-left">{{ bio?.codeCommits }}k</div>
                <div class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Code Commits</div>
            </div>
        </div>
    </section>

    <!-- Edit Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-lg" (click)="$event.stopPropagation()">
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
                <h3 class="text-base font-black dark:text-white text-zinc-900">Edit Bio Section</h3>
                <button (click)="closeEditModal()"
                    class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                    <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                </button>
            </div>

            <!-- Modal Body -->
            <div class="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description</label>
                    <textarea [(ngModel)]="editForm.description" rows="5"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                </div>
                <div class="grid grid-cols-3 gap-4 pb-4">
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Yrs Exp.</label>
                        <input [(ngModel)]="editForm.yearsOfExperience" type="text"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Projects</label>
                        <input [(ngModel)]="editForm.projectsCompleted" type="text"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Commits</label>
                        <input [(ngModel)]="editForm.codeCommits" type="text"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="closeEditModal()"
                    class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">
                    Cancel
                </button>
                <button (click)="saveBio()" [disabled]="isSaving"
                    class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                    <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
            </div>
        </div>
    </div>
  `
})
export class HomeBriefBioComponent {
    public auth = inject(AuthService);
    private profileService = inject(ProfileService);
    private toast = inject(ToastService);

    @Input() bio?: BioEntry;
    @Output() bioUpdated = new EventEmitter<BioEntry>();

    // Icons
    Code2Icon = Code2;
    ZapIcon = Zap;
    EditIcon = Edit3;
    XIcon = X;
    SaveIcon = Save;
    AlertIcon = AlertTriangle;
    CheckIcon = CheckCircle;

    // Heading parts
    headingPart1 = 'Innovative';
    headingHighlight = 'Solutions';
    headingPart2 = 'Builder';

    // Edit modal state
    showEditModal = false;
    isSaving = false;
    editForm: Partial<BioEntry> = {};

    openEditModal() {
        if (this.bio) {
            console.log('Bio data received (Brief):', this.bio);
            // Reconcile ID casing
            const id = this.bio.id || (this.bio as any).Id || (this.bio as any).ID || crypto.randomUUID();
            this.editForm = { ...this.bio, id } as BioEntry;
        } else {
            this.editForm = { id: crypto.randomUUID() };
        }
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
    }

    saveBio() {
        if (!this.editForm.id) {
            this.toast.error('System error: Bio ID is missing. Please refresh.');
            return;
        }
        this.isSaving = true;
        this.profileService.updateBio(this.editForm.id, this.editForm as BioEntry).subscribe({
            next: () => {
                this.bio = { ...this.editForm } as BioEntry;
                this.bioUpdated.emit(this.bio);
                this.showEditModal = false;
                this.isSaving = false;
                this.toast.success('Bio section updated successfully');
            },
            error: (err) => {
                this.isSaving = false;
                this.toast.error('Failed to save: ' + (err.error?.message || err.statusText || 'Server error'));
            }
        });
    }
}
