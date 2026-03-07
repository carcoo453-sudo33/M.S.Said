import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProjectEntry } from '../../../../models';

@Component({
    selector: 'app-project-form-categories',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
        <div class="grid grid-cols-2 gap-6">
            <!-- Category EN -->
            <div class="relative">
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 flex items-center justify-between">
                    <span>Category (EN) *</span>
                    <button type="button" (click)="onManageCategoriesClick()"
                        class="text-[9px] text-red-600 hover:text-red-700 font-bold uppercase">
                        Manage
                    </button>
                </label>
                <input [(ngModel)]="project.category" (input)="onCategoryInput($any($event.target).value)"
                    (focus)="onCategoryInput(project.category || '')" (blur)="onCategoryBlur()"
                    placeholder="e.g. Frontend, Backend, Fullstack"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">

                <div *ngIf="showCategorySuggestions && filteredCategorySuggestions.length > 0"
                    class="absolute z-20 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                    <button *ngFor="let suggestion of filteredCategorySuggestions"
                        (click)="selectCategory(suggestion)" type="button"
                        class="w-full px-4 py-2 text-left text-sm text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                        {{ suggestion }}
                    </button>
                </div>
            </div>

            <!-- Category AR -->
            <div class="relative">
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Category (AR)</label>
                <input [(ngModel)]="project.category_Ar"
                    (input)="onCategoryArInput($any($event.target).value)"
                    (focus)="onCategoryArInput(project.category_Ar || '')" (blur)="onCategoryArBlur()"
                    placeholder="الفئة" dir="rtl"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">

                <div *ngIf="showCategoryArSuggestions && filteredCategoryArSuggestions.length > 0"
                    class="absolute z-20 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                    <button *ngFor="let suggestion of filteredCategoryArSuggestions"
                        (click)="selectCategoryAr(suggestion)" type="button"
                        class="w-full px-4 py-2 text-right text-sm text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                        dir="rtl">
                        {{ suggestion }}
                    </button>
                </div>
            </div>

            <!-- Niche EN -->
            <div class="relative">
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 flex items-center justify-between">
                    <span>Niche (EN)</span>
                    <button type="button" (click)="onManageNichesClick()"
                        class="text-[9px] text-red-600 hover:text-red-700 font-bold uppercase">
                        Manage
                    </button>
                </label>
                <input [(ngModel)]="project.niche" (input)="onNicheInput($any($event.target).value)"
                    (focus)="onNicheInput(project.niche || '')" (blur)="onNicheBlur()"
                    placeholder="e.g. SaaS & Productivity"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">

                <div *ngIf="showNicheSuggestions && filteredNicheSuggestions.length > 0"
                    class="absolute z-20 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                    <button *ngFor="let suggestion of filteredNicheSuggestions" (click)="selectNiche(suggestion)"
                        type="button"
                        class="w-full px-4 py-2 text-left text-sm text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                        {{ suggestion }}
                    </button>
                </div>
            </div>

            <!-- Niche AR -->
            <div class="relative">
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Niche (AR)</label>
                <input [(ngModel)]="project.niche_Ar" (input)="onNicheArInput($any($event.target).value)"
                    (focus)="onNicheArInput(project.niche_Ar || '')" (blur)="onNicheArBlur()"
                    placeholder="التخصص" dir="rtl"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">

                <div *ngIf="showNicheArSuggestions && filteredNicheArSuggestions.length > 0"
                    class="absolute z-20 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                    <button *ngFor="let suggestion of filteredNicheArSuggestions"
                        (click)="selectNicheAr(suggestion)" type="button"
                        class="w-full px-4 py-2 text-right text-sm text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                        dir="rtl">
                        {{ suggestion }}
                    </button>
                </div>
            </div>
        </div>
    `
})
export class ProjectFormCategoriesComponent {
    private cdr = inject(ChangeDetectorRef);

    @Input() project: Partial<ProjectEntry> = {};
    @Input() categories: string[] = [];
    @Input() categoryArSuggestions: string[] = [];
    @Input() nicheSuggestions: string[] = [];
    @Input() nicheArSuggestions: string[] = [];
    
    @Output() manageCategoriesClick = new EventEmitter<void>();
    @Output() manageNichesClick = new EventEmitter<void>();

    showCategorySuggestions = false;
    filteredCategorySuggestions: string[] = [];
    showCategoryArSuggestions = false;
    filteredCategoryArSuggestions: string[] = [];
    showNicheSuggestions = false;
    filteredNicheSuggestions: string[] = [];
    showNicheArSuggestions = false;
    filteredNicheArSuggestions: string[] = [];

    onCategoryInput(value: string) {
        this.filteredCategorySuggestions = !value || value.trim() === '' 
            ? this.categories 
            : this.categories.filter(cat => cat.toLowerCase().includes(value.toLowerCase()));
        this.showCategorySuggestions = true;
        this.cdr.detectChanges();
    }

    selectCategory(category: string) {
        this.project.category = category;
        this.showCategorySuggestions = false;
        this.cdr.detectChanges();
    }

    onCategoryBlur() {
        setTimeout(() => {
            this.showCategorySuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    onCategoryArInput(value: string) {
        this.filteredCategoryArSuggestions = !value || value.trim() === '' 
            ? this.categoryArSuggestions 
            : this.categoryArSuggestions.filter(cat => cat.includes(value));
        this.showCategoryArSuggestions = true;
        this.cdr.detectChanges();
    }

    selectCategoryAr(category: string) {
        this.project.category_Ar = category;
        this.showCategoryArSuggestions = false;
        this.cdr.detectChanges();
    }

    onCategoryArBlur() {
        setTimeout(() => {
            this.showCategoryArSuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    onNicheInput(value: string) {
        this.filteredNicheSuggestions = !value || value.trim() === '' 
            ? this.nicheSuggestions 
            : this.nicheSuggestions.filter(niche => niche.toLowerCase().includes(value.toLowerCase()));
        this.showNicheSuggestions = true;
        this.cdr.detectChanges();
    }

    selectNiche(niche: string) {
        this.project.niche = niche;
        this.showNicheSuggestions = false;
        this.cdr.detectChanges();
    }

    onNicheBlur() {
        setTimeout(() => {
            this.showNicheSuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    onNicheArInput(value: string) {
        this.filteredNicheArSuggestions = !value || value.trim() === '' 
            ? this.nicheArSuggestions 
            : this.nicheArSuggestions.filter(niche => niche.includes(value));
        this.showNicheArSuggestions = true;
        this.cdr.detectChanges();
    }

    selectNicheAr(niche: string) {
        this.project.niche_Ar = niche;
        this.showNicheArSuggestions = false;
        this.cdr.detectChanges();
    }

    onNicheArBlur() {
        setTimeout(() => {
            this.showNicheArSuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    // Handle manage button clicks
    onManageCategoriesClick() {
        console.log('Categories manage button clicked in form');
        this.manageCategoriesClick.emit();
    }

    onManageNichesClick() {
        console.log('Niches manage button clicked in form');
        this.manageNichesClick.emit();
    }
}
