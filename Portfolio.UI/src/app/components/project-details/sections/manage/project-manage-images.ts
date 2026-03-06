import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Upload, Image as ImageIcon, X } from 'lucide-angular';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-project-manage-images',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div class="col-span-2 space-y-6">
        <!-- Image Upload -->
        <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Project Image</label>
            <div class="flex gap-3">
                <div class="flex-1">
                    <input [(ngModel)]="editData.imageUrl" placeholder="Image URL or upload below"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <label [class.opacity-50]="isUploading" [class.pointer-events-none]="isUploading"
                    class="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white hover:bg-zinc-700 transition-all cursor-pointer flex items-center gap-2">
                    <lucide-icon [img]="UploadIcon" class="w-4 h-4"></lucide-icon>
                    <span class="text-[10px] font-black uppercase tracking-widest">{{ isUploading ? 'Uploading...' : 'Upload' }}</span>
                    <input type="file" accept="image/*" (change)="onImageFileSelected($event)" class="hidden">
                </label>
            </div>
            <!-- Image Preview -->
            <div *ngIf="editData.imageUrl"
                class="mt-3 relative w-full h-40 rounded-xl overflow-hidden border border-zinc-700">
                <img [src]="getFullImageUrl(editData.imageUrl)" alt="Preview"
                    class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3">
                    <lucide-icon [img]="ImageIcon" class="w-4 h-4 text-white"></lucide-icon>
                </div>
            </div>
        </div>

        <!-- Gallery Images Upload -->
        <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">
                Gallery Images (Max 10)
                <span class="text-zinc-500 font-normal normal-case tracking-normal ml-2">- For project details page</span>
            </label>
            <label [class.opacity-50]="isUploadingGallery" [class.pointer-events-none]="isUploadingGallery"
                class="w-full px-4 py-8 border-2 border-dashed border-zinc-700 rounded-xl hover:border-red-500 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-zinc-800/50">
                <lucide-icon [img]="UploadIcon" class="w-6 h-6 text-zinc-400"></lucide-icon>
                <span class="text-sm text-zinc-400">
                    {{ isUploadingGallery ? 'Uploading images...' : 'Click to upload or drag and drop' }}
                </span>
                <span class="text-[10px] text-zinc-500">PNG, JPG, GIF up to 5MB each</span>
                <input type="file" accept="image/*" multiple (change)="onGalleryFilesSelected($event)" class="hidden">
            </label>

            <!-- Gallery Preview Grid -->
            <div *ngIf="editData.gallery && editData.gallery.length > 0" class="mt-3 grid grid-cols-4 gap-2">
                <div *ngFor="let img of editData.gallery; let i = index"
                    class="relative group aspect-square rounded-lg overflow-hidden border border-zinc-700">
                    <img [src]="getFullImageUrl(img)" alt="Gallery image {{ i + 1 }}"
                        class="w-full h-full object-cover">
                    <button (click)="removeGalleryImage(i)" type="button"
                        class="absolute top-1 right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <lucide-icon [img]="XIcon" class="w-3 h-3 text-white"></lucide-icon>
                    </button>
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                        <span class="text-[10px] text-white font-bold">{{ i + 1 }}</span>
                    </div>
                </div>
            </div>
            <p *ngIf="editData.gallery && editData.gallery.length > 0" class="text-[10px] text-zinc-400 mt-2">
                {{ editData.gallery.length }} / 10 images uploaded
            </p>
        </div>
    </div>
  `
})
export class ProjectManageImagesComponent {
    private http = inject(HttpClient);
    private toast = inject(ToastService);
    private auth = inject(AuthService);
    private cdr = inject(ChangeDetectorRef);
    
    @Input() editData: any = {};
    @Output() imageUploaded = new EventEmitter<string>();
    @Output() galleryUpdated = new EventEmitter<string[]>();

    UploadIcon = Upload;
    ImageIcon = ImageIcon;
    XIcon = X;

    isUploading = false;
    isUploadingGallery = false;

    // Image Upload Methods
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
                    this.editData.imageUrl = response.url;
                    this.imageUploaded.emit(response.url);
                    this.isUploading = false;
                    this.cdr.detectChanges();
                    this.toast.success('Image uploaded successfully');
                },
                error: (err) => {
                    this.isUploading = false;
                    this.cdr.detectChanges();
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

    onGalleryFilesSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        // Check if user is logged in
        if (!this.auth.isLoggedIn()) {
            this.toast.error('You must be logged in to upload images');
            return;
        }

        const files = Array.from(input.files);

        // Initialize gallery array if it doesn't exist
        if (!this.editData.gallery) {
            this.editData.gallery = [];
        }

        // Validate total number of images (max 10)
        if (this.editData.gallery.length + files.length > 10) {
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
                        this.editData.gallery.push(response.url);
                        uploadedCount++;

                        if (uploadedCount === totalFiles) {
                            this.isUploadingGallery = false;
                            this.galleryUpdated.emit(this.editData.gallery);
                            this.cdr.detectChanges();
                            this.toast.success(`${totalFiles} image(s) uploaded successfully`);
                        }
                    },
                    error: (err) => {
                        uploadedCount++;
                        console.error('Gallery Upload Error:', err);

                        if (uploadedCount === totalFiles) {
                            this.isUploadingGallery = false;
                            this.cdr.detectChanges();
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
        if (this.editData.gallery) {
            this.editData.gallery.splice(index, 1);
            this.galleryUpdated.emit(this.editData.gallery);
            this.toast.success('Image removed from gallery');
            this.cdr.detectChanges();
        }
    }

    getFullImageUrl(url: string): string {
        if (!url) return 'assets/project-placeholder.svg';

        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        const baseUrl = environment.apiUrl.replace('/api', '');
        if (url.startsWith('/')) {
            return `${baseUrl}${url}`;
        }

        return `${baseUrl}/${url}`;
    }
}