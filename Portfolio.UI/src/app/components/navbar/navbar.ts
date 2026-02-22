import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <a routerLink="/" class="text-2xl font-black tracking-tighter hover:text-red-500 transition-all active:scale-95 flex items-center gap-2">
          M<span class="text-red-600">/</span>S
        </a>
        
        <div class="hidden md:flex items-center gap-8">
          <a routerLink="/" routerLinkActive="text-red-500" [routerLinkActiveOptions]="{exact: true}" class="text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-500 transition-colors">Home</a>
          <a routerLink="/projects" routerLinkActive="text-red-500" class="text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-500 transition-colors">Projects</a>
          <a routerLink="/timeline" routerLinkActive="text-red-500" class="text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-500 transition-colors">Experience</a>
          <a routerLink="/education" routerLinkActive="text-red-500" class="text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-500 transition-colors">Education</a>
          <a routerLink="/blog" routerLinkActive="text-red-500" class="text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-500 transition-colors">Blog</a>
          <a routerLink="/contact" routerLinkActive="text-red-500" class="text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-500 transition-colors">Contact</a>
        </div>

        <div class="flex items-center gap-4">
          <ng-container *ngIf="auth.isLoggedIn(); else loginBtn">
             <button (click)="auth.logout()" class="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Logout</button>
          </ng-container>
          <ng-template #loginBtn>
             <a routerLink="/login" class="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95">Admin Center</a>
          </ng-template>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  public auth = inject(AuthService);
}
