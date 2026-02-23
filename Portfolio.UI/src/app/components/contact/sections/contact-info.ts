import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-angular';

@Component({
    selector: 'app-contact-info',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="animate-fade-in-left">
      

        <div class="space-y-10">
            <!-- Email -->
            <div class="flex items-center gap-8 group">
                <div
                    class="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-700 shadow-sm border border-zinc-100 dark:border-zinc-800 flex-shrink-0">
                    <lucide-icon [img]="MailIcon" class="w-8 h-8"></lucide-icon>
                </div>
                <div>
                    <p class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-2">Secure Link
                    </p>
                    <a href="mailto:m.ssaid356@gmail.com"
                        class="text-2xl font-black dark:text-zinc-200 text-zinc-900 hover:text-red-600 transition-colors uppercase tracking-tighter">m.ssaid356&#64;gmail.com</a>
                </div>
            </div>

            <!-- Phone -->
            <div class="flex items-center gap-8 group">
                <div
                    class="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-700 shadow-sm border border-zinc-100 dark:border-zinc-800 flex-shrink-0">
                    <lucide-icon [img]="PhoneIcon" class="w-8 h-8"></lucide-icon>
                </div>
                <div>
                    <p class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-2">Direct
                        Channel</p>
                    <a href="tel:+201067358073"
                        class="text-2xl font-black dark:text-zinc-200 text-zinc-900 hover:text-red-600 transition-colors uppercase tracking-tighter">+20
                        106 735 8073</a>
                </div>
            </div>

            <!-- Location -->
            <div class="flex items-center gap-8 group">
                <div
                    class="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-700 shadow-sm border border-zinc-100 dark:border-zinc-800 flex-shrink-0">
                    <lucide-icon [img]="MapPinIcon" class="w-8 h-8"></lucide-icon>
                </div>
                <div>
                    <p class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-2">Base Of
                        Operations</p>
                    <p class="text-2xl font-black dark:text-zinc-200 text-zinc-900 uppercase tracking-tighter">
                        Gharbia, Egypt</p>
                </div>
            </div>
        </div>

        <!-- Social Links -->
        <div class="mt-20 flex gap-6 mb-20">
            <a href="https://github.com" target="_blank"
                class="w-14 h-14 bg-zinc-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all duration-500 border border-zinc-100 dark:border-zinc-800 hover:rotate-12">
                <lucide-icon [img]="GithubIcon" class="w-6 h-6"></lucide-icon>
            </a>
            <a href="https://linkedin.com" target="_blank"
                class="w-14 h-14 bg-zinc-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all duration-500 border border-zinc-100 dark:border-zinc-800 hover:-rotate-12">
                <lucide-icon [img]="LinkedInIcon" class="w-6 h-6"></lucide-icon>
            </a>
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
