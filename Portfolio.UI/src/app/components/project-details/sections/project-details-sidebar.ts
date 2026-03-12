import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectEntry, ChangelogItem } from '../../../models';
import { TranslationService } from '../../../services/translation.service';
import { ImageUtil } from '../../../utils';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-project-details-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule],
    template: `
    <aside class="md:sticky md:top-0 lg:sticky lg:top-0 h-fit">
        <div *ngIf="project" class="space-y-8 lg:space-y-10 mt-8 lg:mt-10">
        <!-- Changelog -->
        <section *ngIf="getFilteredChangelog().length > 0" class="space-y-6">
            <div class="flex items-center gap-3">
                <div class="w-1 h-6 bg-red-600 rounded-full"></div>
                <h2 class="text-xl font-black italic tracking-tighter uppercase leading-none">{{ 'projectDetails.sidebar.changelog' | translate }}</h2>
            </div>
            <div class="space-y-4 relative">
                <div class="absolute ltr:left-0 rtl:right-0 top-3 bottom-0 w-[1px] bg-zinc-900"></div>
                <div *ngFor="let log of getFilteredChangelog()" class="relative ltr:pl-6 rtl:pr-6 space-y-2">
                    <div class="absolute ltr:left-[-4px] rtl:right-[-4px] top-1.5 w-2 h-2 rounded-full bg-red-600 shadow-lg shadow-red-600/40"></div>
                    <div class="text-[10px] font-bold text-red-600 tracking-widest uppercase">{{ log.date }}</div>
                    <div class="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-all group">
                        <h4 class="text-white font-black uppercase tracking-tight mb-1.5 text-sm group-hover:text-red-600 transition-colors">
                            {{ log.version }} {{ getChangelogTitle(log) }}</h4>
                        <p class="text-zinc-500 text-sm leading-relaxed font-medium">{{ getChangelogDescription(log) }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Related Projects -->
        <section *ngIf="project.relatedProjects && project.relatedProjects.length > 0" class="space-y-6">
            <div class="flex items-center gap-3">
                <div class="w-1 h-6 bg-red-600 rounded-full"></div>
                <h2 class="text-xl font-black italic tracking-tighter uppercase leading-none">{{ 'projectDetails.sidebar.related' | translate }}</h2>
            </div>
            <div class="space-y-4">
                <div *ngFor="let related of project.relatedProjects" [routerLink]="['/projects', related.slug]"
                    class="flex gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-900 hover:border-red-600/30 transition-all group cursor-pointer">
                    <div class="w-20 aspect-video rounded-lg overflow-hidden border border-zinc-800 shrink-0">
                        <img [src]="getFullImageUrl(related.imageUrl)" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all">
                    </div>
                    <div class="space-y-1.5 flex-1 min-w-0">
                        <h4 class="text-white font-black text-sm uppercase tracking-tight group-hover:text-red-600 transition-colors line-clamp-2">{{ related.title }}</h4>
                        <div class="flex flex-wrap gap-1" *ngIf="related.tags">
                            <span *ngFor="let t of related.tags.split(',').slice(0, 3)" class="text-[10px] font-bold text-zinc-600 uppercase">{{ t.trim() }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    </aside>
  `
})
export class ProjectDetailsSidebarComponent {
    @Input() project?: ProjectEntry;
    private translationService = inject(TranslationService);

    getFilteredChangelog(): ChangelogItem[] {
        if (!this.project?.changelog) return [];

        // Filter out items that have no version AND no title in any language
        return this.project.changelog.filter(log => {
            return (log.version && log.version.trim().length > 0) ||
                (log.title && log.title.trim().length > 0) ||
                (log.title_Ar && log.title_Ar.trim().length > 0);
        });
    }

    getChangelogTitle(log: ChangelogItem): string {
        const currentLang = this.translationService.currentLang$();

        if (currentLang === 'ar') {
            return (log.title_Ar && log.title_Ar.trim().length > 0) ? log.title_Ar : (log.title || '');
        } else {
            return (log.title && log.title.trim().length > 0) ? log.title : (log.title_Ar || '');
        }
    }

    getChangelogDescription(log: ChangelogItem): string {
        const currentLang = this.translationService.currentLang$();

        if (currentLang === 'ar') {
            return (log.description_Ar && log.description_Ar.trim().length > 0) ? log.description_Ar : (log.description || '');
        } else {
            return (log.description && log.description.trim().length > 0) ? log.description : (log.description_Ar || '');
        }
    }

    // Use ImageUtil.getFullImageUrl() directly in template via method binding
    getFullImageUrl = ImageUtil.getFullImageUrl;
}
