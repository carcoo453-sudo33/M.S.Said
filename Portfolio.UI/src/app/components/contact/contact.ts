import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { ContactMessage } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';
import { LucideAngularModule, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-angular';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, LucideAngularModule],
  templateUrl: './contact.html'
})
export class ContactComponent {
  private portfolio = inject(PortfolioService);
  model: ContactMessage = { name: '', email: '', subject: '', message: '' };
  loading = false;
  success = false;
  error = false;

  MailIcon = Mail;
  PhoneIcon = Phone;
  MapPinIcon = MapPin;
  GithubIcon = Github;
  LinkedInIcon = Linkedin;
  TwitterIcon = Twitter;

  submitMessage() {
    this.loading = true;
    this.error = false;
    this.portfolio.sendContactMessage(this.model).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.model = { name: '', email: '', subject: '', message: '' };
        setTimeout(() => this.success = false, 5000);
      },
      error: () => {
        this.loading = false;
        this.error = true;
        setTimeout(() => this.error = false, 5000);
      }
    });
  }
}
