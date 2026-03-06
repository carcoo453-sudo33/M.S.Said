import { Component, inject, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';
import { ToastService } from '../../../../services/toast.service';
import { KeyFeature, ChangelogItem } from '../../../../models/project.model';

@Component({
    selector: 'app-project-features-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
    template: `
        <div class="space-y-6">
            <!-- Key Features Management -->
            <div class="space-y-4">
                <h3 class="text-lg font-semibold">Key Features</h3>
                
                <!-- Add New Feature -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <input 
                        [(ngModel)]="newFeature.title"
                        placeholder="Feature title"
                        class="px-3 py-2 border rounded-lg"
                    />
                    <input 
                        [(ngModel)]="newFeature.title_Ar"
                        placeholder="Arabic title (optional)"
                        class="px-3 py-2 border rounded-lg"
                    />
                    <textarea 
                        [(ngModel)]="newFeature.description"
                        placeholder="Feature description"
                        rows="2"
                        class="px-3 py-2 border rounded-lg"
                    ></textarea>
                    <textarea 
                        [(ngModel)]="newFeature.description_Ar"
                        placeholder="Arabic description (optional)"
                        rows="2"
                        class="px-3 py-2 border rounded-lg"
                    ></textarea>
                    <input 
                        [(ngModel)]="newFeature.icon"
                        placeholder="Icon name (optional)"
                        class="px-3 py-2 border rounded-lg"
                    />
                    <button 
                        (click)="addKeyFeature()"
                        [disabled]="!newFeature.title?.trim() || !newFeature.description?.trim()"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                    >
                        <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                        Add Feature
                    </button>
                </div>

                <!-- Features List -->
                <div class="space-y-2">
                    <div 
                        *ngFor="let feature of keyFeatures; let i = index" 
                        class="flex items-start justify-between p-3 bg-white border rounded-lg"
                    >
                        <div class="flex-1">
                            <div class="font-medium">{{ feature.title }}</div>
                            <div *ngIf="feature.title_Ar" class="text-sm text-gray-600">{{ feature.title_Ar }}</div>
                            <div class="text-sm text-gray-700 mt-1">{{ feature.description }}</div>
                            <div *ngIf="feature.description_Ar" class="text-sm text-gray-500">{{ feature.description_Ar }}</div>
                            <div *ngIf="feature.icon" class="text-xs text-blue-600 mt-1">Icon: {{ feature.icon }}</div>
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

            <!-- Responsibilities Management -->
            <div class="space-y-4">
                <h3 class="text-lg font-semibold">Responsibilities</h3>
                
                <!-- Add New Responsibility -->
                <div class="flex gap-2">
                    <input 
                        [(ngModel)]="newResponsibility"
                        placeholder="Add responsibility"
                        class="flex-1 px-3 py-2 border rounded-lg"
                        (keyup.enter)="addResponsibility()"
                    />
                    <button 
                        (click)="addResponsibility()"
                        [disabled]="!newResponsibility?.trim()"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                    >
                        <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                        Add
                    </button>
                </div>

                <!-- Responsibilities List -->
                <div class="space-y-2">
                    <div 
                        *ngFor="let responsibility of responsibilities; let i = index" 
                        class="flex items-center justify-between p-2 bg-white border rounded-lg"
                    >
                        <span class="flex-1">{{ responsibility }}</span>
                        <button 
                            (click)="removeResponsibility(i)"
                            class="text-red-600 hover:text-red-800 ml-2"
                        >
                            <lucide-icon [img]="DeleteIcon" class="w-4 h-4"></lucide-icon>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Changelog Management -->
            <div class="space-y-4">
                <h3 class="text-lg font-semibold">Changelog</h3>
                
                <!-- Add New Changelog Item -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <input 
                        [(ngModel)]="newChangelogItem.version"
                        placeholder="Version (e.g., 1.0.0)"
                        class="px-3 py-2 border rounded-lg"
                    />
                    <input 
                        [(ngModel)]="newChangelogItem.date"
                        type="date"
                        class="px-3 py-2 border rounded-lg"
                    />
                    <input 
                        [(ngModel)]="newChangelogItem.title"
                        placeholder="Change title"
                        class="px-3 py-2 border rounded-lg"
                    />
                    <input 
                        [(ngModel)]="newChangelogItem.title_Ar"
                        placeholder="Arabic title (optional)"
                        class="px-3 py-2 border rounded-lg"
                    />
                    <textarea 
                        [(ngModel)]="newChangelogItem.description"
                        placeholder="Change description"
                        rows="2"
                        class="px-3 py-2 border rounded-lg"
                    ></textarea>
                    <textarea 
                        [(ngModel)]="newChangelogItem.description_Ar"
                        placeholder="Arabic description (optional)"
                        rows="2"
                        class="px-3 py-2 border rounded-lg"
                    ></textarea>
                    <div class="md:col-span-2">
                        <button 
                            (click)="addChangelogItem()"
                            [disabled]="!isChangelogItemValid()"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
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
                        class="flex items-start justify-between p-3 bg-white border rounded-lg"
                    >
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="font-medium">{{ item.title }}</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{{ item.version }}</span>
                                <span class="text-xs text-gray-500">{{ item.date }}</span>
                            </div>
                            <div *ngIf="item.title_Ar" class="text-sm text-gray-600 mb-1">{{ item.title_Ar }}</div>
                            <div class="text-sm text-gray-700">{{ item.description }}</div>
                            <div *ngIf="item.description_Ar" class="text-sm text-gray-500">{{ item.description_Ar }}</div>
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
        </div>
    `
})
export class ProjectFeaturesManagerComponent {
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);

    @Input() keyFeatures: KeyFeature[] = [];
    @Input() responsibilities: string[] = [];
    @Input() changelog: ChangelogItem[] = [];
    
    @Output() keyFeaturesChange = new EventEmitter<KeyFeature[]>();
    @Output() responsibilitiesChange = new EventEmitter<string[]>();
    @Output() changelogChange = new EventEmitter<ChangelogItem[]>();

    PlusIcon = Plus;
    DeleteIcon = Trash2;

    newFeature: Partial<KeyFeature> = { title: '', title_Ar: '', description: '', description_Ar: '', icon: '' };
    newResponsibility = '';
    newChangelogItem: Partial<ChangelogItem> = { version: '', date: '', title: '', title_Ar: '', description: '', description_Ar: '' };

    // Key Features Management
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

    // Responsibilities Management
    addResponsibility() {
        const resp = this.newResponsibility.trim();
        if (!resp) {
            this.toast.warning('Please enter a responsibility');
            return;
        }

        this.responsibilities.push(resp);
        this.newResponsibility = '';
        this.responsibilitiesChange.emit(this.responsibilities);
        this.cdr.detectChanges();
        this.toast.success('Responsibility added');
    }

    removeResponsibility(index: number) {
        this.responsibilities.splice(index, 1);
        this.responsibilitiesChange.emit(this.responsibilities);
        this.cdr.detectChanges();
        this.toast.success('Responsibility removed');
    }

    // Changelog Management
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