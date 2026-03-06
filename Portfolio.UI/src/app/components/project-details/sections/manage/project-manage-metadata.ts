import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Code } from 'lucide-angular';

@Component({
    selector: 'app-project-manage-metadata',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <!-- Project Metadata Section -->
    <div class="col-span-2 mt-4 p-4 bg-zinc-900 rounded-xl">
        <h4 class="text-sm font-black uppercase text-white mb-4 flex items-center gap-2">
            <lucide-icon [img]="CodeIcon" class="w-4 h-4 text-red-600"></lucide-icon>
            Project Metadata
        </h4>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Language (EN)</label>
                <input type="text" [(ngModel)]="editData.language" placeholder="e.g. TypeScript"
                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
            </div>
            <div>
                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Language (AR)</label>
                <input type="text" [(ngModel)]="editData.language_Ar" placeholder="مثال: تايب سكريبت" dir="rtl"
                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
            </div>
            <div>
                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Duration (EN)</label>
                <input type="text" [(ngModel)]="editData.duration" placeholder="e.g. 2025"
                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
            </div>
            <div>
                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Duration (AR)</label>
                <input type="text" [(ngModel)]="editData.duration_Ar" placeholder="مثال: 2025" dir="rtl"
                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
            </div>
            <div>
                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Architecture (EN)</label>
                <input type="text" [(ngModel)]="editData.architecture" placeholder="e.g. Scalable Architecture"
                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
            </div>
            <div>
                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Architecture (AR)</label>
                <input type="text" [(ngModel)]="editData.architecture_Ar" placeholder="مثال: هندسة قابلة للتوسع" dir="rtl"
                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
            </div>
            <div>
                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Status (EN)</label>
                <input type="text" [(ngModel)]="editData.status" placeholder="e.g. Active"
                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
            </div>
            <div>
                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Status (AR)</label>
                <input type="text" [(ngModel)]="editData.status_Ar" placeholder="مثال: نشط" dir="rtl"
                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
            </div>
        </div>
    </div>
  `
})
export class ProjectManageMetadataComponent {
    @Input() editData: any = {};
    
    CodeIcon = Code;
}