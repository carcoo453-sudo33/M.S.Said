import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Layers, Rocket, Monitor, Code, CheckCircle } from 'lucide-angular';
import { ProjectEntry, KeyFeature } from '../../../models';
import { TranslationService } from '../../../services/translation.service';

@Component({
    selector: 'app-project-details-features',
    standalone: true,
    imports: [CommonModule, TranslateModule, LucideAngularModule],
    template: `
    <div *ngIf="project" class="space-y-8 lg:space-y-10">
        <!-- Responsibilities -->
        <section class="space-y-6">
            <div class="flex items-center gap-3">
                <div class="w-1 h-6 bg-red-600 rounded-full"></div>
                <h2 class="text-xl font-black italic tracking-tighter uppercase leading-none">{{ 'projectDetails.features.responsibilities' | translate }}</h2>
            </div>

            <div class="space-y-3">
                <div *ngFor="let resp of project.responsibilities"
                    class="flex gap-3 p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                    <lucide-icon [img]="CheckIcon" class="w-4 h-4 text-red-600 shrink-0 mt-0.5"></lucide-icon>
                    <p class="text-zinc-300 text-xs font-medium leading-relaxed">{{ resp }}</p>
                </div>
            </div>
        </section>

        <!-- Key Features -->
        <section class="space-y-6">
            <div class="flex items-center gap-3">
                <div class="w-1 h-6 bg-red-600 rounded-full"></div>
                <h2 class="text-xl font-black italic tracking-tighter uppercase leading-none">{{ 'projectDetails.features.keyFeatures' | translate }}</h2>
            </div>

            <div class="space-y-4">
                <div *ngFor="let feature of project.keyFeatures"
                    class="bg-zinc-950 p-5 rounded-xl border border-zinc-900 hover:border-red-600/30 transition-all space-y-3 group">
                    <div class="w-9 h-9 bg-red-600/10 rounded-lg flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                        <lucide-icon [img]="LayersIcon" class="w-4 h-4" *ngIf="feature.icon === 'Layers'"></lucide-icon>
                        <lucide-icon [img]="RocketIcon" class="w-4 h-4" *ngIf="feature.icon === 'Rocket'"></lucide-icon>
                        <lucide-icon [img]="MonitorIcon" class="w-4 h-4" *ngIf="feature.icon === 'Monitor'"></lucide-icon>
                        <lucide-icon [img]="CodeIcon" class="w-4 h-4" *ngIf="feature.icon === 'Code'"></lucide-icon>
                    </div>
                    <div class="space-y-2">
                        <h3 class="text-sm font-black tracking-tight uppercase text-zinc-300">{{ getFeatureTitle(feature) }}</h3>
                        <p class="text-zinc-500 text-xs leading-relaxed font-medium">{{ getFeatureDescription(feature) }}</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
  `
})
export class ProjectDetailsFeaturesComponent {
    @Input() project?: ProjectEntry;
    private translationService = inject(TranslationService);
    
    LayersIcon = Layers;
    RocketIcon = Rocket;
    MonitorIcon = Monitor;
    CodeIcon = Code;
    CheckIcon = CheckCircle;

    getFeatureTitle(feature: KeyFeature): string {
        const currentLang = this.translationService.currentLang$();
        return currentLang === 'ar' && feature.title_Ar ? feature.title_Ar : feature.title;
    }

    getFeatureDescription(feature: KeyFeature): string {
        const currentLang = this.translationService.currentLang$();
        return currentLang === 'ar' && feature.description_Ar ? feature.description_Ar : feature.description;
    }
}
