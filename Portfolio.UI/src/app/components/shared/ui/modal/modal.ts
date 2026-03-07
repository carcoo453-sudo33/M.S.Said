import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
    selector: 'ui-modal',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
        <!-- Modal Overlay -->
        <div 
            *ngIf="isOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            (click)="onOverlayClick($event)">
            
            <!-- Modal Content -->
            <div 
                [class]="modalClasses"
                (click)="$event.stopPropagation()"
                role="dialog"
                [attr.aria-labelledby]="title ? 'modal-title' : null"
                [attr.aria-describedby]="description ? 'modal-description' : null"
                aria-modal="true">
                
                <!-- Header -->
                <div *ngIf="showHeader" class="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div class="flex-1">
                        <h2 *ngIf="title" id="modal-title" class="text-lg font-semibold text-zinc-900 dark:text-white">
                            {{ title }}
                        </h2>
                        <p *ngIf="description" id="modal-description" class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            {{ description }}
                        </p>
                    </div>
                    
                    <button 
                        *ngIf="showCloseButton"
                        type="button"
                        class="ml-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        (click)="close.emit()"
                        aria-label="Close modal">
                        <lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon>
                    </button>
                </div>

                <!-- Body -->
                <div [class]="bodyClasses">
                    <ng-content></ng-content>
                </div>

                <!-- Footer -->
                <div *ngIf="showFooter" class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t border-zinc-200 dark:border-zinc-800">
                    <ng-content select="[slot=footer]"></ng-content>
                </div>
            </div>
        </div>
    `
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() isOpen = false;
    @Input() title = '';
    @Input() description = '';
    @Input() size: ModalSize = 'md';
    @Input() showHeader = true;
    @Input() showFooter = false;
    @Input() showCloseButton = true;
    @Input() closeOnOverlayClick = true;
    @Input() closeOnEscape = true;

    @Output() close = new EventEmitter<void>();
    @Output() open = new EventEmitter<void>();

    XIcon = X;

    ngOnInit(): void {
        if (this.closeOnEscape) {
            document.addEventListener('keydown', this.handleEscapeKey);
        }
        
        if (this.isOpen) {
            this.handleOpen();
        }
    }

    ngOnDestroy(): void {
        document.removeEventListener('keydown', this.handleEscapeKey);
        this.restoreBodyScroll();
    }

    ngOnChanges(): void {
        if (this.isOpen) {
            this.handleOpen();
        } else {
            this.restoreBodyScroll();
        }
    }

    private handleOpen(): void {
        this.preventBodyScroll();
        this.open.emit();
    }

    private handleEscapeKey = (event: KeyboardEvent): void => {
        if (event.key === 'Escape' && this.isOpen) {
            this.close.emit();
        }
    };

    onOverlayClick(event: Event): void {
        if (this.closeOnOverlayClick) {
            this.close.emit();
        }
    }

    private preventBodyScroll(): void {
        document.body.style.overflow = 'hidden';
    }

    private restoreBodyScroll(): void {
        document.body.style.overflow = '';
    }

    get modalClasses(): string {
        const baseClasses = 'relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-modal-enter';
        
        const sizeClasses = {
            sm: 'max-w-md',
            md: 'max-w-lg',
            lg: 'max-w-2xl',
            xl: 'max-w-4xl',
            full: 'max-w-7xl mx-4'
        };

        return `${baseClasses} ${sizeClasses[this.size]}`.trim();
    }

    get bodyClasses(): string {
        const scrollable = 'overflow-y-auto custom-scrollbar flex-1';
        const padding = this.showHeader || this.showFooter ? 'p-6' : 'p-6';
        
        return `${scrollable} ${padding}`.trim();
    }
}