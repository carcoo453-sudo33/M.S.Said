import { Component, Input, Output, EventEmitter, signal, computed, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <!-- Trigger -->
      <div 
        #trigger
        (mouseenter)="showTooltip()"
        (mouseleave)="hideTooltip()"
        (focus)="showTooltip()"
        (blur)="hideTooltip()">
        <ng-content></ng-content>
      </div>

      <!-- Tooltip Content -->
      <div 
        *ngIf="isVisible()"
        #tooltip
        [class]="tooltipClasses"
        role="tooltip">
        {{ content }}
        <ng-content select="[slot=content]"></ng-content>
        
        <!-- Arrow -->
        <div [class]="arrowClasses"></div>
      </div>
    </div>
  `
})
export class TooltipComponent {
  @Input() content = '';
  @Input() side: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() align: 'start' | 'center' | 'end' = 'center';
  @Input() delayDuration = 700;
  @Input() className = '';
  @Input() disabled = false;
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('tooltip') tooltip!: ElementRef;

  private _isVisible = signal(false);
  private _timeoutId: any = null;

  isVisible = computed(() => this._isVisible() && !this.disabled);

  get tooltipClasses(): string {
    const sideClasses = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2 top-1/2 -translate-y-1/2',
      right: 'left-full ml-2 top-1/2 -translate-y-1/2'
    };

    const alignClasses = {
      start: this.side === 'top' || this.side === 'bottom' ? 'left-0' : 'top-0',
      center: this.side === 'top' || this.side === 'bottom' ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2',
      end: this.side === 'top' || this.side === 'bottom' ? 'right-0' : 'bottom-0'
    };

    return `absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 ${sideClasses[this.side]} ${alignClasses[this.align]} ${this.className}`;
  }

  get arrowClasses(): string {
    const arrowClasses = {
      top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-popover',
      bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-popover',
      left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-popover',
      right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-popover'
    };

    return `absolute w-0 h-0 border-4 ${arrowClasses[this.side]}`;
  }

  showTooltip() {
    if (this.disabled) return;
    
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }
    
    this._timeoutId = setTimeout(() => {
      this._isVisible.set(true);
      this.openChange.emit(true);
    }, this.delayDuration);
  }

  hideTooltip() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
    
    this._isVisible.set(false);
    this.openChange.emit(false);
  }
}