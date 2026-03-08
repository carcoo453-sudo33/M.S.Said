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
                    <input 
                        [(ngModel)]="newResponsibility.text"
                        placeholder="Responsibility text (EN)"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all font-medium"
                    />
                    <input 
                        [(ngModel)]="newResponsibility.text_Ar"
                        placeholder="Arabic translation (optional)"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all text-right font-medium"
                        dir="rtl"
                    />
                    <div class="flex gap-3 col-span-1 md:col-span-2">
                        <button 
                            (click)="addResponsibility()"
                            [disabled]="!newResponsibility.text?.trim()"
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
                            <div class="flex-1 truncate">
                                <span class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ responsibility.text }}</span>
                                <span *ngIf="responsibility.text_Ar" class="text-xs text-zinc-500 dark:text-zinc-400 mx-2">|</span>
                                <span *ngIf="responsibility.text_Ar" class="text-sm text-zinc-500 dark:text-zinc-400" dir="rtl">{{ responsibility.text_Ar }}</span>
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

    newResponsibility: Partial<Responsibility> = { text: '', text_Ar: '' };

    addResponsibility() {
        const text = this.newResponsibility.text?.trim();
        if (!text) {
            this.toast.warning('Responsibility text is required');
            return;
        }

        this.responsibilities = [...this.responsibilities, {
            text: text,
            text_Ar: this.newResponsibility.text_Ar?.trim() || ''
        }];

        this.newResponsibility = { text: '', text_Ar: '' };
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
