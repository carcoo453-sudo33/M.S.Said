import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageUtilsService {

  /**
   * Get full image URL with proper base URL handling
   */
  getFullImageUrl(url?: string): string {
    if (!url) return 'assets/project-placeholder.svg';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    const baseUrl = environment.apiUrl.replace('/api', '');
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`;
    }

    return `${baseUrl}/${url}`;
  }

  /**
   * Handle image error by setting fallback placeholder
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/project-placeholder.svg';
    }
  }

  /**
   * Hide image on error (for logos and avatars)
   */
  onImageErrorHide(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }
}