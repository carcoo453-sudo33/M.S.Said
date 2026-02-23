import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Play, Rocket, Github } from 'lucide-angular';
import { ProjectEntry } from '../../../models';

@Component({
    selector: 'app-project-details-gallery',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <ng-container *ngIf="project">
        <!-- Featured Media Section -->
        <section class="space-y-10 animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="relative group rounded-[3rem] overflow-hidden border border-zinc-900 bg-zinc-950 aspect-video shadow-2xl">
                <img [src]="project.imageUrl" class="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105">
                <div class="absolute inset-0 flex items-center justify-center">
                    <button class="w-24 h-24 bg-red-600/90 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-red-600/40">
                        <lucide-icon [img]="PlayIcon" class="w-10 h-10 fill-current"></lucide-icon>
                    </button>
                </div>
                <div class="absolute bottom-10 left-10 right-10 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div class="bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10">
                        <span class="text-[10px] font-black tracking-[0.2em] uppercase text-red-600">Featured Media • Case Study</span>
                    </div>
                </div>
            </div>

            <!-- Gallery Thumbnails -->
            <div class="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                <div *ngFor="let img of project.gallery; let i = index"
                    class="w-48 aspect-video rounded-xl border border-zinc-900 overflow-hidden shrink-0 grayscale hover:grayscale-0 cursor-pointer transition-all hover:scale-105 active:scale-95">
                    <img [src]="img" class="w-full h-full object-cover">
                </div>
            </div>
        </section>

        <!-- Action Bar -->
        <section class="flex flex-wrap gap-6 animate-fade-in-up" style="animation-delay: 0.3s">
            <a [href]="project.demoUrl" target="_blank"
                class="bg-red-600 text-white px-12 py-6 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-4 hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">
                <lucide-icon [img]="RocketIcon" class="w-4 h-4"></lucide-icon> Live Demo
            </a>
            <a [href]="project.repoUrl" target="_blank"
                class="bg-zinc-950 border border-zinc-800 text-zinc-300 px-12 py-6 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-4 hover:border-red-600/50 hover:text-white transition-all">
                <lucide-icon [img]="GithubIcon" class="w-4 h-4"></lucide-icon> Source Code
            </a>
        </section>
    </ng-container>
  `
})
export class ProjectDetailsGalleryComponent {
    @Input() project?: ProjectEntry;
    PlayIcon = Play;
    RocketIcon = Rocket;
    GithubIcon = Github;
}
