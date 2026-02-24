import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = signal<Language>('en');
  public readonly currentLang$ = this.currentLang.asReadonly();

  constructor(private translate: TranslateService) {
    // Set default language
    this.translate.setDefaultLang('en');
    
    // Load saved language or use default
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      this.setLanguage(savedLang);
    } else {
      this.setLanguage('en');
    }
  }

  setLanguage(lang: Language) {
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem('language', lang);
    
    // Update document direction and lang attribute
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('lang', lang);
    htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }

  toggleLanguage() {
    const newLang: Language = this.currentLang() === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  isRTL(): boolean {
    return this.currentLang() === 'ar';
  }

  getCurrentLanguage(): Language {
    return this.currentLang();
  }
}
