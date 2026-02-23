import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';

@Component({
    selector: 'app-projects-bottom-cta',
    standalone: true,
    imports: [CommonModule, RouterLink, LucideAngularModule],
    template: `
    <section class="mt-48 mb-24 animate-fade-in-up">
        <div class="text-center space-y-8">
            <div class="w-px h-24 bg-gradient-to-b from-transparent via-red-600 to-transparent mx-auto"></div>
            <p class="text-zinc-500 font-medium italic uppercase tracking-widest text-[10px]">Ready to architect
                your next digital leap?</p>
            <a routerLink="/contact"
                class="inline-flex items-center gap-4 text-2xl md:text-4xl font-black uppercase tracking-tighter hover:text-red-600 transition-all group italic">
                Initiate Connection <lucide-icon [img]="ArrowRightIcon"
                    class="w-8 h-8 group-hover:translate-x-3 transition-transform"></lucide-icon>
            </a>
        </div>
    </section>
  `
})
export class ProjectsBottomCTAComponent {
    ArrowRightIcon = ArrowRight;
}
