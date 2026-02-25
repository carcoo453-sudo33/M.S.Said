import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Mail, Github, Linkedin, MapPin, Phone } from 'lucide-angular';
import { TranslationService } from '../../../services/translation.service';

@Component({
    selector: 'app-shared-footer',
    standalone: true,
    imports: [CommonModule, RouterLink, LucideAngularModule, TranslateModule],
    template: `
    <footer class="pt-10 pb-10 border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
        <div class="max-w-7xl mx-auto px-2">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2" [class.text-right]="translationService.isRTL()">
                <!-- Column 1: Brand -->
                <div class="space-y-2">
                    <a routerLink="/" class="text-2xl font-black tracking-tighter flex items-center gap-1 text-zinc-900 dark:text-white group">
                        <div class="bg-red-600 text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20" [class.mr-2]="!translationService.isRTL()" [class.ml-2]="translationService.isRTL()">M</div>
                        Mostafa<span class="text-red-600">.Dev</span>
                    </a>
                    <p class="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed font-bold">
                        {{ 'footer.description' | translate }}
                    </p>
                </div>

                <!-- Column 2: Social -->
                <div>
                    <h4 class="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-8">{{ 'footer.connectTitle' | translate }}</h4>
                    <div class="flex items-center gap-6">
                        <a href="mailto:m.ssaid356@gmail.com" class="text-zinc-400 hover:text-red-600 transition-all hover:scale-110">
                            <lucide-icon [img]="MailIcon" class="w-5 h-5"></lucide-icon>
                        </a>
                        <a href="https://github.com/mssaid" target="_blank" class="text-zinc-400 hover:text-red-600 transition-all hover:scale-110">
                            <lucide-icon [img]="GithubIcon" class="w-5 h-5"></lucide-icon>
                        </a>
                        <a href="https://linkedin.com/in/mostafasaid" target="_blank" class="text-zinc-400 hover:text-red-600 transition-all hover:scale-110">
                            <lucide-icon [img]="LinkedinIcon" class="w-5 h-5"></lucide-icon>
                        </a>
                    </div>
                </div>

                <!-- Column 3: Stats/Info -->
                <div>
                    <h4 class="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-8">{{ 'footer.contactTitle' | translate }}</h4>
                    <ul class="space-y-4">
                        <li class="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            <lucide-icon [img]="MapPinIcon" class="w-3 h-3 text-red-600"></lucide-icon>
                            {{ 'footer.location' | translate }}
                        </li>
                        <li class="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            <lucide-icon [img]="MailIcon" class="w-3 h-3 text-red-600"></lucide-icon>
                            m.ssaid356@gmail.com
                        </li>
                        <li class="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            <lucide-icon [img]="PhoneIcon" class="w-3 h-3 text-red-600"></lucide-icon>
                            <span dir="ltr">+20 1067358073</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="pt-10 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6">
                <p class="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                    {{ 'footer.copyright' | translate }}
                </p>
                <div class="flex items-center gap-2">
                    <span class="text-zinc-400 text-[9px] font-black uppercase">{{ 'footer.madeWith' | translate }}</span>
                </div>
            </div>
        </div>
    </footer>
  `
})
export class SharedFooterComponent {
    public translationService = inject(TranslationService);
    
    MailIcon = Mail;
    GithubIcon = Github;
    LinkedinIcon = Linkedin;
    MapPinIcon = MapPin;
    PhoneIcon = Phone;
}
