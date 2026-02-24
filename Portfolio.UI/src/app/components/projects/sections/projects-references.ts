import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, Quote, Edit3, Trash2, X, Save, Plus, AlertTriangle, Upload, User } from 'lucide-angular';
import { Testimonial } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-projects-references',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule, TranslateModule],
    template: `
    <section class="mt-48 animate-fade-in-up" style="animation-delay: 0.6s">
        <div class="flex items-center gap-4 mb-16 relative">
            <div class="w-1 h-12 bg-red-600 rounded-full"></div>
            <h2 class="text-4xl font-black dark:text-white text-zinc-900 tracking-tight uppercase italic">
                {{ 'projects.references.title' | translate }}
            </h2>
            
            <!-- Admin Panel -->
            <button *ngIf="auth.isLoggedIn()" (click)="openCreateModal()"
                class="ms-auto px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center gap-2">
                <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                {{ 'projects.references.addTestimonial' | translate }}
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let testimonial of testimonials"
                class="group bg-zinc-50 dark:bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 relative">
                
                <!-- Admin Actions -->
                <div *ngIf="auth.isLoggedIn()" class="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button (click)="onEdit(testimonial)"
                        class="w-8 h-8 rounded-lg bg-black/80 backdrop-blur-md flex items-center justify-center text-white hover:text-red-500 border border-white/10 transition-all">
                        <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
                    </button>
                    <button (click)="onDelete(testimonial)"
                        class="w-8 h-8 rounded-lg bg-black/80 backdrop-blur-md flex items-center justify-center text-white hover:text-red-600 border border-white/10 transition-all">
                        <lucide-icon [img]="DeleteIcon" class="w-3.5 h-3.5"></lucide-icon>
                    </button>
                </div>

                <div class="mb-6">
                    <lucide-icon [img]="QuoteIcon" class="w-10 h-10 text-red-600 opacity-20"></lucide-icon>
                </div>

                <p class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8 italic">
                    "{{ testimonial.content }}"
                </p>

                <div class="flex items-center gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center text-white font-black text-lg overflow-hidden">
                        <img *ngIf="testimonial.avatarUrl" 
                             [src]="getFullImageUrl(testimonial.avatarUrl)" 
                             alt="{{ testimonial.name }}" 
                             class="w-full h-full object-cover"
                             (error)="onImageError($event)">
                        <span *ngIf="!testimonial.avatarUrl">{{ testimonial.name.charAt(0) }}</span>
                    </div>
                    <div>
                        <h4 class="font-bold text-zinc-900 dark:text-white text-sm">{{ testimonial.name }}</h4>
                        <p class="text-zinc-500 text-xs">{{ testimonial.role }}<span *ngIf="testimonial.company"> at {{ testimonial.company }}</span></p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Edit/Create Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-2xl max-h-[90vh]" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
                <h3 class="text-base font-black dark:text-white text-zinc-900">{{ isCreating ? 'Add Testimonial' : 'Edit Testimonial' }}</h3>
                <button (click)="closeEditModal()"
                    class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                    <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                </button>
            </div>

            <div class="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Name *</label>
                        <input [(ngModel)]="editingTestimonial.name" placeholder="Full name"
                            [class]="submitted && editingTestimonial.name && !editingTestimonial.name.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700'"
                            class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all border">
                        <p *ngIf="submitted && editingTestimonial.name && !editingTestimonial.name.trim()" class="text-red-500 text-[10px] font-bold mt-1.5">Name is required</p>
                    </div>

                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Role *</label>
                        <input [(ngModel)]="editingTestimonial.role" placeholder="e.g. Senior Developer"
                            [class]="submitted && editingTestimonial.role && !editingTestimonial.role.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700'"
                            class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all border">
                        <p *ngIf="submitted && editingTestimonial.role && !editingTestimonial.role.trim()" class="text-red-500 text-[10px] font-bold mt-1.5">Role is required</p>
                    </div>

                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Company</label>
                        <input [(ngModel)]="editingTestimonial.company" placeholder="Company name (optional)"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Testimonial Content *</label>
                        <textarea [(ngModel)]="editingTestimonial.content" placeholder="What they said about you..." rows="4"
                            [class]="submitted && editingTestimonial.content && !editingTestimonial.content.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700'"
                            class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all border resize-none"></textarea>
                        <p *ngIf="submitted && editingTestimonial.content && !editingTestimonial.content.trim()" class="text-red-500 text-[10px] font-bold mt-1.5">Content is required</p>
                    </div>

                    <!-- Avatar Upload Section -->
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Avatar Image</label>
                        <div class="flex gap-3">
                            <div class="flex-1">
                                <input [(ngModel)]="editingTestimonial.avatarUrl" placeholder="Avatar URL or upload below"
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
                        <div *ngIf="editingTestimonial.avatarUrl" class="mt-3 flex items-center gap-3">
                            <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                                <img [src]="getFullImageUrl(editingTestimonial.avatarUrl)" 
                                     alt="Avatar preview" 
                                     class="w-full h-full object-cover"
                                     (error)="onImageError($event)">
                            </div>
                            <div class="flex-1">
                                <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Avatar Preview</p>
                                <p class="text-xs text-zinc-500 mt-0.5">This will appear next to the testimonial</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="closeEditModal()"
                    class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">Cancel</button>
                <button (click)="saveTestimonial()" [disabled]="isSaving"
                    class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                    <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ isSaving ? 'Saving...' : 'Save' }}
                </button>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation -->
    <div *ngIf="deleteTestimonial" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="deleteTestimonial = null"></div>
        <div class="relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-sm p-6 text-center animate-modal-enter">
            <div class="w-14 h-14 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <lucide-icon [img]="AlertIcon" class="w-7 h-7 text-red-500"></lucide-icon>
            </div>
            <h4 class="text-base font-black dark:text-white text-zinc-900 mb-2">Delete Testimonial?</h4>
            <p class="text-sm text-zinc-500 mb-6">Are you sure you want to delete the testimonial from <strong class="text-zinc-900 dark:text-white">{{ deleteTestimonial.name }}</strong>?</p>
            <div class="flex items-center justify-center gap-3">
                <button (click)="deleteTestimonial = null"
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
    public auth = inject(AuthService);
    private profileService = inject(ProfileService);
    private toast = inject(ToastService);
    private http = inject(HttpClient);

    @Input() testimonials: Testimonial[] = [];
    @Output() testimonialsUpdated = new EventEmitter<Testimonial[]>();

    QuoteIcon = Quote;
    EditIcon = Edit3;
    DeleteIcon = Trash2;
    XIcon = X;
    SaveIcon = Save;
    PlusIcon = Plus;
    AlertIcon = AlertTriangle;
    UploadIcon = Upload;
    UserIcon = User;

    showEditModal = false;
    isSaving = false;
    isDeleting = false;
    isUploading = false;
    submitted = false;
    isCreating = false;
    deleteTestimonial: Testimonial | null = null;
    editingTestimonial: Partial<Testimonial> = {};

    onEdit(testimonial: Testimonial) {
        this.editingTestimonial = { ...testimonial };
        this.isCreating = false;
        this.submitted = false;
        this.showEditModal = true;
    }

    onDelete(testimonial: Testimonial) {
        this.deleteTestimonial = testimonial;
    }

    openCreateModal() {
        this.editingTestimonial = {
            name: '',
            role: '',
            company: '',
            content: '',
            avatarUrl: ''
        };
        this.isCreating = true;
        this.submitted = false;
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
        this.editingTestimonial = {};
    }

    onAvatarFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 2MB for avatars)
        if (file.size > 2 * 1024 * 1024) {
            this.toast.error('Image size must be less than 2MB');
            return;
        }

        this.uploadAvatar(file);
    }

    uploadAvatar(file: File) {
        // Check if user is logged in
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
                    this.editingTestimonial.avatarUrl = response.url;
                    this.isUploading = false;
                    this.toast.success('Avatar uploaded successfully');
                },
                error: (err) => {
                    this.isUploading = false;
                    console.error('Avatar Upload Error:', err);
                    
                    if (err.status === 401) {
                        this.toast.error('Authentication failed. Please log in again.');
                        this.auth.logout();
                        window.location.href = '/login';
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

    saveTestimonial() {
        this.submitted = true;

        if (!this.editingTestimonial.name || !this.editingTestimonial.name.trim() || 
            !this.editingTestimonial.role || !this.editingTestimonial.role.trim() || 
            !this.editingTestimonial.content || !this.editingTestimonial.content.trim()) {
            this.toast.error('Please fill in all required fields');
            return;
        }

        this.isSaving = true;

        const testimonialData: any = {
            id: this.editingTestimonial.id || crypto.randomUUID(),
            name: this.editingTestimonial.name,
            role: this.editingTestimonial.role,
            company: this.editingTestimonial.company || '',
            content: this.editingTestimonial.content,
            avatarUrl: this.editingTestimonial.avatarUrl || ''
        };

        const request = this.isCreating
            ? this.profileService.createTestimonial(testimonialData)
            : this.profileService.updateTestimonial(this.editingTestimonial.id!, testimonialData);

        request.subscribe({
            next: (savedTestimonial: Testimonial) => {
                if (this.isCreating) {
                    this.testimonials = [...this.testimonials, savedTestimonial];
                } else {
                    const index = this.testimonials.findIndex(t => t.id === savedTestimonial.id);
                    if (index !== -1) {
                        this.testimonials[index] = savedTestimonial;
                        this.testimonials = [...this.testimonials];
                    }
                }
                this.testimonialsUpdated.emit(this.testimonials);
                this.isSaving = false;
                this.showEditModal = false;
                this.toast.success(`Testimonial ${this.isCreating ? 'created' : 'updated'} successfully`);
            },
            error: (err) => {
                this.isSaving = false;
                this.toast.error(`Failed to ${this.isCreating ? 'create' : 'update'} testimonial`);
                console.error('Testimonial Save Error:', err);
            }
        });
    }

    executeDelete() {
            if (!this.deleteTestimonial?.id) return;

            this.isDeleting = true;
            this.profileService.deleteTestimonial(this.deleteTestimonial.id).subscribe({
                next: () => {
                    this.testimonials = this.testimonials.filter(t => t.id !== this.deleteTestimonial!.id);
                    this.testimonialsUpdated.emit(this.testimonials);
                    this.deleteTestimonial = null;
                    this.isDeleting = false;
                    this.toast.success('Testimonial deleted successfully');
                },
                error: (err) => {
                    this.isDeleting = false;
                    this.deleteTestimonial = null;
                    if (err.status === 401) {
                        this.toast.error('Authentication failed. Please log in again.');
                        this.auth.logout();
                        window.location.href = '/login';
                    } else {
                        this.toast.error('Failed to delete testimonial');
                    }
                    console.error('Testimonial Delete Error:', err);
                }
            });
        }

        getFullImageUrl(url: string): string {
            if (!url) return '';

            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url;
            }

            if (url.startsWith('/')) {
                return `${environment.apiUrl.replace('/api', '')}${url}`;
            }

            return `${environment.apiUrl.replace('/api', '')}/${url}`;
        }

        onImageError(event: Event) {
            const img = event.target as HTMLImageElement;
            img.style.display = 'none';
        }
    }
