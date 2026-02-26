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
    <section class="bg-zinc-950 py-20 md:py-32 relative overflow-hidden">
        <!-- Animated gradient background -->
        <div class="absolute inset-0 bg-gradient-to-br from-red-600/10 via-purple-600/10 to-blue-600/10 opacity-40 animate-gradient"></div>
        
        <!-- Animated grid pattern -->
        <div class="absolute inset-0 opacity-[0.02]" 
             style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px;"></div>
        
        <!-- Floating orbs -->
        <div class="absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        
        <div class="max-w-5xl mx-auto px-6 relative text-center">
            <!-- Title with stagger animation -->
            <div class="space-y-2 mb-8">
                <h2 class="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-none uppercase animate-fade-in-up">
                    {{ 'home.cta.title1' | translate }}
                </h2>
                <h2 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none uppercase animate-fade-in-up animation-delay-200">
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B7E] via-[#FF6B9D] to-[#7000FF] animate-gradient-x">
                        {{ 'home.cta.title2' | translate }}
                    </span>
                </h2>
                <h2 class="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-none uppercase animate-fade-in-up animation-delay-400">
                    {{ 'home.cta.title3' | translate }}
                </h2>
            </div>
            
            <!-- Description with fade in -->
            <p class="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-12 animate-fade-in-up animation-delay-600">
                {{ 'home.cta.description' | translate }}
            </p>
            
            <!-- Buttons with hover effects -->
            <div class="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-800">
                <a routerLink="/contact"
                    class="group relative px-12 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20">
                    <span class="relative z-10">{{ 'home.cta.button1' | translate }}</span>
                    <div class="absolute inset-0 bg-gradient-to-r from-[#FF3B7E] to-[#7000FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span class="relative z-10 text-black group-hover:text-white transition-colors duration-300">{{ 'home.cta.button1' | translate }}</span>
                </a>
                
                <a [href]="'mailto:' + bio?.email"
                    class="group relative px-12 py-5 bg-transparent text-white border-2 border-zinc-700 rounded-full font-black uppercase tracking-widest text-xs overflow-hidden transition-all duration-300 hover:scale-105 hover:border-white/50">
                    <span class="relative z-10 flex items-center justify-center gap-2">
                        <svg class="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        {{ 'home.cta.button2' | translate }}
                    </span>
                    <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
            </div>
            
            <!-- Decorative line -->
            <div class="mt-16 flex items-center justify-center gap-4 opacity-30">
                <div class="h-px w-20 bg-gradient-to-r from-transparent to-white"></div>
                <div class="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                <div class="h-px w-20 bg-gradient-to-l from-transparent to-white"></div>
            </div>
        </div>
    </section>
  `,
    styles: [`
        @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.1); }
        }
        
        @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(20px) scale(1.05); }
        }
        
        @keyframes fade-in-up {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 15s ease infinite;
        }
        
        .animate-gradient-x {
            background-size: 200% auto;
            animation: gradient-x 3s linear infinite;
        }
        
        .animate-float {
            animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
            animation: float-delayed 10s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
            opacity: 0;
        }
        
        .animation-delay-200 {
            animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
            animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
            animation-delay: 0.6s;
        }
        
        .animation-delay-800 {
            animation-delay: 0.8s;
        }
    `]
})
export class HomeFinalCTAComponent {
    @Input() bio?: BioEntry;
}
