import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, Edit, Trash2 } from 'lucide-angular';
import { ProjectEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-project-details-header',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, LucideAngularModule],
    template: `
    <!-- Breadcrumbs -->
    <div class="mb-8 lg:mb-10 animate-fade-in">
        <nav class="flex items-center gap-2 lg:gap-3 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-zinc-500">
            <a routerLink="/projects" class="hover:text-red-500 transition-colors">{{ 'projectDetails.breadcrumb' | translate }}</a>
            <span class="text-zinc-700">/</span>
            <span class="text-white truncate">{{ project?.title }}</span>
        </nav>
    </div>

    <!-- Header Section -->
    <header *ngIf="project" class="space-y-8 lg:space-y-12 animate-fade-in-up relative">
        <!-- Admin Actions -->
        <div *ngIf="auth.isLoggedIn()" class="absolute top-0 right-0 flex gap-2 lg:gap-3">
            <button (click)="onEditClick()"
                class="flex items-center gap-2 bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-600 px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-white transition-all group">
                <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:scale-110 transition-transform"></lucide-icon>
                <span class="text-[9px] lg:text-[10px] font-black uppercase">{{ 'projectDetails.edit' | translate }}</span>
            </button>
            <button (click)="onDeleteClick()"
                class="flex items-center gap-2 bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-600 px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-white transition-all group">
                <lucide-icon [img]="DeleteIcon" class="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:scale-110 transition-transform"></lucide-icon>
                <span class="text-[9px] lg:text-[10px] font-black uppercase">{{ 'projectDetails.delete' | translate }}</span>
            </button>
        </div>

        <div class="space-y-4 lg:space-y-6 pr-32 lg:pr-0">
            <h1 class="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-none dark:text-zinc-100 italic">
                {{ project.title.split(':')[0] }}<span class="text-red-600" *ngIf="project.title.includes(':')">: {{
                    project.title.split(':')[1] }}</span>
            </h1>
        </div>
    </header>
  `
})
export class ProjectDetailsHeaderComponent {
    public auth = inject(AuthService);
    private router = inject(Router);
    private translate = inject(TranslateService);
    
    @Input() project?: ProjectEntry;
    @Output() onEdit = new EventEmitter<void>();
    @Output() onDelete = new EventEmitter<void>();
    
    EditIcon = Edit;
    DeleteIcon = Trash2;

    onEditClick() {
        this.onEdit.emit();
    }

    onDeleteClick() {
        const confirmMessage = this.translate.instant('projectDetails.deleteConfirm');
        if (confirm(confirmMessage)) {
            this.onDelete.emit();
        }
    }
}
