import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Code2, Zap, Monitor, Database, Terminal, FileCode, Mail, Phone, MapPin } from 'lucide-angular';
import { ServiceEntry } from '../../../models';

@Component({
    selector: 'app-home-services',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <section class="animate-fade-in-up">
        <div class="flex items-center gap-6 mb-16">
            <div class="w-2 h-12 bg-red-600 rounded-full"></div>
            <h2 class="text-5xl font-black dark:text-white text-zinc-900 tracking-tighter uppercase">Strategic
                Expertise</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div *ngFor="let service of services"
                class="group bg-zinc-50/50 dark:bg-zinc-900/40 p-12 rounded-[4rem] border border-zinc-100 dark:border-zinc-800/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-700">
                <div
                    class="w-20 h-20 bg-white dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-red-600 transition-all shadow-xl shadow-black/[0.02]">
                    <lucide-icon [img]="getServiceIcon(service.icon)"
                        class="w-10 h-10 text-red-600 group-hover:text-white transition-colors"></lucide-icon>
                </div>
                <h3
                    class="text-3xl font-black mb-6 dark:text-white text-zinc-900 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                    {{ service.title }}</h3>
                <p class="text-zinc-500 text-lg leading-relaxed">{{ service.description }}</p>
            </div>
        </div>
    </section>
  `
})
export class HomeServicesComponent {
    @Input() services: ServiceEntry[] = [];

    getServiceIcon(iconName: string): any {
        const icons: { [key: string]: any } = {
            'code': Code2,
            'code-2': Code2,
            'zap': Zap,
            'monitor': Monitor,
            'database': Database,
            'terminal': Terminal,
            'file-code': FileCode,
            'mail': Mail,
            'phone': Phone,
            'map-pin': MapPin,
            'layout': Monitor,
            'smartphone': Monitor
        };

        const cleanName = iconName?.replace('lucide-', '')?.toLowerCase();
        return icons[cleanName] || Code2;
    }
}
