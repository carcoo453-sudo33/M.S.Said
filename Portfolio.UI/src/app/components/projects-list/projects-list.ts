import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Search, SlidersHorizontal, Grid3x3, List, ChevronLeft, ChevronRight, Eye, Star, Rocket, Clock, Image } from 'lucide-angular';
import { ProjectService } from '../../services/project.service';
import { ProjectEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { SharedFooterComponent } from '../shared/footer/footer';
import { TranslationService } from '../../services/translation.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    LucideAngularModule,
    NavbarComponent,
    SharedFooterComponent
  ],
  templateUrl: './projects-list.html'
})
export class ProjectsListComponent implements OnInit {
  private projectService = inject(ProjectService);
  public translationService = inject(TranslationService);
  private route = inject(ActivatedRoute);

  // Create project trigger (mirrors projects-grid interface)
  triggerCreateProject = signal(false);

  // Icons
  SearchIcon = Search;
  FilterIcon = SlidersHorizontal;
  GridIcon = Grid3x3;
  ListIcon = List;
  ChevronLeftIcon = ChevronLeft;
  ChevronRightIcon = ChevronRight;
  EyeIcon = Eye;
  StarIcon = Star;
  RocketIcon = Rocket;
  ClockIcon = Clock;
  ImageIcon = Image;

  // Math for template
  Math = Math;

  // Data
  allProjects = signal<ProjectEntry[]>([]);
  categories = signal<any[]>([]);
  niches = signal<any[]>([]);

  // UI State
  isLoading = signal(true);
  viewMode = signal<'grid' | 'list'>('grid');
  openDropdown = signal<string | null>(null);

  // Filters
  searchQuery = signal('');
  selectedCategory = signal('');
  selectedNiche = signal('');
  selectedCompany = signal('');
  selectedTag = signal('');
  sortBy = signal('newest');

  // Pagination
  currentPage = signal(1);
  itemsPerPage = 6;

  // Computed
  highlightedProjects = computed(() => {
    const projects = this.allProjects();
    if (!projects || projects.length === 0) return [];

    let mostVisited: ProjectEntry | null = null;
    let featured: ProjectEntry | null = null;
    let lastPublish: ProjectEntry | null = null;

    // Sort projects by views descending
    const byViews = [...projects].sort((a, b) => (b.views || 0) - (a.views || 0));
    mostVisited = byViews[0] || null;

    // Sort projects by featured, preferring highest views or newest, excluding mostVisited
    const featuredProjects = [...projects].filter(p => !!(p as any).isFeatured && p.id !== mostVisited?.id);
    if (featuredProjects.length > 0) {
      featured = featuredProjects.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
    } else {
      // Fallback if no featured
      featured = byViews.find(p => p.id !== mostVisited?.id) || null;
    }

    // Sort projects by latest, excluding mostVisited and featured
    const byLatest = [...projects]
      .filter(p => p.id !== mostVisited?.id && p.id !== featured?.id)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    lastPublish = byLatest[0] || null;

    const highlights = [
      { type: 'most-visited', label: 'Highest Visits', project: mostVisited, icon: this.EyeIcon, color: 'from-blue-600 to-cyan-500', shadow: 'shadow-blue-500/20', labelKey: 'projects.highlights.mostVisited' },
      { type: 'featured', label: 'Featured ✨', project: featured, icon: this.StarIcon, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20', labelKey: 'projects.highlights.featured' },
      { type: 'last-publish', label: 'Latest Release', project: lastPublish, icon: this.RocketIcon, color: 'from-red-600 to-pink-500', shadow: 'shadow-red-500/20', labelKey: 'projects.highlights.latest' }
    ];

    return highlights.filter(h => h.project != null) as any[];
  });

  availableTags = computed(() => {
    const tags = new Set<string>();
    this.allProjects().forEach(project => {
      if (project.tags) {
        project.tags.split(',').forEach(tag => tags.add(tag.trim()));
      }
    });
    return Array.from(tags).sort();
  });

  availableCompanies = computed(() => {
    const companies = new Set<string>();
    this.allProjects().forEach(project => {
      if (project.company) {
        companies.add(project.company.trim());
      }
    });
    return Array.from(companies).sort();
  });

  filteredProjects = computed(() => {
    let projects = [...this.allProjects()];

    // Search filter
    const query = this.searchQuery().toLowerCase();
    if (query) {
      projects = projects.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        (p as any).titleAr?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        (p as any).descriptionAr?.toLowerCase().includes(query) ||
        p.tags?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (this.selectedCategory()) {
      projects = projects.filter(p => p.category === this.selectedCategory());
    }

    // Niche filter
    if (this.selectedNiche()) {
      projects = projects.filter(p => p.niche === this.selectedNiche());
    }

    // Company filter
    if (this.selectedCompany()) {
      projects = projects.filter(p => p.company === this.selectedCompany());
    }

    // Tag filter
    if (this.selectedTag()) {
      projects = projects.filter(p =>
        p.tags?.split(',').map(t => t.trim()).includes(this.selectedTag())
      );
    }

    // Sort
    switch (this.sortBy()) {
      case 'newest':
        projects.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'oldest':
        projects.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        break;
      case 'views':
        projects.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'az':
        projects.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'za':
        projects.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
    }

    return projects;
  });

  paginatedProjects = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProjects().slice(start, end);
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredProjects().length / this.itemsPerPage)
  );

  ngOnInit() {
    this.loadData();

    // Auto-open create modal if navigated with ?create=true
    this.route.queryParams.subscribe(params => {
      if (params['create'] === 'true') {
        setTimeout(() => this.triggerCreateProject.set(!this.triggerCreateProject()), 500);
      }
    });
  }

  loadData() {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.allProjects.set(projects);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load projects:', err);
        this.isLoading.set(false);
      }
    });

    this.projectService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: (err) => console.error('Failed to load categories:', err)
    });

    this.projectService.getNiches().subscribe({
      next: (niches) => this.niches.set(niches),
      error: (err) => console.error('Failed to load niches:', err)
    });
  }

  onSearchChange(value: string) {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  toggleDropdown(dropdown: string) {
    this.openDropdown.set(this.openDropdown() === dropdown ? null : dropdown);
  }

  onDropdownBlur(dropdown: string) {
    setTimeout(() => {
      if (this.openDropdown() === dropdown) {
        this.openDropdown.set(null);
      }
    }, 200);
  }

  onCategoryChange(value: string) {
    this.selectedCategory.set(value);
    this.currentPage.set(1);
    this.openDropdown.set(null);
  }

  onNicheChange(value: string) {
    this.selectedNiche.set(value);
    this.currentPage.set(1);
    this.openDropdown.set(null);
  }

  onCompanyChange(value: string) {
    this.selectedCompany.set(value);
    this.currentPage.set(1);
    this.openDropdown.set(null);
  }

  onTagChange(value: string) {
    this.selectedTag.set(value);
    this.currentPage.set(1);
    this.openDropdown.set(null);
  }

  onSortChange(value: string) {
    this.sortBy.set(value);
    this.openDropdown.set(null);
  }

  getSortLabel(): string {
    const labels: Record<string, string> = {
      'newest': 'Newest First',
      'oldest': 'Oldest First',
      'views': 'Most Viewed',
      'az': 'A-Z',
      'za': 'Z-A'
    };
    return labels[this.sortBy()] || 'Newest First';
  }

  toggleViewMode() {
    this.viewMode.set(this.viewMode() === 'grid' ? 'list' : 'grid');
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.selectedNiche.set('');
    this.selectedCompany.set('');
    this.selectedTag.set('');
    this.sortBy.set('newest');
    this.currentPage.set(1);
  }

  // Helper methods for template to access index signature properties
  getTitle(project: ProjectEntry): string {
    return this.translationService.isRTL() && (project as any).titleAr
      ? (project as any).titleAr
      : project.title || '';
  }

  getDescription(project: ProjectEntry): string {
    return this.translationService.isRTL() && (project as any).descriptionAr
      ? (project as any).descriptionAr
      : project.description || '';
  }

  getCategory(project: ProjectEntry): string {
    return this.translationService.isRTL() && (project as any).categoryAr
      ? (project as any).categoryAr
      : project.category || '';
  }

  getNiche(project: ProjectEntry): string {
    return this.translationService.isRTL() && (project as any).nicheAr
      ? (project as any).nicheAr
      : project.niche || '';
  }

  getCompany(project: ProjectEntry): string {
    return this.translationService.isRTL() && (project as any).companyAr
      ? (project as any).companyAr
      : project.company || '';
  }

  isFeatured(project: ProjectEntry): boolean {
    return !!(project as any).isFeatured;
  }

  getFullImageUrl(url: string): string {
    if (!url) return 'assets/project-placeholder.svg';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    const baseUrl = environment.apiUrl.replace('/api', '');
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`;
    }

    return `${baseUrl}/${url}`;
  }

  onImageError(event: any) {
    // Fallback to placeholder image when image fails to load
    event.target.src = 'assets/project-placeholder.svg';
  }
}
