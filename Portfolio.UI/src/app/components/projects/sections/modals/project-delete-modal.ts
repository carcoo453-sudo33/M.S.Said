import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertTriangle } from 'lucide-angular';
import { ProjectEntry } from '../../../../models';

@Component({
    selector: 'app-project-delete-modal',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
        <div *ngIf="project" class="modal-overlay" (click)="cancel.emit()">
            <div class="modal-content max-w-sm" (click)="$event.stopPropagation()">
                <div class="p-6 text-center">
                    <div class="w-14 h-14 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <lucide-icon [img]="AlertIcon" class="w-7 h-7 text-red-500"></lucide-icon>
                    </div>
                    <h4 class="text-base font-black dark:text-white text-zinc-900 mb-2">Delete Project?</h4>
                    <p class="text-sm text-zinc-500 mb-6">Are you sure you want to delete <strong
                            class="text-zinc-900 dark:text-white">{{ project.title }}</strong>?</p>
                    <div class="flex items-center justify-center gap-3">
                        <button (click)="cancel.emit()"
                            class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 transition-all">Cancel</button>
                        <button (click)="confirm.emit()" [disabled]="isDeleting"
                            class="px-6 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50">
                            {{ isDeleting ? 'Deleting...' : 'Delete' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ProjectDeleteModalComponent {
    @Input() project: ProjectEntry | null = null;
    @Input() isDeleting = false;
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    AlertIcon = AlertTriangle;
}
