import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BioEntry } from '../../../models/bio.model';

@Component({
    selector: 'app-education-specializations',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    template: `
    <div
        class="mt-2 p-16 dark:bg-zinc-900/40 bg-zinc-50/50 backdrop-blur-xl rounded-3xl border border-zinc-100 dark:border-zinc-800 text-center animate-fade-in-up">
        <h2 class="text-xl font-black mb-6 uppercase tracking-tight dark:text-white text-zinc-900" [innerHTML]="getTitle()">
        </h2>
        <p class="text-zinc-500 dark:text-zinc-400 mb-12 max-w-2xl mx-auto text-sm">
            {{ getDescription() }}
        </p>
        <div class="flex flex-wrap justify-center gap-4">
            <span
                *ngFor="let focus of getFocusItems()"
                class="px-6 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-red-600 hover:border-red-600/30 transition-all shadow-sm">
                {{ focus }}
            </span>
        </div>
    </div>
  `
})
export class EducationSpecializationsComponent {
    @Input() bio?: BioEntry;
    private translate = inject(TranslateService);

    private defaultItems = ['ASP.NET Core', 'Angular', 'Distributed Systems', 'Cloud Architecture', 'Identity & Security', 'RESTful APIs', 'SQL Server', 'Entity Framework'];

    getTitle(): string {
        if (this.bio?.technicalFocusTitle) {
            const parts = this.bio.technicalFocusTitle.split(' ');
            if (parts.length > 1) {
                const lastWord = parts.pop();
                return `${parts.join(' ')} <span class="text-red-600">${lastWord}</span>`;
            }
            return this.bio.technicalFocusTitle;
        }
        const translatedTitle = this.translate.instant('education.technicalFocusTitle');
        const parts = translatedTitle.split(' ');
        if (parts.length > 1) {
            const lastWord = parts.pop();
            return `${parts.join(' ')} <span class="text-red-600">${lastWord}</span>`;
        }
        return translatedTitle;
    }

    getDescription(): string {
        return this.bio?.technicalFocusDescription || this.translate.instant('education.technicalFocusDescription');
    }

    getFocusItems(): string[] {
        if (this.bio?.technicalFocusItems) {
            return this.bio.technicalFocusItems.split(',').map(item => item.trim());
        }
        return this.defaultItems;
    }
}
