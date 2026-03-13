import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { ProjectEntry } from '../../../../models';

@Component({
    selector: 'app-project-form-categories',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule, TranslateModule],
    template: `
        <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Categories</h3>
            
            <div class="grid grid-cols-2 gap-6">
                <!-- Category -->
                <div class="col-span-2 relative">
                    <label for="project-category" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Category *</label>
                    <select id="project-category" name="project-category"
                        [(ngModel)]="project.category"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all appearance-none cursor-pointer">
                        <option [value]="undefined" disabled selected>Select a category</option>
                        <option *ngFor="let cat of availableCategories" [value]="cat">{{ cat | translate }}</option>
                    </select>
                    <div class="absolute right-4 top-[38px] pointer-events-none text-zinc-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>

                <!-- Niche EN -->
                <div class="relative">
                    <label for="project-niche" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 flex items-center justify-between">
                        <span>Niche (EN)</span>
                        <button type="button" (click)="onManageNichesClick()"
                            class="text-[9px] text-red-600 hover:text-red-700 font-bold uppercase">
                            Manage
                        </button>
                    </label>
                    <input id="project-niche" name="project-niche"
                        [(ngModel)]="project.niche" (input)="onNicheInput($any($event.target).value)"
                        (focus)="onNicheInput(project.niche || '')" (blur)="onNicheBlur()"
                        placeholder="e.g. SaaS & Productivity"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">

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
                    <label for="project-niche-ar" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Niche (AR)</label>
                    <input id="project-niche-ar" name="project-niche-ar"
                        [(ngModel)]="project.niche_Ar" (input)="onNicheArInput($any($event.target).value)"
                        (focus)="onNicheArInput(project.niche_Ar || '')" (blur)="onNicheArBlur()"
                        placeholder="التخصص" dir="rtl"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">

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
        </div>
    `
})
export class ProjectFormCategoriesComponent {
    private cdr = inject(ChangeDetectorRef);

    @Input() project: Partial<ProjectEntry> = {};
    @Input() nicheSuggestions: string[] = [];
    @Input() nicheArSuggestions: string[] = [];

    @Output() manageNichesClick = new EventEmitter<void>();

    availableCategories = [
        'WebDevelopment', 'MobileDevelopment', 'DesktopApplication', 'ApiDevelopment',
        'DatabaseDesign', 'UiUxDesign', 'Devops', 'CloudInfrastructure',
        'MachineLearning', 'DataAnalysis', 'FullStack', 'FrontEnd', 'BackEnd',
        'EmbeddedSystems', 'GameDevelopment', 'Blockchain', 'Iot', 'Cybersecurity',
        'Automation', 'Testing'
    ];

    showNicheSuggestions = false;
    filteredNicheSuggestions: string[] = [];
    showNicheArSuggestions = false;
    filteredNicheArSuggestions: string[] = [];

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

    onManageNichesClick() {
        console.log('Niches manage button clicked in form');
        this.manageNichesClick.emit();
    }
}
