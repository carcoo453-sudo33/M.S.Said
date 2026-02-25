import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle } from 'lucide-angular';
import { BioEntry } from '../../../models';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-shared-signature',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <section *ngIf="bio" class="max-w-7xl mx-auto px-6 py-10 border-t border-zinc-100 dark:border-zinc-900 mt-2">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div class="lg:col-span-4 relative group">
                <div class="absolute inset-0 bg-red-600/20 rounded-[3rem] rotate-6 group-hover:rotate-12 transition-transform duration-700"></div>
                <img [src]="getAvatarUrl()" [alt]="bio.name"
                    class="relative w-full aspect-square object-cover rounded-[3rem] border-4 border-white dark:border-zinc-800 shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700">
                <div class="absolute -bottom-6 -right-6 w-24 h-24 bg-zinc-950 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-xl group-hover:scale-110 transition-transform">
                    <span class="text-white font-black text-xl italic uppercase tracking-tighter">M.D</span>
                </div>
            </div>
            <div class="lg:col-span-8 space-y-8">
                <div>
                    <p class="text-red-600 font-bold text-[10px] uppercase tracking-[0.6em] mb-4 text-center lg:text-left">Strategic Lead</p>
                    <h2 class="text-3xl md:text-5xl font-black dark:text-white text-zinc-900 tracking-tighter uppercase leading-tight text-center lg:text-left">
                        {{ bio.name }}<br>
                        <span class="text-zinc-400">Arch. Design</span>
                    </h2>
                </div>
                <p *ngIf="quote" class="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed italic border-l-2 border-zinc-100 dark:border-zinc-800 pl-8">
                    "{{ quote }}"
                </p>
                <div class="flex flex-wrap justify-center lg:justify-start gap-8">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                            <lucide-icon [img]="CheckIcon" class="w-5 h-5"></lucide-icon>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Verified Origin</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
  `
})
export class SharedSignatureComponent {
    @Input() bio: BioEntry | null = null;
    @Input() quote: string = '';
    CheckIcon = CheckCircle;

    getAvatarUrl() {
        const avatar = this.bio?.avatarUrl;
        if (!avatar) return 'https://ui-avatars.com/api/?name=' + (this.bio?.name || 'User') + '&background=f20d0d&color=fff';
        if (avatar.startsWith('http')) return avatar;
        const baseUrl = environment.apiUrl.replace('/api', '');
        return `${baseUrl}${avatar}`;
    }
}
