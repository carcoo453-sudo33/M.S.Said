import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SeparatorOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'ui-separator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [attr.role]="decorative ? 'none' : 'separator'"
      [attr.aria-orientation]="orientation"
      [class]="separatorClasses"
    ></div>
  `
})
export class SeparatorComponent {
  @Input() orientation: SeparatorOrientation = 'horizontal';
  @Input() decorative = true;
  @Input() className = '';

  get separatorClasses(): string {
    const baseClasses = 'shrink-0 bg-border';
    const orientationClasses = this.orientation === 'horizontal' 
      ? 'h-[1px] w-full' 
      : 'h-full w-[1px]';
    
    return `${baseClasses} ${orientationClasses} ${this.className}`.trim();
  }
}