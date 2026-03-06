import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="skeletonClasses"></div>
  `
})
export class SkeletonComponent {
  @Input() className = '';

  get skeletonClasses(): string {
    return `animate-pulse rounded-md bg-muted ${this.className}`.trim();
  }
}