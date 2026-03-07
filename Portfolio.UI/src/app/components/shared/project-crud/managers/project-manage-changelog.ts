import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';
import { ChangelogItem } from '../../../../models';

@Component({
    selector: 'app-project-manage-changelog',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <!-- Changelog -->
    <section class="space-y-6">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-black uppercase text-red-600">Changelog</h3>
            <button (click)="addChangelogItem()" 
                class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-colors">
                <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                Add Entry
            </button>
        </div>
        <div class="space-y-4">
            <div *ngFor="let item of editData.changelog; let i = index"
                class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black uppercase text-zinc-600">Entry {{i + 1}}</span>
                    <button (click)="removeChangelogItem(i)" 
                        class="text-red-600 hover:text-red-500 transition-colors">
                        <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Date</label>
                        <input type="text" [(ngModel)]="item.date"
                            class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Version</label>
                        <input type="text" [(ngModel)]="item.version"
                            class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Title (EN)</label>
                        <input type="text" [(ngModel)]="item.title"
                            class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Title (AR)</label>
                    <input type="text" [(ngModel)]="item.title_Ar" dir="rtl"
                        placeholder="العنوان"
                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                </div>
                <div>
                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Description (EN)</label>
                    <textarea [(ngModel)]="item.description" rows="2"
                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none resize-none"></textarea>
                </div>
                <div>
                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Description (AR)</label>
                    <textarea [(ngModel)]="item.description_Ar" rows="2" dir="rtl"
                        placeholder="الوصف"
                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none resize-none"></textarea>
                </div>
            </div>
        </div>
    </section>
  `
})
export class ProjectManageChangelogComponent {
    @Input() editData: any = {};
    
    PlusIcon = Plus;
    TrashIcon = Trash2;

    // Changelog
    addChangelogItem() {
        if (!this.editData.changelog) {
            this.editData.changelog = [];
        }
        this.editData.changelog.push({
            date: '',
            version: '',
            title: '',
            description: ''
        });
    }

    removeChangelogItem(index: number) {
        this.editData.changelog.splice(index, 1);
    }
}