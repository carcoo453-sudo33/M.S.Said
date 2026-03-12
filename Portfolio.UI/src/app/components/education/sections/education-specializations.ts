import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, Edit3, X, Save, Plus, Trash2 } from 'lucide-angular';
import { BioEntry } from '../../../models/bio.model';
import { AuthService } from '../../../services/auth.service';
import { HomeService } from '../../../services/home.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-education-specializations',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
    template: `
    <div
        class="mt-2 p-16 dark:bg-zinc-900/40 bg-zinc-50/50 backdrop-blur-xl rounded-xl border border-zinc-200 dark:border-zinc-800 text-center animate-fade-in-up relative">
        
        <!-- Edit Button -->
        <button *ngIf="auth.isLoggedIn()" (click)="openEditModal()"
            class="absolute top-4 right-4 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-110 hover:text-red-500 transition-all">
            <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
        </button>

        <h2 class="text-xl font-black mb-6 uppercase tracking-tight dark:text-white text-zinc-900" [innerHTML]="getTitle()">
        </h2>
        <p class="text-zinc-500 dark:text-zinc-400 mb-12 max-w-2xl mx-auto text-sm">
            {{ getDescription() }}
        </p>
        <div class="flex flex-wrap justify-center gap-4">
            <span
                *ngFor="let focus of getFocusItems()"
                class="px-6 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-red-600 hover:border-red-600/30 transition-all shadow-sm">
                {{ focus }}
            </span>
        </div>
    </div>

    <!-- Edit Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-2xl" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
                <h3 class="text-base font-black dark:text-white text-zinc-900">Manage Technical Focus</h3>
                <button (click)="closeEditModal()"
                    class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                    <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                </button>
            </div>

            <div class="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Title (EN)</label>
                    <input [(ngModel)]="editForm['technicalFocusTitle']" placeholder="e.g., Technical Focus"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Title (AR)</label>
                    <input [(ngModel)]="editForm['technicalFocusTitle_Ar']" placeholder="e.g., التركيز التقني" dir="rtl"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (EN)</label>
                    <textarea [(ngModel)]="editForm['technicalFocusDescription']" rows="3"
                        placeholder="Describe your technical focus..."
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (AR)</label>
                    <textarea [(ngModel)]="editForm['technicalFocusDescription_Ar']" rows="3" dir="rtl"
                        placeholder="صف تركيزك التقني..."
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                </div>
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Focus Items (EN)</label>
                        <button (click)="addFocusItem()" type="button"
                            class="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all">
                            <lucide-icon [img]="PlusIcon" class="w-3.5 h-3.5"></lucide-icon>
                        </button>
                    </div>
                    <div class="space-y-2">
                        <div *ngFor="let item of focusItemsList; let i = index" class="flex items-center gap-2">
                            <input [(ngModel)]="focusItemsList[i]" placeholder="e.g., ASP.NET Core"
                                class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                            <button (click)="removeFocusItem(i)" type="button"
                                class="w-8 h-8 rounded-lg bg-red-600/10 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                                <lucide-icon [img]="TrashIcon" class="w-3.5 h-3.5"></lucide-icon>
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Focus Items (AR) - Comma Separated</label>
                    <textarea [(ngModel)]="editForm['technicalFocusItems_Ar']" rows="2" dir="rtl"
                        placeholder="e.g., ASP.NET Core, Angular, أنظمة موزعة"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                </div>
            </div>

            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="closeEditModal()"
                    class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">
                    Cancel
                </button>
                <button (click)="saveTechnicalFocus()" [disabled]="isSaving"
                    class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                    <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
            </div>
        </div>
    </div>
  `
})
export class EducationSpecializationsComponent {
    @Input() bio?: BioEntry;
    @Output() bioUpdated = new EventEmitter<BioEntry>();
    
    public auth = inject(AuthService);
    private translate = inject(TranslateService);
    private homeService = inject(HomeService);
    private toast = inject(ToastService);

    // Icons
    EditIcon = Edit3;
    XIcon = X;
    SaveIcon = Save;
    PlusIcon = Plus;
    TrashIcon = Trash2;

    // Edit state
    showEditModal = false;
    isSaving = false;
    editForm: Partial<BioEntry> = {};
    focusItemsList: string[] = [];

    private defaultItems = ['ASP.NET Core', 'Angular', 'Distributed Systems', 'Cloud Architecture', 'Identity & Security', 'RESTful APIs', 'SQL Server', 'Entity Framework'];

    getTitle(): string {
        const currentLang = this.translate.currentLang || 'en';
        let title = '';
        
        if (currentLang === 'ar' && this.bio?.['technicalFocusTitle_Ar']) {
            title = this.bio['technicalFocusTitle_Ar'];
        } else if (this.bio?.['technicalFocusTitle']) {
            title = this.bio['technicalFocusTitle'];
        } else {
            title = this.translate.instant('education.technicalFocusTitle');
        }
        
        const parts = title.split(' ');
        if (parts.length > 1) {
            const lastWord = parts.pop();
            return `${parts.join(' ')} <span class="text-red-600">${lastWord}</span>`;
        }
        return title;
    }

    getDescription(): string {
        const currentLang = this.translate.currentLang || 'en';
        
        if (currentLang === 'ar' && this.bio?.['technicalFocusDescription_Ar']) {
            return this.bio['technicalFocusDescription_Ar'];
        }
        return this.bio?.['technicalFocusDescription'] || this.translate.instant('education.technicalFocusDescription');
    }

    getFocusItems(): string[] {
        const currentLang = this.translate.currentLang || 'en';
        
        if (currentLang === 'ar' && this.bio?.['technicalFocusItems_Ar']) {
            return (this.bio['technicalFocusItems_Ar'] as string).split(',').map((item: string) => item.trim());
        }
        
        if (this.bio?.['technicalFocusItems']) {
            return (this.bio['technicalFocusItems'] as string).split(',').map((item: string) => item.trim());
        }
        return this.defaultItems;
    }

    openEditModal() {
        if (this.bio) {
            this.editForm = { ...this.bio };
            this.focusItemsList = this.bio.technicalFocusItems 
                ? this.bio.technicalFocusItems.split(',').map(item => item.trim())
                : [...this.defaultItems];
        } else {
            this.editForm = {};
            this.focusItemsList = [...this.defaultItems];
        }
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
    }

    addFocusItem() {
        this.focusItemsList.push('');
    }

    removeFocusItem(index: number) {
        this.focusItemsList.splice(index, 1);
    }

    saveTechnicalFocus() {
        if (!this.bio?.id) {
            this.toast.error('Bio ID is missing. Please refresh the page.');
            return;
        }

        // Convert focus items list to comma-separated string
        this.editForm.technicalFocusItems = this.focusItemsList
            .filter(item => item.trim())
            .join(', ');

        this.isSaving = true;
        this.homeService.updateBio(this.bio.id, this.editForm as BioEntry).subscribe({
            next: (updatedBio: BioEntry) => {
                this.bio = updatedBio;
                this.bioUpdated.emit(updatedBio);
                this.showEditModal = false;
                this.isSaving = false;
                this.toast.success('Technical Focus updated successfully');
            },
            error: (err: any) => {
                this.isSaving = false;
                this.toast.error('Failed to save: ' + (err.error?.message || err.statusText || 'Server error'));
            }
        });
    }
}
