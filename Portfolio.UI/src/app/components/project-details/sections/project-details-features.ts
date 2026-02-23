import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Layers, Rocket, Monitor, Code, CheckCircle } from 'lucide-angular';
import { ProjectEntry } from '../../../models';

@Component({
    selector: 'app-project-details-features',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div *ngIf="project" class="space-y-32">
        <!-- Key Features -->
        <section class="space-y-16">
            <div class="flex items-center gap-6">
                <div class="w-2 h-10 bg-red-600 rounded-full"></div>
                <h2 class="text-3xl font-black italic tracking-tighter uppercase leading-none">Key Features</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div *ngFor="let feature of project.keyFeatures"
                    class="bg-zinc-950 p-10 rounded-[2.5rem] border border-zinc-900 hover:border-red-600/30 transition-all space-y-6 group">
                    <div class="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                        <lucide-icon [img]="LayersIcon" class="w-6 h-6" *ngIf="feature.icon === 'Layers'"></lucide-icon>
                        <lucide-icon [img]="RocketIcon" class="w-6 h-6" *ngIf="feature.icon === 'Rocket'"></lucide-icon>
                        <lucide-icon [img]="MonitorIcon" class="w-6 h-6" *ngIf="feature.icon === 'Monitor'"></lucide-icon>
                        <lucide-icon [img]="CodeIcon" class="w-6 h-6" *ngIf="feature.icon === 'Code'"></lucide-icon>
                    </div>
                    <div class="space-y-3">
                        <h3 class="text-lg font-black tracking-tight uppercase text-zinc-300">{{ feature.title }}</h3>
                        <p class="text-zinc-500 text-sm leading-relaxed font-medium">{{ feature.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Responsibilities -->
        <section class="space-y-16">
            <div class="flex items-center gap-6">
                <div class="w-2 h-10 bg-red-600 rounded-full"></div>
                <h2 class="text-3xl font-black italic tracking-tighter uppercase leading-none">Responsibilities</h2>
            </div>

            <div class="space-y-8">
                <div *ngFor="let resp of project.responsibilities"
                    class="flex gap-6 p-8 bg-zinc-900/40 rounded-xl border border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                    <lucide-icon [img]="CheckIcon" class="w-6 h-6 text-red-600 shrink-0"></lucide-icon>
                    <p class="text-zinc-300 font-medium leading-relaxed">{{ resp }}</p>
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
