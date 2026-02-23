import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Heart, Share2 } from 'lucide-angular';
import { ProjectEntry } from '../../../models';

@Component({
    selector: 'app-project-details-interactions',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div *ngIf="project" class="space-y-32">
        <!-- Interactions -->
        <div class="flex items-center gap-6 pt-12">
            <button (click)="onReact.emit()"
                class="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 px-8 py-4 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-all group">
                <lucide-icon [img]="HeartIcon" class="w-5 h-5 transition-transform group-hover:scale-125 text-red-600"></lucide-icon>
                <span class="font-black text-xs uppercase">{{ project.reactionsCount }}</span>
            </button>
            <button (click)="onShare.emit()"
                class="bg-zinc-900 hover:bg-zinc-800 p-4 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-all">
                <lucide-icon [img]="ShareIcon" class="w-5 h-5"></lucide-icon>
            </button>
        </div>

        <!-- Discussion -->
        <section class="space-y-16">
            <h2 class="text-2xl font-black italic uppercase tracking-tighter">Discussion</h2>

            <div class="flex gap-6">
                <img src="https://i.pravatar.cc/150?u=me" class="w-14 h-14 rounded-xl object-cover shrink-0 grayscale">
                <div class="flex-1 space-y-4">
                    <textarea placeholder="Join the conversation..."
                        class="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-6 text-white text-sm focus:border-red-600 outline-none transition-colors min-h-[120px]"></textarea>
                    <div class="flex justify-end">
                        <button class="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg">Post Comment</button>
                    </div>
                </div>
            </div>

            <div class="space-y-12">
                <div *ngFor="let comment of project.comments" class="flex gap-6 animate-fade-in-up">
                    <img [src]="comment.avatarUrl" class="w-14 h-14 rounded-xl object-cover shrink-0 grayscale hover:grayscale-0 transition-all">
                    <div class="flex-1 space-y-3">
                        <div class="flex items-center gap-4">
                            <h4 class="font-black text-zinc-100 text-sm italic uppercase">{{ comment.author }}</h4>
                            <span class="text-[10px] text-zinc-600 font-bold">{{ comment.date }}</span>
                        </div>
                        <p class="text-zinc-400 text-sm leading-relaxed font-medium">{{ comment.content }}</p>
                        <div class="flex items-center gap-4 pt-2">
                            <button class="text-[10px] font-black uppercase text-zinc-600 hover:text-white transition-colors">Reply</button>
                            <button class="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-600 hover:text-red-600 transition-colors">
                                <lucide-icon [img]="HeartIcon" class="w-3 h-3"></lucide-icon> {{ comment.likes }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  `
})
export class ProjectDetailsInteractionsComponent {
    @Input() project?: ProjectEntry;
    @Output() onReact = new EventEmitter<void>();
    @Output() onShare = new EventEmitter<void>();
    HeartIcon = Heart;
    ShareIcon = Share2;
}
