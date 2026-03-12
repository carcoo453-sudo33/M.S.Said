import { environment } from '../../environments/environment';

/**
 * Image utility functions for handling image URLs and error states
 * Static utility class - no instantiation needed
 */
export class ImageUtil {

  /**
   * Get full image URL with proper base URL handling
   * Handles relative paths, absolute paths, and external URLs
   * @param url Image URL (relative or absolute)
   * @returns Full image URL or placeholder if not provided
   */
  static getFullImageUrl(url?: string): string {
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
   * Check if URL is external (absolute URL)
   * @param url URL to check
   * @returns true if URL is external
   */
  static isExternalUrl(url?: string): boolean {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  }

  /**
   * Handle image error by setting fallback placeholder
   * @param event Error event from img element
   */
  static onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/project-placeholder.svg';
    }
  }

  /**
   * Hide image on error (for logos and avatars)
   * @param event Error event from img element
   */
  static onImageErrorHide(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }
}
