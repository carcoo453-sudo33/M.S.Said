import { Component, inject, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';
import { ToastService } from '../../../../services/toast.service';
import { KeyFeature } from '../../../../models/project.model';

@Component({
    selector: 'app-project-key-features-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
    template: `
        <div class="space-y-4">
            <!-- Add New Feature -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <input 
                    [(ngModel)]="newFeature.title"
                    placeholder="Feature title"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                />
                <input 
                    [(ngModel)]="newFeature.title_Ar"
                    placeholder="Arabic title (optional)"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                />
                <textarea 
                    [(ngModel)]="newFeature.description"
                    placeholder="Feature description"
                    rows="2"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all resize-none"
                ></textarea>
                <textarea 
                    [(ngModel)]="newFeature.description_Ar"
                    placeholder="Arabic description (optional)"
                    rows="2"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all resize-none"
                ></textarea>
                <input 
                    [(ngModel)]="newFeature.icon"
                    placeholder="Icon name (optional)"
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                />
                <button 
                    (click)="addKeyFeature()"
                    [disabled]="!newFeature.title?.trim() || !newFeature.description?.trim()"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                >
                    <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                    Add Feature
                </button>
            </div>

            <!-- Features List -->
            <div class="space-y-2">
                <div 
                    *ngFor="let feature of keyFeatures; let i = index" 
                    class="flex items-start justify-between p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                >
                    <div class="flex-1">
                        <div class="font-medium">{{ feature.title }}</div>
                        <div *ngIf="feature.title_Ar" class="text-sm text-zinc-600 dark:text-zinc-400">{{ feature.title_Ar }}</div>
                        <div class="text-sm text-zinc-700 dark:text-zinc-300 mt-1">{{ feature.description }}</div>
                        <div *ngIf="feature.description_Ar" class="text-sm text-zinc-500 dark:text-zinc-400">{{ feature.description_Ar }}</div>
                        <div *ngIf="feature.icon" class="text-xs text-red-600 mt-1">Icon: {{ feature.icon }}</div>
                    </div>
                    <button 
                        (click)="removeKeyFeature(i)"
                        class="text-red-600 hover:text-red-800 ml-2"
                    >
                        <lucide-icon [img]="DeleteIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                </div>
            </div>
        </div>
    `
})
export class ProjectKeyFeaturesManagerComponent {
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

        this.keyFeatures.push({
            icon: this.newFeature.icon || 'star',
            title: title,
            title_Ar: this.newFeature.title_Ar?.trim() || '',
            description: description,
            description_Ar: this.newFeature.description_Ar?.trim() || ''
        });

        this.newFeature = { title: '', title_Ar: '', description: '', description_Ar: '', icon: '' };
        this.keyFeaturesChange.emit(this.keyFeatures);
        this.cdr.detectChanges();
        this.toast.success('Feature added');
    }

    removeKeyFeature(index: number) {
        this.keyFeatures.splice(index, 1);
        this.keyFeaturesChange.emit(this.keyFeatures);
        this.cdr.detectChanges();
        this.toast.success('Feature removed');
    }
}