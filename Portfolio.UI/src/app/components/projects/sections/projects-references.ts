import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Quote, Plus, Edit3, Trash2, X, Save, AlertTriangle, Upload } from 'lucide-angular';
import { AuthService } from '../../../services/auth.service';
import { ProjectsPageService } from '../../../services/projects-page.service';
import { ToastService } from '../../../services/toast.service';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from '../../../services/translation.service';
import { ImageUtil } from '../../../utils/image.util';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Reference } from '../../../models';

@Component({
    selector: 'app-projects-references',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule, TranslateModule],
    template: `
    <section class="animate-fade-in-up" style="animation-delay: 0.6s">
        <div class="flex items-center gap-4 mb-12 relative">
            <div class="w-1 h-12 bg-red-600 rounded-full"></div>
            <h2 class="text-4xl font-black dark:text-white text-zinc-900 tracking-tight uppercase italic">
                {{ 'projects.references.title' | translate }}
            </h2>
            
            <!-- Admin Panel -->
            <button *ngIf="auth.isLoggedIn()" (click)="openCreateModal()"
                class="ms-auto px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center gap-2">
                <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                {{ 'projects.references.addReference' | translate }}
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let reference of references"
                class="group bg-zinc-50 dark:bg-zinc-900/40 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-red-600 hover:shadow-xl hover:shadow-red-600/10 hover:-translate-y-2 transition-all duration-500 relative">
                
                <!-- Admin Actions -->
                <div *ngIf="auth.isLoggedIn()" class="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button (click)="onEdit(reference)"
                        class="w-8 h-8 rounded-lg bg-black/80 backdrop-blur-md flex items-center justify-center text-white hover:text-red-500 border border-white/10 transition-all">
                        <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
                    </button>
                    <button (click)="onDelete(reference)"
                        class="w-8 h-8 rounded-lg bg-black/80 backdrop-blur-md flex items-center justify-center text-white hover:text-red-600 border border-white/10 transition-all">
                        <lucide-icon [img]="DeleteIcon" class="w-3.5 h-3.5"></lucide-icon>
                    </button>
                </div>

                <div class="mb-6">
                    <lucide-icon [img]="QuoteIcon" class="w-10 h-10 text-red-600 opacity-20"></lucide-icon>
                </div>

                <p class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8 italic">
                    "{{ getReferenceContent(reference) }}"
                </p>

                <div class="flex items-center gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center text-white font-black text-lg overflow-hidden">
                        <img *ngIf="reference.imagePath" 
                             [src]="getFullImageUrl(reference.imagePath)" 
                             alt="{{ reference.name }}" 
                             class="w-full h-full object-cover"
                             (error)="onImageError($event)">
                        <span *ngIf="!reference.imagePath">{{ reference.name.charAt(0) }}</span>
                    </div>
                    <div>
                        <h4 class="font-bold text-zinc-900 dark:text-white text-sm">{{ reference.name }}</h4>
                        <p class="text-zinc-500 text-xs">{{ getReferenceRole(reference) }}<span *ngIf="getReferenceCompany(reference)"> at {{ getReferenceCompany(reference) }}</span></p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Edit/Create Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-2xl max-h-[90vh]" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
                <h3 class="text-base font-black dark:text-white text-zinc-900">{{ isCreating ? 'Add Reference' : 'Edit Reference' }}</h3>
                <button (click)="closeEditModal()"
                    class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                    <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                </button>
            </div>

            <div class="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Name *</label>
                        <input [(ngModel)]="editingReference.name" placeholder="Full name"
                            [class]="submitted && editingReference.name && !editingReference.name.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700'"
                            class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all border">
                        <p *ngIf="submitted && editingReference.name && !editingReference.name.trim()" class="text-red-500 text-[10px] font-bold mt-1.5">Name is required</p>
                    </div>

                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Role (EN) *</label>
                        <input [(ngModel)]="editingReference.role" placeholder="e.g. Senior Developer"
                            [class]="submitted && editingReference.role && !editingReference.role.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700'"
                            class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all border">
                        <p *ngIf="submitted && editingReference.role && !editingReference.role.trim()" class="text-red-500 text-[10px] font-bold mt-1.5">Role is required</p>
                    </div>

                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Role (AR)</label>
                        <input [(ngModel)]="editingReference.role_Ar" placeholder="مثال: مطور أول" dir="rtl"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Company (EN)</label>
                        <input [(ngModel)]="editingReference.company" placeholder="Company name (optional)"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Company (AR)</label>
                        <input [(ngModel)]="editingReference.company_Ar" placeholder="اسم الشركة (اختياري)" dir="rtl"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Reference Content (EN) *</label>
                        <textarea [(ngModel)]="editingReference.content" placeholder="What they said about you..." rows="4"
                            [class]="submitted && editingReference.content && !editingReference.content.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700'"
                            class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all border resize-none"></textarea>
                        <p *ngIf="submitted && editingReference.content && !editingReference.content.trim()" class="text-red-500 text-[10px] font-bold mt-1.5">Content is required</p>
                    </div>

                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Reference Content (AR)</label>
                        <textarea [(ngModel)]="editingReference.content_Ar" placeholder="ما قالوه عنك..." rows="4" dir="rtl"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                    </div>

                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Phone</label>
                        <input [(ngModel)]="editingReference.phone" placeholder="Phone number (optional)"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Email</label>
                        <input [(ngModel)]="editingReference.email" placeholder="Email (optional)"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Social Link</label>
                        <input [(ngModel)]="editingReference.socialLink" placeholder="LinkedIn, Twitter, etc. (optional)"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <!-- Image Upload Section -->
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Avatar Image</label>
                        <div class="flex gap-3">
                            <div class="flex-1">
                                <input [(ngModel)]="editingReference.imagePath" placeholder="Avatar URL or upload below"
                                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                            </div>
                            <label [class.opacity-50]="isUploading" [class.pointer-events-none]="isUploading"
                                class="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer flex items-center gap-2">
                                <lucide-icon [img]="UploadIcon" class="w-4 h-4"></lucide-icon>
                                <span class="text-[10px] font-bold uppercase tracking-widest">{{ isUploading ? 'Uploading...' : 'Upload' }}</span>
                                <input type="file" accept="image/*" (change)="onAvatarFileSelected($event)" class="hidden">
                            </label>
                        </div>
                        <!-- Avatar Preview -->
                        <div *ngIf="editingReference.imagePath" class="mt-3 flex items-center gap-3">
                            <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                                <img [src]="getFullImageUrl(editingReference.imagePath)" 
                                     alt="Avatar preview" 
                                     class="w-full h-full object-cover"
                                     (error)="onImageError($event)">
                            </div>
                            <div class="flex-1">
                                <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Avatar Preview</p>
                                <p class="text-xs text-zinc-500 mt-0.5">This will appear next to the reference</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="closeEditModal()"
                    class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">Cancel</button>
                <button (click)="saveReference()" [disabled]="isSaving"
                    class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                    <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ isSaving ? 'Saving...' : 'Save' }}
                </button>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation -->
    <div *ngIf="deleteReference" class="modal-overlay">
        <div class="modal-content max-w-sm" (click)="$event.stopPropagation()">
            <div class="p-6 text-center">
            <div class="w-14 h-14 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <lucide-icon [img]="AlertIcon" class="w-7 h-7 text-red-500"></lucide-icon>
            </div>
            <h4 class="text-base font-black dark:text-white text-zinc-900 mb-2">Delete Reference?</h4>
            <p class="text-sm text-zinc-500 mb-6">Are you sure you want to delete the reference from <strong class="text-zinc-900 dark:text-white">{{ deleteReference.name }}</strong>?</p>
            <div class="flex items-center justify-center gap-3">
                <button (click)="deleteReference = null"
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
export class ProjectsReferencesComponent {
    readonly auth = inject(AuthService);
    private readonly projectsPageService = inject(ProjectsPageService);
    private readonly toast = inject(ToastService);
    private readonly http = inject(HttpClient);
    private readonly translationService = inject(TranslationService);
    private readonly router = inject(Router);

    @Input() references: Reference[] = [];
    @Output() referencesUpdated = new EventEmitter<Reference[]>();

    QuoteIcon = Quote;
    EditIcon = Edit3;
    DeleteIcon = Trash2;
    XIcon = X;
    SaveIcon = Save;
    PlusIcon = Plus;
    AlertIcon = AlertTriangle;
    UploadIcon = Upload;

    showEditModal = false;
    isSaving = false;
    isDeleting = false;
    isUploading = false;
    submitted = false;
    isCreating = false;
    deleteReference: Reference | null = null;
    editingReference: Partial<Reference> = {};

    getReferenceRole(reference: Reference): string {
        const currentLang = this.translationService.currentLang$();
        if (currentLang === 'ar' && reference.role_Ar) {
            return reference.role_Ar;
        }
        return reference.role || '';
    }

    getReferenceCompany(reference: Reference): string {
        const currentLang = this.translationService.currentLang$();
        if (currentLang === 'ar' && reference.company_Ar) {
            return reference.company_Ar;
        }
        return reference.company || '';
    }

    getReferenceContent(reference: Reference): string {
        const currentLang = this.translationService.currentLang$();
        if (currentLang === 'ar' && reference.content_Ar) {
            return reference.content_Ar;
        }
        return reference.content;
    }

    onEdit(reference: Reference) {
        this.editingReference = { ...reference };
        this.isCreating = false;
        this.submitted = false;
        this.showEditModal = true;
    }

    onDelete(reference: Reference) {
        this.deleteReference = reference;
    }

    openCreateModal() {
        this.editingReference = {
            name: '',
            role: '',
            role_Ar: '',
            company: '',
            company_Ar: '',
            content: '',
            content_Ar: '',
            imagePath: '',
            phone: '',
            email: '',
            socialLink: ''
        };
        this.isCreating = true;
        this.submitted = false;
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
        this.editingReference = {};
    }

    onAvatarFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];
        
        if (!file.type.startsWith('image/')) {
            this.toast.error('Please select an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            this.toast.error('Image size must be less than 2MB');
            return;
        }

        this.uploadAvatar(file);
    }

    uploadAvatar(file: File) {
        if (!this.auth.isLoggedIn()) {
            this.toast.error('You must be logged in to upload images');
            return;
        }

        this.isUploading = true;
        const formData = new FormData();
        formData.append('file', file);

        this.http.post<{ url: string }>(`${environment.apiUrl}/uploads/profile-image`, formData)
            .subscribe({
                next: (response) => {
                    this.editingReference.imagePath = response.url;
                    this.isUploading = false;
                    this.toast.success('Avatar uploaded successfully');
                },
                error: (err: any) => {
                    this.isUploading = false;
                    console.error('Avatar Upload Error:', err);
                    
                    if (err.status === 401) {
                        this.toast.error('Authentication failed. Please log in again.');
                        this.auth.logout();
                        globalThis.location.href = '/login';
                    } else if (err.status === 400) {
                        this.toast.error(err.error?.message || 'Invalid file. Please check file type and size.');
                    } else if (err.status === 500) {
                        this.toast.error(err.error || 'Server error while uploading image');
                    } else {
                        this.toast.error('Failed to upload avatar. Please try again.');
                    }
                }
            });
    }

    saveReference() {
        this.submitted = true;

        if (!this.editingReference.name?.trim() || 
            !this.editingReference.role?.trim() || 
            !this.editingReference.content?.trim()) {
            this.toast.error('Please fill in all required fields');
            return;
        }

        this.isSaving = true;

        const referenceData: Reference = {
            id: this.editingReference.id || crypto.randomUUID(),
            name: this.editingReference.name || '',
            role: this.editingReference.role || '',
            role_Ar: this.editingReference.role_Ar,
            company: this.editingReference.company || '',
            company_Ar: this.editingReference.company_Ar,
            content: this.editingReference.content || '',
            content_Ar: this.editingReference.content_Ar,
            imagePath: this.editingReference.imagePath,
            phone: this.editingReference.phone,
            email: this.editingReference.email,
            socialLink: this.editingReference.socialLink,
            publishedAt: this.editingReference.publishedAt || new Date(),
            createdAt: this.editingReference.createdAt || new Date(),
            updatedAt: new Date()
        };

        const request = this.isCreating
            ? this.projectsPageService.createReference(referenceData)
            : this.projectsPageService.updateReference(this.editingReference.id as string, referenceData);

        request.subscribe({
            next: (savedReference: Reference) => {
                if (this.isCreating) {
                    this.references = [...this.references, savedReference];
                } else {
                    const index = this.references.findIndex(r => r.id === savedReference.id);
                    if (index !== -1) {
                        this.references[index] = savedReference;
                        this.references = [...this.references];
                    }
                }
                this.referencesUpdated.emit(this.references);
                this.isSaving = false;
                this.showEditModal = false;
                this.toast.success(`Reference ${this.isCreating ? 'created' : 'updated'} successfully`);
            },
            error: (err: any) => {
                this.isSaving = false;
                this.toast.error(`Failed to ${this.isCreating ? 'create' : 'update'} reference`);
                console.error('Reference Save Error:', err);
            }
        });
    }

    executeDelete() {
        if (!this.deleteReference?.id) return;

        this.isDeleting = true;
        this.projectsPageService.deleteReference(this.deleteReference.id).subscribe({
            next: () => {
                this.references = this.references.filter(r => r.id !== this.deleteReference!.id);
                this.referencesUpdated.emit(this.references);
                this.deleteReference = null;
                this.isDeleting = false;
                this.toast.success('Reference deleted successfully');
            },
            error: (err: any) => {
                this.isDeleting = false;
                this.deleteReference = null;
                if (err.status === 401) {
                    this.toast.error('Authentication failed. Please log in again.');
                    this.auth.logout();
                    globalThis.location.href = '/login';
                } else {
                    this.toast.error('Failed to delete reference');
                }
                console.error('Reference Delete Error:', err);
            }
        });
    }

    onImageError(event: Event) {
        ImageUtil.onImageErrorHide(event);
    }

    // Use ImageUtil.getFullImageUrl() directly in template via method binding
    getFullImageUrl = ImageUtil.getFullImageUrl;
}
