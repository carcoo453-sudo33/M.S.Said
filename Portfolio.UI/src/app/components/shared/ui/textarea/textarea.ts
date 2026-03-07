import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type TextareaSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'ui-textarea',
    standalone: true,
    imports: [CommonModule, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextareaComponent),
            multi: true
        }
    ],
    template: `
        <div class="relative">
            <!-- Label -->
            <label *ngIf="label" [for]="textareaId" [class]="labelClasses">
                {{ label }}
                <span *ngIf="required" class="text-red-500 ml-1">*</span>
            </label>

            <!-- Textarea -->
            <textarea
                [id]="textareaId"
                [placeholder]="placeholder"
                [disabled]="disabled"
                [readonly]="readonly"
                [required]="required"
                [rows]="rows"
                [maxLength]="maxlength"
                [class]="textareaClasses"
                [value]="value"
                (input)="onInput($event)"
                (blur)="onBlur()"
                (focus)="onFocus()"
                [attr.dir]="dir"
            ></textarea>

            <!-- Character Count -->
            <div *ngIf="maxlength && showCharCount" class="flex justify-between items-center mt-1.5">
                <p *ngIf="helperText && !error" class="text-xs text-zinc-500 dark:text-zinc-400">
                    {{ helperText }}
                </p>
                <p *ngIf="error" class="text-xs text-red-500 dark:text-red-400">
                    {{ error }}
                </p>
                <span class="text-xs text-zinc-400 ml-auto">
                    {{ value.length }}/{{ maxlength }}
                </span>
            </div>

            <!-- Helper Text (without char count) -->
            <p *ngIf="helperText && !error && (!maxlength || !showCharCount)" class="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                {{ helperText }}
            </p>

            <!-- Error Message (without char count) -->
            <p *ngIf="error && (!maxlength || !showCharCount)" class="text-xs text-red-500 dark:text-red-400 mt-1.5">
                {{ error }}
            </p>
        </div>
    `
})
export class TextareaComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() placeholder = '';
    @Input() size: TextareaSize = 'md';
    @Input() disabled = false;
    @Input() readonly = false;
    @Input() required = false;
    @Input() error = '';
    @Input() helperText = '';
    @Input() rows = 3;
    @Input() maxlength: number | undefined;
    @Input() showCharCount = false;
    @Input() dir: 'ltr' | 'rtl' = 'ltr';
    @Input() resize: 'none' | 'vertical' | 'horizontal' | 'both' = 'vertical';

    @Output() valueChange = new EventEmitter<string>();
    @Output() focus = new EventEmitter<void>();
    @Output() blur = new EventEmitter<void>();

    value = '';
    textareaId = `textarea-${Math.random().toString(36).substr(2, 9)}`;

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
        const target = event.target as HTMLTextAreaElement;
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

    get labelClasses(): string {
        return 'text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block';
    }

    get textareaClasses(): string {
        const baseClasses = 'w-full border rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all';
        
        const sizeClasses = {
            sm: 'px-3 py-2 text-sm',
            md: 'px-4 py-2.5 text-sm',
            lg: 'px-4 py-3 text-base'
        };

        const stateClasses = this.error 
            ? 'border-red-500 ring-2 ring-red-500/30' 
            : 'border-zinc-200 dark:border-zinc-700';

        const resizeClasses = {
            none: 'resize-none',
            vertical: 'resize-y',
            horizontal: 'resize-x',
            both: 'resize'
        };

        const directionClass = this.dir === 'rtl' ? 'text-right' : '';

        return `${baseClasses} ${sizeClasses[this.size]} ${stateClasses} ${resizeClasses[this.resize]} ${directionClass}`.trim();
    }
}