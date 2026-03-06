import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-scroll-area',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="scrollAreaClasses">
      <div 
        #viewport
        [class]="viewportClasses"
        (scroll)="onScroll($event)">
        <div [style.min-width]="'100%'">
          <ng-content></ng-content>
        </div>
      </div>
      
      <!-- Vertical Scrollbar -->
      <div 
        *ngIf="showScrollbar && scrollbarVisible"
        [class]="scrollbarClasses"
        [style.opacity]="scrollbarOpacity">
        <div 
          [class]="thumbClasses"
          [style.height.%]="thumbHeight"
          [style.top.%]="thumbTop">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scroll-viewport {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    
    .scroll-viewport::-webkit-scrollbar {
      display: none;
    }
  `]
})
export class ScrollAreaComponent implements AfterViewInit, OnDestroy {
  @Input() className = '';
  @Input() type: 'auto' | 'always' | 'scroll' | 'hover' = 'hover';
  @Input() scrollHideDelay = 600;
  @Input() showScrollbar = true;

  @ViewChild('viewport') viewport!: ElementRef<HTMLDivElement>;

  scrollbarVisible = false;
  scrollbarOpacity = 0;
  thumbHeight = 100;
  thumbTop = 0;

  private scrollTimeout?: number;
  private resizeObserver?: ResizeObserver;

  get scrollAreaClasses(): string {
    return `relative overflow-hidden ${this.className}`;
  }

  get viewportClasses(): string {
    return 'h-full w-full rounded-[inherit] scroll-viewport overflow-auto';
  }

  get scrollbarClasses(): string {
    return 'flex touch-none select-none transition-colors absolute right-0 top-0 z-10 h-full w-2.5 border-l border-l-transparent p-[1px]';
  }

  get thumbClasses(): string {
    return 'relative flex-1 rounded-full bg-border transition-colors hover:bg-border/80';
  }

  ngAfterViewInit() {
    this.updateScrollbar();
    this.setupResizeObserver();
  }

  ngOnDestroy() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  onScroll(event: Event) {
    this.updateScrollbar();
    this.showScrollbarTemporarily();
  }

  private updateScrollbar() {
    if (!this.viewport?.nativeElement) return;

    const element = this.viewport.nativeElement;
    const { scrollTop, scrollHeight, clientHeight } = element;

    // Calculate if scrollbar should be visible
    this.scrollbarVisible = scrollHeight > clientHeight;

    if (this.scrollbarVisible) {
      // Calculate thumb size and position
      this.thumbHeight = (clientHeight / scrollHeight) * 100;
      this.thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (100 - this.thumbHeight);
    }
  }

  private showScrollbarTemporarily() {
    if (!this.showScrollbar) return;

    this.scrollbarOpacity = 1;

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    if (this.type === 'hover') {
      this.scrollTimeout = window.setTimeout(() => {
        this.scrollbarOpacity = 0;
      }, this.scrollHideDelay);
    }
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined' && this.viewport?.nativeElement) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateScrollbar();
      });
      
      this.resizeObserver.observe(this.viewport.nativeElement);
    }
  }
}