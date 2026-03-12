/**
 * Translation utility functions for handling bilingual content
 * Static utility class - no instantiation needed
 * Supports English (en) and Arabic (ar) with _Ar suffix convention
 */
export class TranslationUtil {

  /**
   * Get translated field value based on current language
   * For Arabic, looks for field_Ar property first, then falls back to original field
   * @param obj The object containing the field
   * @param fieldName The base field name (without _Ar suffix)
   * @param currentLang The current language ('en' or 'ar')
   * @returns The translated value or the original value
   */
  static getTranslatedField(obj: any, fieldName: string, currentLang: string): string {
    if (!obj) return '';
    
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
   * Applies translation to specified fields for all items in array
   * @param items Array of objects
   * @param fields Array of field names to translate
   * @param currentLang The current language ('en' or 'ar')
   * @returns Array with translated fields
   */
  static translateArray<T>(items: T[], fields: string[], currentLang: string): T[] {
    return items.map(item => this.translateObject(item, fields, currentLang));
  }

  /**
   * Get translated object
   * Applies translation to specified fields in a single object
   * @param obj Object to translate
   * @param fields Array of field names to translate
   * @param currentLang The current language ('en' or 'ar')
   * @returns Object with translated fields
   */
  static translateObject<T>(obj: T, fields: string[], currentLang: string): T {
    if (!obj) return obj;
    
    const translated = { ...obj } as any;
    
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
