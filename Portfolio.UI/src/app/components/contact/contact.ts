import { Component, inject, signal, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContactService } from '../../services/contact.service';
import { HomeService } from '../../services/home.service';
import { ContactMessage, BioEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { LucideAngularModule } from 'lucide-angular';
import { TranslationService } from '../../services/translation.service';

// Section Components
import { ContactInfoComponent } from './sections/contact-info';
import { ContactMapComponent } from './sections/contact-map';
import { ContactFormComponent } from './sections/contact-form';
import { ContactSocialLinksComponent } from './sections/contact-social-links';

// Skeleton Components
import { ContactInfoSkeletonComponent } from './sections/contact-info-skeleton';
import { ContactMapSkeletonComponent } from './sections/contact-map-skeleton';
import { ContactFormSkeletonComponent } from './sections/contact-form-skeleton';

// Shared Global Components
import { SharedFooterComponent } from '../shared/footer/footer';
import { SharedPageHeaderComponent } from '../shared/page-header/page-header';
import { SharedSignatureComponent } from '../shared/signature/signature';

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
    ContactSocialLinksComponent,
    ContactInfoSkeletonComponent,
    ContactMapSkeletonComponent,
    ContactFormSkeletonComponent,
    SharedFooterComponent,
    SharedPageHeaderComponent,
    SharedSignatureComponent
  ],
  templateUrl: './contact.html'
})
export class ContactComponent implements OnInit, AfterViewInit {
  private readonly contactService = inject(ContactService);
  private readonly homeService = inject(HomeService);
  public readonly translationService = inject(TranslationService);
  private readonly cdr = inject(ChangeDetectorRef);
  
  model = signal<ContactMessage>({ name: '', email: '', phone: '', subject: '', message: '' });
  loading = signal(false);
  success = signal(false);
  error = signal(false);
  bio = signal<BioEntry | null>(null);
  viewInitialized = signal(false);

  ngOnInit() {
    this.loadBio();
  }

  ngAfterViewInit() {
    // Ensure view is fully initialized before showing content
    setTimeout(() => {
      this.viewInitialized.set(true);
      this.cdr.detectChanges();
    }, 100);
  }

  loadBio() {
    this.homeService.getBio().subscribe({
      next: (data) => {
        this.bio.set(data);
      },
      error: (err: any) => {
        console.error('Failed to load bio:', err);
      }
    });
  }

  submitMessage() {
    this.loading.set(true);
    this.error.set(false);
    this.contactService.sendContactMessage(this.model()).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        this.model.set({ name: '', email: '', phone: '', subject: '', message: '' });
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
