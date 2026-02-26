import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
    selector: 'app-projects-header',
    standalone: true,
    imports: [CommonModule, TranslateModule, LucideAngularModule],
    template: `
    <header class="pt-2 mb-16 text-center animate-fade-in-up">
        <h1
            class="text-6xl md:text-8xl font-black tracking-tighter leading-none dark:text-white text-zinc-900 mb-6 flex flex-col items-center italic">
            <span>{{ 'projects.header.title1' | translate }} <span
                    class="text-red-600 tracking-widest leading-none">{{ 'projects.header.title2' | translate }}</span></span>
        </h1>
        <p
            class="text-zinc-500 dark:text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed pt-6 uppercase tracking-widest font-black text-[10px]">
            {{ 'projects.header.subtitle' | translate }}
        </p>

        <!-- Admin Action -->
        <div *ngIf="auth.isLoggedIn()" class="flex justify-center mt-16">
            <button 
                (click)="onCreateProject()"
                class="px-8 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl">
                <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                {{ 'projects.header.createProject' | translate }}
            </button>
        </div>
    </header>
  `
})
export class ProjectsHeaderComponent {
    public auth = inject(AuthService);
    PlusIcon = Plus;
    @Input() filters: string[] = [];
    @Input() selectedFilter: string = 'All';
    @Output() filterChange = new EventEmitter<string>();
    @Output() createProject = new EventEmitter<void>();

    onFilterChange(filter: string) {
        this.filterChange.emit(filter);
    }
    
    onCreateProject() {
        this.createProject.emit();
    }
}
