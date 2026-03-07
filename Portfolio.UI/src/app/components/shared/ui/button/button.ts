import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'ui-button',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
        <button 
            [type]="type"
            [disabled]="disabled || loading"
            [class]="buttonClasses"
            (click)="onClick.emit($event)">
            
            <!-- Loading State -->
            <div *ngIf="loading" class="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
            
            <!-- Icon Left -->
            <lucide-icon *ngIf="iconLeft && !loading" [img]="iconLeft" [class]="iconClasses"></lucide-icon>
            
            <!-- Content -->
            <span [class.sr-only]="iconOnly">
                <ng-content></ng-content>
            </span>
            
            <!-- Icon Right -->
            <lucide-icon *ngIf="iconRight && !loading" [img]="iconRight" [class]="iconClasses"></lucide-icon>
        </button>
    `
})
export class ButtonComponent {
    @Input() variant: ButtonVariant = 'primary';
    @Input() size: ButtonSize = 'md';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() disabled = false;
    @Input() loading = false;
    @Input() iconLeft: any;
    @Input() iconRight: any;
    @Input() iconOnly = false;
    @Input() fullWidth = false;
    
    @Output() onClick = new EventEmitter<Event>();

    get buttonClasses(): string {
        const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
        
        const variantClasses = {
            primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-600/20',
            secondary: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:ring-zinc-500',
            outline: 'bg-transparent border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:ring-zinc-500',
            ghost: 'bg-transparent text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:ring-zinc-500',
            destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/20'
        };

        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm rounded-lg',
            md: 'px-4 py-2.5 text-sm rounded-xl',
            lg: 'px-6 py-3 text-base rounded-xl'
        };

        const widthClass = this.fullWidth ? 'w-full' : '';
        const iconOnlyClass = this.iconOnly ? 'aspect-square p-2' : '';

        return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]} ${widthClass} ${iconOnlyClass}`.trim();
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