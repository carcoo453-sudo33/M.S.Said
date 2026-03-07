import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'ghost';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
    selector: 'ui-card',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div [class]="cardClasses">
            <!-- Header -->
            <div *ngIf="title || description" [class]="headerClasses">
                <h3 *ngIf="title" class="text-lg font-semibold text-zinc-900 dark:text-white">
                    {{ title }}
                </h3>
                <p *ngIf="description" class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {{ description }}
                </p>
                <ng-content select="[slot=header]"></ng-content>
            </div>

            <!-- Content -->
            <div [class]="contentClasses">
                <ng-content></ng-content>
            </div>

            <!-- Footer -->
            <div *ngIf="hasFooterContent" [class]="footerClasses">
                <ng-content select="[slot=footer]"></ng-content>
            </div>
        </div>
    `
})
export class CardComponent {
    @Input() title = '';
    @Input() description = '';
    @Input() variant: CardVariant = 'default';
    @Input() padding: CardPadding = 'md';
    @Input() hover = false;
    @Input() clickable = false;

    hasFooterContent = false;

    ngAfterContentInit(): void {
        // Check if footer content is provided
        this.hasFooterContent = document.querySelector('ng-content[select="[slot=footer]"]') !== null;
    }

    get cardClasses(): string {
        const baseClasses = 'rounded-xl transition-all duration-200';
        
        const variantClasses = {
            default: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
            outlined: 'bg-transparent border border-zinc-200 dark:border-zinc-800',
            elevated: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg',
            ghost: 'bg-zinc-50 dark:bg-zinc-800/50'
        };

        const interactionClasses = [];
        if (this.hover) {
            interactionClasses.push('hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700');
        }
        if (this.clickable) {
            interactionClasses.push('cursor-pointer hover:scale-[1.02] active:scale-[0.98]');
        }

        return `${baseClasses} ${variantClasses[this.variant]} ${interactionClasses.join(' ')}`.trim();
    }

    get headerClasses(): string {
        const paddingClasses = {
            none: '',
            sm: 'p-4 pb-0',
            md: 'p-6 pb-0',
            lg: 'p-8 pb-0'
        };

        return paddingClasses[this.padding];
    }

    get contentClasses(): string {
        const paddingClasses = {
            none: '',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8'
        };

        const headerAdjustment = (this.title || this.description) ? 'pt-4' : '';

        return `${paddingClasses[this.padding]} ${headerAdjustment}`.trim();
    }

    get footerClasses(): string {
        const paddingClasses = {
            none: '',
            sm: 'p-4 pt-0',
            md: 'p-6 pt-0',
            lg: 'p-8 pt-0'
        };

        return `${paddingClasses[this.padding]} border-t border-zinc-200 dark:border-zinc-800 mt-4`.trim();
    }
}