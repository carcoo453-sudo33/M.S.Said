import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-contact-social-links',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex justify-center gap-6 flex-wrap">
      <!-- GitHub -->
      <a href="https://github.com/Mostafa-SAID7" target="_blank"
        class="group w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-500 border border-zinc-200 dark:border-zinc-800 hover:rotate-12 hover:scale-110 hover:bg-[#333] hover:border-[#333] hover:shadow-[0_0_20px_rgba(51,51,51,0.5)]">
        <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
      <!-- LinkedIn -->
      <a href="https://www.linkedin.com/in/mostafasamirsaid" target="_blank"
        class="group w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-500 border border-zinc-200 dark:border-zinc-800 hover:-rotate-12 hover:scale-110 hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[0_0_20px_rgba(10,102,194,0.5)]">
        <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.736 0-9.646h3.554v1.364c.429-.659 1.191-1.599 2.905-1.599 2.122 0 3.714 1.388 3.714 4.373v5.508zM5.337 8.855c-1.144 0-1.915-.762-1.915-1.715 0-.955.77-1.715 1.958-1.715 1.187 0 1.927.76 1.927 1.715 0 .953-.74 1.715-1.97 1.715zm1.946 11.597H3.392V9.806h3.891v10.646zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
        </svg>
      </a>
      <!-- Facebook -->
      <a href="https://www.facebook.com/mostafa.samir.1994" target="_blank"
        class="group w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-500 border border-zinc-200 dark:border-zinc-800 hover:rotate-12 hover:scale-110 hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_0_20px_rgba(24,119,242,0.5)]">
        <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>
      <!-- Dev.to -->
      <a href="https://dev.to/mostafa_samir" target="_blank"
        class="group w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-500 border border-zinc-200 dark:border-zinc-800 hover:-rotate-12 hover:scale-110 hover:bg-[#0A0A0A] hover:border-[#0A0A0A] hover:shadow-[0_0_20px_rgba(10,10,10,0.5)]">
        <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z"/>
        </svg>
      </a>
      <!-- X (Twitter) -->
      <a href="https://x.com/mostafa41226132" target="_blank"
        class="group w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-500 border border-zinc-200 dark:border-zinc-800 hover:rotate-12 hover:scale-110 hover:bg-[#000000] hover:border-[#000000] hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.807-5.974 6.807H2.882l7.432-8.518L1.227 2.25h6.836l4.867 6.44 5.432-6.44zM17.15 18.75h1.828L6.122 3.97H4.231l12.919 14.78z"/>
        </svg>
      </a>
      <!-- Pinterest -->
      <a href="https://www.pinterest.com/MSaid356" target="_blank"
        class="group w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-500 border border-zinc-200 dark:border-zinc-800 hover:-rotate-12 hover:scale-110 hover:bg-[#E60023] hover:border-[#E60023] hover:shadow-[0_0_20px_rgba(230,0,35,0.5)]">
        <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
        </svg>
      </a>
      <!-- Stack Overflow -->
      <a href="https://stackoverflow.com/users/21488881/mostafa-said" target="_blank"
        class="group w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-500 border border-zinc-200 dark:border-zinc-800 hover:rotate-12 hover:scale-110 hover:bg-[#F58025] hover:border-[#F58025] hover:shadow-[0_0_20px_rgba(245,128,37,0.5)]">
        <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154Z"/>
        </svg>
      </a>
    </div>
  `
})
export class ContactSocialLinksComponent {
}
