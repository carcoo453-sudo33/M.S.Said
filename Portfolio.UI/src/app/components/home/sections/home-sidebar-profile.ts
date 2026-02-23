import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail, MapPin, Linkedin, Github, MessageCircle, Download } from 'lucide-angular';
import { BioEntry } from '../../../models';

@Component({
    selector: 'app-home-sidebar-profile',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <aside class="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-8 animate-fade-in-left">
        <div
            class="bg-zinc-50/50 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[3rem] p-10 border border-zinc-100 dark:border-zinc-800/50 text-center transition-all hover:shadow-2xl group relative overflow-hidden">
            <div
                class="absolute inset-0 bg-gradient-to-br from-red-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity">
            </div>

            <div class="relative w-52 h-52 mx-auto mb-10">
                <div
                    class="absolute inset-0 bg-gradient-to-tr from-[#FF3B7E] to-[#7000FF] rounded-[4rem] rotate-6 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                </div>
                <img [src]="bio?.avatarUrl" [alt]="bio?.name"
                    class="relative w-full h-full object-cover rounded-[4rem] shadow-2xl border-4 border-white dark:border-zinc-800 group-hover:scale-[1.02] transition-all duration-700 dark:grayscale group-hover:grayscale-0">
                <div
                    class="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-white dark:border-zinc-800 rounded-full animate-pulse">
                </div>
            </div>

            <h2 class="text-3xl font-black mb-2 tracking-tighter uppercase dark:text-white text-zinc-900">{{
                bio?.name }}</h2>
            <p
                class="text-[#FF3B7E] font-black text-[10px] mb-10 uppercase tracking-[0.3em] bg-red-600/5 inline-block px-5 py-2 rounded-full border border-red-600/10">
                {{ bio?.title }}
            </p>

            <div class="space-y-4 mb-10">
                <div
                    class="flex items-center gap-5 text-left p-4 rounded-3xl hover:bg-white dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700 group/item">
                    <div
                        class="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 group-hover/item:text-[#FF3B7E] transition-colors">
                        <lucide-icon [img]="MailIcon" class="w-5 h-5"></lucide-icon>
                    </div>
                    <div class="min-w-0">
                        <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Email</p>
                        <p class="text-sm font-black truncate dark:text-zinc-200 text-zinc-800">{{ bio?.email }}</p>
                    </div>
                </div>
                <div
                    class="flex items-center gap-5 text-left p-4 rounded-3xl hover:bg-white dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700 group/item">
                    <div
                        class="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 group-hover/item:text-[#FF3B7E] transition-colors">
                        <lucide-icon [img]="MapPinIcon" class="w-5 h-5"></lucide-icon>
                    </div>
                    <div>
                        <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Location</p>
                        <p class="text-sm font-black dark:text-zinc-200 text-zinc-800">{{ bio?.location }}</p>
                    </div>
                </div>
            </div>

            <div class="flex justify-center gap-4 mb-10">
                <a *ngIf="bio?.linkedInUrl" [href]="bio?.linkedInUrl" target="_blank"
                    class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-[#FF3B7E] hover:text-white transition-all">
                    <lucide-icon [img]="LinkedinIcon" class="w-5 h-5"></lucide-icon>
                </a>
                <a *ngIf="bio?.gitHubUrl" [href]="bio?.gitHubUrl" target="_blank"
                    class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-[#FF3B7E] hover:text-white transition-all">
                    <lucide-icon [img]="GithubIcon" class="w-5 h-5"></lucide-icon>
                </a>
            </div>

            <div class="space-y-4">
                <a [href]="'https://wa.me/' + bio?.whatsAppUrl" target="_blank"
                    class="flex items-center justify-center gap-3 w-full py-5 bg-[#25D366] text-white font-black rounded-3xl hover:brightness-105 transition-all shadow-xl shadow-green-600/20 uppercase tracking-widest text-[10px]">
                    <lucide-icon [img]="MessageCircleIcon" class="w-5 h-5"></lucide-icon>
                    Direct WhatsApp
                </a>
                <a [href]="bio?.cvUrl" target="_blank"
                    class="flex items-center justify-center gap-3 w-full py-5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-black rounded-3xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all border border-zinc-100 dark:border-zinc-800 uppercase tracking-widest text-[10px]">
                    <lucide-icon [img]="DownloadIcon" class="w-5 h-5"></lucide-icon>
                    Resume PDF
                </a>
            </div>
        </div>
    </aside>
  `
})
export class HomeSidebarProfileComponent {
    @Input() bio?: BioEntry;
    MailIcon = Mail;
    MapPinIcon = MapPin;
    LinkedinIcon = Linkedin;
    GithubIcon = Github;
    MessageCircleIcon = MessageCircle;
    DownloadIcon = Download;
}
