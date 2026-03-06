import { Component, Input, Output, EventEmitter, signal, computed, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-popover',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block">
      <!-- Trigger -->
      <div #trigger (click)="togglePopover()" class="cursor-pointer">
        <ng-content select="[slot=trigger]"></ng-content>
      </div>

      <!-- Popover Content -->
      <div 
        *ngIf="isOpen()"
        #content
        [class]="popoverClasses"
        (click)="$event.stopPropagation()">
        <ng-content select="[slot=content]"></ng-content>
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class PopoverComponent {
  @Input() className = '';
  @Input() align: 'start' | 'center' | 'end' = 'center';
  @Input() side: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() sideOffset = 4;
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  private _isOpen = signal(false);
  isOpen = computed(() => this._isOpen());

  get popoverClasses(): string {
    const alignClasses = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0'
    };

    const sideClasses = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2 top-0',
      right: 'left-full ml-2 top-0'
    };

    return `absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 ${alignClasses[this.align]} ${sideClasses[this.side]} ${this.className}`;
  }

  togglePopover() {
    const newState = !this._isOpen();
    this._isOpen.set(newState);
    this.openChange.emit(newState);
  }

  closePopover() {
    this._isOpen.set(false);
    this.openChange.emit(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isOpen() && 
        !this.trigger?.nativeElement?.contains(event.target) && 
        !this.content?.nativeElement?.contains(event.target)) {
      this.closePopover();
    }
  }
}