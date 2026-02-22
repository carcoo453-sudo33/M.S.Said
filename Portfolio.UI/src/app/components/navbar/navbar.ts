import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <span class="text-xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent cursor-pointer" routerLink="/">
          PORTFOLIO.
        </span>
        <div class="hidden md:flex items-center gap-6">
          <a routerLink="/timeline" routerLinkActive="text-red-500" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Experience</a>
          <a routerLink="/projects" routerLinkActive="text-red-500" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Projects</a>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <ng-container *ngIf="auth.isLoggedIn(); else loginBtn">
           <button (click)="auth.logout()" class="text-sm font-medium text-zinc-400 hover:text-white">Logout</button>
        </ng-container>
        <ng-template #loginBtn>
           <a routerLink="/login" class="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Admin Login</a>
        </ng-template>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  public auth = inject(AuthService);
}
