import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Zap } from 'lucide-angular';
import { TranslationService } from '../../../services/translation.service';

@Component({
    selector: 'app-contact-map',
    standalone: true,
    imports: [CommonModule, TranslateModule, LucideAngularModule],
    template: `
    <div class="animate-fade-in-left h-full flex flex-col" style="animation-delay: 0.4s">
        <!-- Map Container -->
        <div
            class="relative group rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-[#E4D5C7] dark:bg-zinc-900/40 flex-1">
            <!-- Sketch Overlay for high-fidelity parchment feel -->
            <div
                class="absolute inset-0 bg-[#E4D5C7]/30 dark:bg-black/40 pointer-events-none z-10 mix-blend-multiply">
            </div>
            <div class="absolute inset-0 backdrop-blur-[1px] pointer-events-none z-10 opacity-30"></div>

            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109825.279610111!2d30.9575917!3d30.7911111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f7c9e0e7a7e8e7%3A0x7e7e8e7e8e7e8e7e!2sGharbia%20Governorate%2C%20Egypt!5e0!3m2!1sen!2seg!4v1711234567890!5m2!1sen!2seg"
                width="100%" height="100%"
                style="border:0; filter: grayscale(1) sepia(0.5) contrast(1.2) brightness(0.9) hue-rotate(-10deg); min-height: 450px;"
                allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                class="relative z-0 group-hover:scale-105 transition-transform duration-[4000ms]">
            </iframe>

            <!-- Pulse Marker over the specific spot -->
            <div class="absolute top-[45%] left-[48%] z-10 pointer-events-none">
                <div class="relative flex h-12 w-12">
                    <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20"></span>
                    <span
                        class="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-4 border-white dark:border-zinc-950 shadow-lg mt-4 ml-4"></span>
                </div>
            </div>
        </div>

        <!-- Discovery Card (Below Map) -->
        <div
            [attr.dir]="translationService.isRTL() ? 'rtl' : 'ltr'"
            class="bg-zinc-50 dark:bg-zinc-900 backdrop-blur-xl p-6 lg:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl mt-6">
            <div class="flex items-start justify-between mb-6">
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <span
                            class="text-zinc-900 dark:text-white font-black text-lg lg:text-xl uppercase tracking-tighter italic">{{ 'contact.map.title' | translate }}</span>
                        <div
                            class="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)] animate-pulse">
                        </div>
                    </div>
                    <p class="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em]">
                        {{ 'contact.map.subtitle' | translate }}</p>
                </div>
                <lucide-icon [img]="ZapIcon" class="w-5 h-5 text-red-600 animate-pulse"></lucide-icon>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <div [class.text-right]="translationService.isRTL()" [class.text-left]="!translationService.isRTL()">
                    <p class="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{{ 'contact.map.baseCoordinate' | translate }}</p>
                    <p class="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase italic">{{ 'contact.map.location' | translate }}</p>
                </div>
                <div [class.text-left]="translationService.isRTL()" [class.text-right]="!translationService.isRTL()">
                    <p class="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{{ 'contact.map.syncStatus' | translate }}</p>
                    <p class="text-[10px] font-bold text-green-500 uppercase italic">{{ 'contact.map.cognitive' | translate }}</p>
                </div>
            </div>
        </div>
    </div>
  `
})
export class ContactMapComponent {
    translationService = inject(TranslationService);
    ZapIcon = Zap;
}
