import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Quote } from 'lucide-angular';
import { Testimonial } from '../../../models';

@Component({
    selector: 'app-projects-references',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <section class="mt-48 animate-fade-in-up">
        <div class="flex items-center gap-6 mb-20">
            <div class="w-2 h-12 bg-red-600 rounded-full"></div>
            <h2 class="text-5xl font-black dark:text-white text-zinc-900 tracking-tighter uppercase italic">
                References
            </h2>
        </div>

        <div class="grid grid-cols-1 gap-10">
            <div *ngFor="let t of testimonials"
                class="bg-zinc-950 p-12 md:p-20 rounded-[4rem] border border-zinc-800 relative overflow-hidden group">
                <div
                    class="absolute top-10 right-10 text-red-600 opacity-20 group-hover:opacity-40 transition-opacity">
                    <lucide-icon [img]="QuoteIcon" class="w-24 h-24"></lucide-icon>
                </div>

                <div class="relative z-10 space-y-12">
                    <p
                        class="text-zinc-400 text-2xl md:text-3xl leading-relaxed italic text-center font-medium">
                        {{ t.content }}
                    </p>

                    <div class="flex flex-col items-center gap-6">
                        <img [src]="t.avatarUrl" [alt]="t.name"
                            class="w-20 h-20 rounded-full border-2 border-red-600 p-1 bg-zinc-900">
                        <div class="text-center">
                            <h4 class="text-white font-black text-xl uppercase tracking-tight italic">{{ t.name
                                }}</h4>
                            <p class="text-red-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                                {{ t.role }} @ {{ t.company }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  `
})
export class ProjectsReferencesComponent {
    @Input() testimonials: Testimonial[] = [];
    QuoteIcon = Quote;
}
