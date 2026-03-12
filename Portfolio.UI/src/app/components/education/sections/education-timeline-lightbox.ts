import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
    selector: 'app-education-timeline-lightbox',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div *ngIf="isOpen" 
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in"
        (click)="onClose()">
        
        <!-- Close Button (Top) -->
        <button (click)="onClose()" 
            class="absolute top-4 ltr:right-4 rtl:left-4 z-[210] w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all group">
            <lucide-icon [img]="XIcon" class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"></lucide-icon>
        </button>

        <!-- Image Counter -->
        <div *ngIf="images.length > 1" class="absolute top-4 left-1/2 -translate-x-1/2 z-[210] px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
            <span class="text-white font-black text-sm tracking-widest">
                {{ currentIndex + 1 }} / {{ images.length }}
            </span>
        </div>

        <!-- Main Image Container -->
        <div class="relative w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-16" (click)="$event.stopPropagation()">
            <img [src]="images[currentIndex]" 
                class="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-scale-in"
                [class.animate-slide-left]="slideDirection === 'left'"
                [class.animate-slide-right]="slideDirection === 'right'">
        </div>

        <!-- Navigation Buttons -->
        <button *ngIf="images.length > 1"
            (click)="previousImage(); $event.stopPropagation()"
            class="absolute ltr:left-4 ltr:md:left-8 rtl:right-4 rtl:md:right-8 top-1/2 -translate-y-1/2 z-[210] w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all group">
            <lucide-icon [img]="ChevronLeftIcon" class="w-7 h-7 group-hover:scale-110 transition-transform"></lucide-icon>
        </button>

        <button *ngIf="images.length > 1"
            (click)="nextImage(); $event.stopPropagation()"
            class="absolute ltr:right-4 ltr:md:right-8 rtl:left-4 rtl:md:left-8 top-1/2 -translate-y-1/2 z-[210] w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all group">
            <lucide-icon [img]="ChevronRightIcon" class="w-7 h-7 group-hover:scale-110 transition-transform"></lucide-icon>
        </button>

        <!-- Thumbnail Strip -->
        <div *ngIf="images.length > 1" 
            class="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[210] max-w-[90%]"
            (click)="$event.stopPropagation()">
            <div class="overflow-x-auto no-scrollbar">
                <div class="flex gap-2 md:gap-3 px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <div *ngFor="let img of images; let i = index"
                        (click)="goToImage(i)"
                        [class.ring-2]="i === currentIndex"
                        [class.ring-red-600]="i === currentIndex"
                        [class.opacity-50]="i !== currentIndex"
                        class="w-16 md:w-20 aspect-video rounded-lg overflow-hidden shrink-0 cursor-pointer hover:opacity-100 transition-all hover:scale-105 border border-white/20">
                        <img [src]="img" class="w-full h-full object-cover">
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Close Button - Red Background (Bottom) -->
        <button (click)="onClose()"
            class="absolute top-20 md:top-24 ltr:right-4 ltr:md:right-8 rtl:left-4 rtl:md:left-8 z-[210] w-12 h-12 rounded-xl bg-red-600 backdrop-blur-md border border-red-500 flex items-center justify-center text-white hover:bg-red-700 transition-all group shadow-lg">
            <lucide-icon [img]="XIcon" class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"></lucide-icon>
        </button>
    </div>
    `
})
export class EducationTimelineLightboxComponent {
    @Input() isOpen = false;
    @Input() images: string[] = [];
    @Input() currentIndex = 0;
    @Output() closed = new EventEmitter<void>();
    @Output() indexChanged = new EventEmitter<number>();

    XIcon = X;
    ChevronLeftIcon = ChevronLeft;
    ChevronRightIcon = ChevronRight;

    slideDirection: 'left' | 'right' | null = null;

    onClose(): void {
        this.closed.emit();
    }

    nextImage(): void {
        if (this.images.length <= 1) return;
        this.slideDirection = 'right';
        const newIndex = (this.currentIndex + 1) % this.images.length;
        this.indexChanged.emit(newIndex);
        setTimeout(() => this.slideDirection = null, 300);
    }

    previousImage(): void {
        if (this.images.length <= 1) return;
        this.slideDirection = 'left';
        const newIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
        this.indexChanged.emit(newIndex);
        setTimeout(() => this.slideDirection = null, 300);
    }

    goToImage(index: number): void {
        if (index < 0 || index >= this.images.length) return;
        this.slideDirection = index > this.currentIndex ? 'right' : 'left';
        this.indexChanged.emit(index);
        setTimeout(() => this.slideDirection = null, 300);
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        if (!this.isOpen) return;

        switch (event.key) {
            case 'Escape':
                this.onClose();
                break;
            case 'ArrowLeft':
                this.previousImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    }
}
