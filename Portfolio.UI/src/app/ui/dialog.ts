import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'ui-dialog-content',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div 
      *ngIf="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-0"
      (click)="onOverlayClick()"
    >
      <div 
        [class]="contentClasses"
        (click)="$event.stopPropagation()"
        role="dialog"
        aria-modal="true"
      >
        <button
          *ngIf="showClose"
          type="button"
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          (click)="onClose()"
        >
          <lucide-icon [img]="XIcon" class="h-4 w-4"></lucide-icon>
          <span class="sr-only">Close</span>
        </button>
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class DialogContentComponent {
  @Input() open = false;
  @Input() showClose = true;
  @Input() className = '';
  
  @Output() openChange = new EventEmitter<boolean>();

  XIcon = X;

  get contentClasses(): string {
    return `fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg ${this.className}`.trim();
  }

  onOverlayClick(): void {
    this.onClose();
  }

  onClose(): void {
    this.open = false;
    this.openChange.emit(false);
  }
}

@Component({
  selector: 'ui-dialog-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="headerClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogHeaderComponent {
  @Input() className = '';

  get headerClasses(): string {
    return `flex flex-col space-y-1.5 text-center sm:text-left ${this.className}`.trim();
  }
}

@Component({
  selector: 'ui-dialog-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 [class]="titleClasses">
      <ng-content></ng-content>
    </h2>
  `
})
export class DialogTitleComponent {
  @Input() className = '';

  get titleClasses(): string {
    return `text-lg font-semibold leading-none tracking-tight ${this.className}`.trim();
  }
}

@Component({
  selector: 'ui-dialog-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [class]="descriptionClasses">
      <ng-content></ng-content>
    </p>
  `
})
export class DialogDescriptionComponent {
  @Input() className = '';

  get descriptionClasses(): string {
    return `text-sm text-muted-foreground ${this.className}`.trim();
  }
}

@Component({
  selector: 'ui-dialog-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="footerClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogFooterComponent {
  @Input() className = '';

  get footerClasses(): string {
    return `flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${this.className}`.trim();
  }
}

@Component({
  selector: 'ui-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-content></ng-content>
  `
})
export class DialogComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
}