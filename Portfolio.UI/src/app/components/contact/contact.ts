import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { ContactMessage } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { LucideAngularModule } from 'lucide-angular';

// Section Components
import { ContactInfoComponent } from './sections/contact-info';
import { ContactMapComponent } from './sections/contact-map';
import { ContactFormComponent } from './sections/contact-form';

// Shared Global Components
import { SharedFooterComponent } from '../shared/footer/footer';
import { SharedPageHeaderComponent } from '../shared/page-header/page-header';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    LucideAngularModule,
    ContactInfoComponent,
    ContactMapComponent,
    ContactFormComponent,
    SharedFooterComponent,
    SharedPageHeaderComponent
  ],
  templateUrl: './contact.html'
})
export class ContactComponent {
  private contactService = inject(ContactService);
  model: ContactMessage = { name: '', email: '', subject: '', message: '' };
  loading = false;
  success = false;
  error = false;

  submitMessage() {
    this.loading = true;
    this.error = false;
    this.contactService.sendContactMessage(this.model).subscribe({
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
