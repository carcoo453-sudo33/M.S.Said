import { Component, inject, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectsListService } from '../../../../services/projects-list.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
    selector: 'app-project-suggestion-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
        <!-- Suggestion Management Section -->
        <div class="space-y-4">
            <!-- Add New Item -->
            <div class="flex gap-2">
                <input 
                    [(ngModel)]="newItemName"
                    [placeholder]="title + ' name'"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                />
                <input 
                    [(ngModel)]="newItemNameAr"
                    placeholder="Arabic name (optional)"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all text-right"
                    dir="rtl"
                />
                <button 
                    (click)="addNewItem()"
                    [disabled]="!newItemName.trim()"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 hover:bg-red-700 transition-colors whitespace-nowrap"
                >
                    Add {{ title }}
                </button>
            </div>

            <!-- Items List -->
            <div class="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                <div 
                    *ngFor="let item of items" 
                    class="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-sm transition-all"
                >
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-zinc-900 dark:text-white">{{ item.name }}</span>
                        <span *ngIf="item.name_Ar" class="text-sm text-zinc-400">|</span>
                        <span *ngIf="item.name_Ar" class="text-sm font-medium text-zinc-500" dir="rtl">{{ item.name_Ar }}</span>
                    </div>
                    <button 
                        (click)="removeItem(item.id, item.name)"
                        class="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                        Remove
                    </button>
                </div>

                <!-- Empty State -->
                <div *ngIf="items.length === 0" class="flex flex-col items-center justify-center py-10 text-zinc-400">
                    <p class="text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">No {{ title }} available</p>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #27272a;
        }
    `]
})
export class ProjectSuggestionManagerComponent {
    private readonly projectsListService = inject(ProjectsListService);
    private readonly toast = inject(ToastService);
    private readonly cdr = inject(ChangeDetectorRef);

    @Input() title = 'Item';
    @Input() type: 'category' | 'niche' = 'category';
    @Input() items: any[] = [];
    @Output() updated = new EventEmitter<void>();

    newItemName = '';
    newItemNameAr = '';

    addNewItem() {
        const name = this.newItemName?.trim();
        if (!name) return;

        const payload = {
            name: name,
            name_Ar: this.newItemNameAr?.trim() || undefined
        };

        const request = this.type === 'category'
            ? this.projectsListService.createCategory(payload)
            : this.projectsListService.createNiche(payload);

        request.subscribe({
            next: (item) => {
                this.items.push(item);
                this.items.sort((a, b) => a.name.localeCompare(b.name));
                this.toast.success(`${this.title} "${name}" added`);
                this.newItemName = '';
                this.newItemNameAr = '';
                this.updated.emit();
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(`Failed to create ${this.type}:`, err);
                this.toast.error(`Failed to add ${this.type}`);
            }
        });
    }

    removeItem(id: string, name: string) {
        if (!id) return;

        const request = this.type === 'category'
            ? this.projectsListService.deleteCategory(id)
            : this.projectsListService.deleteNiche(id);

        request.subscribe({
            next: () => {
                const index = this.items.findIndex(i => i.id === id);
                if (index !== -1) {
                    this.items.splice(index, 1);
                }
                this.toast.success(`${this.title} "${name}" removed`);
                this.updated.emit();
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                console.error(`Failed to delete ${this.type}:`, err);
                this.toast.error(`Failed to remove ${this.type}`);
            }
        });
    }
}
