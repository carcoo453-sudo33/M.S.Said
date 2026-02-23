import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Layers, Rocket, Monitor, Code, CheckCircle } from 'lucide-angular';
import { ProjectEntry } from '../../../models';

@Component({
    selector: 'app-project-details-features',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div *ngIf="project" class="space-y-16 lg:space-y-20">
        <!-- Key Features -->
        <section class="space-y-8">
            <div class="flex items-center gap-4">
                <div class="w-1.5 h-8 bg-red-600 rounded-full"></div>
                <h2 class="text-2xl lg:text-3xl font-black italic tracking-tighter uppercase leading-none">Key Features</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div *ngFor="let feature of project.keyFeatures"
                    class="bg-zinc-950 p-6 lg:p-8 rounded-2xl lg:rounded-[2rem] border border-zinc-900 hover:border-red-600/30 transition-all space-y-4 lg:space-y-5 group">
                    <div class="w-10 h-10 lg:w-12 lg:h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                        <lucide-icon [img]="LayersIcon" class="w-5 h-5 lg:w-6 lg:h-6" *ngIf="feature.icon === 'Layers'"></lucide-icon>
                        <lucide-icon [img]="RocketIcon" class="w-5 h-5 lg:w-6 lg:h-6" *ngIf="feature.icon === 'Rocket'"></lucide-icon>
                        <lucide-icon [img]="MonitorIcon" class="w-5 h-5 lg:w-6 lg:h-6" *ngIf="feature.icon === 'Monitor'"></lucide-icon>
                        <lucide-icon [img]="CodeIcon" class="w-5 h-5 lg:w-6 lg:h-6" *ngIf="feature.icon === 'Code'"></lucide-icon>
                    </div>
                    <div class="space-y-2 lg:space-y-3">
                        <h3 class="text-base lg:text-lg font-black tracking-tight uppercase text-zinc-300">{{ feature.title }}</h3>
                        <p class="text-zinc-500 text-sm leading-relaxed font-medium">{{ feature.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Responsibilities -->
        <section class="space-y-8">
            <div class="flex items-center gap-4">
                <div class="w-1.5 h-8 bg-red-600 rounded-full"></div>
                <h2 class="text-2xl lg:text-3xl font-black italic tracking-tighter uppercase leading-none">Responsibilities</h2>
            </div>

            <div class="space-y-4 lg:space-y-6">
                <div *ngFor="let resp of project.responsibilities"
                    class="flex gap-4 lg:gap-5 p-5 lg:p-6 bg-zinc-900/40 rounded-xl border border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                    <lucide-icon [img]="CheckIcon" class="w-5 h-5 lg:w-6 lg:h-6 text-red-600 shrink-0 mt-0.5"></lucide-icon>
                    <p class="text-zinc-300 text-sm font-medium leading-relaxed">{{ resp }}</p>
                </div>
            </div>
        </section>
    </div>
  `
})
export class ProjectDetailsFeaturesComponent {
    @Input() project?: ProjectEntry;
    LayersIcon = Layers;
    RocketIcon = Rocket;
    MonitorIcon = Monitor;
    CodeIcon = Code;
    CheckIcon = CheckCircle;
}
