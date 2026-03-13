import { Component, inject, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';
import { ToastService } from '../../../../services/toast.service';
import { Responsibility } from '../../../../models/project.model';

@Component({
    selector: 'app-project-form-responsibilities',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
    template: `
        <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Responsibilities</h3>
            <div class="space-y-4">
                <!-- Add New Responsibility -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <div class="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                        <input 
                            [(ngModel)]="newResponsibility.title"
                            placeholder="Title (EN)"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all font-medium"
                        />
                        <input 
                            [(ngModel)]="newResponsibility.title_Ar"
                            placeholder="Title (AR)"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all text-right font-medium"
                            dir="rtl"
                        />
                    </div>
                    <textarea 
                        [(ngModel)]="newResponsibility.description"
                        placeholder="Description (EN)"
                        rows="2"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all resize-none font-medium"
                    ></textarea>
                    <textarea 
                        [(ngModel)]="newResponsibility.description_Ar"
                        placeholder="Description (AR)"
                        rows="2"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all resize-none text-right font-medium"
                        dir="rtl"
                    ></textarea>
                    <div class="flex gap-3 col-span-1 md:col-span-2">
                        <button 
                            (click)="addResponsibility()"
                            [disabled]="!newResponsibility.title?.trim() && !newResponsibility.description?.trim()"
                            class="w-full px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/5"
                        >
                            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                            Add Responsibility
                        </button>
                    </div>
                </div>

                <!-- Responsibilities List -->
                <div class="grid grid-cols-1 gap-2">
                    <div 
                        *ngFor="let responsibility of responsibilities; let i = index" 
                        class="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:shadow-sm transition-all group"
                    >
                        <div class="flex items-center gap-3 overflow-hidden">
                            <div class="shrink-0 w-6 h-6 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                <span class="text-red-600 text-[10px] font-black">{{ i + 1 }}</span>
                            </div>
                            <div class="flex-1 overflow-hidden">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ responsibility.title }}</span>
                                    <span *ngIf="responsibility.title_Ar" class="text-xs text-zinc-500 dark:text-zinc-400">({{ responsibility.title_Ar }})</span>
                                </div>
                                <div class="mt-1">
                                    <p class="text-xs text-zinc-600 dark:text-zinc-400">{{ responsibility.description }}</p>
                                    <p *ngIf="responsibility.description_Ar" class="text-xs text-zinc-500 dark:text-zinc-500 italic" dir="rtl">{{ responsibility.description_Ar }}</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            (click)="removeResponsibility(i)"
                            class="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                            <lucide-icon [img]="DeleteIcon" class="w-4 h-4"></lucide-icon>
                        </button>
                    </div>
                </div>

                <!-- Empty State -->
                <div *ngIf="responsibilities.length === 0" class="flex flex-col items-center justify-center py-6 text-zinc-400">
                    <p class="text-[10px] font-bold uppercase tracking-widest">No responsibilities added yet</p>
                </div>
            </div>
        </div>
    `
})
export class ProjectFormResponsibilitiesComponent {
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);

    @Input() responsibilities: Responsibility[] = [];
    @Output() responsibilitiesChange = new EventEmitter<Responsibility[]>();

    PlusIcon = Plus;
    DeleteIcon = Trash2;

    newResponsibility: Partial<Responsibility> = { title: '', title_Ar: '', description: '', description_Ar: '' };

    addResponsibility() {
        const title = this.newResponsibility.title?.trim() || '';
        const description = this.newResponsibility.description?.trim() || '';

        if (!title && !description) {
            this.toast.warning('Please provide at least a title or description');
            return;
        }

        this.responsibilities = [...this.responsibilities, {
            title: title,
            title_Ar: this.newResponsibility.title_Ar?.trim() || '',
            description: description,
            description_Ar: this.newResponsibility.description_Ar?.trim() || ''
        }];

        this.newResponsibility = { title: '', title_Ar: '', description: '', description_Ar: '' };
        this.responsibilitiesChange.emit(this.responsibilities);
        this.cdr.detectChanges();
        this.toast.success('Responsibility added');
    }

    removeResponsibility(index: number) {
        this.responsibilities = this.responsibilities.filter((_, i) => i !== index);
        this.responsibilitiesChange.emit(this.responsibilities);
        this.cdr.detectChanges();
        this.toast.success('Responsibility removed');
    }
}
