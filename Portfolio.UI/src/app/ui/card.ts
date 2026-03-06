import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  @Input() className = '';

  get cardClasses(): string {
    return `rounded-lg border bg-card text-card-foreground shadow-sm ${this.className}`.trim();
  }
}

@Component({
  selector: 'ui-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="headerClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class CardHeaderComponent {
  @Input() className = '';

  get headerClasses(): string {
    return `flex flex-col space-y-1.5 p-6 ${this.className}`.trim();
  }
}

@Component({
  selector: 'ui-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 [class]="titleClasses">
      <ng-content></ng-content>
    </h3>
  `
})
export class CardTitleComponent {
  @Input() className = '';

  get titleClasses(): string {
    return `text-2xl font-semibold leading-none tracking-tight ${this.className}`.trim();
  }
}

@Component({
  selector: 'ui-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [class]="descriptionClasses">
      <ng-content></ng-content>
    </p>
  `
})
export class CardDescriptionComponent {
  @Input() className = '';

  get descriptionClasses(): string {
    return `text-sm text-muted-foreground ${this.className}`.trim();
  }
}

@Component({
  selector: 'ui-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="contentClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class CardContentComponent {
  @Input() className = '';

  get contentClasses(): string {
    return `p-6 pt-0 ${this.className}`.trim();
  }
}

@Component({
  selector: 'ui-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="footerClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class CardFooterComponent {
  @Input() className = '';

  get footerClasses(): string {
    return `flex items-center p-6 pt-0 ${this.className}`.trim();
  }
}