import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../../services/project.service';

@Component({
    selector: 'app-project-manage-basic-info',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="grid grid-cols-2 gap-6">
        <!-- Title EN -->
        <div class="col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Title (EN) *</label>
            <input [(ngModel)]="editData.title" placeholder="Project title"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
        </div>

        <!-- Title AR -->
        <div class="col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Title (AR)</label>
            <input [(ngModel)]="editData.title_Ar" placeholder="عنوان المشروع" dir="rtl"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
        </div>

        <!-- Description EN -->
        <div class="col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (EN) *</label>
            <textarea [(ngModel)]="editData.description" placeholder="Project description" rows="3"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
        </div>

        <!-- Description AR -->
        <div class="col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (AR)</label>
            <textarea [(ngModel)]="editData.description_Ar" placeholder="وصف المشروع" rows="3" dir="rtl"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
        </div>

        <!-- Summary EN -->
        <div class="col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Summary (EN)</label>
            <textarea [(ngModel)]="editData.summary" placeholder="Brief project summary" rows="2"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
        </div>

        <!-- Summary AR -->
        <div class="col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Summary (AR)</label>
            <textarea [(ngModel)]="editData.summary_Ar" placeholder="ملخص المشروع" rows="2" dir="rtl"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
        </div>

        <!-- URLs Section -->
        <div class="col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Project URL</label>
            <input [(ngModel)]="editData.projectUrl" placeholder="https://..."
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
        </div>

        <div class="col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">GitHub URL</label>
            <input [(ngModel)]="editData.gitHubUrl" placeholder="https://github.com/..."
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
        </div>

        <!-- Is Featured -->
        <div class="col-span-2 flex items-center gap-6 p-4 bg-zinc-900 rounded-xl">
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="editData.isFeatured"
                    class="w-4 h-4 rounded border-zinc-600 text-red-600 focus:ring-red-500 focus:ring-2">
                <span class="text-sm font-bold text-white">Mark as Featured</span>
            </label>
        </div>
    </div>
  `
})
export class ProjectManageBasicInfoComponent {
    @Input() editData: any = {};
}