import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, ArrowRight, Sparkles } from 'lucide-angular';

@Component({
    selector: 'app-projects-bottom-cta',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, LucideAngularModule],
    template: `
    <section class="relative overflow-hidden py-16">
        <!-- Background effects -->
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/5 to-transparent"></div>
        <div class="absolute inset-0 opacity-[0.02]" 
             style="background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 30px 30px;"></div>
        
        <!-- Floating particles -->
        <div class="absolute top-1/2 left-1/4 w-2 h-2 bg-red-500/30 rounded-full animate-float-particle"></div>
        <div class="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-500/30 rounded-full animate-float-particle-delayed"></div>
        <div class="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-500/30 rounded-full animate-float-particle-slow"></div>
        
        <div class="relative text-center space-y-12 max-w-4xl mx-auto px-6">
            <!-- Animated divider line -->
            <div class="flex items-center justify-center gap-4">
                <div class="w-px h-32 bg-gradient-to-b from-transparent via-red-600 to-transparent animate-pulse-slow"></div>
            </div>
            
            <!-- Question text with sparkle icon -->
            <div class="flex items-center justify-center gap-3 animate-fade-in-up">
                <lucide-icon [img]="SparklesIcon" class="w-4 h-4 text-red-600 animate-spin-slow"></lucide-icon>
                <p class="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.3em] text-xs">
                    {{ 'projects.cta.question' | translate }}
                </p>
                <lucide-icon [img]="SparklesIcon" class="w-4 h-4 text-red-600 animate-spin-slow"></lucide-icon>
            </div>
            
            <!-- Main CTA with enhanced hover effects -->
            <div class="animate-fade-in-up animation-delay-200">
                <a routerLink="/contact"
                    class="group relative inline-flex items-center gap-6 text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter transition-all duration-500">
                    <!-- Gradient text with animation -->
                    <span class="relative">
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-red-600 to-zinc-900 dark:from-white dark:via-red-500 dark:to-white bg-[length:200%_auto] group-hover:bg-[length:100%_auto] animate-gradient-x transition-all duration-500">
                            {{ 'projects.cta.action' | translate }}
                        </span>
                        <!-- Underline effect -->
                        <span class="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-red-600 to-purple-600 group-hover:w-full transition-all duration-500"></span>
                    </span>
                    
                    <!-- Animated arrow with circle background -->
                    <span class="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 text-white group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-purple-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                        <lucide-icon [img]="ArrowRightIcon"
                            class="w-8 h-8 md:w-10 md:h-10 group-hover:translate-x-2 transition-transform duration-500"></lucide-icon>
                        <!-- Pulse ring effect -->
                        <span class="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-0 group-hover:opacity-20"></span>
                    </span>
                </a>
            </div>
            
            <!-- Decorative elements -->
            <div class="flex items-center justify-center gap-6 pt-8 animate-fade-in-up animation-delay-400">
                <div class="h-px w-24 bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent"></div>
                <div class="flex gap-2">
                    <div class="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse animation-delay-200"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse animation-delay-400"></div>
                </div>
                <div class="h-px w-24 bg-gradient-to-l from-transparent via-zinc-300 dark:via-zinc-700 to-transparent"></div>
            </div>
        </div>
    </section>
  `,
    styles: [`
        @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        @keyframes float-particle {
            0%, 100% { 
                transform: translate(0, 0) scale(1);
                opacity: 0.3;
            }
            50% { 
                transform: translate(20px, -30px) scale(1.5);
                opacity: 0.6;
            }
        }
        
        @keyframes float-particle-delayed {
            0%, 100% { 
                transform: translate(0, 0) scale(1);
                opacity: 0.3;
            }
            50% { 
                transform: translate(-30px, 20px) scale(1.3);
                opacity: 0.5;
            }
        }
        
        @keyframes float-particle-slow {
            0%, 100% { 
                transform: translate(0, 0) scale(1);
                opacity: 0.2;
            }
            50% { 
                transform: translate(15px, 25px) scale(1.4);
                opacity: 0.4;
            }
        }
        
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
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
        
        .animate-gradient-x {
            animation: gradient-x 3s ease infinite;
        }
        
        .animate-float-particle {
            animation: float-particle 6s ease-in-out infinite;
        }
        
        .animate-float-particle-delayed {
            animation: float-particle-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-particle-slow {
            animation: float-particle-slow 10s ease-in-out infinite;
        }
        
        .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
        }
        
        .animate-pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
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
    `]
})
export class ProjectsBottomCTAComponent {
    ArrowRightIcon = ArrowRight;
    SparklesIcon = Sparkles;
}
