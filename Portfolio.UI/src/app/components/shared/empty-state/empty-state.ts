import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, PackageOpen } from 'lucide-angular';

@Component({
    selector: 'app-shared-empty-state',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <section class="text-center py-24 animate-fade-in-up">
        <div
            class="bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 rounded-[4rem] p-24 max-w-2xl mx-auto space-y-10">
            <div
                class="inline-flex items-center justify-center w-24 h-24 rounded-xl bg-white dark:bg-zinc-800 shadow-sm text-zinc-300">
                <lucide-icon [img]="icon || PackageOpenIcon" class="w-12 h-12"></lucide-icon>
            </div>
            <h2 class="text-4xl font-black uppercase tracking-tighter leading-none">{{ title }}</h2>
            <p class="text-zinc-500 italic text-xl font-medium">{{ message }}</p>
        </div>
    </section>
  `
})
export class SharedEmptyStateComponent {
    @Input() title: string = 'Awaiting Content';
    @Input() message: string = 'No artifacts found in this sector.';
    @Input() icon: any;
    PackageOpenIcon = PackageOpen;
}
