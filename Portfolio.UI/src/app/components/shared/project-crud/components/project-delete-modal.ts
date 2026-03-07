import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, AlertTriangle, X, Trash2, Loader } from 'lucide-angular';
import { ProjectEntry } from '../../../../models';
import { ProjectCrudService } from '../project-crud.service';

@Component({
    selector: 'app-project-delete-modal',
    standalone: true,
    imports: [CommonModule, TranslateModule, LucideAngularModule],
    template: `
        <div *ngIf="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" (click)="close()">
            <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md" (click)="$event.stopPropagation()">
                
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div class="flex items-center gap-3">
                        <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30">
                            <lucide-icon [img]="AlertTriangleIcon" class="w-6 h-6 text-red-600 dark:text-red-400"></lucide-icon>
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-zinc-900 dark:text-white">
                                Delete Project
                            </h2>
                            <p class="text-sm text-zinc-500 dark:text-zinc-400">
                                This action cannot be undone
                            </p>
                        </div>
                    </div>
                    <button 
                        (click)="close()" 
                        class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        [disabled]="isDeleting()">
                        <lucide-icon [img]="XIcon" class="w-5 h-5 text-zinc-500"></lucide-icon>
                    </button>
                </div>

                <!-- Content -->
                <div class="p-6">
                    <div class="mb-6">
                        <p class="text-zinc-700 dark:text-zinc-300 mb-4">
                            Are you sure you want to delete this project? This action cannot be undone and will permanently remove all project data.
                        </p>
                        
                        <!-- Project Info -->
                        <div *ngIf="project" class="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center">
                                    <lucide-icon [img]="Trash2Icon" class="w-6 h-6 text-zinc-500"></lucide-icon>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h3 class="font-semibold text-zinc-900 dark:text-white truncate">
                                        {{ project.title }}
                                    </h3>
                                    <p class="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                                        {{ project.description }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p class="text-sm text-red-700 dark:text-red-300 font-medium">
                                ⚠️ This action is permanent and cannot be undone
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex items-center justify-end gap-3 p-6 border-t border-zinc-200 dark:border-zinc-800">
                    <button 
                        (click)="close()" 
                        class="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        [disabled]="isDeleting()">
                        Cancel
                    </button>
                    <button 
                        (click)="confirmDelete()" 
                        [disabled]="isDeleting()"
                        class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                        <lucide-icon [img]="isDeleting() ? LoaderIcon : Trash2Icon" class="w-4 h-4" [class.animate-spin]="isDeleting()"></lucide-icon>
                        {{ isDeleting() ? 'Deleting...' : 'Delete Project' }}
                    </button>
                </div>

            </div>
        </div>
    `
})
export class ProjectDeleteModalComponent {
    private crudService = inject(ProjectCrudService);

    @Input() project: ProjectEntry | null = null;
    @Input() isOpen = false;
    
    @Output() projectDeleted = new EventEmitter<ProjectEntry>();
    @Output() modalClosed = new EventEmitter<void>();

    isDeleting = signal(false);

    // Icons
    AlertTriangleIcon = AlertTriangle;
    XIcon = X;
    Trash2Icon = Trash2;
    LoaderIcon = Loader;

    close() {
        if (this.isDeleting()) return;
        this.modalClosed.emit();
    }

    async confirmDelete() {
        if (!this.project?.id || this.isDeleting()) return;

        this.isDeleting.set(true);

        try {
            await this.crudService.deleteProject(this.project.id);
            this.projectDeleted.emit(this.project);
            this.close();
        } catch (error) {
            console.error('Failed to delete project:', error);
        } finally {
            this.isDeleting.set(false);
        }
    }
}