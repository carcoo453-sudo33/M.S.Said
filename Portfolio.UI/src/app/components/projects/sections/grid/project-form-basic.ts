import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectEntry } from '../../../../models';
import { InputComponent } from '../../../../ui/input';
import { TextareaComponent } from '../../../../ui/textarea';
import { LabelComponent } from '../../../../ui/label';

@Component({
    selector: 'app-project-form-basic',
    standalone: true,
    imports: [CommonModule, FormsModule, InputComponent, TextareaComponent, LabelComponent],
    template: `
        <div class="grid grid-cols-2 gap-6">
            <!-- Title EN -->
            <div class="col-span-2">
                <ui-label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Title (EN) *</ui-label>
                <ui-input 
                    [(ngModel)]="project.title" 
                    placeholder="Project title"
                    [className]="submitted && project.title && !project.title.trim() ? 'border-red-500 ring-2 ring-red-500/30' : ''">
                </ui-input>
                <p *ngIf="submitted && project.title && !project.title.trim()"
                    class="text-red-500 text-[10px] font-bold mt-1.5">Title is required</p>
            </div>

            <!-- Title AR -->
            <div class="col-span-2">
                <ui-label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Title (AR)</ui-label>
                <ui-input 
                    [(ngModel)]="project.title_Ar" 
                    placeholder="عنوان المشروع"
                    className="text-right"
                    [attr.dir]="'rtl'">
                </ui-input>
            </div>

            <!-- Description EN -->
            <div class="col-span-2">
                <ui-label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (EN) *</ui-label>
                <ui-textarea 
                    [(ngModel)]="project.description" 
                    placeholder="Project description" 
                    rows="3"
                    [className]="submitted && project.description && !project.description.trim() ? 'border-red-500 ring-2 ring-red-500/30' : ''">
                </ui-textarea>
                <p *ngIf="submitted && project.description && !project.description.trim()"
                    class="text-red-500 text-[10px] font-bold mt-1.5">Description is required</p>
            </div>

            <!-- Description AR -->
            <div class="col-span-2">
                <ui-label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (AR)</ui-label>
                <ui-textarea 
                    [(ngModel)]="project.description_Ar" 
                    placeholder="وصف المشروع" 
                    rows="3"
                    className="text-right"
                    [attr.dir]="'rtl'">
                </ui-textarea>
            </div>
        </div>
    `
})
export class ProjectFormBasicComponent {
    @Input() project: Partial<ProjectEntry> = {};
    @Input() submitted = false;
}
