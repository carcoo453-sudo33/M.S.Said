import { Component, Input, Output, EventEmitter, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-slider',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="sliderClasses">
      <input
        type="range"
        [min]="min"
        [max]="max"
        [step]="step"
        [value]="value()"
        [disabled]="disabled"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="slider-input" />
      
      <!-- Track -->
      <div class="slider-track">
        <!-- Range -->
        <div 
          class="slider-range"
          [style.width.%]="percentage()">
        </div>
      </div>
      
      <!-- Thumb -->
      <div 
        class="slider-thumb"
        [style.left.%]="percentage()">
      </div>
    </div>
  `,
  styles: [`
    .slider-input {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
    
    .slider-input:disabled {
      cursor: not-allowed;
    }
    
    .slider-track {
      @apply relative h-2 w-full grow overflow-hidden rounded-full bg-secondary;
    }
    
    .slider-range {
      @apply absolute h-full bg-primary;
    }
    
    .slider-thumb {
      @apply absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50;
    }
  `]
})
export class SliderComponent implements ControlValueAccessor {
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() disabled = false;
  @Input() className = '';
  @Output() valueChange = new EventEmitter<number>();

  private _value = signal(0);
  value = this._value.asReadonly();

  private onChange = (value: number) => {};
  onTouched = () => {};

  get sliderClasses(): string {
    return `relative flex w-full touch-none select-none items-center ${this.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${this.className}`;
  }

  get percentage(): number {
    return ((this.value() - this.min) / (this.max - this.min)) * 100;
  }

  onInput(event: Event) {
    if (this.disabled) return;
    
    const target = event.target as HTMLInputElement;
    const newValue = parseFloat(target.value);
    
    this._value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    if (value !== null && value !== undefined) {
      this._value.set(value);
    }
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}