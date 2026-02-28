import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-contact-map-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="animate-pulse">
        <div class="aspect-[4/3] bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
    </div>
  `
})
export class ContactMapSkeletonComponent { }
