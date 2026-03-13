import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectEntry } from '../../../../models';

@Component({
    selector: 'app-project-form-metadata',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
        <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Technical Details</h3>
            
            <div class="grid grid-cols-2 gap-6">
                <!-- Language -->
                <div class="relative">
                    <label for="project-language" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Language</label>
                    <select id="project-language" name="project-language"
                        [(ngModel)]="project.language"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all appearance-none cursor-pointer">
                        <option [value]="undefined">Select Language</option>
                        <option *ngFor="let lang of languages" [value]="lang">{{ lang }}</option>
                    </select>
                    <div class="absolute right-4 top-[38px] pointer-events-none text-zinc-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>

                <!-- Language AR -->
                <div>
                    <label for="project-language-ar" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Language (AR)</label>
                    <input id="project-language-ar" name="project-language-ar"
                        [(ngModel)]="project.language_Ar" placeholder="اللغة البرمجية" dir="rtl"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>

                <!-- Duration -->
                <div>
                    <label for="project-duration" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Duration (EN)</label>
                    <input id="project-duration" name="project-duration"
                        [(ngModel)]="project.duration" placeholder="e.g. 2024 or 3 Months"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>

                <!-- Duration AR -->
                <div>
                    <label for="project-duration-ar" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Duration (AR)</label>
                    <input id="project-duration-ar" name="project-duration-ar"
                        [(ngModel)]="project.duration_Ar" placeholder="المدة الزمنية" dir="rtl"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>

                <!-- Architecture -->
                <div class="relative">
                    <label for="project-architecture" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Architecture</label>
                    <select id="project-architecture" name="project-architecture"
                        [(ngModel)]="project.architecture"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all appearance-none cursor-pointer">
                        <option [value]="undefined">Select Architecture</option>
                        <option *ngFor="let arch of architectures" [value]="arch">{{ arch }}</option>
                    </select>
                    <div class="absolute right-4 top-[38px] pointer-events-none text-zinc-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>

                <!-- Architecture AR -->
                <div>
                    <label for="project-architecture-ar" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Architecture (AR)</label>
                    <input id="project-architecture-ar" name="project-architecture-ar"
                        [(ngModel)]="project.architecture_Ar" placeholder="هيكلية المشروع" dir="rtl"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>

                <!-- Status -->
                <div class="relative">
                    <label for="project-status" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Status</label>
                    <select id="project-status" name="project-status"
                        [(ngModel)]="project.status"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all appearance-none cursor-pointer">
                        <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
                    </select>
                    <div class="absolute right-4 top-[38px] pointer-events-none text-zinc-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>

                <!-- Project Type -->
                <div class="relative">
                    <label for="project-type" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Project Type</label>
                    <select id="project-type" name="project-type"
                        [(ngModel)]="project.type"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all appearance-none cursor-pointer">
                        <option *ngFor="let t of types" [value]="t">{{ t }}</option>
                    </select>
                    <div class="absolute right-4 top-[38px] pointer-events-none text-zinc-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>

                <!-- Development Method -->
                <div class="relative col-span-2">
                    <label for="project-method" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Development Methodology</label>
                    <select id="project-method" name="project-method"
                        [(ngModel)]="project.developmentMethod"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all appearance-none cursor-pointer">
                        <option *ngFor="let m of methods" [value]="m">{{ m }}</option>
                    </select>
                    <div class="absolute right-4 top-[38px] pointer-events-none text-zinc-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ProjectFormMetadataComponent {
    @Input() project: Partial<ProjectEntry> = {};

    languages = ['CSharp', 'JavaScript', 'TypeScript', 'Python', 'Go', 'Php', 'Dart', 'Sql', 'Html', 'Css'];
    architectures = ['Monolithic', 'Microservices', 'Serverless', 'EventDriven', 'Layered', 'CleanArchitecture', 'Hexagonal', 'Onion', 'Mvc', 'Mvvm', 'ClientServer', 'PeerToPeer'];
    statuses = ['Planning', 'InProgress', 'Completed', 'OnHold', 'Archived'];
    types = ['Initial', 'Editing', 'Fixing', 'Refactoring', 'Migration', 'Enhancement', 'Integration', 'Performance', 'Security', 'Documentation'];
    methods = ['Manual', 'AI', 'Hybrid', 'Automated', 'Collaborative', 'PairProgramming', 'TestDriven', 'Agile', 'Waterfall', 'Prototype'];
}
