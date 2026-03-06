import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@Component({
  selector: 'app-optimized-image',
  standalone: true,
  imports: [CommonModule, LazyLoadImageModule],
  template: `
    <div [class]="containerClasses">
      <!-- Loading Skeleton -->
      <div 
        *ngIf="isLoading()" 
        [class]="skeletonClasses"
        [attr.aria-label]="'Loading ' + alt">
      </div>

      <!-- Optimized Image with ng-lazyload-image -->
      <img
        [lazyLoad]="src"
        [defaultImage]="placeholderSrc"
        [errorImage]="errorSrc"
        [alt]="alt"
        [class]="imageClasses"
        [style.object-fit]="objectFit"
        [style.aspect-ratio]="aspectRatio"
        [attr.loading]="loading"
        [attr.decoding]="decoding"
        [attr.fetchpriority]="priority"
        [sizes]="sizes"
        [srcset]="srcset"
        [offset]="lazyLoadOffset"
        [scrollContainer]="scrollContainer"
        [customObserver]="customObserver"
        (onLoad)="onImageLoad($event)"
        (onError)="onImageError($event)" />

      <!-- Error State -->
      <div 
        *ngIf="hasError()" 
        [class]="errorClasses">
        <div class="text-center">
          <div class="text-2xl mb-2">📷</div>
          <p class="text-sm text-muted-foreground">Failed to load image</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .image-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .dark .image-skeleton {
      background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
      background-size: 200% 100%;
    }
  `]
})
export class OptimizedImageComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+';
  @Input() errorSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg==';
  @Input() className = '';
  @Input() objectFit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' = 'cover';
  @Input() aspectRatio = '';
  @Input() loading: 'lazy' | 'eager' = 'lazy';
  @Input() decoding: 'async' | 'sync' | 'auto' = 'async';
  @Input() priority: 'high' | 'low' | 'auto' = 'auto';
  @Input() sizes = '';
  @Input() srcset = '';
  @Input() showSkeleton = true;
  @Input() showErrorState = true;
  
  // ng-lazyload-image specific options
  @Input() lazyLoadOffset = 50;
  @Input() scrollContainer?: HTMLElement;
  @Input() customObserver?: IntersectionObserver;

  @Output() imageLoad = new EventEmitter<Event>();
  @Output() imageError = new EventEmitter<Event>();

  private _isLoading = signal(true);
  private _hasError = signal(false);

  isLoading = computed(() => this._isLoading() && this.showSkeleton);
  hasError = computed(() => this._hasError() && this.showErrorState);

  get containerClasses(): string {
    return `relative overflow-hidden ${this.className}`;
  }

  get imageClasses(): string {
    const baseClasses = 'w-full h-full transition-opacity duration-300';
    const visibilityClasses = this.isLoading() || this.hasError() ? 'opacity-0' : 'opacity-100';
    return `${baseClasses} ${visibilityClasses}`;
  }

  get skeletonClasses(): string {
    return 'absolute inset-0 image-skeleton rounded';
  }

  get errorClasses(): string {
    return 'absolute inset-0 flex items-center justify-center bg-muted rounded';
  }

  onImageLoad(event: Event) {
    this._isLoading.set(false);
    this._hasError.set(false);
    this.imageLoad.emit(event);
  }

  onImageError(event: Event) {
    this._isLoading.set(false);
    this._hasError.set(true);
    this.imageError.emit(event);
  }

  // Utility method to generate responsive srcset
  static generateSrcSet(baseUrl: string, sizes: number[] = [320, 640, 960, 1280, 1920]): string {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
  }

  // Utility method to generate sizes attribute
  static generateSizes(breakpoints: { [key: string]: string } = {
    '(max-width: 640px)': '100vw',
    '(max-width: 1024px)': '50vw',
    default: '33vw'
  }): string {
    const entries = Object.entries(breakpoints);
    const mediaQueries = entries.slice(0, -1).map(([query, size]) => `${query} ${size}`);
    const defaultSize = entries[entries.length - 1][1];
    return [...mediaQueries, defaultSize].join(', ');
  }
}