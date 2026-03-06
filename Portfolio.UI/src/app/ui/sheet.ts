import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'ui-sheet',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <!-- Overlay -->
    <div 
      *ngIf="open"
      [class]="overlayClasses"
      (click)="closeSheet()">
    </div>

    <!-- Sheet Content -->
    <div 
      *ngIf="open"
      [class]="sheetClasses"
      (click)="$event.stopPropagation()">
      
      <!-- Close Button -->
      <button 
        (click)="closeSheet()"
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
        <lucide-icon [img]="XIcon" class="h-4 w-4"></lucide-icon>
        <span class="sr-only">Close</span>
      </button>

      <ng-content></ng-content>
    </div>
  `
})
export class SheetComponent {
  @Input() open = false;
  @Input() side: 'top' | 'bottom' | 'left' | 'right' = 'right';
  @Input() className = '';
  @Output() openChange = new EventEmitter<boolean>();

  XIcon = X;

  get overlayClasses(): string {
    return 'fixed inset-0 z-50 bg-black/80 animate-in fade-in-0';
  }

  get sheetClasses(): string {
    const baseClasses = 'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out animate-in duration-500';
    
    const sideClasses = {
      top: 'inset-x-0 top-0 border-b slide-in-from-top',
      bottom: 'inset-x-0 bottom-0 border-t slide-in-from-bottom',
      left: 'inset-y-0 left-0 h-full w-3/4 border-r slide-in-from-left sm:max-w-sm',
      right: 'inset-y-0 right-0 h-full w-3/4 border-l slide-in-from-right sm:max-w-sm'
    };

    return `${baseClasses} ${sideClasses[this.side]} ${this.className}`;
  }

  closeSheet() {
    this.openChange.emit(false);
  }
}

@Component({
  selector: 'ui-sheet-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="headerClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class SheetHeaderComponent {
  @Input() className = '';

  get headerClasses(): string {
    return `flex flex-col space-y-2 text-center sm:text-left ${this.className}`;
  }
}

@Component({
  selector: 'ui-sheet-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="footerClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class SheetFooterComponent {
  @Input() className = '';

  get footerClasses(): string {
    return `flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${this.className}`;
  }
}

@Component({
  selector: 'ui-sheet-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 [class]="titleClasses">
      <ng-content></ng-content>
    </h2>
  `
})
export class SheetTitleComponent {
  @Input() className = '';

  get titleClasses(): string {
    return `text-lg font-semibold text-foreground ${this.className}`;
  }
}

@Component({
  selector: 'ui-sheet-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [class]="descriptionClasses">
      <ng-content></ng-content>
    </p>
  `
})
export class SheetDescriptionComponent {
  @Input() className = '';

  get descriptionClasses(): string {
    return `text-sm text-muted-foreground ${this.className}`;
  }
}