import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationHelperService {
  private translate = inject(TranslateService);

  /**
   * Get translated field value based on current language
   * @param obj The object containing the field
   * @param fieldName The base field name (without _Ar suffix)
   * @returns The translated value or the original value
   */
  getTranslatedField(obj: any, fieldName: string): string {
    if (!obj) return '';
    
    const currentLang = this.translate.currentLang || this.translate.defaultLang;
    
    // If Arabic, try to get the _Ar field first
    if (currentLang === 'ar') {
      const arField = `${fieldName}_Ar`;
      if (obj[arField]) {
        return obj[arField];
      }
    }
    
    // Fallback to the original field
    return obj[fieldName] || '';
  }

  /**
   * Get translated array of objects
   * @param items Array of objects
   * @param fields Array of field names to translate
   * @returns Array with translated fields
   */
  translateArray<T>(items: T[], fields: string[]): T[] {
    return items.map(item => this.translateObject(item, fields));
  }

  /**
   * Get translated object
   * @param obj Object to translate
   * @param fields Array of field names to translate
   * @returns Object with translated fields
   */
  translateObject<T>(obj: T, fields: string[]): T {
    if (!obj) return obj;
    
    const translated = { ...obj } as any;
    const currentLang = this.translate.currentLang || this.translate.defaultLang;
    
    if (currentLang === 'ar') {
      fields.forEach(field => {
        const arField = `${field}_Ar`;
        if (translated[arField]) {
          translated[field] = translated[arField];
        }
      });
    }
    
    return translated;
  }
}
