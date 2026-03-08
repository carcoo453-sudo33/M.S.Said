import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectEntry } from '../../../../models';

@Component({
    selector: 'app-project-form-basic',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Basic Information</h3>
            <div class="grid grid-cols-2 gap-6">
                <!-- Title EN -->
                <div class="col-span-2">
                    <label for="project-title" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Title (EN) *</label>
                    <input 
                        id="project-title"
                        name="project-title"
                        [(ngModel)]="project.title" 
                        placeholder="Project title"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                        [class.border-red-500]="submitted && project.title && !project.title.trim()"
                        [class.ring-2]="submitted && project.title && !project.title.trim()"
                        [class.ring-red-500/30]="submitted && project.title && !project.title.trim()">
                    <p *ngIf="submitted && project.title && !project.title.trim()"
                        class="text-red-500 text-[10px] font-bold mt-1.5">Title is required</p>
                </div>

                <!-- Title AR -->
                <div class="col-span-2">
                    <label for="project-title-ar" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Title (AR)</label>
                    <input 
                        id="project-title-ar"
                        name="project-title-ar"
                        [(ngModel)]="project.title_Ar" 
                        placeholder="عنوان المشروع"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all text-right"
                        dir="rtl">
                </div>

                <!-- Description EN -->
                <div class="col-span-2">
                    <label for="project-description" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (EN) *</label>
                    <textarea 
                        id="project-description"
                        name="project-description"
                        [(ngModel)]="project.description" 
                        placeholder="Project description" 
                        rows="3"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all resize-none"
                        [class.border-red-500]="submitted && project.description && !project.description.trim()"
                        [class.ring-2]="submitted && project.description && !project.description.trim()"
                        [class.ring-red-500/30]="submitted && project.description && !project.description.trim()">
                    </textarea>
                    <p *ngIf="submitted && project.description && !project.description.trim()"
                        class="text-red-500 text-[10px] font-bold mt-1.5">Description is required</p>
                </div>

                <!-- Description AR -->
                <div class="col-span-2">
                    <label for="project-description-ar" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (AR)</label>
                    <textarea 
                        id="project-description-ar"
                        name="project-description-ar"
                        [(ngModel)]="project.description_Ar" 
                        placeholder="وصف المشروع" 
                        rows="3"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all resize-none text-right"
                        dir="rtl">
                    </textarea>
                </div>
            </div>
        </div>
    `
})
export class ProjectFormBasicComponent {
    @Input() project: Partial<ProjectEntry> = {};
    @Input() submitted = false;
}
