import { Component, Input, Output, EventEmitter, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ui-radio-group',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="groupClasses" role="radiogroup">
      <div 
        *ngFor="let option of options; trackBy: trackByFn"
        class="flex items-center space-x-2">
        <ui-radio-item
          [value]="option.value"
          [checked]="selectedValue() === option.value"
          [disabled]="option.disabled || disabled"
          (change)="onSelectionChange(option.value)">
        </ui-radio-item>
        <label 
          [for]="option.value"
          [class]="getLabelClasses(option)"
          (click)="onLabelClick(option)">
          {{ option.label }}
        </label>
      </div>
    </div>
  `
})
export class RadioGroupComponent implements ControlValueAccessor {
  @Input() options: RadioOption[] = [];
  @Input() disabled = false;
  @Input() className = '';
  @Output() valueChange = new EventEmitter<string>();

  private _selectedValue = signal<string>('');
  selectedValue = this._selectedValue.asReadonly();

  private onChange = (value: string) => {};
  onTouched = () => {};

  get groupClasses(): string {
    return `grid gap-2 ${this.className}`;
  }

  onSelectionChange(value: string) {
    if (this.disabled) return;
    
    this._selectedValue.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
    this.onTouched();
  }

  onLabelClick(option: RadioOption) {
    if (option.disabled || this.disabled) return;
    this.onSelectionChange(option.value);
  }

  getLabelClasses(option: RadioOption): string {
    const baseClasses = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer';
    return option.disabled || this.disabled ? `${baseClasses} opacity-50 cursor-not-allowed` : baseClasses;
  }

  trackByFn(index: number, option: RadioOption): string {
    return option.value;
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    if (value !== null && value !== undefined) {
      this._selectedValue.set(value);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

@Component({
  selector: 'ui-radio-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      role="radio"
      [attr.aria-checked]="checked"
      [disabled]="disabled"
      [class]="radioClasses"
      (click)="toggle()"
      (blur)="onBlur()">
      <div *ngIf="checked" class="radio-indicator"></div>
    </button>
  `,
  styles: [`
    .radio-indicator {
      @apply h-2.5 w-2.5 rounded-full bg-current;
    }
  `]
})
export class RadioItemComponent {
  @Input() value = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Input() className = '';
  @Output() change = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  get radioClasses(): string {
    return `aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center ${this.className}`;
  }

  toggle() {
    if (!this.disabled) {
      this.change.emit(this.value);
    }
  }

  onBlur() {
    this.blur.emit();
  }
}