import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Play, Rocket, Github, Heart, Share2, Eye, MessageCircle } from 'lucide-angular';
import { ProjectEntry } from '../../../models';
import { ProjectService } from '../../../services/project.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-project-details-gallery',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <ng-container *ngIf="project">
        <!-- Featured Media Section with Vertical Reaction Icons -->
        <section class="space-y-6 lg:space-y-8 animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="relative group rounded-2xl lg:rounded-[2.5rem] overflow-hidden border border-zinc-900 bg-zinc-950 aspect-video shadow-2xl">
                <img [src]="getFullImageUrl(getCurrentImage())" class="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105">
                
                <!-- Centered Action Buttons -->
                <div class="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                    <a [href]="project.projectUrl" target="_blank" *ngIf="project.projectUrl"
                        class="bg-red-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-black text-xs lg:text-sm uppercase tracking-widest flex items-center gap-2 lg:gap-3 hover:bg-red-700 hover:scale-110 transition-all shadow-2xl shadow-red-600/40">
                        <lucide-icon [img]="RocketIcon" class="w-4 h-4 lg:w-5 lg:h-5"></lucide-icon> Live Demo
                    </a>
                    <a [href]="project.gitHubUrl" target="_blank" *ngIf="project.gitHubUrl"
                        class="bg-black/80 backdrop-blur-md border-2 border-white/30 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-black text-xs lg:text-sm uppercase tracking-widest flex items-center gap-2 lg:gap-3 hover:border-red-600 hover:bg-red-600 hover:scale-110 transition-all shadow-2xl">
                        <lucide-icon [img]="GithubIcon" class="w-4 h-4 lg:w-5 lg:h-5"></lucide-icon> Source Code
                    </a>
                </div>
                
                <!-- Vertical Reaction Icons - Right Side -->
                <div class="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 lg:gap-4 z-20">
                    <!-- Love/React Button -->
                    <button (click)="onReact()"
                        class="flex flex-col items-center gap-1.5 bg-black/80 backdrop-blur-md hover:bg-red-600 px-3 lg:px-4 py-3 lg:py-4 rounded-xl border border-white/10 hover:border-red-600 transition-all group">
                        <lucide-icon [img]="HeartIcon" class="w-4 h-4 lg:w-5 lg:h-5 text-red-600 group-hover:text-white transition-colors group-hover:scale-110"></lucide-icon>
                        <span class="text-[10px] lg:text-xs font-black text-white">{{ project.reactionsCount || 0 }}</span>
                    </button>
                    
                    <!-- Share Button -->
                    <button (click)="onShare()"
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
                <div class="absolute bottom-4 lg:bottom-8 left-4 lg:left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
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
                    {{ project.summary }}
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
    </ng-container>
  `
})
export class ProjectDetailsGalleryComponent {
    private projectService = inject(ProjectService);
    
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
    
    selectedImage?: string;
    
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
}
