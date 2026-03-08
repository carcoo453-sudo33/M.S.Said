import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X } from 'lucide-angular';
import { ToastService } from '../../../../services/toast.service';

@Component({
    selector: 'app-project-form-tags',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
        <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Tags</h3>
            <div class="col-span-2">
                <label for="project-tags" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">
                    Tags / Technologies
                    <span class="text-zinc-500 font-normal normal-case tracking-normal ml-2">- Click to add from suggestions</span>
                </label>

                <!-- Selected Tags Display -->
                <div class="flex flex-wrap gap-2 mb-2" *ngIf="selectedTags.length > 0">
                    <span *ngFor="let tag of selectedTags; let i = index"
                        class="inline-flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                        {{ tag }}
                        <button (click)="removeTag(i)" type="button"
                            class="hover:bg-red-700 rounded-full p-0.5 transition-colors">
                            <lucide-icon [img]="XIcon" class="w-3 h-3"></lucide-icon>
                        </button>
                    </span>
                </div>

                <!-- Tag Input with Suggestions -->
                <div class="relative">
                    <input id="project-tags" name="project-tags"
                        [(ngModel)]="tagInput" (input)="onTagInputChange($any($event.target).value)"
                        (focus)="showTechSuggestions = true; onTagInputChange(tagInput)" (blur)="onTagsBlur()"
                        (keyup.enter)="addCustomTag()" placeholder="Type to search or add custom tag..."
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">

                    <!-- Technology Suggestions Dropdown -->
                    <div *ngIf="showTechSuggestions && filteredTechSuggestions.length > 0"
                        class="absolute z-20 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        <button *ngFor="let tech of filteredTechSuggestions" (click)="selectTech(tech)"
                            type="button"
                            class="w-full px-4 py-2 text-left text-sm text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2">
                            <span class="w-2 h-2 bg-red-600 rounded-full"></span>
                            {{ tech }}
                        </button>
                    </div>
                </div>
                <p class="text-[9px] text-zinc-500 mt-1.5">Press Enter to add custom tag or select from suggestions</p>
            </div>
        </div>
    `
})
export class ProjectFormTagsComponent {
    private cdr = inject(ChangeDetectorRef);
    private toast = inject(ToastService);

    @Input() selectedTags: string[] = [];
    @Input() techSuggestions: string[] = [];
    @Output() selectedTagsChange = new EventEmitter<string[]>();

    XIcon = X;
    tagInput = '';
    showTechSuggestions = false;
    filteredTechSuggestions: string[] = [];

    onTagInputChange(value: string) {
        this.tagInput = value;

        if (!value || value.trim() === '') {
            this.filteredTechSuggestions = this.techSuggestions.filter(tech =>
                !this.selectedTags.includes(tech)
            );
            this.showTechSuggestions = true;
            this.cdr.detectChanges();
            return;
        }

        this.filteredTechSuggestions = this.techSuggestions.filter(tech =>
            tech.toLowerCase().includes(value.toLowerCase()) &&
            !this.selectedTags.includes(tech)
        );

        this.showTechSuggestions = this.filteredTechSuggestions.length > 0;
        this.cdr.detectChanges();
    }

    selectTech(tech: string) {
        if (this.selectedTags.includes(tech)) {
            this.toast.warning(`"${tech}" is already added`);
            return;
        }

        this.selectedTags.push(tech);
        this.selectedTagsChange.emit(this.selectedTags);
        this.tagInput = '';
        this.showTechSuggestions = false;
        this.cdr.detectChanges();
    }

    addCustomTag() {
        const tag = this.tagInput.trim();
        if (!tag) return;

        if (this.selectedTags.includes(tag)) {
            this.toast.warning(`"${tag}" is already added`);
            this.tagInput = '';
            return;
        }

        this.selectedTags.push(tag);
        this.selectedTagsChange.emit(this.selectedTags);
        this.tagInput = '';
        this.showTechSuggestions = false;
        this.cdr.detectChanges();
    }

    removeTag(index: number) {
        this.selectedTags.splice(index, 1);
        this.selectedTagsChange.emit(this.selectedTags);
        this.cdr.detectChanges();
    }

    onTagsBlur() {
        setTimeout(() => {
            this.showTechSuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }
}
