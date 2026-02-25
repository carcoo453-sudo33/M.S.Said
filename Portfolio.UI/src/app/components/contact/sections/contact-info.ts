import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-angular';

@Component({
    selector: 'app-contact-info',
    standalone: true,
    imports: [CommonModule, TranslateModule, LucideAngularModule],
    template: `
    <div class="animate-fade-in-up">
        <!-- Contact Info - Horizontal Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <!-- Email -->
            <div class="flex flex-col items-center text-center group">
                <div
                    class="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-700 shadow-sm border border-zinc-100 dark:border-zinc-800 mb-6">
                    <lucide-icon [img]="MailIcon" class="w-8 h-8"></lucide-icon>
                </div>
                <p class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-3">{{ 'contact.info.secureLink' | translate }}</p>
                <a href="mailto:m.ssaid356@gmail.com"
                    class="text-lg lg:text-xl font-black dark:text-zinc-200 text-zinc-900 hover:text-red-600 transition-colors uppercase tracking-tighter break-all">m.ssaid356&#64;gmail.com</a>
            </div>

            <!-- Phone -->
            <div class="flex flex-col items-center text-center group">
                <div
                    class="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-700 shadow-sm border border-zinc-100 dark:border-zinc-800 mb-6">
                    <lucide-icon [img]="PhoneIcon" class="w-8 h-8"></lucide-icon>
                </div>
                <p class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-3">{{ 'contact.info.directChannel' | translate }}</p>
                <a href="https://wa.me/201067358073" target="_blank" dir="ltr"
                    class="text-lg lg:text-xl font-black dark:text-zinc-200 text-zinc-900 hover:text-red-600 transition-colors uppercase tracking-tighter">+20 106 735 8073</a>
            </div>

            <!-- Location -->
            <div class="flex flex-col items-center text-center group">
                <div
                    class="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-700 shadow-sm border border-zinc-100 dark:border-zinc-800 mb-6">
                    <lucide-icon [img]="MapPinIcon" class="w-8 h-8"></lucide-icon>
                </div>
                <p class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-3">{{ 'contact.info.baseOfOperations' | translate }}</p>
                <p class="text-lg lg:text-xl font-black dark:text-zinc-200 text-zinc-900 uppercase tracking-tighter">Gharbia, Egypt</p>
            </div>
        </div>
    </div>
  `
})
export class ContactInfoComponent {
    MailIcon = Mail;
    PhoneIcon = Phone;
    MapPinIcon = MapPin;
    GithubIcon = Github;
    LinkedInIcon = Linkedin;
}
