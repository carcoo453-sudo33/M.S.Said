import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { HomeService } from '../../../services/home.service';
import { LucideAngularModule, Sun, Moon, Menu, X } from 'lucide-angular';
import { BioEntry } from '../../../models';
import { environment } from '../../../../environments/environment';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher';
import { NotificationDropdownComponent } from '../notification-dropdown/notification-dropdown';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule, LanguageSwitcherComponent, NotificationDropdownComponent, TranslateModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent implements OnInit {
  public auth = inject(AuthService);
  public theme = inject(ThemeService);
  private readonly homeService = inject(HomeService);

  bio: BioEntry | null = null;

  ngOnInit() {
    this.homeService.getBio().subscribe({
      next: (bio: BioEntry | null) => this.bio = bio,
      error: (err: any) => {
        console.error('Navbar: Failed to load bio', err);
        // Set default bio to prevent UI breaking
        this.bio = null;
      }
    });
  }

  SunIcon = Sun;
  MoonIcon = Moon;
  MenuIcon = Menu;
  XIcon = X;

  mobileMenuOpen = false;

  toggleMobile() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  getAvatarUrl() {
    const avatar = this.bio?.avatarUrl;
    if (!avatar) return null;
    if (avatar.startsWith('http')) return avatar;
    const baseUrl = (environment as any).apiBaseUrl || environment.apiUrl.replace('/api', '');
    return `${baseUrl}${avatar}`;
  }
}
