import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-switch',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ],
  template: `
    <button
      type="button"
      role="switch"
      [attr.aria-checked]="checked"
      [disabled]="disabled"
      [class]="switchClasses"
      (click)="toggle()"
    >
      <span [class]="thumbClasses"></span>
    </button>
  `
})
export class SwitchComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() className = '';
  
  @Output() checkedChange = new EventEmitter<boolean>();

  checked = false;
  
  private onTouched = () => {};
  private onChanged = (value: boolean) => {};

  get switchClasses(): string {
    const baseClasses = 'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50';
    const stateClasses = this.checked 
      ? 'bg-primary' 
      : 'bg-input';
    
    return `${baseClasses} ${stateClasses} ${this.className}`.trim();
  }

  get thumbClasses(): string {
    const baseClasses = 'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform';
    const positionClasses = this.checked 
      ? 'translate-x-5' 
      : 'translate-x-0';
    
    return `${baseClasses} ${positionClasses}`.trim();
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