import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../models';

@Component({
    selector: 'app-projects-brand-slider',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="mt-48 overflow-hidden py-20 border-t border-b border-zinc-100 dark:border-zinc-900">
        <div class="flex animate-marquee gap-24 items-center">
            <ng-container *ngFor="let i of [1,2]">
                <div *ngFor="let client of clients"
                    class="w-48 shrink-0 flex items-center justify-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <span
                        class="text-2xl font-black tracking-tighter text-zinc-400 hover:text-red-600 transition-colors uppercase italic">{{
                        client.name }}</span>
                </div>
            </ng-container>
        </div>
    </section>
  `
})
export class ProjectsBrandSliderComponent {
    @Input() clients: Client[] = [];
}
