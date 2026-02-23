import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertCircle } from 'lucide-angular';

@Component({
    selector: 'app-shared-error-state',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <section class="text-center py-24 space-y-10 animate-fade-in-up">
        <div
            class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            <lucide-icon [img]="AlertCircleIcon" class="w-12 h-12"></lucide-icon>
        </div>
        <h2 class="text-4xl font-black uppercase tracking-tighter">{{ title }}</h2>
        <button (click)="onRetry()"
            class="bg-zinc-900 dark:bg-white text-white dark:text-black font-black py-5 px-12 rounded-full uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95 shadow-2xl">
            {{ retryText }}
        </button>
    </section>
  `
})
export class SharedErrorStateComponent {
    @Input() title: string = 'Connection Severed';
    @Input() retryText: string = 'Retry Link';
    @Output() retry = new EventEmitter<void>();
    AlertCircleIcon = AlertCircle;

    onRetry() {
        this.retry.emit();
    }
}
