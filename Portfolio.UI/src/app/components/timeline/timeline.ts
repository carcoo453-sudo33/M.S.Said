import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../services/profile.service';
import { ExperienceEntry, BioEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { LucideAngularModule } from 'lucide-angular';
import { TranslationService } from '../../services/translation.service';

// Section Components
import { TimelineListComponent } from './sections/timeline-list';

// Shared Global Components
import { SharedPageHeaderComponent } from '../shared/page-header/page-header';
import { SharedFooterComponent } from '../shared/footer/footer';
import { SharedErrorStateComponent } from '../shared/error-state/error-state';
import { SharedEmptyStateComponent } from '../shared/empty-state/empty-state';
import { SharedSkeletonComponent } from '../shared/skeleton/skeleton';
import { SharedSignatureComponent } from '../shared/signature/signature';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NavbarComponent,
    LucideAngularModule,
    TimelineListComponent,
    SharedPageHeaderComponent,
    SharedFooterComponent,
    SharedErrorStateComponent,
    SharedEmptyStateComponent,
    SharedSkeletonComponent,
    SharedSignatureComponent
  ],
  templateUrl: './timeline.html'
})
export class TimelineComponent implements OnInit {
  private profileService = inject(ProfileService);
  public translationService = inject(TranslationService);
  experiences = signal<ExperienceEntry[]>([]);
  bio = signal<BioEntry | null>(null);
  isLoading = signal(true);
  hasError = signal(false);

  ngOnInit() {
    this.profileService.getBio().subscribe({
      next: (bio) => this.bio.set(bio),
      error: (err) => console.error('Timeline: Failed to load bio', err)
    });
    this.profileService.getExperiences().subscribe({
      next: (data) => {
        this.experiences.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }
}
