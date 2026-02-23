import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { LucideAngularModule, Edit3, Trash2 } from 'lucide-angular';

@Component({
    selector: 'app-projects-grid',
    standalone: true,
    imports: [CommonModule, RouterLink, LucideAngularModule],
    template: `
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
                <button (click)="$event.stopPropagation()"
                    class="w-10 h-10 rounded-lg bg-black/80 backdrop-blur-md flex items-center justify-center text-white hover:text-red-500 border border-white/10 transition-all">
                    <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
                </button>
                <button (click)="$event.stopPropagation()"
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
                    <span *ngFor="let tech of project.techStack?.split(',')"
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
  `
})
export class ProjectsGridComponent {
    public auth = inject(AuthService);
    @Input() projects: ProjectEntry[] = [];
    EditIcon = Edit3;
    DeleteIcon = Trash2;
}
