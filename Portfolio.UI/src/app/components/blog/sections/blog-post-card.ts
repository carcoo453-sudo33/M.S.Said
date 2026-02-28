import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
    LucideAngularModule, Share2, ThumbsUp, MessageCircle, Star,
    ArrowRight, CornerDownRight, Linkedin, Github, Layers, ExternalLink, BookOpen, Edit
} from 'lucide-angular';
import { BlogPost } from '../../../models';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-blog-post-card',
    standalone: true,
    imports: [CommonModule, TranslateModule, LucideAngularModule],
    host: {
        'class': 'flex h-full'
    },
    template: `
    <article
        class="w-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-fade-in-up group h-full flex flex-col"
        [style.animation-delay]="delay">

        <!-- Card Header -->
        <div class="p-8 flex items-start justify-between">
            <div class="flex items-center gap-4">
                <div
                    class="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-red-600 shadow-sm">
                    <lucide-icon [img]="getSocialIcon(post.socialType)" class="w-6 h-6"></lucide-icon>
                </div>
                <div>
                    <h3 class="font-black text-lg group-hover:text-red-600 transition-colors">{{ post.title }}</h3>
                    <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                        Posted on {{ post.socialType }} • {{ post.publishedAt | date:'mediumDate' }}
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button *ngIf="canEdit" (click)="onEdit.emit(post); $event.stopPropagation()"
                    class="text-zinc-400 hover:text-red-600 p-2 transition-colors">
                    <lucide-icon [img]="EditIcon" class="w-5 h-5"></lucide-icon>
                </button>
                <button class="text-zinc-400 hover:text-zinc-600 p-2">
                    <lucide-icon [img]="Share2Icon" class="w-5 h-5"></lucide-icon>
                </button>
                <span *ngIf="post.socialType === 'GitHub'"
                    class="absolute -top-1 -right-1 flex h-3 w-3">
                    <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            </div>
        </div>

        <!-- Card Content -->
        <div class="px-8 pb-8 space-y-6 flex-1">
            <p class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                {{ post.summary }}
            </p>

            <!-- GitHub Release Special View -->
            <div *ngIf="post.socialType === 'GitHub' && post.version"
                class="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6 border-l-4 border-red-600 space-y-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <lucide-icon [img]="CornerDownRightIcon"
                            class="w-4 h-4 text-red-600"></lucide-icon>
                        <span
                            class="text-xs font-black uppercase tracking-widest dark:text-zinc-300">Release
                            Version: {{ post.version }}</span>
                    </div>
                    <span
                        class="bg-green-100 dark:bg-green-600/20 text-green-600 dark:text-green-400 text-[8px] font-black px-2 py-1 rounded uppercase tracking-tighter">Latest</span>
                </div>
                <code
                    class="block text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-white/50 dark:bg-black/20 p-4 rounded-xl">
                    {{ post.content | slice:0:100 }}...
                </code>
            </div>

            <!-- Post Image (Large view for LinkedIn/Dev.to) -->
            <div *ngIf="post.imageUrl && post.socialType !== 'GitHub'"
                class="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl group/img">
                <img [src]="post.imageUrl"
                    class="w-full h-auto object-cover group-hover/img:scale-105 transition-transform duration-[2000ms]">
            </div>

            <!-- Tags (Social Style) -->
            <div *ngIf="post.tags" class="flex flex-wrap gap-2">
                <span *ngFor="let tag of post.tags.split(',')"
                    class="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-600/5 px-3 py-1 rounded-md">
                    #{{ tag.trim() }}
                </span>
            </div>
        </div>

        <!-- Card Footer (Interactions) -->
        <div
            class="px-8 py-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div class="flex items-center gap-6">
                <div *ngIf="post.likesCount !== undefined"
                    class="flex items-center gap-2 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer group/stat">
                    <lucide-icon [img]="ThumbsUpIcon"
                        class="w-4 h-4 group-hover/stat:scale-125 transition-transform"></lucide-icon>
                    <span class="text-[10px] font-black">{{ post.likesCount }} {{ 'blog.card.likes' | translate }}</span>
                </div>
                <div *ngIf="post.commentsCount !== undefined"
                    class="flex items-center gap-2 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer group/stat">
                    <lucide-icon [img]="MessageCircleIcon"
                        class="w-4 h-4 group-hover/stat:scale-125 transition-transform"></lucide-icon>
                    <span class="text-[10px] font-black">{{ post.commentsCount }} {{ 'blog.card.comments' | translate }}</span>
                </div>
                <div *ngIf="post.starsCount !== undefined"
                    class="flex items-center gap-2 text-zinc-400 hover:text-yellow-500 transition-colors cursor-pointer group/stat">
                    <lucide-icon [img]="StarIcon"
                        class="w-4 h-4 group-hover/stat:scale-125 transition-transform"></lucide-icon>
                    <span class="text-[10px] font-black">{{ post.starsCount }} {{ 'blog.card.stars' | translate }}</span>
                </div>
            </div>
            <button (click)="onNavigate.emit(post)"
                class="text-red-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                {{ getReadButtonText() }}
                <lucide-icon [img]="ArrowRightIcon" class="w-4 h-4"></lucide-icon>
            </button>
        </div>
    </article>
  `
})
export class BlogPostCardComponent {
    private authService = inject(AuthService);
    
    @Input() post!: BlogPost;
    @Input() delay: string = '0s';
    @Output() onNavigate = new EventEmitter<BlogPost>();
    @Output() onEdit = new EventEmitter<BlogPost>();

    Share2Icon = Share2;
    ThumbsUpIcon = ThumbsUp;
    MessageCircleIcon = MessageCircle;
    StarIcon = Star;
    ArrowRightIcon = ArrowRight;
    CornerDownRightIcon = CornerDownRight;
    EditIcon = Edit;

    get canEdit(): boolean {
        return this.authService.isLoggedIn();
    }

    getReadButtonText(): string {
        if (this.post.socialType === 'GitHub') {
            return 'View Repo';
        } else if (this.post.socialUrl) {
            return `Read on ${this.post.socialType}`;
        } else {
            return 'Read Article';
        }
    }

    getSocialIcon(type?: string) {
        if (!type) return BookOpen;
        switch (type.toLowerCase()) {
            case 'linkedin': return Linkedin;
            case 'github': return Github;
            case 'dev.to': return Layers;
            default: return ExternalLink;
        }
    }
}
