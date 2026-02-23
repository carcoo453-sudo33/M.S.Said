import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Code2, Database, FileCode, Zap, Monitor, Terminal, Github } from 'lucide-angular';
import { SkillEntry } from '../../../models';

@Component({
    selector: 'app-home-tech-stack',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <section class="animate-fade-in-up pt-12 border-t border-zinc-100 dark:border-zinc-900">
        <p class="text-center text-[10px] font-black uppercase tracking-[0.6em] text-zinc-400 mb-16">Mastering
            the Modern Stack</p>
        <div class="flex flex-wrap justify-center gap-10">
            <div *ngFor="let skill of skills"
                class="w-28 h-28 bg-white dark:bg-zinc-900/40 rounded-[2.5rem] shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center group hover:border-red-600/30 hover:scale-110 transition-all cursor-pointer">
                <lucide-icon [img]="getSkillIcon(skill.icon)"
                    class="w-10 h-10 text-zinc-300 dark:text-zinc-700 group-hover:text-red-500 transition-colors mb-2"></lucide-icon>
                <span
                    class="text-[8px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{{
                    skill.name }}</span>
            </div>
        </div>
    </section>
  `
})
export class HomeTechStackComponent {
    @Input() skills: SkillEntry[] = [];

    getSkillIcon(iconName?: string): any {
        const icons: { [key: string]: any } = {
            'lucide-angular': Code2,
            'lucide-dot-net': Database,
            'lucide-javascript': FileCode,
            'lucide-database': Database,
            'lucide-html5': Code2,
            'lucide-css3': Zap,
            'lucide-layout': Monitor,
            'lucide-terminal': Terminal,
            'lucide-github': Github
        };
        return icons[iconName || ''] || Code2;
    }
}
