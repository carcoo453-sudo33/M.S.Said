import { Component, inject, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';
import { ToastService } from '../../../../services/toast.service';
import { KeyFeature } from '../../../../models/project.model';

@Component({
    selector: 'app-project-form-features',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
    template: `
        <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Key Features</h3>
            <div class="space-y-4">
                <!-- Add New Feature -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <input 
                        [(ngModel)]="newFeature.title"
                        placeholder="Feature title"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all font-medium"
                    />
                    <input 
                        [(ngModel)]="newFeature.title_Ar"
                        placeholder="Arabic title (optional)"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all text-right font-medium"
                        dir="rtl"
                    />
                    <textarea 
                        [(ngModel)]="newFeature.description"
                        placeholder="Feature description"
                        rows="2"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all resize-none"
                    ></textarea>
                    <textarea 
                        [(ngModel)]="newFeature.description_Ar"
                        placeholder="Arabic description (optional)"
                        rows="2"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all resize-none text-right"
                        dir="rtl"
                    ></textarea>
                    <div class="flex gap-3 col-span-1 md:col-span-2">
                        <input 
                            [(ngModel)]="newFeature.icon"
                            placeholder="Icon name (optional)"
                            class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all font-medium"
                        />
                        <button 
                            (click)="addKeyFeature()"
                            [disabled]="!newFeature.title?.trim() || !newFeature.description?.trim()"
                            class="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-black/5"
                        >
                            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                            Add Feature
                        </button>
                    </div>
                </div>

                <!-- Features List -->
                <div class="grid grid-cols-1 gap-3">
                    <div 
                        *ngFor="let feature of keyFeatures; let i = index" 
                        class="flex items-start justify-between p-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:shadow-md transition-all group"
                    >
                        <div class="flex-1">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                    <span class="text-red-600 text-sm font-bold">{{ i + 1 }}</span>
                                </div>
                                <div>
                                    <div class="font-bold text-zinc-900 dark:text-white">{{ feature.title }}</div>
                                    <div *ngIf="feature.title_Ar" class="text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ feature.title_Ar }}</div>
                                </div>
                            </div>
                            <div class="mt-3 space-y-1">
                                <div class="text-sm text-zinc-600 dark:text-zinc-300">{{ feature.description }}</div>
                                <div *ngIf="feature.description_Ar" class="text-sm text-zinc-500 dark:text-zinc-400 italic" dir="rtl">{{ feature.description_Ar }}</div>
                            </div>
                            <div *ngIf="feature.icon" class="mt-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 w-fit">
                                <span class="text-[9px] font-bold text-zinc-500 uppercase tracking-tight">Icon:</span>
                                <span class="text-[9px] font-black text-red-600 uppercase">{{ feature.icon }}</span>
                            </div>
                        </div>
                        <button 
                            (click)="removeKeyFeature(i)"
                            class="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                            <lucide-icon [img]="DeleteIcon" class="w-4 h-4"></lucide-icon>
                        </button>
                    </div>
                </div>

                <!-- Empty State -->
                <div *ngIf="keyFeatures.length === 0" class="flex flex-col items-center justify-center py-8 text-zinc-400">
                    <div class="w-12 h-12 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center mb-3">
                        <lucide-icon [img]="PlusIcon" class="w-5 h-5 opacity-50"></lucide-icon>
                    </div>
                    <p class="text-xs font-bold uppercase tracking-widest">No features added yet</p>
                </div>
            </div>
        </div>
    `
})
export class ProjectFormFeaturesComponent {
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);

    @Input() keyFeatures: KeyFeature[] = [];
    @Output() keyFeaturesChange = new EventEmitter<KeyFeature[]>();

    PlusIcon = Plus;
    DeleteIcon = Trash2;

    newFeature: Partial<KeyFeature> = { title: '', title_Ar: '', description: '', description_Ar: '', icon: '' };

    addKeyFeature() {
        const title = this.newFeature.title?.trim();
        const description = this.newFeature.description?.trim();

        if (!title || !description) {
            this.toast.warning('Please provide both title and description for the feature');
            return;
        }

        this.keyFeatures = [...this.keyFeatures, {
            icon: this.newFeature.icon || 'star',
            title: title,
            title_Ar: this.newFeature.title_Ar?.trim() || '',
            description: description,
            description_Ar: this.newFeature.description_Ar?.trim() || ''
        }];

        this.newFeature = { title: '', title_Ar: '', description: '', description_Ar: '', icon: '' };
        this.keyFeaturesChange.emit(this.keyFeatures);
        this.cdr.detectChanges();
        this.toast.success('Feature added');
    }

    removeKeyFeature(index: number) {
        this.keyFeatures = this.keyFeatures.filter((_, i) => i !== index);
        this.keyFeaturesChange.emit(this.keyFeatures);
        this.cdr.detectChanges();
        this.toast.success('Feature removed');
    }
}
