import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, X, Save, Plus, Trash2, AlertTriangle, Upload, BookOpen } from 'lucide-angular';
import { EducationEntry } from '../../../models';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-education-timeline-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
    template: `
        <!-- Edit Modal -->
        <div *ngIf="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="onClose()">
            <div class="relative bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-modal-enter" (click)="$event.stopPropagation()">
                <!-- Header -->
                <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between z-20">
                    <h3 class="text-base font-black dark:text-white text-zinc-900">Manage Education</h3>
                    <div class="flex items-center gap-2">
                        <button (click)="addNewEntry()" class="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all">
                            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                        </button>
                        <button (click)="onClose()" class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                            <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                        </button>
                    </div>
                </div>

                <!-- Body -->
                <div class="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1 max-h-[70vh]">
                    <!-- Empty State for Edit Modal -->
                    <div *ngIf="editList.length === 0" class="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                        <div class="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                            <lucide-icon [img]="BookOpenIcon" class="w-8 h-8 text-zinc-400"></lucide-icon>
                        </div>
                        <h4 class="text-sm font-black dark:text-white text-zinc-900 mb-2">No Entries Found</h4>
                        <p class="text-xs text-zinc-500 mb-6">There are no education entries yet.</p>
                        <button (click)="addNewEntry()" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Add New Entry</button>
                    </div>

                    <div *ngFor="let item of editList; let i = index"
                        class="p-4 rounded-xl border space-y-3"
                        [class]="submitted && (!item.institution.trim() || !item.degree.trim()) ? 'border-red-500/50 bg-red-600/5' : 'border-zinc-200 dark:border-zinc-700'">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Entry {{ i + 1 }}</span>
                            <button (click)="confirmDelete(i)"
                                class="w-7 h-7 rounded-lg bg-red-600/10 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                                <lucide-icon [img]="TrashIcon" class="w-3.5 h-3.5"></lucide-icon>
                            </button>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Category *</label>
                                <select [(ngModel)]="item.category"
                                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                                    <option value="Education">Education</option>
                                    <option value="Training">Training</option>
                                    <option value="Certification">Certification</option>
                                    <option value="Achievement">Achievement</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Duration *</label>
                                <input [(ngModel)]="item.duration" placeholder="e.g. 2020-2024"
                                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Institution (EN) *</label>
                                <input [(ngModel)]="item.institution" placeholder="Institution name"
                                    [class]="submitted && !item.institution.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700 focus:ring-red-500/30 focus:border-red-500'"
                                    class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 transition-all border">
                                <p *ngIf="submitted && !item.institution.trim()" class="text-red-500 text-[10px] font-bold mt-1.5 ms-1">Institution is required</p>
                            </div>
                            <div>
                                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Institution (AR)</label>
                                <input [(ngModel)]="item.institution_Ar" placeholder="اسم المؤسسة" dir="rtl"
                                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Degree/Title (EN) *</label>
                                <input [(ngModel)]="item.degree" placeholder="Degree or certification title"
                                    [class]="submitted && !item.degree.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700 focus:ring-red-500/30 focus:border-red-500'"
                                    class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 transition-all border">
                                <p *ngIf="submitted && !item.degree.trim()" class="text-red-500 text-[10px] font-bold mt-1.5 ms-1">Degree is required</p>
                            </div>
                            <div>
                                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Degree/Title (AR)</label>
                                <input [(ngModel)]="item.degree_Ar" placeholder="الدرجة أو اللقب" dir="rtl"
                                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (EN)</label>
                                <textarea [(ngModel)]="item.description" placeholder="Brief description" rows="2"
                                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                            </div>
                            <div>
                                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (AR)</label>
                                <textarea [(ngModel)]="item.description_Ar" placeholder="وصف مختصر" rows="2" dir="rtl"
                                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Location (EN)</label>
                                <input [(ngModel)]="item.location" placeholder="City, Country"
                                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Location (AR)</label>
                                <input [(ngModel)]="item.location_Ar" placeholder="المدينة، البلد" dir="rtl"
                                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                            </div>
                        </div>

                        <!-- Image Upload -->
                        <div>
                            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Institution Logo/Image</label>
                            <div class="flex items-center gap-3">
                                <div *ngIf="item.imageUrl" class="w-16 h-16 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 overflow-hidden flex-shrink-0">
                                    <img [src]="getImageUrl(item.imageUrl)" [alt]="item.institution" class="w-full h-full object-cover">
                                </div>
                                <div class="flex-1">
                                    <label class="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-red-500 hover:text-red-500 transition-all flex items-center gap-2 w-fit">
                                        <lucide-icon [img]="UploadIcon" class="w-3.5 h-3.5"></lucide-icon>
                                        {{ uploadingImageFor === item.id ? 'Uploading...' : 'Upload Image' }}
                                        <input type="file" class="hidden" (change)="onImageSelected($event, i)" accept="image/*" [disabled]="uploadingImageFor === item.id">
                                    </label>
                                    <p class="text-zinc-400 text-[9px] mt-1">Upload logo or certificate image (optional)</p>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <input type="checkbox" [(ngModel)]="item.isCompleted" [id]="'completed-' + i"
                                class="w-4 h-4 rounded border-zinc-300 text-red-600 focus:ring-red-500">
                            <label [for]="'completed-' + i" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 cursor-pointer">Completed</label>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                    <button (click)="onClose()"
                        class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">Cancel</button>
                    <button (click)="onSave()" [disabled]="isSaving"
                        class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                        <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                        {{ isSaving ? 'Saving...' : 'Save All' }}
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
                <h4 class="text-base font-black dark:text-white text-zinc-900 mb-2">Delete Entry?</h4>
                <p class="text-sm text-zinc-500 mb-6">Are you sure you want to delete <strong class="text-zinc-900 dark:text-white">{{ editList[deleteIndex!]?.degree || 'this entry' }}</strong>?</p>
                <div class="flex items-center justify-center gap-3">
                    <button (click)="deleteIndex = null"
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
export class EducationTimelineModalComponent implements OnChanges {
    private readonly profileService = inject(ProfileService);
    private readonly toast = inject(ToastService);

    @Input() isOpen = false;
    @Input() education: EducationEntry[] = [];
    @Input() isSaving = false;
    @Input() isDeleting = false;
    @Output() closed = new EventEmitter<void>();
    @Output() saved = new EventEmitter<EducationEntry[]>();
    @Output() deleted = new EventEmitter<string>();

    XIcon = X;
    SaveIcon = Save;
    PlusIcon = Plus;
    TrashIcon = Trash2;
    AlertIcon = AlertTriangle;
    UploadIcon = Upload;
    BookOpenIcon = BookOpen;

    editList: EducationEntry[] = [];
    submitted = false;
    deleteIndex: number | null = null;
    uploadingImageFor: string | null = null;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && this.isOpen && this.education) {
            this.editList = this.education.map(e => ({ ...e }));
            this.submitted = false;
        }
    }

    onClose(): void {
        this.closed.emit();
    }

    onSave(): void {
        this.submitted = true;
        if (this.editList.some(item => !item.institution.trim() || !item.degree.trim())) {
            this.toast.error('Please fill in all required fields');
            return;
        }
        this.saved.emit(this.editList);
    }

    addNewEntry(): void {
        this.editList.push({
            id: crypto.randomUUID(),
            institution: '',
            institution_Ar: '',
            degree: '',
            degree_Ar: '',
            duration: '',
            description: '',
            description_Ar: '',
            location: '',
            location_Ar: '',
            imageUrl: '',
            isCompleted: true,
            createdAt: new Date(),
            category: 'Education'
        });
    }

    confirmDelete(index: number): void {
        this.deleteIndex = index;
    }

    executeDelete(): void {
        if (this.deleteIndex === null) return;
        const item = this.editList[this.deleteIndex];
        if (item.id) {
            this.deleted.emit(item.id);
            this.editList.splice(this.deleteIndex, 1);
        } else {
            this.editList.splice(this.deleteIndex, 1);
        }
        this.deleteIndex = null;
    }

    onImageSelected(event: any, index: number): void {
        const file = event.target.files[0];
        if (!file) return;

        const item = this.editList[index];
        this.uploadingImageFor = item.id;

        this.profileService.uploadAvatar(file).subscribe({
            next: (res: any) => {
                item.imageUrl = res.url;
                this.uploadingImageFor = null;
                this.toast.success('Image uploaded successfully');
            },
            error: (err: any) => {
                this.uploadingImageFor = null;
                this.toast.error('Image upload failed: ' + (err.error?.message || 'Server error'));
            }
        });
    }

    getImageUrl(imageUrl: string): string {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('http')) return imageUrl;
        // Assuming ImageUtil is available, adjust as needed
        return imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
    }
}
