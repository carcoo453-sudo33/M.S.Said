import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, Code, Clock, Layers, CheckCircle } from 'lucide-angular';
import { ProjectEntry } from '../../../models';
import { TranslationService } from '../../../services/translation.service';

@Component({
    selector: 'app-project-details-specs',
    standalone: true,
    imports: [CommonModule, TranslateModule, LucideAngularModule],
    template: `
    <section *ngIf="project" class=" mt-5 grid grid-cols-2 mb-5 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 animate-fade-in-up" style="animation-delay: 0.1s">
        <!-- Language -->
        <div class="bg-zinc-900/40 border border-zinc-800 p-4 lg:p-6 rounded-xl space-y-3 lg:space-y-4 hover:border-red-600 hover:bg-zinc-900 transition-all duration-500">
            <div class="flex items-center gap-2 lg:gap-3 text-red-600">
                <lucide-icon [img]="CodeIcon" class="w-4 h-4 lg:w-5 lg:h-5"></lucide-icon>
                <span class="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">{{ 'projectDetails.specs.language' | translate }}</span>
            </div>
            <div class="text-sm lg:text-lg xl:text-xl font-black italic uppercase text-white truncate">{{ getTranslatedValue(project.language, project.language_Ar, 'multipleLanguages') }}</div>
        </div>
        <!-- Duration -->
        <div class="bg-zinc-900/40 border border-zinc-800 p-4 lg:p-6 rounded-xl space-y-3 lg:space-y-4 hover:border-red-600 hover:bg-zinc-900 transition-all duration-500">
            <div class="flex items-center gap-2 lg:gap-3 text-red-600">
                <lucide-icon [img]="ClockIcon" class="w-4 h-4 lg:w-5 lg:h-5"></lucide-icon>
                <span class="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">{{ 'projectDetails.specs.duration' | translate }}</span>
            </div>
            <div class="text-sm lg:text-lg xl:text-xl font-black italic uppercase text-white truncate">{{ getTranslatedValue(project.duration, project.duration_Ar) }}</div>
        </div>
        <!-- Architecture -->
        <div class="bg-zinc-900/40 border border-zinc-800 p-4 lg:p-6 rounded-xl space-y-3 lg:space-y-4 hover:border-red-600 hover:bg-zinc-900 transition-all duration-500">
            <div class="flex items-center gap-2 lg:gap-3 text-red-600">
                <lucide-icon [img]="LayersIcon" class="w-4 h-4 lg:w-5 lg:h-5"></lucide-icon>
                <span class="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">{{ 'projectDetails.specs.architecture' | translate }}</span>
            </div>
            <div class="text-sm lg:text-lg xl:text-xl font-black italic uppercase text-white truncate">{{ getTranslatedValue(project.architecture, project.architecture_Ar, 'scalableArchitecture') }}</div>
        </div>
        <!-- Status -->
        <div class="bg-zinc-900/40 border border-zinc-800 p-4 lg:p-6 rounded-xl space-y-3 lg:space-y-4 hover:border-red-600 hover:bg-zinc-900 transition-all duration-500">
            <div class="flex items-center gap-2 lg:gap-3 text-red-600">
                <lucide-icon [img]="CheckIcon" class="w-4 h-4 lg:w-5 lg:h-5"></lucide-icon>
                <span class="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">{{ 'projectDetails.specs.status' | translate }}</span>
            </div>
            <div class="text-sm lg:text-lg xl:text-xl font-black italic uppercase text-green-500">{{ getTranslatedValue(project.status, project.status_Ar, 'active') }}</div>
        </div>
    </section>
  `
})
export class ProjectDetailsSpecsComponent {
    @Input() project?: ProjectEntry;
    private translate = inject(TranslateService);
    private translationService = inject(TranslationService);
    
    CodeIcon = Code;
    ClockIcon = Clock;
    LayersIcon = Layers;
    CheckIcon = CheckCircle;

    getTranslatedValue(value: string | undefined, valueAr: string | undefined, fallbackKey?: string): string {
        const currentLang = this.translationService.currentLang$();
        
        // If Arabic is selected and Arabic value exists, use it
        if (currentLang === 'ar' && valueAr && valueAr.trim().length > 0) {
            return valueAr;
        }
        
        // If value exists, use it
        if (value && value.trim().length > 0) {
            return value;
        }
        
        // Use fallback translation if provided
        if (fallbackKey) {
            const key = `projectDetails.specs.${fallbackKey}`;
            return this.translate.instant(key);
        }
        
        return '';
    }
}
