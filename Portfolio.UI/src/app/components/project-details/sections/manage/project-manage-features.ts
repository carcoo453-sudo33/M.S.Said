import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';
import { KeyFeature } from '../../../../models';

@Component({
    selector: 'app-project-manage-features',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <!-- Key Features -->
    <section class="space-y-6">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-black uppercase text-red-600">Key Features</h3>
            <button (click)="addFeature()" 
                class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-colors">
                <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                Add Feature
            </button>
        </div>
        <div class="space-y-4">
            <div *ngFor="let feature of editData.keyFeatures; let i = index"
                class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black uppercase text-zinc-600">Feature {{i + 1}}</span>
                    <button (click)="removeFeature(i)" 
                        class="text-red-600 hover:text-red-500 transition-colors">
                        <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Icon</label>
                        <select [(ngModel)]="feature.icon"
                            class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                            <option value="Layers">Layers</option>
                            <option value="Rocket">Rocket</option>
                            <option value="Monitor">Monitor</option>
                            <option value="Code">Code</option>
                        </select>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Title (EN)</label>
                        <input type="text" [(ngModel)]="feature.title"
                            class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Title (AR)</label>
                    <input type="text" [(ngModel)]="feature.title_Ar" dir="rtl"
                        placeholder="العنوان"
                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                </div>
                <div>
                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Description (EN)</label>
                    <textarea [(ngModel)]="feature.description" rows="2"
                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none resize-none"></textarea>
                </div>
                <div>
                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Description (AR)</label>
                    <textarea [(ngModel)]="feature.description_Ar" rows="2" dir="rtl"
                        placeholder="الوصف"
                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none resize-none"></textarea>
                </div>
            </div>
        </div>
    </section>
  `
})
export class ProjectManageFeaturesComponent {
    @Input() editData: any = {};
    
    PlusIcon = Plus;
    TrashIcon = Trash2;

    // Key Features
    addFeature() {
        if (!this.editData.keyFeatures) {
            this.editData.keyFeatures = [];
        }
        this.editData.keyFeatures.push({
            icon: 'Layers',
            title: '',
            description: ''
        });
    }

    removeFeature(index: number) {
        this.editData.keyFeatures.splice(index, 1);
    }
}