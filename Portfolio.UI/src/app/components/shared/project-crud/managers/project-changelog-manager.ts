import { Component, inject, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';
import { ToastService } from '../../../../services/toast.service';
import { ChangelogItem } from '../../../../models/project.model';

@Component({
    selector: 'app-project-changelog-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
    template: `
        <div class="space-y-4">
            <h3 class="text-lg font-semibold">Changelog</h3>
            
            <!-- Add New Changelog Item -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <input 
                    [(ngModel)]="newChangelogItem.version"
                    placeholder="Version (e.g., 1.0.0)"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                />
                <input 
                    [(ngModel)]="newChangelogItem.date"
                    type="date"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                />
                <input 
                    [(ngModel)]="newChangelogItem.title"
                    placeholder="Change title"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                />
                <input 
                    [(ngModel)]="newChangelogItem.title_Ar"
                    placeholder="Arabic title (optional)"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                />
                <textarea 
                    [(ngModel)]="newChangelogItem.description"
                    placeholder="Change description"
                    rows="2"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all resize-none"
                ></textarea>
                <textarea 
                    [(ngModel)]="newChangelogItem.description_Ar"
                    placeholder="Arabic description (optional)"
                    rows="2"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all resize-none"
                ></textarea>
                <div class="md:col-span-2">
                    <button 
                        (click)="addChangelogItem()"
                        [disabled]="!isChangelogItemValid()"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2 hover:bg-red-700 transition-colors"
                    >
                        <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                        Add Changelog Entry
                    </button>
                </div>
            </div>

            <!-- Changelog List -->
            <div class="space-y-2">
                <div 
                    *ngFor="let item of changelog; let i = index" 
                    class="flex items-start justify-between p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                >
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="font-medium">{{ item.title }}</span>
                            <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">{{ item.version }}</span>
                            <span class="text-xs text-zinc-500 dark:text-zinc-400">{{ item.date }}</span>
                        </div>
                        <div *ngIf="item.title_Ar" class="text-sm text-zinc-600 dark:text-zinc-400 mb-1">{{ item.title_Ar }}</div>
                        <div class="text-sm text-zinc-700 dark:text-zinc-300">{{ item.description }}</div>
                        <div *ngIf="item.description_Ar" class="text-sm text-zinc-500 dark:text-zinc-400">{{ item.description_Ar }}</div>
                    </div>
                    <button 
                        (click)="removeChangelogItem(i)"
                        class="text-red-600 hover:text-red-800 ml-2"
                    >
                        <lucide-icon [img]="DeleteIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                </div>
            </div>
        </div>
    `
})
export class ProjectChangelogManagerComponent {
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);

    @Input() changelog: ChangelogItem[] = [];
    @Output() changelogChange = new EventEmitter<ChangelogItem[]>();

    PlusIcon = Plus;
    DeleteIcon = Trash2;

    newChangelogItem: Partial<ChangelogItem> = { version: '', date: '', title: '', title_Ar: '', description: '', description_Ar: '' };

    addChangelogItem() {
        const version = this.newChangelogItem.version?.trim();
        const date = this.newChangelogItem.date?.trim();
        const title = this.newChangelogItem.title?.trim();
        const description = this.newChangelogItem.description?.trim();

        if (!version || !date || !title || !description) {
            this.toast.warning('Please fill in all required changelog fields (version, date, title, description)');
            return;
        }

        this.changelog.push({
            version: version,
            date: date,
            title: title,
            title_Ar: this.newChangelogItem.title_Ar?.trim() || '',
            description: description,
            description_Ar: this.newChangelogItem.description_Ar?.trim() || ''
        });

        this.newChangelogItem = { version: '', date: '', title: '', title_Ar: '', description: '', description_Ar: '' };
        this.changelogChange.emit(this.changelog);
        this.cdr.detectChanges();
        this.toast.success('Changelog entry added');
    }

    removeChangelogItem(index: number) {
        this.changelog.splice(index, 1);
        this.changelogChange.emit(this.changelog);
        this.cdr.detectChanges();
        this.toast.success('Changelog entry removed');
    }

    isChangelogItemValid(): boolean {
        return !!(
            this.newChangelogItem.version?.trim() &&
            this.newChangelogItem.date?.trim() &&
            this.newChangelogItem.title?.trim() &&
            this.newChangelogItem.description?.trim()
        );
    }
}