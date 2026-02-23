import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { ExperienceEntry, BioEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { LucideAngularModule } from 'lucide-angular';

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
  experiences: ExperienceEntry[] = [];
  bio: BioEntry | null = null;
  isLoading = true;
  hasError = false;

  ngOnInit() {
    this.profileService.getBio().subscribe({
      next: (bio) => this.bio = bio,
      error: (err) => console.error('Timeline: Failed to load bio', err)
    });
    this.profileService.getExperiences().subscribe({
      next: (data) => {
        this.experiences = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }
}
