import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { BioEntry } from '../../../models';

@Component({
    selector: 'app-home-hero',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, RouterLink],
    template: `
    <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 z-0">
            <div
                class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] animate-pulse">
            </div>
            <div
                class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-[120px] animate-pulse delay-700">
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 dark:bg-white/5 backdrop-blur-sm border border-zinc-100 dark:border-white/10 mb-8 animate-fade-in-up"
                style="animation-delay: 0.1s">
                <span class="relative flex h-2 w-2">
                    <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span
                    class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Available
                    for Innovation</span>
            </div>

            <h1 class="text-6xl md:text-9xl font-black tracking-tighter mb-8 animate-fade-in-up leading-[0.85] uppercase"
                style="animation-delay: 0.2s">
                Design <span
                    class="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B7E] to-[#7000FF]">Engineered</span><br>
                For Impact.
            </h1>

            <p class="max-w-2xl mx-auto text-lg md:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed mb-12 animate-fade-in-up italic"
                style="animation-delay: 0.3s">
                "I'm <strong>{{ bio?.name }}</strong>, a {{ bio?.title }} focused on crafting premium scale
                architectures and high-fidelity user interfaces."
            </p>

            <div class="flex flex-wrap justify-center gap-6 animate-fade-in-up" style="animation-delay: 0.4s">
                <a routerLink="/projects"
                    class="px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-black/10">
                    Explore Gallery
                    <lucide-icon [img]="ArrowRightIcon" class="w-4 h-4"></lucide-icon>
                </a>
                <a routerLink="/contact"
                    class="px-10 py-5 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-800 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-zinc-50 transition-all">
                    Get in Touch
                </a>
            </div>

            <div class="mt-24 flex justify-center gap-16 animate-fade-in-up" style="animation-delay: 0.6s">
                <div class="text-center group">
                    <p
                        class="text-4xl font-black dark:text-white text-zinc-900 group-hover:text-red-600 transition-colors">
                        {{ bio?.yearsOfExperience }}</p>
                    <p class="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Tenure</p>
                </div>
                <div class="text-center group">
                    <p
                        class="text-4xl font-black dark:text-white text-zinc-900 group-hover:text-purple-600 transition-colors">
                        {{ bio?.projectsCompleted }}</p>
                    <p class="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Cases Won</p>
                </div>
                <div class="text-center group">
                    <p
                        class="text-4xl font-black dark:text-white text-zinc-900 group-hover:text-blue-600 transition-colors">
                        {{ bio?.codeCommits }}</p>
                    <p class="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Commits</p>
                </div>
            </div>
        </div>
    </section>
  `
})
export class HomeHeroComponent {
    @Input() bio?: BioEntry;
    ArrowRightIcon = ArrowRight;
}
