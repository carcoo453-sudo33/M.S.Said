import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative">
      <select
        [value]="value"
        [disabled]="disabled"
        [class]="selectClasses"
        (change)="onSelectionChange($event)"
        (blur)="onBlur()"
        (focus)="onFocus.emit($event)"
      >
        <option value="" disabled *ngIf="placeholder">{{ placeholder }}</option>
        <option 
          *ngFor="let option of options" 
          [value]="option.value"
          [disabled]="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <lucide-icon 
        [img]="ChevronDownIcon" 
        class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none"
      ></lucide-icon>
    </div>
  `
})
export class SelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() className = '';
  
  @Output() onFocus = new EventEmitter<Event>();
  @Output() onBlur = new EventEmitter<Event>();
  @Output() selectionChange = new EventEmitter<string>();

  ChevronDownIcon = ChevronDown;
  value = '';
  
  private onTouched = () => {};
  private onChanged = (value: string) => {};

  get selectClasses(): string {
    return `flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${this.className}`.trim();
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChanged(this.value);
    this.selectionChange.emit(this.value);
  }

  onBlur(): void {
    this.onTouched();
    this.onBlur.emit();
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}