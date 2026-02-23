import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-shared-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-12 animate-pulse">
        <div *ngFor="let _ of [].constructor(count)" 
             class="bg-zinc-100 dark:bg-zinc-900/50 rounded-[3rem] w-full"
             [style.height]="height">
        </div>
    </div>
  `
})
export class SharedSkeletonComponent {
    @Input() count: number = 3;
    @Input() height: string = '200px';
}
