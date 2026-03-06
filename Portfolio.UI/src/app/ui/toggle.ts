import { Component, Input, Output, EventEmitter, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-toggle',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true
    }
  ],
  template: `
    <button
      type="button"
      [class]="toggleClasses"
      [disabled]="disabled"
      [attr.aria-pressed]="pressed()"
      (click)="toggle()"
      (blur)="onTouched()">
      <ng-content></ng-content>
    </button>
  `
})
export class ToggleComponent implements ControlValueAccessor {
  @Input() variant: 'default' | 'outline' = 'default';
  @Input() size: 'default' | 'sm' | 'lg' = 'default';
  @Input() disabled = false;
  @Input() className = '';
  @Output() pressedChange = new EventEmitter<boolean>();

  private _pressed = signal(false);
  pressed = this._pressed.asReadonly();

  private onChange = (value: boolean) => {};
  onTouched = () => {};

  get toggleClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variantClasses = {
      default: 'bg-transparent',
      outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground'
    };

    const sizeClasses = {
      default: 'h-10 px-3',
      sm: 'h-9 px-2.5',
      lg: 'h-11 px-5'
    };

    const pressedClasses = this.pressed() ? 'bg-accent text-accent-foreground' : '';

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]} ${pressedClasses} ${this.className}`;
  }

  toggle() {
    if (!this.disabled) {
      const newPressed = !this.pressed();
      this._pressed.set(newPressed);
      this.onChange(newPressed);
      this.pressedChange.emit(newPressed);
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    if (value !== null && value !== undefined) {
      this._pressed.set(value);
    }
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}