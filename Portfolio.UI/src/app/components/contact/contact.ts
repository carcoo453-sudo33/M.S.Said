import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContactService } from '../../services/contact.service';
import { ContactMessage } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { LucideAngularModule } from 'lucide-angular';
import { TranslationService } from '../../services/translation.service';

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
    TranslateModule,
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
  public translationService = inject(TranslationService);
  model = signal<ContactMessage>({ name: '', email: '', subject: '', message: '' });
  loading = signal(false);
  success = signal(false);
  error = signal(false);

  submitMessage() {
    this.loading.set(true);
    this.error.set(false);
    this.contactService.sendContactMessage(this.model()).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        this.model.set({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => this.success.set(false), 5000);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
        setTimeout(() => this.error.set(false), 5000);
      }
    });
  }
}
