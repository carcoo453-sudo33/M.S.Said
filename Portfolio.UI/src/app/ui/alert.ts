import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertVariant = 'default' | 'destructive';

@Component({
  selector: 'ui-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="alertClasses" role="alert">
      <ng-content></ng-content>
    </div>
  `
})
export class AlertComponent {
  @Input() variant: AlertVariant = 'default';
  @Input() className = '';

  get alertClasses(): string {
    const baseClasses = 'relative w-full rounded-lg border p-4';
    
    const variantClasses = {
      default: 'bg-background text-foreground',
      destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive'
    };

    return `${baseClasses} ${variantClasses[this.variant]} ${this.className}`.trim();
  }
}

@Component({
  selector: 'ui-alert-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h5 [class]="titleClasses">
      <ng-content></ng-content>
    </h5>
  `
})
export class AlertTitleComponent {
  @Input() className = '';

  get titleClasses(): string {
    return `mb-1 font-medium leading-none tracking-tight ${this.className}`.trim();
  }
}

@Component({
  selector: 'ui-alert-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="descriptionClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class AlertDescriptionComponent {
  @Input() className = '';

  get descriptionClasses(): string {
    return `text-sm [&_p]:leading-relaxed ${this.className}`.trim();
  }
}