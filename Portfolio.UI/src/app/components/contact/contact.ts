import { Component, inject, signal, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContactService } from '../../services/contact.service';
import { ProfileService } from '../../services/profile.service';
import { ContactMessage, BioEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { LucideAngularModule, Github, Linkedin, Facebook, Twitter } from 'lucide-angular';
import { TranslationService } from '../../services/translation.service';

// Section Components
import { ContactInfoComponent } from './sections/contact-info';
import { ContactMapComponent } from './sections/contact-map';
import { ContactFormComponent } from './sections/contact-form';

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
  private contactService = inject(ContactService);
  private profileService = inject(ProfileService);
  public translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  
  model = signal<ContactMessage>({ name: '', email: '', subject: '', message: '' });
  loading = signal(false);
  success = signal(false);
  error = signal(false);
  bio = signal<BioEntry | null>(null);
  viewInitialized = signal(false);
  
  GithubIcon = Github;
  LinkedinIcon = Linkedin;
  FacebookIcon = Facebook;
  TwitterIcon = Twitter;

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
    this.profileService.getBio().subscribe({
      next: (data) => {
        this.bio.set(data);
      },
      error: (err) => {
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
