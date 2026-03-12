import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Linkedin, Github, MessageSquare } from 'lucide-angular';
import { BioEntry } from '../../../models';
import { TranslationService } from '../../../services/translation.service';
import { TranslationUtil, ImageUtil } from '../../../utils';

@Component({
    selector: 'app-blog-profile-card',
    standalone: true,
    imports: [CommonModule, TranslateModule, LucideAngularModule],
    template: `
    <div
        class="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 animate-fade-in-left">
        <div class="h-20 bg-gradient-to-r from-red-600 to-purple-600"></div>
        <div class="px-8 pb-8 -mt-10 text-center">
            <div class="relative inline-block">
                <img [src]="getAvatarUrl()"
                    class="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-900 object-cover shadow-lg mx-auto mb-4">
                <div
                    class="absolute bottom-5 right-2 w-4 h-4 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full animate-pulse">
                </div>
            </div>
            <h2 class="text-xl font-black tracking-tight dark:text-white">{{ getName() }}</h2>
            <p class="text-red-600 text-[10px] font-black uppercase tracking-widest mt-1">{{ getTitle() }}</p>
            <p class="text-zinc-500 dark:text-zinc-400 text-xs mt-4 mb-6 leading-relaxed px-4 italic">
                "{{ getDescriptionPreview() }}"
            </p>

            <div class="flex justify-center gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                <a [href]="bio?.linkedInUrl" target="_blank"
                    class="text-zinc-400 hover:text-red-600 transition-colors">
                    <lucide-icon [img]="LinkedinIcon" class="w-5 h-5"></lucide-icon>
                </a>
                <a [href]="bio?.gitHubUrl" target="_blank"
                    class="text-zinc-400 hover:text-red-600 transition-colors">
                    <lucide-icon [img]="GithubIcon" class="w-5 h-5"></lucide-icon>
                </a>
                <a [href]="'mailto:' + bio?.email"
                    class="text-zinc-400 hover:text-red-600 transition-colors">
                    <lucide-icon [img]="MessageSquareIcon" class="w-5 h-5"></lucide-icon>
                </a>
            </div>
        </div>
    </div>
  `
})
export class BlogProfileCardComponent {
    @Input() bio: BioEntry | null = null;
    private readonly translationService = inject(TranslationService);
    
    LinkedinIcon = Linkedin;
    GithubIcon = Github;
    MessageSquareIcon = MessageSquare;

    getName(): string {
        if (!this.bio) return 'Mostafa Samir Said';
        const currentLang = this.translationService.currentLang$();
        return TranslationUtil.getTranslatedField(this.bio, 'name', currentLang);
    }

    getTitle(): string {
        if (!this.bio) return 'Full Stack Developer';
        const currentLang = this.translationService.currentLang$();
        return TranslationUtil.getTranslatedField(this.bio, 'title', currentLang);
    }

    getDescriptionPreview(): string {
        if (!this.bio) return 'Sharing insights on API integration, responsive design, and web performance.';
        const currentLang = this.translationService.currentLang$();
        const description = TranslationUtil.getTranslatedField(this.bio, 'description', currentLang);
        return description.length > 100 ? description.slice(0, 100) + '...' : description;
    }

    getAvatarUrl(): string {
        return ImageUtil.getFullImageUrl(this.bio?.avatarUrl);
    }
}
