import { Component, Input, Output, EventEmitter, signal, computed, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-hover-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <!-- Trigger -->
      <div 
        #trigger
        (mouseenter)="showCard()"
        (mouseleave)="hideCard()"
        (focus)="showCard()"
        (blur)="hideCard()">
        <ng-content select="[slot=trigger]"></ng-content>
      </div>

      <!-- Hover Card Content -->
      <div 
        *ngIf="isVisible()"
        #content
        [class]="cardClasses"
        (mouseenter)="cancelHide()"
        (mouseleave)="hideCard()"
        role="tooltip">
        <ng-content select="[slot=content]"></ng-content>
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class HoverCardComponent {
  @Input() className = '';
  @Input() side: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() align: 'start' | 'center' | 'end' = 'center';
  @Input() sideOffset = 4;
  @Input() openDelay = 700;
  @Input() closeDelay = 300;
  @Input() disabled = false;
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  private _isVisible = signal(false);
  private _showTimeout?: number;
  private _hideTimeout?: number;

  isVisible = computed(() => this._isVisible() && !this.disabled);

  get cardClasses(): string {
    const sideClasses = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2 top-0',
      right: 'left-full ml-2 top-0'
    };

    const alignClasses = {
      start: this.side === 'top' || this.side === 'bottom' ? 'left-0' : 'top-0',
      center: this.side === 'top' || this.side === 'bottom' ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2',
      end: this.side === 'top' || this.side === 'bottom' ? 'right-0' : 'bottom-0'
    };

    return `absolute z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 ${sideClasses[this.side]} ${alignClasses[this.align]} ${this.className}`;
  }

  showCard() {
    if (this.disabled) return;
    
    this.cancelHide();
    
    this._showTimeout = window.setTimeout(() => {
      this._isVisible.set(true);
      this.openChange.emit(true);
    }, this.openDelay);
  }

  hideCard() {
    this.cancelShow();
    
    this._hideTimeout = window.setTimeout(() => {
      this._isVisible.set(false);
      this.openChange.emit(false);
    }, this.closeDelay);
  }

  cancelShow() {
    if (this._showTimeout) {
      clearTimeout(this._showTimeout);
      this._showTimeout = undefined;
    }
  }

  cancelHide() {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
      this._hideTimeout = undefined;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isVisible() && 
        !this.trigger?.nativeElement?.contains(event.target) && 
        !this.content?.nativeElement?.contains(event.target)) {
      this._isVisible.set(false);
      this.openChange.emit(false);
    }
  }
}