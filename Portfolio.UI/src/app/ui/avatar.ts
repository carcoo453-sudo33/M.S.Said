import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="avatarClasses">
      <ui-avatar-image 
        *ngIf="src"
        [src]="src" 
        [alt]="alt"
        [className]="imageClassName"
        (error)="onImageError()">
      </ui-avatar-image>
      <ui-avatar-fallback 
        *ngIf="!src || imageError()"
        [className]="fallbackClassName">
        <ng-content>{{ fallback }}</ng-content>
      </ui-avatar-fallback>
    </div>
  `
})
export class AvatarComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() fallback = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() className = '';
  @Input() imageClassName = '';
  @Input() fallbackClassName = '';

  imageError = signal(false);

  get avatarClasses(): string {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16'
    };
    
    return `relative flex shrink-0 overflow-hidden rounded-full ${sizeClasses[this.size]} ${this.className}`;
  }

  onImageError() {
    this.imageError.set(true);
  }
}

@Component({
  selector: 'ui-avatar-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img 
      [src]="src"
      [alt]="alt"
      [class]="imageClasses"
      (error)="error.emit()"
      (load)="load.emit()" />
  `
})
export class AvatarImageComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() className = '';
  @Output() error = new EventEmitter<void>();
  @Output() load = new EventEmitter<void>();

  get imageClasses(): string {
    return `aspect-square h-full w-full object-cover ${this.className}`;
  }
}

@Component({
  selector: 'ui-avatar-fallback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="fallbackClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class AvatarFallbackComponent {
  @Input() className = '';

  get fallbackClasses(): string {
    return `flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium ${this.className}`;
  }
}