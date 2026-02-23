import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-education-specializations',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div
        class="mt-48 p-20 dark:bg-zinc-900/40 bg-zinc-50/50 backdrop-blur-xl rounded-[4rem] border border-zinc-100 dark:border-zinc-800 text-center animate-fade-in-up">
        <h2 class="text-5xl font-black mb-8 uppercase tracking-tighter dark:text-white text-zinc-900">Technical
            <span class="text-red-600">Focus</span>
        </h2>
        <p class="text-zinc-500 dark:text-zinc-400 mb-16 max-w-xl mx-auto text-lg italic font-medium">Continuous
            specialization in systemic engineering and modern digital frameworks.</p>
        <div class="flex flex-wrap justify-center gap-6">
            <span
                *ngFor="let focus of ['ASP.NET Core', 'Angular', 'Distributed Systems', 'Cloud Architecture', 'Identity Security']"
                class="px-8 py-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-red-600 transition-all shadow-sm">
                {{ focus }}
            </span>
        </div>
    </div>
  `
})
export class EducationSpecializationsComponent { }
