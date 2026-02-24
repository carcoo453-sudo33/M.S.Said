import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="toggleLanguage()"
      class="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-red-600/50 transition-all hover:scale-110 active:scale-95">
      <span class="text-xs font-black text-zinc-600 dark:text-zinc-400 hover:text-red-500 transition-all">
        {{ currentLang() === 'en' ? 'AR' : 'EN' }}
      </span>
    </button>
  `
})
export class LanguageSwitcherComponent {
  private translationService = inject(TranslationService);
  
  currentLang = this.translationService.currentLang$;

  toggleLanguage() {
    this.translationService.toggleLanguage();
  }
}
