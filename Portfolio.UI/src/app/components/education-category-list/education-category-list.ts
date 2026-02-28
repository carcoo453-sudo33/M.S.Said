import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../services/profile.service';
import { TranslationService } from '../../services/translation.service';
import { BioEntry, EducationEntry } from '../../models';
import { LucideAngularModule } from 'lucide-angular';

// Components
import { NavbarComponent } from '../shared/navbar/navbar';
import { SharedPageHeaderComponent } from '../shared/page-header/page-header';
import { SharedFooterComponent } from '../shared/footer/footer';
import { SharedErrorStateComponent } from '../shared/error-state/error-state';

@Component({
  selector: 'app-education-category-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NavbarComponent,
    SharedPageHeaderComponent,
    SharedFooterComponent,
    SharedErrorStateComponent,
    FormsModule,
    LucideAngularModule
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
  allEducation = signal<EducationEntry[]>([]);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);

  categoryTitle = signal<string>('');
  categoryDescription = signal<string>('');

  // Search and Pagination State
  searchQuery = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = signal<number>(5);

  // 1. Raw filtering by Category
  categoryFilteredItems = computed(() => {
    const data = this.allEducation();
    const cat = this.categoryType();
    if (!data || !cat) return [];

    switch (cat) {
      case 'training': return data.filter((e: EducationEntry) => e.category === 'Training');
      case 'certification': return data.filter((e: EducationEntry) => e.category === 'Certification');
      case 'achievement': return data.filter((e: EducationEntry) => e.category === 'Achievement');
      case 'education': return data.filter((e: EducationEntry) => e.category === 'Education');
      default: return [];
    }
  });

  // 2. Search applied on top of category list
  searchedItems = computed(() => {
    const items = this.categoryFilteredItems();
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return items;

    return items.filter(item =>
      item.degree.toLowerCase().includes(query) ||
      item.institution.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  });

  // 3. Final array passed to template for rendering (Paginated)
  filteredEducation = computed(() => {
    const items = this.searchedItems();
    const page = this.currentPage();
    const size = this.pageSize();

    const startIndex = (page - 1) * size;
    return items.slice(startIndex, startIndex + size);
  });

  // Pagination Helpers
  totalPages = computed(() => Math.max(1, Math.ceil(this.searchedItems().length / this.pageSize())));

  hasPreviousPage = computed(() => this.currentPage() > 1);
  hasNextPage = computed(() => this.currentPage() < this.totalPages());

  nextPage() {
    if (this.hasNextPage()) this.currentPage.update(p => p + 1);
  }

  previousPage() {
    if (this.hasPreviousPage()) this.currentPage.update(p => p - 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1); // Reset to page 1 when searching
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const categoryParam = params.get('category')?.toLowerCase() || 'training';
      this.categoryType.set(categoryParam);
      this.setCategoryMetadata(categoryParam);
      this.loadEducation();
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

  loadEducation(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.profileService.getEducation().subscribe({
      next: (educationData: EducationEntry[]) => {
        this.allEducation.set(educationData);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading education list:', error);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  onEducationUpdated(updatedEducation: EducationEntry[]) {
    // Re-load the list from the server completely
    this.loadEducation();
  }
}
