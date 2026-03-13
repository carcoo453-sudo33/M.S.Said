import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Layers, Rocket, Monitor, Code } from 'lucide-angular';
import { ProjectEntry, KeyFeature, Responsibility } from '../../../models';
import { TranslationService } from '../../../services/translation.service';

@Component({
    selector: 'app-project-details-features',
    standalone: true,
    imports: [CommonModule, TranslateModule, LucideAngularModule],
    template: `
    <div *ngIf="project" class="space-y-8 lg:space-y-10">
        <!-- Key Features -->
        <section *ngIf="getFilteredFeatures().length > 0" class="space-y-6">
            <div class="flex items-center gap-3">
                <div class="w-1 h-6 bg-red-600 rounded-full"></div>
                <h2 class="text-xl font-black italic tracking-tighter uppercase leading-none">{{ 'projectDetails.features.keyFeatures' | translate }}</h2>
            </div>

            <div class="space-y-4">
                <div *ngFor="let feature of getFilteredFeatures().slice(0, 3)"
                    class="bg-zinc-950 p-5 rounded-xl border border-zinc-900 hover:border-red-600/30 transition-all space-y-3 group">
                    <div class="space-y-2">
                        <h3 class="text-sm font-black tracking-tight uppercase text-zinc-300">{{ getFeatureTitle(feature) }}</h3>
                    </div>
                </div>

                <!-- Show More Count -->
                <div *ngIf="getFilteredFeatures().length > 3" 
                    class="flex items-center justify-center p-4 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
                    <span class="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        + {{ getFilteredFeatures().length - 3 }} {{ 'projectDetails.features.moreFeatures' | translate }}
                    </span>
                </div>
            </div>
        </section>

        <!-- Responsibilities -->
        <section *ngIf="getFilteredResponsibilities().length > 0" class="space-y-6">
            <div class="flex items-center gap-3">
                <div class="w-1 h-6 bg-red-600 rounded-full"></div>
                <h2 class="text-xl font-black italic tracking-tighter uppercase leading-none">{{ 'projectDetails.features.responsibilities' | translate }}</h2>
            </div>

            <div class="space-y-3">
                <div *ngFor="let responsibility of getFilteredResponsibilities()"
                    class="flex items-start gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-900 hover:border-red-600/30 transition-all group">
                    <div class="w-2 h-2 bg-red-600 rounded-full mt-1.5 shrink-0 group-hover:scale-150 transition-transform"></div>
                    <p class="text-zinc-400 text-sm leading-relaxed font-medium flex-1">{{ getResponsibilityText(responsibility) }}</p>
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

    getFilteredFeatures(): KeyFeature[] {
        if (!this.project?.keyFeatures) return [];

        // Show all features - don't filter by language
        // The getFeatureTitle and getFeatureDescription methods will handle fallback
        return this.project.keyFeatures.filter(feature => {
            // Only filter out completely empty features (no title in any language)
            return (feature.title && feature.title.trim().length > 0) ||
                (feature.title_Ar && feature.title_Ar.trim().length > 0);
        });
    }

    getFeatureTitle(feature: KeyFeature): string {
        const currentLang = this.translationService.currentLang$();

        // Try to get the title in current language, fallback to other language if not available
        if (currentLang === 'ar') {
            return (feature.title_Ar && feature.title_Ar.trim().length > 0) ? feature.title_Ar : feature.title;
        } else {
            return (feature.title && feature.title.trim().length > 0) ? feature.title : (feature.title_Ar || '');
        }
    }

    getFeatureDescription(feature: KeyFeature): string {
        return '';
    }

    getFilteredResponsibilities(): Responsibility[] {
        if (!this.project?.responsibilities) return [];

        return this.project.responsibilities.filter(res => {
            const title = res.title || '';
            const title_Ar = res.title_Ar || '';
            return title.trim().length > 0 || title_Ar.trim().length > 0;
        });
    }

    getResponsibilityText(responsibility: Responsibility): string {
        const currentLang = this.translationService.currentLang$();
        const text = responsibility.title || '';
        const text_Ar = responsibility.title_Ar || '';

        if (currentLang === 'ar') {
            return (text_Ar.trim().length > 0) ? text_Ar : text;
        } else {
            return (text.trim().length > 0) ? text : text_Ar;
        }
    }
}
