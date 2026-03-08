import { Component, inject, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';
import { ToastService } from '../../../../services/toast.service';
import { ChangelogItem } from '../../../../models/project.model';

@Component({
    selector: 'app-project-form-changelog',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
    template: `
        <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Changelog</h3>
            <div class="space-y-4">
                <!-- Add New Changelog Entry -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <div class="col-span-1 md:col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Version</label>
                        <input 
                            [(ngModel)]="newItem['version']"
                            placeholder="e.g. v1.0.0"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all font-bold"
                        />
                    </div>
                    <div class="col-span-1 md:col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Title (EN)</label>
                        <input 
                            [(ngModel)]="newItem['title']"
                            placeholder="Major Update / Bug Fixes"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all font-medium"
                        />
                    </div>
                    <div class="col-span-1 md:col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (EN)</label>
                        <textarea 
                            [(ngModel)]="newItem['description']"
                            placeholder="Describe what's new..."
                            rows="2"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all resize-none"
                        ></textarea>
                    </div>
                    <div class="col-span-1 md:col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (AR)</label>
                        <textarea 
                            [(ngModel)]="newItem['description_Ar']"
                            placeholder="وصف التغييرات..."
                            rows="2"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all resize-none text-right"
                            dir="rtl"
                        ></textarea>
                    </div>
                    <div class="col-span-1 md:col-span-2">
                        <button 
                            (click)="addChangelogItem()"
                            [disabled]="!newItem['version']?.trim() || !newItem['description']?.trim()"
                            class="w-full px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/5"
                        >
                            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                            Add to History
                        </button>
                    </div>
                </div>

                <!-- Changelog List -->
                <div class="grid grid-cols-1 gap-4">
                    <div 
                        *ngFor="let item of changelog; let i = index" 
                        class="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 group"
                    >
                        <!-- Timeline Bullet -->
                        <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 bg-red-600"></div>
                        
                        <div class="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 hover:shadow-md transition-all">
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center gap-2">
                                    <span class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-[10px] font-black text-red-600 uppercase tracking-widest">
                                        {{ item.version }}
                                    </span>
                                    <span class="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">{{ item.date | date:'mediumDate' }}</span>
                                </div>
                                <button 
                                    (click)="removeChangelogItem(i)"
                                    class="text-zinc-400 hover:text-red-600 transition-colors"
                                >
                                    <lucide-icon [img]="DeleteIcon" class="w-3.5 h-3.5"></lucide-icon>
                                </button>
                            </div>
                            <div class="space-y-1">
                                <h4 class="text-sm font-bold text-zinc-900 dark:text-white">{{ item.title }}</h4>
                                <p class="text-xs text-zinc-600 dark:text-zinc-300">{{ item.description }}</p>
                                <p *ngIf="item.description_Ar" class="text-xs text-zinc-500 dark:text-zinc-400 italic" dir="rtl">{{ item.description_Ar }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div *ngIf="changelog.length === 0" class="flex flex-col items-center justify-center py-8 text-zinc-400">
                    <p class="text-[10px] font-bold uppercase tracking-widest">Initial Release Only</p>
                </div>
            </div>
        </div>
    `
})
export class ProjectFormChangelogComponent {
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);

    @Input() changelog: ChangelogItem[] = [];
    @Output() changelogChange = new EventEmitter<ChangelogItem[]>();

    PlusIcon = Plus;
    DeleteIcon = Trash2;

    newItem: Partial<ChangelogItem> = { version: '', title: '', description: '', description_Ar: '', date: '' };

    addChangelogItem() {
        const version = this.newItem['version']?.trim();
        const description = this.newItem['description']?.trim();

        if (!version || !description) {
            this.toast.warning('Version and description are required');
            return;
        }

        const item: ChangelogItem = {
            version: version,
            title: this.newItem['title']?.trim() || `Update ${version}`,
            description: description,
            description_Ar: this.newItem['description_Ar']?.trim() || '',
            date: new Date().toISOString(),
            id: 0,
            projectId: 0
        };

        this.changelog = [item, ...this.changelog];

        this.newItem = { version: '', title: '', description: '', description_Ar: '', date: '' };
        this.changelogChange.emit(this.changelog);
        this.cdr.detectChanges();
        this.toast.success('Version history updated');
    }

    removeChangelogItem(index: number) {
        this.changelog = this.changelog.filter((_, i) => i !== index);
        this.changelogChange.emit(this.changelog);
        this.cdr.detectChanges();
        this.toast.success('Changelog entry removed');
    }
}
