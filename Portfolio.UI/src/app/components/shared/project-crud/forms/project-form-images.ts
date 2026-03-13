import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Upload, Image, X } from 'lucide-angular';
import { AuthService } from '../../../../services/auth.service';
import { ToastService } from '../../../../services/toast.service';
import { ImageUtil } from '../../../../utils';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-project-form-images',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
        <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Images</h3>
            <div class="space-y-6">
                <!-- Image Upload -->
                <div class="col-span-2">
                    <label for="project-image-url-form" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Project Image</label>
                    <div class="flex gap-3">
                        <div class="flex-1">
                            <input id="project-image-url-form" name="project-image-url-form" [ngModel]="imageUrl || ''" (ngModelChange)="imageUrlChange.emit($event)" placeholder="Image URL or upload below"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                        <label for="project-image-upload-form" [class.opacity-50]="isUploading" [class.pointer-events-none]="isUploading"
                            class="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer flex items-center gap-2">
                            <lucide-icon [img]="UploadIcon" class="w-4 h-4"></lucide-icon>
                            <span class="text-[10px] font-black uppercase tracking-widest">{{ isUploading ? 'Uploading...' : 'Upload' }}</span>
                            <input id="project-image-upload-form" name="project-image-upload-form" type="file" accept="image/*" (change)="onImageFileSelected($event)" class="hidden">
                        </label>
                    </div>
                    <!-- Image Preview -->
                    <div *ngIf="imageUrl"
                        class="mt-3 relative w-full h-40 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                        <img [src]="getFullImageUrl(imageUrl)" alt="Preview" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3">
                            <lucide-icon [img]="ImageIcon" class="w-4 h-4 text-white"></lucide-icon>
                        </div>
                    </div>
                </div>

                <!-- Gallery Upload Section -->
                <div class="col-span-2">
                    <label for="gallery-images-upload-form" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">
                        Gallery Images (Max 15)
                        <span class="text-zinc-500 font-normal normal-case tracking-normal ml-2">- For project details page</span>
                    </label>
                    <label for="gallery-images-upload-form" [class.opacity-50]="isUploadingGallery" [class.pointer-events-none]="isUploadingGallery"
                        class="w-full px-4 py-8 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl hover:border-red-500 dark:hover:border-red-500 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-white dark:bg-zinc-800/50">
                        <lucide-icon [img]="UploadIcon" class="w-6 h-6 text-zinc-400"></lucide-icon>
                        <span class="text-sm text-zinc-600 dark:text-zinc-400">
                            {{ isUploadingGallery ? 'Uploading images...' : 'Click to upload or drag and drop' }}
                        </span>
                        <span class="text-[10px] text-zinc-400">PNG, JPG, GIF up to 5MB each</span>
                        <input id="gallery-images-upload-form" name="gallery-images-upload-form" type="file" accept="image/*" multiple (change)="onGalleryFilesSelected($event)" class="hidden">
                    </label>

                    <!-- Gallery List/Manage (New Detailed View) -->
                    <div *ngIf="galleryImages.length > 0" class="mt-6 space-y-4">
                        <div *ngFor="let img of galleryImages; let i = index"
                            class="flex items-start gap-4 p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 group">
                            <!-- Thumbnail -->
                            <div class="w-24 aspect-video rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
                                <img [src]="getFullImageUrl(img.imageUrl)" class="w-full h-full object-cover">
                            </div>

                            <!-- Details -->
                            <div class="flex-1 grid grid-cols-2 gap-3">
                                <div class="col-span-1">
                                    <label class="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1 block">Title</label>
                                    <input [(ngModel)]="img.title" placeholder="Image title"
                                        class="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs">
                                </div>
                                <div class="col-span-1">
                                    <label class="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1 block">Type</label>
                                    <select [(ngModel)]="img.type" (ngModelChange)="onGalleryImagesChanged()"
                                        class="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs">
                                        <option [value]="0">Real View</option>
                                        <option [value]="1">Base Details</option>
                                        <option [value]="2">Wireframe</option>
                                        <option [value]="3">Bug Fix</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Actions -->
                            <button (click)="removeGalleryImage(i)" type="button"
                                class="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all">
                                <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                            </button>
                        </div>
                    </div>

                    <p *ngIf="galleryImages.length > 0" class="text-[10px] text-zinc-400 mt-2">
                        {{ galleryImages.length }} images in gallery
                    </p>
                </div>
            </div>
        </div>
    `
})
export class ProjectFormImagesComponent {
    private readonly auth = inject(AuthService);
    private readonly http = inject(HttpClient);
    private readonly toast = inject(ToastService);
    private readonly cdr = inject(ChangeDetectorRef);

    @Input() imageUrl: string | undefined = '';
    @Input() galleryImages: any[] = [];
    @Output() imageUrlChange = new EventEmitter<string>();
    @Output() galleryImagesChange = new EventEmitter<any[]>();

    UploadIcon = Upload;
    ImageIcon = Image;
    XIcon = X;
    isUploading = false;
    isUploadingGallery = false;

    onGalleryImagesChanged() {
        this.galleryImagesChange.emit(this.galleryImages);
    }

    onImageFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];
        if (!file.type.startsWith('image/')) {
            this.toast.error('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            this.toast.error('Image size must be less than 5MB');
            return;
        }

        this.uploadImage(file);
    }

    uploadImage(file: File) {
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
                    this.imageUrl = response.url;
                    this.imageUrlChange.emit(this.imageUrl);
                    this.isUploading = false;
                    this.cdr.detectChanges();
                    this.toast.success('Image uploaded successfully');
                },
                error: (err) => {
                    this.isUploading = false;
                    this.cdr.detectChanges();
                    if (err.status === 401) {
                        this.toast.error('Authentication failed. Please log in again.');
                        this.auth.logout();
                        window.location.href = '/login';
                    } else {
                        this.toast.error('Failed to upload image. Please try again.');
                    }
                }
            });
    }

    onGalleryFilesSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        if (!this.auth.isLoggedIn()) {
            this.toast.error('You must be logged in to upload images');
            return;
        }

        const files = Array.from(input.files);
        if (this.galleryImages.length + files.length > 15) {
            this.toast.error('Maximum 15 gallery images allowed');
            return;
        }

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
                        this.galleryImages.push({
                            imageUrl: response.url,
                            title: file.name.split('.')[0], // Default title from filename
                            type: 0 // Default to Real View
                        });
                        uploadedCount++;

                        if (uploadedCount === totalFiles) {
                            this.isUploadingGallery = false;
                            this.galleryImagesChange.emit(this.galleryImages);
                            this.cdr.detectChanges();
                            this.toast.success(`${totalFiles} image(s) uploaded successfully`);
                        }
                    },
                    error: (err) => {
                        uploadedCount++;
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
        this.galleryImages.splice(index, 1);
        this.galleryImagesChange.emit(this.galleryImages);
        this.toast.success('Image removed from gallery');
    }

    getFullImageUrl(url: string): string {
        return ImageUtil.getFullImageUrl(url);
    }
}
