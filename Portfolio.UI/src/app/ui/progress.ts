import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="progressClasses">
      <div 
        class="h-full w-full flex-1 bg-primary transition-all"
        [style.transform]="'translateX(-' + (100 - (value || 0)) + '%)'"
      ></div>
    </div>
  `
})
export class ProgressComponent {
  @Input() value?: number;
  @Input() max = 100;
  @Input() className = '';

  get progressClasses(): string {
    return `relative h-4 w-full overflow-hidden rounded-full bg-secondary ${this.className}`.trim();
  }

  get progressValue(): number {
    if (this.value === undefined) return 0;
    return Math.min(Math.max(this.value, 0), this.max);
  }
}