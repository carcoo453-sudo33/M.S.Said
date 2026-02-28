import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../services/profile.service';
import { TranslationService } from '../../services/translation.service';
import { BioEntry, EducationEntry } from '../../models';

// Components
import { NavbarComponent } from '../shared/navbar/navbar';
import { SharedPageHeaderComponent } from '../shared/page-header/page-header';
import { EducationTimelineComponent } from '../education/sections/education-timeline';
import { SharedFooterComponent } from '../shared/footer/footer';
import { SharedErrorStateComponent } from '../shared/error-state/error-state';

@Component({
  selector: 'app-education-category-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    NavbarComponent,
    SharedPageHeaderComponent,
    EducationTimelineComponent,
    SharedFooterComponent,
    SharedErrorStateComponent
  ],
  templateUrl: './education-category-list.html',
  styleUrl: './education-category-list.css',
})
export class EducationCategoryList implements OnInit {
  private route = inject(ActivatedRoute);
  public location = inject(Location);
  private profileService = inject(ProfileService);
  public translationService = inject(TranslationService);

  categoryType = signal<string>('');
  bio = signal<BioEntry | null>(null);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);

  categoryTitle = signal<string>('');
  categoryDescription = signal<string>('');
  filteredEducation = computed(() => {
    const data = this.bio();
    const cat = this.categoryType();
    if (!data || !cat) return [];

    switch (cat) {
      case 'training': return data['education']?.filter((e: EducationEntry) => e.category === 'Training') || [];
      case 'certification': return data['education']?.filter((e: EducationEntry) => e.category === 'Certification') || [];
      case 'achievement': return data['education']?.filter((e: EducationEntry) => e.category === 'Achievement') || [];
      case 'education': return data['education']?.filter((e: EducationEntry) => e.category === 'Education') || [];
      default: return [];
    }
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const categoryParam = params.get('category')?.toLowerCase() || 'training';
      this.categoryType.set(categoryParam);
      this.setCategoryMetadata(categoryParam);
      this.loadBioProfile();
    });
  }

  private setCategoryMetadata(category: string) {
    switch (category) {
      case 'training':
        this.categoryTitle.set('education.trainingTitle');
        this.categoryDescription.set('education.trainingDesc');
        break;
      case 'certification':
        this.categoryTitle.set('education.certificationTitle');
        this.categoryDescription.set('education.certificationDesc');
        break;
      case 'achievement':
        this.categoryTitle.set('education.achievementTitle');
        this.categoryDescription.set('education.achievementDesc');
        break;
      case 'education':
      default:
        this.categoryTitle.set('education.educationTitle');
        this.categoryDescription.set('education.educationDesc');
        break;
    }
  }

  loadBioProfile(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.profileService.getBio().subscribe({
      next: (profile: BioEntry | null) => {
        this.bio.set(profile);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading bio profile:', error);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  onEducationUpdated(updatedEducation: EducationEntry[]) {
    if (!this.bio()) return;
    const currentBio = this.bio()!;

    // Merge the category updates back into the master timeline
    const filteredOut = currentBio['education']?.filter((e: EducationEntry) => e.category !== this.filteredEducation()[0]?.category) || [];
    this.bio.set({
      ...currentBio,
      ['education']: [...filteredOut, ...updatedEducation]
    });
  }
}
