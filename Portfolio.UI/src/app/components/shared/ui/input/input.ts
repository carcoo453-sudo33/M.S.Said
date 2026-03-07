import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'datetime-local' | 'time';

@Component({
    selector: 'ui-input',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ],
    template: `
        <div class="relative">
            <!-- Label -->
            <label *ngIf="label" [for]="inputId" [class]="labelClasses">
                {{ label }}
                <span *ngIf="required" class="text-red-500 ml-1">*</span>
            </label>

            <!-- Input Container -->
            <div class="relative">
                <!-- Left Icon -->
                <div *ngIf="iconLeft" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <lucide-icon [img]="iconLeft" [class]="iconClasses"></lucide-icon>
                </div>

                <!-- Input Field -->
                <input
                    [id]="inputId"
                    [type]="type"
                    [placeholder]="placeholder"
                    [disabled]="disabled"
                    [readonly]="readonly"
                    [required]="required"
                    [min]="min"
                    [max]="max"
                    [step]="step"
                    [maxLength]="maxlength"
                    [class]="inputClasses"
                    [value]="value"
                    (input)="onInput($event)"
                    (blur)="onBlur()"
                    (focus)="onFocus()"
                    [attr.dir]="dir"
                />

                <!-- Right Icon -->
                <div *ngIf="iconRight" class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <lucide-icon [img]="iconRight" [class]="iconClasses"></lucide-icon>
                </div>

                <!-- Clear Button -->
                <button 
                    *ngIf="clearable && value && !disabled"
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    (click)="clearValue()">
                    <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
                </button>
            </div>

            <!-- Helper Text -->
            <p *ngIf="helperText && !error" class="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                {{ helperText }}
            </p>

            <!-- Error Message -->
            <p *ngIf="error" class="text-xs text-red-500 dark:text-red-400 mt-1.5">
                {{ error }}
            </p>
        </div>
    `
})
export class InputComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() placeholder = '';
    @Input() type: InputType = 'text';
    @Input() size: InputSize = 'md';
    @Input() disabled = false;
    @Input() readonly = false;
    @Input() required = false;
    @Input() error = '';
    @Input() helperText = '';
    @Input() iconLeft: any;
    @Input() iconRight: any;
    @Input() clearable = false;
    @Input() dir: 'ltr' | 'rtl' = 'ltr';
    @Input() min: string | number | undefined;
    @Input() max: string | number | undefined;
    @Input() step: string | number | undefined;
    @Input() maxlength: number | undefined;

    @Output() valueChange = new EventEmitter<string>();
    @Output() focus = new EventEmitter<void>();
    @Output() blur = new EventEmitter<void>();

    value = '';
    inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

    // ControlValueAccessor implementation
    private onChange = (value: string) => {};
    private onTouched = () => {};

    writeValue(value: string): void {
        this.value = value || '';
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

    onInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
        this.onChange(this.value);
        this.valueChange.emit(this.value);
    }

    onFocus(): void {
        this.focus.emit();
    }

    onBlur(): void {
        this.onTouched();
        this.blur.emit();
    }

    clearValue(): void {
        this.value = '';
        this.onChange(this.value);
        this.valueChange.emit(this.value);
    }

    get labelClasses(): string {
        return 'text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block';
    }

    get inputClasses(): string {
        const baseClasses = 'w-full border rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all';
        
        const sizeClasses = {
            sm: 'px-3 py-2 text-sm',
            md: 'px-4 py-2.5 text-sm',
            lg: 'px-4 py-3 text-base'
        };

        const stateClasses = this.error 
            ? 'border-red-500 ring-2 ring-red-500/30' 
            : 'border-zinc-200 dark:border-zinc-700';

        const iconPadding = this.iconLeft ? 'pl-10' : '';
        const rightPadding = (this.iconRight || this.clearable) ? 'pr-10' : '';
        const directionClass = this.dir === 'rtl' ? 'text-right' : '';

        return `${baseClasses} ${sizeClasses[this.size]} ${stateClasses} ${iconPadding} ${rightPadding} ${directionClass}`.trim();
    }

    get iconClasses(): string {
        const sizeClasses = {
            sm: 'w-3.5 h-3.5',
            md: 'w-4 h-4',
            lg: 'w-5 h-5'
        };
        return sizeClasses[this.size];
    }
}