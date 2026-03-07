import { Component, inject, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';
import { ToastService } from '../../../../services/toast.service';

// Type for responsibility items (supports both legacy string format and new object format)
type ResponsibilityItem = string | { text: string; text_Ar?: string };

@Component({
    selector: 'app-project-responsibilities-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
    template: `
        <div class="space-y-4">
            <!-- Add New Responsibility -->
            <div class="flex gap-2">
                <input 
                    [(ngModel)]="newResponsibility"
                    placeholder="Add responsibility (English)"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                    (keyup.enter)="addResponsibility()"
                />
                <input 
                    [(ngModel)]="newResponsibilityAr"
                    placeholder="إضافة مسؤولية (عربي)"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                    dir="rtl"
                    (keyup.enter)="addResponsibility()"
                />
                <button 
                    (click)="addResponsibility()"
                    [disabled]="!newResponsibility.trim()"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                >
                    <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                    Add
                </button>
            </div>

            <!-- Responsibilities List -->
            <div class="space-y-2">
                <div 
                    *ngFor="let responsibility of responsibilities; let i = index" 
                    class="flex items-start justify-between p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                >
                    <div class="flex-1">
                        <div class="text-sm text-zinc-900 dark:text-white">{{ getResponsibilityText(responsibility) }}</div>
                        <div *ngIf="getResponsibilityTextAr(responsibility)" class="text-sm text-zinc-600 dark:text-zinc-400 mt-1" dir="rtl">{{ getResponsibilityTextAr(responsibility) }}</div>
                    </div>
                    <button 
                        (click)="removeResponsibility(i)"
                        class="text-red-600 hover:text-red-800 ml-2"
                    >
                        <lucide-icon [img]="DeleteIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                </div>
            </div>
        </div>
    `
})
export class ProjectResponsibilitiesManagerComponent {
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);

    @Input() responsibilities: ResponsibilityItem[] = [];
    @Output() responsibilitiesChange = new EventEmitter<ResponsibilityItem[]>();

    PlusIcon = Plus;
    DeleteIcon = Trash2;

    newResponsibility = '';
    newResponsibilityAr = '';

    addResponsibility() {
        const resp = this.newResponsibility.trim();
        const respAr = this.newResponsibilityAr.trim();
        
        if (!resp) {
            this.toast.warning('Please enter a responsibility in English');
            return;
        }

        const responsibility = {
            text: resp,
            text_Ar: respAr || ''
        };

        this.responsibilities.push(responsibility);
        this.newResponsibility = '';
        this.newResponsibilityAr = '';
        this.responsibilitiesChange.emit(this.responsibilities);
        this.cdr.detectChanges();
        this.toast.success('Responsibility added');
    }

    removeResponsibility(index: number) {
        this.responsibilities.splice(index, 1);
        this.responsibilitiesChange.emit(this.responsibilities);
        this.cdr.detectChanges();
        this.toast.success('Responsibility removed');
    }

    // Helper methods for template
    getResponsibilityText(responsibility: ResponsibilityItem): string {
        return typeof responsibility === 'string' ? responsibility : responsibility.text;
    }

    getResponsibilityTextAr(responsibility: ResponsibilityItem): string | undefined {
        return typeof responsibility === 'string' ? undefined : responsibility.text_Ar;
    }
}