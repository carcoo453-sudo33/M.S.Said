import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { LucideAngularModule, Sun, Moon, Menu, X } from 'lucide-angular';
import { ProfileService } from '../../../services/profile.service';
import { BioEntry } from '../../../models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent implements OnInit {
  public auth = inject(AuthService);
  public theme = inject(ThemeService);
  private profileService = inject(ProfileService);

  bio: BioEntry | null = null;

  ngOnInit() {
    this.profileService.getBio().subscribe({
      next: (bio) => this.bio = bio,
      error: (err) => {
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
