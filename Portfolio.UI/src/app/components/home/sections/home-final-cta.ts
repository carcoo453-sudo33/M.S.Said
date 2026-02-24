import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { BioEntry } from '../../../models';

@Component({
    selector: 'app-home-final-cta',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule],
    template: `
    <section class="bg-zinc-950 py-28 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-red-600/10 to-purple-600/10 opacity-40"></div>
        <div class="max-w-4xl mx-auto px-6 relative text-center space-y-12">
            <h2 class="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase">
                {{ 'home.cta.title1' | translate }}<br>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B7E] to-[#7000FF]">{{ 'home.cta.title2' | translate }}</span>
                {{ 'home.cta.title3' | translate }}
            </h2>
            <p class="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
                {{ 'home.cta.description' | translate }}
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <a routerLink="/contact"
                    class="px-10 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-white/5">
                    {{ 'home.cta.button1' | translate }}
                </a>
                <a [href]="'mailto:' + bio?.email"
                    class="px-10 py-4 bg-zinc-900 text-white border border-zinc-800 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-all">
                    {{ 'home.cta.button2' | translate }}
                </a>
            </div>
        </div>
    </section>
  `
})
export class HomeFinalCTAComponent {
    @Input() bio?: BioEntry;
}
