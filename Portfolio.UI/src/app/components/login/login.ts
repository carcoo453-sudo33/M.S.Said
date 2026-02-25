import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  showPassword = false;

  EyeIcon = Eye;
  EyeOffIcon = EyeOff;

  onLogin() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.errorMessage = 'Invalid email or password'
    });
  }
}
