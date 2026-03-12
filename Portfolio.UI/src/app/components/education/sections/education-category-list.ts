import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Meta, Title } from '@angular/platform-browser';
import { EducationService } from '../../../services/education.service';
import { TranslationService } from '../../../services/translation.service';
import { EducationEntry } from '../../../models';
import { LucideAngularModule } from 'lucide-angular';

// Components
import { NavbarComponent } from '../../shared/navbar/navbar';
import { SharedPageHeaderComponent } from '../../shared/page-header/page-header';
import { SharedFooterComponent } from '../../shared/footer/footer';
import { SharedErrorStateComponent } from '../../shared/error-state/error-state';

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
})
export class EducationCategoryListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  public location = inject(Location);
  private readonly educationService = inject(EducationService);
  public translationService = inject(TranslationService);
  private readonly translate = inject(TranslateService);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

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
      item.degree?.toLowerCase().includes(query) ||
      item.institution?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
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
    this.updateSeoTags(category);
  }

  private updateSeoTags(category: string) {
    const isAr = this.translationService.isRTL();
    const seoData = this.getSeoData(category, isAr);

    this.titleService.setTitle(seoData.title);
    this.metaService.updateTag({ name: 'description', content: seoData.description });

    // OpenGraph
    this.metaService.updateTag({ property: 'og:title', content: seoData.title });
    this.metaService.updateTag({ property: 'og:description', content: seoData.description });
    this.metaService.updateTag({ property: 'og:url', content: globalThis.location.href });

    // Canonical
    this.setCanonicalLink();
  }

  private getSeoData(category: string, isAr: boolean): { title: string; description: string } {
    const seoMap: Record<string, { ar: { title: string; description: string }; en: { title: string; description: string } }> = {
      training: {
        ar: { title: 'التدريب التقني والورش | Mostafa.Dev', description: 'قائمة كاملة بالتدريبات التقنية والورش العمل التي حضرها مصطفى صادق.' },
        en: { title: 'Technical Training & Workshops | Mostafa.Dev', description: 'A complete list of technical trainings and workshops attended by Mostafa Said.' }
      },
      certification: {
        ar: { title: 'الشهادات والاعتمادات | Mostafa.Dev', description: 'الشهادات المهنية والاعتمادات التقنية في مختلف تقنيات هندسة البرمجيات.' },
        en: { title: 'Certifications & Credentials | Mostafa.Dev', description: 'Professional certifications and technical credentials in various software engineering technologies.' }
      },
      achievement: {
        ar: { title: 'الإنجازات والجوائز | Mostafa.Dev', description: 'تكريمات وإنجازات مصطفى صادق خلال مسيرته المهنية والأكاديمية.' },
        en: { title: 'Achievements & Awards | Mostafa.Dev', description: 'Honors and achievements of Mostafa Said during his professional and academic career.' }
      },
      education: {
        ar: { title: 'المسيرة الأكاديمية | Mostafa.Dev', description: 'استكشف الخلفية التعليمية والدرجات العلمية لمصطفى صادق.' },
        en: { title: 'Academic Journey | Mostafa.Dev', description: 'Explore the educational background and academic degrees of Mostafa Said.' }
      }
    };

    const data = seoMap[category] || seoMap['education'];
    const lang = isAr ? 'ar' : 'en';
    return data[lang];
  }

  private setCanonicalLink(): void {
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', globalThis.location.href);
  }

  loadEducation(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.educationService.getEducation().subscribe({
      next: (educationData: EducationEntry[]) => {
        this.allEducation.set(educationData);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading education list:', err);
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
