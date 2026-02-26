import { Component, Input, Output, EventEmitter, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Play, Rocket, Github, Heart, Share2, Eye, MessageCircle, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-angular';
import { ProjectEntry } from '../../../models';
import { ProjectService } from '../../../services/project.service';
import { TranslationService } from '../../../services/translation.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-project-details-gallery',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <ng-container *ngIf="project">
        <!-- Featured Media Section with Vertical Reaction Icons -->
        <section class="space-y-6 lg:space-y-8 animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="relative group rounded-2xl lg:rounded-[2.5rem] overflow-hidden border border-zinc-900 bg-zinc-950 aspect-video shadow-2xl cursor-pointer"
                (click)="openLightbox(getCurrentImage())">
                <img [src]="getFullImageUrl(getCurrentImage())" class="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105">
                
                <!-- Expand Icon -->
                <div class="absolute top-4 ltr:right-4 rtl:left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <div class="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/20">
                        <lucide-icon [img]="MaximizeIcon" class="w-5 h-5 text-white"></lucide-icon>
                    </div>
                </div>
                
                <!-- Centered Action Buttons -->
                <div class="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                    <a [href]="project.projectUrl" target="_blank" *ngIf="project.projectUrl"
                        (click)="$event.stopPropagation()"
                        class="bg-red-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-black text-xs lg:text-sm uppercase tracking-widest flex items-center gap-2 lg:gap-3 hover:bg-red-700 hover:scale-110 transition-all shadow-2xl shadow-red-600/40">
                        <lucide-icon [img]="RocketIcon" class="w-4 h-4 lg:w-5 lg:h-5"></lucide-icon> Live Demo
                    </a>
                    <a [href]="project.gitHubUrl" target="_blank" *ngIf="project.gitHubUrl"
                        (click)="$event.stopPropagation()"
                        class="bg-black/80 backdrop-blur-md border-2 border-white/30 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-black text-xs lg:text-sm uppercase tracking-widest flex items-center gap-2 lg:gap-3 hover:border-red-600 hover:bg-red-600 hover:scale-110 transition-all shadow-2xl">
                        <lucide-icon [img]="GithubIcon" class="w-4 h-4 lg:w-5 lg:h-5"></lucide-icon> Source Code
                    </a>
                </div>
                
                <!-- Vertical Reaction Icons - Right Side -->
                <div class="absolute ltr:right-4 ltr:lg:right-6 rtl:left-4 rtl:lg:left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 lg:gap-4 z-20">
                    <!-- Love/React Button -->
                    <button (click)="onReact(); $event.stopPropagation()"
                        class="flex flex-col items-center gap-1.5 bg-black/80 backdrop-blur-md hover:bg-red-600 px-3 lg:px-4 py-3 lg:py-4 rounded-xl border border-white/10 hover:border-red-600 transition-all group">
                        <lucide-icon [img]="HeartIcon" class="w-4 h-4 lg:w-5 lg:h-5 text-red-600 group-hover:text-white transition-colors group-hover:scale-110"></lucide-icon>
                        <span class="text-[10px] lg:text-xs font-black text-white">{{ project.reactionsCount || 0 }}</span>
                    </button>
                    
                    <!-- Share Button -->
                    <button (click)="onShare(); $event.stopPropagation()"
                        class="flex flex-col items-center gap-1.5 bg-black/80 backdrop-blur-md hover:bg-zinc-700 px-3 lg:px-4 py-3 lg:py-4 rounded-xl border border-white/10 hover:border-zinc-600 transition-all group">
                        <lucide-icon [img]="ShareIcon" class="w-4 h-4 lg:w-5 lg:h-5 text-zinc-400 group-hover:text-white transition-colors group-hover:scale-110"></lucide-icon>
                        <span class="text-[10px] lg:text-xs font-black text-white uppercase tracking-wider">Share</span>
                    </button>
                    
                    <!-- Views Counter -->
                    <div class="flex flex-col items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 lg:px-4 py-3 lg:py-4 rounded-xl border border-white/10">
                        <lucide-icon [img]="EyeIcon" class="w-4 h-4 lg:w-5 lg:h-5 text-blue-500"></lucide-icon>
                        <span class="text-[10px] lg:text-xs font-black text-white">{{ project.views || 0 }}</span>
                    </div>
                    
                    <!-- Comments Counter -->
                    <div class="flex flex-col items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 lg:px-4 py-3 lg:py-4 rounded-xl border border-white/10">
                        <lucide-icon [img]="MessageCircleIcon" class="w-4 h-4 lg:w-5 lg:h-5 text-green-500"></lucide-icon>
                        <span class="text-[10px] lg:text-xs font-black text-white">{{ project.comments?.length || 0 }}</span>
                    </div>
                </div>
                
                <!-- Featured Badge - Bottom Left -->
                <div class="absolute bottom-4 lg:bottom-8 ltr:left-4 ltr:lg:left-8 rtl:right-4 rtl:lg:right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                    <div class="bg-black/60 backdrop-blur-md px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl border border-white/10">
                        <span class="text-[9px] lg:text-[10px] font-black tracking-[0.15em] lg:tracking-[0.2em] uppercase text-red-600">Featured Media • Case Study</span>
                    </div>
                </div>
            </div>

            <!-- Gallery Thumbnails -->
            <div class="flex gap-3 lg:gap-4 overflow-x-auto pb-2 pt-2 lg:pb-4 no-scrollbar" *ngIf="getAllImages().length > 0">
                <div *ngFor="let img of getAllImages(); let i = index"
                    (click)="selectImage(img)"
                    [class.ring-2]="selectedImage === img || (!selectedImage && i === 0)"
                    [class.ring-red-600]="selectedImage === img || (!selectedImage && i === 0)"
                    class="w-32 lg:w-40 xl:w-48 aspect-video rounded-lg lg:rounded-xl border border-zinc-900 overflow-hidden shrink-0 grayscale hover:grayscale-0 cursor-pointer transition-all hover:scale-105 active:scale-95">
                    <img [src]="getFullImageUrl(img)" class="w-full h-full object-cover">
                </div>
            </div>
            
            <!-- Description -->
            <div class="">
                <p class="text-zinc-400 text-base md:text-lg lg:text-xl leading-relaxed font-medium">
                    {{ getProjectSummary() }}
                </p>
            </div>
            
            <!-- Tech Tags -->
            <div class="flex flex-wrap gap-2 lg:gap-3">
                <span *ngFor="let tech of project.technologies.split(',')"
                    class="bg-zinc-900 border border-zinc-800 px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black tracking-widest uppercase text-zinc-500 hover:text-red-600 hover:border-red-600/30 transition-all cursor-default">
                    {{ tech.trim() }}
                </span>
            </div>
        </section>

        <!-- Lightbox Modal -->
        <div *ngIf="lightboxOpen" 
            class="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in"
            (click)="closeLightbox()">
            
            <!-- Close Button -->
            <button (click)="closeLightbox()" 
                class="absolute top-4 ltr:right-4 rtl:left-4 z-[210] w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all group">
                <lucide-icon [img]="XIcon" class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"></lucide-icon>
            </button>

            <!-- Image Counter -->
            <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[210] px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <span class="text-white font-black text-sm tracking-widest">
                    {{ currentLightboxIndex + 1 }} / {{ getAllImages().length }}
                </span>
            </div>

            <!-- Main Image Container -->
            <div class="relative w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-16" (click)="$event.stopPropagation()">
                <img [src]="getFullImageUrl(lightboxImage)" 
                    class="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-scale-in"
                    [class.animate-slide-left]="slideDirection === 'left'"
                    [class.animate-slide-right]="slideDirection === 'right'">
            </div>

            <!-- Navigation Buttons -->
            <button *ngIf="getAllImages().length > 1"
                (click)="previousImage(); $event.stopPropagation()"
                class="absolute ltr:left-4 ltr:md:left-8 rtl:right-4 rtl:md:right-8 top-1/2 -translate-y-1/2 z-[210] w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed group">
                <lucide-icon [img]="ChevronLeftIcon" class="w-7 h-7 group-hover:scale-110 transition-transform"></lucide-icon>
            </button>

            <button *ngIf="getAllImages().length > 1"
                (click)="nextImage(); $event.stopPropagation()"
                class="absolute ltr:right-4 ltr:md:right-8 rtl:left-4 rtl:md:left-8 top-1/2 -translate-y-1/2 z-[210] w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed group">
                <lucide-icon [img]="ChevronRightIcon" class="w-7 h-7 group-hover:scale-110 transition-transform"></lucide-icon>
            </button>

            <!-- Thumbnail Strip -->
            <div *ngIf="getAllImages().length > 1" 
                class="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[210] max-w-[90%]"
                (click)="$event.stopPropagation()">
                <div class="overflow-x-auto no-scrollbar">
                    <div class="flex gap-2 md:gap-3 px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                        <div *ngFor="let img of getAllImages(); let i = index"
                            (click)="goToImage(i)"
                            [class.ring-2]="i === currentLightboxIndex"
                            [class.ring-red-600]="i === currentLightboxIndex"
                            [class.opacity-50]="i !== currentLightboxIndex"
                            class="w-16 md:w-20 aspect-video rounded-lg overflow-hidden shrink-0 cursor-pointer hover:opacity-100 transition-all hover:scale-105 border border-white/20">
                            <img [src]="getFullImageUrl(img)" class="w-full h-full object-cover">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Close Button for Thumbnail Strip - Fixed to top right -->
            <button *ngIf="getAllImages().length > 1" (click)="closeLightbox()"
                class="absolute top-20 md:top-24 right-4 md:right-8 z-[210] w-12 h-12 rounded-xl bg-red-600 backdrop-blur-md border border-red-500 flex items-center justify-center text-white hover:bg-red-700 transition-all group shadow-lg">
                <lucide-icon [img]="XIcon" class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"></lucide-icon>
            </button>
        </div>
    </ng-container>
  `
})
export class ProjectDetailsGalleryComponent {
    private projectService = inject(ProjectService);
    private translationService = inject(TranslationService);
    
    @Input() project?: ProjectEntry;
    @Output() onReactEvent = new EventEmitter<void>();
    @Output() onShareEvent = new EventEmitter<void>();
    
    PlayIcon = Play;
    RocketIcon = Rocket;
    GithubIcon = Github;
    HeartIcon = Heart;
    ShareIcon = Share2;
    EyeIcon = Eye;
    MessageCircleIcon = MessageCircle;
    XIcon = X;
    ChevronLeftIcon = ChevronLeft;
    ChevronRightIcon = ChevronRight;
    MaximizeIcon = Maximize2;
    
    selectedImage?: string;
    lightboxOpen = false;
    lightboxImage = '';
    currentLightboxIndex = 0;
    slideDirection: 'left' | 'right' | null = null;

    getProjectSummary(): string {
        if (!this.project) return '';
        const currentLang = this.translationService.currentLang$();
        
        // Use description field (same as projects listing page)
        return currentLang === 'ar' && this.project.description_Ar ? this.project.description_Ar : (this.project.description || '');
    }
    
    getAllImages(): string[] {
        if (!this.project) return [];
        const images: string[] = [];
        
        // Add main image first
        if (this.project.imageUrl) {
            images.push(this.project.imageUrl);
        }
        
        // Add gallery images
        if (this.project.gallery && this.project.gallery.length > 0) {
            images.push(...this.project.gallery);
        }
        
        return images;
    }

    onReact() {
        this.onReactEvent.emit();
    }

    onShare() {
        this.onShareEvent.emit();
    }
    
    selectImage(imageUrl: string) {
        this.selectedImage = imageUrl;
    }
    
    getCurrentImage(): string {
        return this.selectedImage || this.project?.imageUrl || '';
    }

    openLightbox(imageUrl: string) {
        const images = this.getAllImages();
        this.currentLightboxIndex = images.indexOf(imageUrl);
        if (this.currentLightboxIndex === -1) this.currentLightboxIndex = 0;
        
        this.lightboxImage = imageUrl;
        this.lightboxOpen = true;
        this.slideDirection = null;
        
        // Prevent body scroll when lightbox is open
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightboxOpen = false;
        this.slideDirection = null;
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    nextImage() {
        const images = this.getAllImages();
        if (images.length <= 1) return;
        
        this.slideDirection = 'right';
        this.currentLightboxIndex = (this.currentLightboxIndex + 1) % images.length;
        this.lightboxImage = images[this.currentLightboxIndex];
        
        // Reset animation
        setTimeout(() => this.slideDirection = null, 300);
    }

    previousImage() {
        const images = this.getAllImages();
        if (images.length <= 1) return;
        
        this.slideDirection = 'left';
        this.currentLightboxIndex = this.currentLightboxIndex === 0 ? images.length - 1 : this.currentLightboxIndex - 1;
        this.lightboxImage = images[this.currentLightboxIndex];
        
        // Reset animation
        setTimeout(() => this.slideDirection = null, 300);
    }

    goToImage(index: number) {
        const images = this.getAllImages();
        if (index < 0 || index >= images.length) return;
        
        this.slideDirection = index > this.currentLightboxIndex ? 'right' : 'left';
        this.currentLightboxIndex = index;
        this.lightboxImage = images[index];
        
        // Reset animation
        setTimeout(() => this.slideDirection = null, 300);
    }

    getFullImageUrl(url?: string): string {
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

    // Keyboard navigation for lightbox
    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (!this.lightboxOpen) return;
        
        switch(event.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.previousImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    }
}
