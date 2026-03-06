import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule, Check } from 'lucide-angular';

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  template: `
    <button
      type="button"
      role="checkbox"
      [attr.aria-checked]="checked"
      [disabled]="disabled"
      [class]="checkboxClasses"
      (click)="toggle()"
    >
      <lucide-icon 
        *ngIf="checked" 
        [img]="CheckIcon" 
        class="h-4 w-4"
      ></lucide-icon>
    </button>
  `
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() className = '';
  
  @Output() checkedChange = new EventEmitter<boolean>();

  CheckIcon = Check;
  checked = false;
  
  private onTouched = () => {};
  private onChanged = (value: boolean) => {};

  get checkboxClasses(): string {
    return `peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${this.checked ? 'bg-primary text-primary-foreground' : ''} ${this.className}`.trim();
  }

  toggle(): void {
    if (this.disabled) return;
    
    this.checked = !this.checked;
    this.onChanged(this.checked);
    this.checkedChange.emit(this.checked);
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.checked = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}