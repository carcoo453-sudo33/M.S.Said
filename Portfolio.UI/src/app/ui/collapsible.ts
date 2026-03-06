import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-collapsible',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="collapsibleClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class CollapsibleComponent {
  @Input() open = false;
  @Input() disabled = false;
  @Input() className = '';
  @Output() openChange = new EventEmitter<boolean>();

  private _isOpen = signal(false);
  isOpen = computed(() => this.open || this._isOpen());

  get collapsibleClasses(): string {
    return `${this.className}`;
  }

  toggle() {
    if (!this.disabled) {
      const newOpen = !this.isOpen();
      this._isOpen.set(newOpen);
      this.openChange.emit(newOpen);
    }
  }

  setOpen(open: boolean) {
    if (!this.disabled) {
      this._isOpen.set(open);
      this.openChange.emit(open);
    }
  }
}

@Component({
  selector: 'ui-collapsible-trigger',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [class]="triggerClasses"
      [disabled]="disabled"
      (click)="onTrigger()"
      [attr.aria-expanded]="isOpen">
      <ng-content></ng-content>
    </button>
  `
})
export class CollapsibleTriggerComponent {
  @Input() disabled = false;
  @Input() isOpen = false;
  @Input() className = '';
  @Output() trigger = new EventEmitter<void>();

  get triggerClasses(): string {
    return `${this.className}`;
  }

  onTrigger() {
    if (!this.disabled) {
      this.trigger.emit();
    }
  }
}

@Component({
  selector: 'ui-collapsible-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="isOpen"
      [class]="contentClasses"
      [style.overflow]="'hidden'"
      [style.transition]="'all 0.2s ease-in-out'">
      <ng-content></ng-content>
    </div>
  `
})
export class CollapsibleContentComponent {
  @Input() isOpen = false;
  @Input() className = '';

  get contentClasses(): string {
    return `animate-in slide-in-from-top-1 ${this.className}`;
  }
}