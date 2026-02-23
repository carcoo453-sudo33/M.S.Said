import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private platformId = inject(PLATFORM_ID);
    private readonly STORAGE_KEY = 'portfolio-theme';

    isDark = signal<boolean>(true);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            // Restore preference from localStorage, default to dark
            const saved = localStorage.getItem(this.STORAGE_KEY);
            const prefersDark = saved ? saved === 'dark' : true;
            this.isDark.set(prefersDark);
            this.applyTheme(prefersDark);
        }

        // React to changes automatically
        effect(() => {
            if (isPlatformBrowser(this.platformId)) {
                this.applyTheme(this.isDark());
                localStorage.setItem(this.STORAGE_KEY, this.isDark() ? 'dark' : 'light');
            }
        });
    }

    toggle() {
        this.isDark.update(v => !v);
    }

    private applyTheme(dark: boolean) {
        const root = document.documentElement;
        if (dark) {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
    }
}
