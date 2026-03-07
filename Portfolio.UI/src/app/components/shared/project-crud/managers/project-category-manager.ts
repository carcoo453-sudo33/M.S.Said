import { Component, inject, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectService } from '../../../../services/project.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
    selector: 'app-project-category-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
        <!-- Category Management Section -->
        <div class="space-y-4">
            <h3 class="text-lg font-semibold">Category Management</h3>
            
            <!-- Add New Category -->
            <div class="flex gap-2">
                <input 
                    [(ngModel)]="newCategoryName"
                    placeholder="Category name"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                />
                <input 
                    [(ngModel)]="newCategoryNameAr"
                    placeholder="Arabic name (optional)"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                />
                <button 
                    (click)="addNewCategory()"
                    [disabled]="!newCategoryName.trim()"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 hover:bg-red-700 transition-colors"
                >
                    Add
                </button>
            </div>

            <!-- Categories List -->
            <div class="space-y-2 max-h-40 overflow-y-auto">
                <div 
                    *ngFor="let category of managedCategories" 
                    class="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                >
                    <div>
                        <span class="font-medium">{{ category.name }}</span>
                        <span *ngIf="category.name_Ar" class="text-sm text-zinc-600 dark:text-zinc-400 ml-2">({{ category.name_Ar }})</span>
                    </div>
                    <button 
                        (click)="removeCategory(category.id)"
                        class="text-red-600 hover:text-red-800 text-sm"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    `
})
export class ProjectCategoryManagerComponent {
    private projectService = inject(ProjectService);
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);

    @Input() managedCategories: any[] = [];
    @Output() categoriesUpdated = new EventEmitter<void>();

    newCategoryName = '';
    newCategoryNameAr = '';

    addNewCategory() {
        const name = this.newCategoryName?.trim();
        if (!name) return;

        this.projectService.createCategory({
            name: name,
            name_Ar: this.newCategoryNameAr?.trim() || undefined
        }).subscribe({
            next: (category) => {
                this.managedCategories.push(category);
                this.managedCategories.sort((a, b) => a.name.localeCompare(b.name));
                this.toast.success(`Category "${name}" added`);
                this.newCategoryName = '';
                this.newCategoryNameAr = '';
                this.categoriesUpdated.emit();
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to create category:', err);
                this.toast.error('Failed to add category');
            }
        });
    }

    removeCategory(id: string) {
        const category = this.managedCategories.find(c => c.id === id);
        if (!category) return;

        this.projectService.deleteCategory(id).subscribe({
            next: () => {
                this.managedCategories = this.managedCategories.filter(c => c.id !== id);
                this.toast.success(`Category "${category.name}" removed`);
                this.categoriesUpdated.emit();
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to delete category:', err);
                this.toast.error('Failed to remove category');
            }
        });
    }
}