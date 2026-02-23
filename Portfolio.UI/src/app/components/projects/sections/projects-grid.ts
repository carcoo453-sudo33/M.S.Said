import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProjectEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ProjectService } from '../../../services/project.service';
import { ToastService } from '../../../services/toast.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, Edit3, Trash2, X, Save, Plus, AlertTriangle, Upload, Image } from 'lucide-angular';

@Component({
    selector: 'app-projects-grid',
    standalone: true,
    imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule],
    template: `
    <!-- Add Project Button -->
    <div *ngIf="auth.isLoggedIn()" class="flex justify-end mb-6">
        <button (click)="openCreateModal()"
            class="px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center gap-2">
            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
            Add Project
        </button>
    </div>

    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in-up"
        style="animation-delay: 0.2s">
        <div *ngFor="let project of projects; let i = index" [routerLink]="['/projects', project.slug]"
            class="group cursor-pointer bg-white dark:bg-zinc-900/40 rounded-[2rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-700 relative flex flex-col">

            <!-- Year Badge -->
            <div class="absolute top-4 right-4 z-20">
                <span
                    class="bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-red-600 border border-white/10 uppercase tracking-widest">
                    {{ (project.duration || '2024').split('-')[0] }}
                </span>
            </div>

            <!-- Admin Actions -->
            <div *ngIf="auth.isLoggedIn()" class="absolute top-4 left-4 z-20 flex gap-2">
                <button (click)="onEdit($event, project)"
                    class="w-10 h-10 rounded-lg bg-black/80 backdrop-blur-md flex items-center justify-center text-white hover:text-red-500 border border-white/10 transition-all">
                    <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
                </button>
                <button (click)="onDelete($event, project)"
                    class="w-10 h-10 rounded-lg bg-black/80 backdrop-blur-md flex items-center justify-center text-white hover:text-red-600 border border-white/10 transition-all">
                    <lucide-icon [img]="DeleteIcon" class="w-4 h-4"></lucide-icon>
                </button>
            </div>

            <div class="relative aspect-[16/10] overflow-hidden">
                <img [src]="project.imageUrl || 'assets/project-placeholder.png'"
                    class="w-full h-full object-cover dark:grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1000ms]">
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div class="p-8 flex-1 flex flex-col">
                <div class="mb-4">
                    <h3
                        class="text-2xl font-bold dark:text-white text-zinc-900 mb-2 group-hover:text-red-600 transition-colors uppercase italic tracking-tighter">
                        {{ project.title }}
                    </h3>
                    <p
                        class="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        {{ project.niche }}
                    </p>
                </div>

                <p
                    class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                    {{ project.description }}
                </p>

                <div class="flex flex-wrap gap-2 mb-8 mt-auto">
                    <span *ngFor="let tech of project.technologies.split(',')"
                        class="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 font-black px-3 py-1.5 rounded-lg text-[8px] uppercase border border-zinc-100 dark:border-zinc-700 tracking-wider">
                        {{ tech.trim() }}
                    </span>
                </div>

                <button
                    class="w-full py-4 rounded-xl border border-red-600/20 text-red-600 font-bold text-[10px] uppercase tracking-widest group-hover:bg-red-600 group-hover:text-white transition-all shadow-lg shadow-red-600/5">
                    View Case Study
                </button>
            </div>
        </div>
    </section>

    <!-- Edit/Create Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-3xl max-h-[90vh]" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
                <h3 class="text-base font-black dark:text-white text-zinc-900">{{ isCreating ? 'Create Project' : 'Edit Project' }}</h3>
                <button (click)="closeEditModal()"
                    class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                    <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                </button>
            </div>

            <div class="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Title *</label>
                        <input [(ngModel)]="editingProject.title" placeholder="Project title"
                            [class]="submitted && !editingProject.title?.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700'"
                            class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all border">
                        <p *ngIf="submitted && !editingProject.title?.trim()" class="text-red-500 text-[10px] font-bold mt-1.5">Title is required</p>
                    </div>

                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description *</label>
                        <textarea [(ngModel)]="editingProject.description" placeholder="Project description" rows="3"
                            [class]="submitted && !editingProject.description?.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700'"
                            class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all border resize-none"></textarea>
                        <p *ngIf="submitted && !editingProject.description?.trim()" class="text-red-500 text-[10px] font-bold mt-1.5">Description is required</p>
                    </div>

                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Category *</label>
                        <select [(ngModel)]="editingProject.category"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                            <option value="">Select category</option>
                            <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
                        </select>
                    </div>

                    <div class="relative">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Niche</label>
                        <input [(ngModel)]="editingProject.niche" 
                            (input)="onNicheInput($any($event.target).value)"
                            (focus)="onNicheInput(editingProject.niche || '')"
                            (blur)="onNicheBlur()"
                            placeholder="e.g. SaaS & Productivity"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        
                        <!-- Niche Suggestions Dropdown -->
                        <div *ngIf="showNicheSuggestions && filteredNicheSuggestions.length > 0"
                            class="absolute z-20 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                            <button *ngFor="let suggestion of filteredNicheSuggestions"
                                (click)="selectNiche(suggestion)"
                                type="button"
                                class="w-full px-4 py-2 text-left text-sm text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                                {{ suggestion }}
                            </button>
                        </div>
                    </div>

                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Technologies (comma-separated) *</label>
                        <input [(ngModel)]="editingProject.technologies" placeholder="e.g. Angular, .NET Core, SQL Server"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <!-- Image Upload Section -->
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Project Image</label>
                        <div class="flex gap-3">
                            <div class="flex-1">
                                <input [(ngModel)]="editingProject.imageUrl" placeholder="Image URL or upload below"
                                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                            </div>
                            <label [class.opacity-50]="isUploading" [class.pointer-events-none]="isUploading"
                                class="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer flex items-center gap-2">
                                <lucide-icon [img]="UploadIcon" class="w-4 h-4"></lucide-icon>
                                <span class="text-[10px] font-bold uppercase tracking-widest">{{ isUploading ? 'Uploading...' : 'Upload' }}</span>
                                <input type="file" accept="image/*" (change)="onImageFileSelected($event)" class="hidden">
                            </label>
                        </div>
                        <!-- Image Preview -->
                        <div *ngIf="editingProject.imageUrl" class="mt-3 relative w-full h-40 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                            <img [src]="editingProject.imageUrl" alt="Preview" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3">
                                <lucide-icon [img]="ImageIcon" class="w-4 h-4 text-white"></lucide-icon>
                            </div>
                        </div>
                    </div>

                    <!-- Gallery Upload Section -->
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">
                            Gallery Images (Max 10)
                            <span class="text-zinc-500 font-normal normal-case tracking-normal ml-2">- For project details page</span>
                        </label>
                        <label [class.opacity-50]="isUploadingGallery" [class.pointer-events-none]="isUploadingGallery"
                            class="w-full px-4 py-8 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl hover:border-red-500 dark:hover:border-red-500 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-zinc-50 dark:bg-zinc-800/50">
                            <lucide-icon [img]="UploadIcon" class="w-6 h-6 text-zinc-400"></lucide-icon>
                            <span class="text-sm text-zinc-600 dark:text-zinc-400">
                                {{ isUploadingGallery ? 'Uploading images...' : 'Click to upload or drag and drop' }}
                            </span>
                            <span class="text-[10px] text-zinc-400">PNG, JPG, GIF up to 5MB each</span>
                            <input type="file" accept="image/*" multiple (change)="onGalleryFilesSelected($event)" class="hidden">
                        </label>
                        
                        <!-- Gallery Preview Grid -->
                        <div *ngIf="galleryImages.length > 0" class="mt-3 grid grid-cols-4 gap-2">
                            <div *ngFor="let img of galleryImages; let i = index" class="relative group aspect-square rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                <img [src]="img" alt="Gallery image {{ i + 1 }}" class="w-full h-full object-cover">
                                <button (click)="removeGalleryImage(i)" type="button"
                                    class="absolute top-1 right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <lucide-icon [img]="XIcon" class="w-3 h-3 text-white"></lucide-icon>
                                </button>
                                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                                    <span class="text-[8px] text-white font-bold">{{ i + 1 }}</span>
                                </div>
                            </div>
                        </div>
                        <p *ngIf="galleryImages.length > 0" class="text-[10px] text-zinc-400 mt-2">
                            {{ galleryImages.length }} / 10 images uploaded
                        </p>
                    </div>

                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Duration</label>
                        <input [(ngModel)]="editingProject.duration" placeholder="e.g. 2024 or 2024-2025"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Project URL</label>
                        <input [(ngModel)]="editingProject.projectUrl" placeholder="https://..."
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">GitHub URL</label>
                        <input [(ngModel)]="editingProject.gitHubUrl" placeholder="https://github.com/..."
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>
                </div>
            </div>

            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="closeEditModal()"
                    class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">Cancel</button>
                <button (click)="saveProject()" [disabled]="isSaving"
                    class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                    <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ isSaving ? 'Saving...' : 'Save' }}
                </button>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation -->
    <div *ngIf="deleteProject" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="deleteProject = null"></div>
        <div class="relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-sm p-6 text-center animate-modal-enter">
            <div class="w-14 h-14 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <lucide-icon [img]="AlertIcon" class="w-7 h-7 text-red-500"></lucide-icon>
            </div>
            <h4 class="text-base font-black dark:text-white text-zinc-900 mb-2">Delete Project?</h4>
            <p class="text-sm text-zinc-500 mb-6">Are you sure you want to delete <strong class="text-zinc-900 dark:text-white">{{ deleteProject?.title }}</strong>?</p>
            <div class="flex items-center justify-center gap-3">
                <button (click)="deleteProject = null"
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
export class ProjectsGridComponent {
    public auth = inject(AuthService);
    private projectService = inject(ProjectService);
    private toast = inject(ToastService);
    private http = inject(HttpClient);
    
    @Input() projects: ProjectEntry[] = [];
    @Output() edit = new EventEmitter<ProjectEntry>();
    @Output() delete = new EventEmitter<ProjectEntry>();
    @Output() projectsUpdated = new EventEmitter<ProjectEntry[]>();
    
    EditIcon = Edit3;
    DeleteIcon = Trash2;
    XIcon = X;
    SaveIcon = Save;
    PlusIcon = Plus;
    AlertIcon = AlertTriangle;
    UploadIcon = Upload;
    ImageIcon = Image;

    showEditModal = false;
    isSaving = false;
    isDeleting = false;
    isUploading = false;
    isUploadingGallery = false;
    submitted = false;
    isCreating = false;
    deleteProject: ProjectEntry | null = null;
    editingProject: Partial<ProjectEntry> = {};
    galleryImages: string[] = [];
    
    // Category options
    categories = ['E-Commerce', 'Healthcare', 'Portfolio', 'Productivity', 'Education', 'Finance', 'Social Media', 'Entertainment', 'Other'];
    
    // Niche suggestions
    nicheSuggestions: string[] = [];
    filteredNicheSuggestions: string[] = [];
    showNicheSuggestions = false;

    onEdit(event: Event, project: ProjectEntry) {
        event.stopPropagation();
        event.preventDefault();
        this.editingProject = { ...project };
        this.galleryImages = project.gallery ? [...project.gallery] : [];
        this.isCreating = false;
        this.submitted = false;
        this.loadNicheSuggestions();
        this.showEditModal = true;
    }

    onDelete(event: Event, project: ProjectEntry) {
        event.stopPropagation();
        event.preventDefault();
        this.deleteProject = project;
    }

    openCreateModal() {
        this.editingProject = {
            title: '',
            description: '',
            technologies: '',
            category: '',
            niche: '',
            imageUrl: '',
            projectUrl: '',
            gitHubUrl: '',
            duration: new Date().getFullYear().toString(),
            views: 0
        };
        this.galleryImages = [];
        this.isCreating = true;
        this.submitted = false;
        this.loadNicheSuggestions();
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
        this.editingProject = {};
        this.galleryImages = [];
        this.showNicheSuggestions = false;
    }

    loadNicheSuggestions() {
        // Extract unique niches from existing projects
        const niches = this.projects
            .map(p => p.niche)
            .filter((niche): niche is string => !!niche && niche.trim() !== '');
        this.nicheSuggestions = [...new Set(niches)];
    }

    onNicheInput(value: string) {
        if (!value || value.trim() === '') {
            this.showNicheSuggestions = false;
            return;
        }
        
        this.filteredNicheSuggestions = this.nicheSuggestions.filter(niche =>
            niche.toLowerCase().includes(value.toLowerCase())
        );
        this.showNicheSuggestions = this.filteredNicheSuggestions.length > 0;
    }

    selectNiche(niche: string) {
        this.editingProject.niche = niche;
        this.showNicheSuggestions = false;
    }

    onNicheBlur() {
        // Delay hiding to allow click events on suggestions to fire
        setTimeout(() => {
            this.showNicheSuggestions = false;
        }, 200);
    }

    onGalleryFilesSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        // Check if user is logged in
        if (!this.auth.isLoggedIn()) {
            this.toast.error('You must be logged in to upload images');
            return;
        }

        const files = Array.from(input.files);
        
        // Validate total number of images (max 10)
        if (this.galleryImages.length + files.length > 10) {
            this.toast.error('Maximum 10 gallery images allowed');
            return;
        }

        // Validate each file
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                this.toast.error(`${file.name} is not an image file`);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                this.toast.error(`${file.name} is larger than 5MB`);
                return;
            }
        }

        this.uploadGalleryImages(files);
    }

    uploadGalleryImages(files: File[]) {
        this.isUploadingGallery = true;
        let uploadedCount = 0;
        const totalFiles = files.length;

        files.forEach(file => {
            const formData = new FormData();
            formData.append('file', file);

            this.http.post<{ url: string }>(`${environment.apiUrl}/uploads/project-image`, formData)
                .subscribe({
                    next: (response) => {
                        this.galleryImages.push(response.url);
                        uploadedCount++;
                        
                        if (uploadedCount === totalFiles) {
                            this.isUploadingGallery = false;
                            this.toast.success(`${totalFiles} image(s) uploaded successfully`);
                        }
                    },
                    error: (err) => {
                        uploadedCount++;
                        console.error('Gallery Upload Error:', err);
                        
                        if (uploadedCount === totalFiles) {
                            this.isUploadingGallery = false;
                        }
                        
                        if (err.status === 401) {
                            this.toast.error('Authentication failed. Please log in again.');
                            this.auth.logout();
                            window.location.href = '/login';
                        } else {
                            this.toast.error(`Failed to upload ${file.name}`);
                        }
                    }
                });
        });
    }

    removeGalleryImage(index: number) {
        this.galleryImages.splice(index, 1);
        this.toast.success('Image removed from gallery');
    }

    onImageFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.toast.error('Image size must be less than 5MB');
            return;
        }

        this.uploadImage(file);
    }

    uploadImage(file: File) {
        // Check if user is logged in
        if (!this.auth.isLoggedIn()) {
            this.toast.error('You must be logged in to upload images');
            return;
        }

        this.isUploading = true;
        const formData = new FormData();
        formData.append('file', file);

        this.http.post<{ url: string }>(`${environment.apiUrl}/uploads/project-image`, formData)
            .subscribe({
                next: (response) => {
                    this.editingProject.imageUrl = response.url;
                    this.isUploading = false;
                    this.toast.success('Image uploaded successfully');
                },
                error: (err) => {
                    this.isUploading = false;
                    console.error('Image Upload Error:', err);
                    
                    if (err.status === 401) {
                        this.toast.error('Authentication failed. Please log in again.');
                        this.auth.logout();
                        window.location.href = '/login';
                    } else if (err.status === 400) {
                        this.toast.error(err.error?.message || 'Invalid file. Please check file type and size.');
                    } else if (err.status === 500) {
                        this.toast.error(err.error || 'Server error while uploading image');
                    } else {
                        this.toast.error('Failed to upload image. Please try again.');
                    }
                }
            });
    }

    saveProject() {
        this.submitted = true;
        
        if (!this.editingProject.title?.trim() || !this.editingProject.description?.trim()) {
            this.toast.error('Please fill in all required fields');
            return;
        }

        this.isSaving = true;

        const projectData: Partial<ProjectEntry> = {
            id: this.editingProject.id || crypto.randomUUID(),
            slug: this.editingProject.slug || this.generateSlug(this.editingProject.title!),
            title: this.editingProject.title!,
            description: this.editingProject.description!,
            technologies: this.editingProject.technologies || '',
            category: this.editingProject.category || '',
            niche: this.editingProject.niche,
            imageUrl: this.editingProject.imageUrl,
            gallery: this.galleryImages.length > 0 ? this.galleryImages : undefined,
            projectUrl: this.editingProject.projectUrl,
            gitHubUrl: this.editingProject.gitHubUrl,
            duration: this.editingProject.duration,
            views: this.editingProject.views || 0
        };

        const request = this.isCreating
            ? this.projectService.createProject(projectData as any)
            : this.projectService.updateProject(this.editingProject.id!, projectData as ProjectEntry);

        request.subscribe({
            next: (savedProject: ProjectEntry) => {
                if (this.isCreating) {
                    this.projects = [...this.projects, savedProject];
                } else {
                    const index = this.projects.findIndex(p => p.id === savedProject.id);
                    if (index !== -1) {
                        this.projects[index] = savedProject;
                        this.projects = [...this.projects];
                    }
                }
                this.projectsUpdated.emit(this.projects);
                this.isSaving = false;
                this.showEditModal = false;
                this.toast.success(`Project ${this.isCreating ? 'created' : 'updated'} successfully`);
            },
            error: (err) => {
                this.isSaving = false;
                this.toast.error(`Failed to ${this.isCreating ? 'create' : 'update'} project`);
                console.error('Project Save Error:', err);
            }
        });
    }

    generateSlug(title: string): string {
        return title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    executeDelete() {
        if (!this.deleteProject?.id) return;

        this.isDeleting = true;
        this.projectService.deleteProject(this.deleteProject.id).subscribe({
            next: () => {
                this.projects = this.projects.filter(p => p.id !== this.deleteProject!.id);
                this.projectsUpdated.emit(this.projects);
                this.delete.emit(this.deleteProject!);
                this.deleteProject = null;
                this.isDeleting = false;
                this.toast.success('Project deleted successfully');
            },
            error: (err) => {
                this.isDeleting = false;
                this.deleteProject = null;
                if (err.status === 401) {
                    this.toast.error('Authentication failed. Please log in again.');
                    this.auth.logout();
                    window.location.href = '/login';
                } else {
                    this.toast.error('Failed to delete project');
                }
                console.error('Project Delete Error:', err);
            }
        });
    }
}
