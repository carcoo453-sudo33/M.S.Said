import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-blog-trending-topics-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 animate-pulse">
        <!-- Title -->
        <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/2 mb-6"></div>
        
        <!-- Tags -->
        <div class="flex flex-wrap gap-2">
            <div *ngFor="let width of tagWidths" 
                 class="h-7 bg-zinc-200 dark:bg-zinc-800 rounded-md"
                 [style.width]="width"></div>
        </div>
    </div>
  `
})
export class BlogTrendingTopicsSkeletonComponent implements OnInit {
    tagWidths: string[] = [];

    ngOnInit() {
        const widths = ['60px', '80px', '70px', '90px', '75px', '85px'];
        this.tagWidths = Array(6).fill(0).map(() => 
            widths[Math.floor(Math.random() * widths.length)]
        );
    }
}
