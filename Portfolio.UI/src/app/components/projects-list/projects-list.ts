import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Search, SlidersHorizontal, Grid3x3, List, ChevronLeft, ChevronRight, Eye, Star, Rocket, Clock, Image, Plus } from 'lucide-angular';
import { ProjectsListService } from '../../services/projects-list.service';
import { ProjectEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { SharedFooterComponent } from '../shared/footer/footer';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { TranslationUtil, ImageUtil, ProjectUtil } from '../../utils';

// Centralized CRUD
import { ProjectCrudModalComponent } from '../shared/project-crud/project-crud-modal';
import { ProjectDeleteModalComponent } from '../shared/project-crud/components/project-delete-modal';
import { ProjectCardComponent } from '../shared/project-card/project-card';
import { ProjectCrudService } from '../shared/project-crud/project-crud.service';

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
    SharedFooterComponent,
    ProjectCrudModalComponent,
    ProjectDeleteModalComponent,
    ProjectCardComponent
  ],
  templateUrl: './projects-list.html'
})
export class ProjectsListComponent implements OnInit {
  private projectsListService = inject(ProjectsListService);
  private crudService = inject(ProjectCrudService);
  public translationService = inject(TranslationService);
  private route = inject(ActivatedRoute);
  public auth = inject(AuthService);
  private titleService = inject(Title);
  private meta = inject(Meta);

  // Create project modal state
  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  editingProject = signal<ProjectEntry | null>(null);
  deletingProject = signal<ProjectEntry | null>(null);

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
  PlusIcon = Plus;

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
    const highlights = ProjectUtil.getProjectHighlights(projects);
    if (highlights.length === 0) return [];

    const result = [];
    if (highlights[0]) result.push({ type: 'most-visited', project: highlights[0], icon: this.EyeIcon, color: 'from-blue-600 to-cyan-500', shadow: 'shadow-blue-500/20', labelKey: 'projects.highlights.mostVisited' });
    if (highlights[1]) result.push({ type: 'featured', project: highlights[1], icon: this.StarIcon, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20', labelKey: 'projects.highlights.featured' });
    if (highlights[2]) result.push({ type: 'last-publish', project: highlights[2], icon: this.RocketIcon, color: 'from-red-600 to-pink-500', shadow: 'shadow-red-500/20', labelKey: 'projects.highlights.latest' });

    return result;
  });

  availableTags = computed(() => {
    const tags = new Set<string>();
    this.allProjects().forEach(project => {
      if (project.tags) {
        project.tags.split(',').forEach(tag => tags.add(tag.trim()));
      }
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  });

  availableCompanies = computed(() => {
    const companies = new Set<string>();
    this.allProjects().forEach(project => {
      if (project.company) {
        companies.add(project.company.trim());
      }
    });
    return Array.from(companies).sort((a, b) => a.localeCompare(b));
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
    this.updateSeoTags();
    this.loadData();

    // Auto-open create modal if navigated with ?create=true
    this.route.queryParams.subscribe(params => {
      if (params['create'] === 'true') {
        setTimeout(() => this.showCreateModal.set(true), 500);
      }
    });
  }

  loadData() {
    this.projectsListService.getProjects().subscribe({
      next: (response: any) => {
        this.allProjects.set(response.items || response);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load projects:', err);
        this.isLoading.set(false);
      }
    });

    this.projectsListService.getCategories().subscribe({
      next: (cats: any) => this.categories.set(cats),
      error: (err: any) => console.error('Failed to load categories:', err)
    });

    this.projectsListService.getNiches().subscribe({
      next: (niches: any) => this.niches.set(niches),
      error: (err: any) => console.error('Failed to load niches:', err)
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

  // Helper methods for template to use TranslationUtil
  getTitle(project: ProjectEntry): string {
    const currentLang = this.translationService.currentLang$();
    return TranslationUtil.getTranslatedField(project, 'title', currentLang);
  }

  getDescription(project: ProjectEntry): string {
    const currentLang = this.translationService.currentLang$();
    return TranslationUtil.getTranslatedField(project, 'description', currentLang);
  }

  getCategory(project: ProjectEntry): string {
    const currentLang = this.translationService.currentLang$();
    return TranslationUtil.getTranslatedField(project, 'category', currentLang);
  }

  getNiche(project: ProjectEntry): string {
    const currentLang = this.translationService.currentLang$();
    return TranslationUtil.getTranslatedField(project, 'niche', currentLang);
  }

  getCompany(project: ProjectEntry): string {
    const currentLang = this.translationService.currentLang$();
    return TranslationUtil.getTranslatedField(project, 'company', currentLang);
  }

  isFeatured(project: ProjectEntry): boolean {
    return !!project.isFeatured;
  }

  getFullImageUrl(url: string): string {
    return ImageUtil.getFullImageUrl(url);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  // Centralized CRUD methods
  onCreateProject() {
    this.showCreateModal.set(true);
  }

  onProjectSaved(project: ProjectEntry) {
    // Add to projects list if it's a new project, or update existing
    const existingIndex = this.allProjects().findIndex(p => p.id === project.id);
    if (existingIndex === -1) {
      this.allProjects.set([...this.allProjects(), project]);
    } else {
      const updated = [...this.allProjects()];
      updated[existingIndex] = project;
      this.allProjects.set(updated);
    }
    this.showCreateModal.set(false);
    this.showEditModal.set(false);
    this.editingProject.set(null);
  }

  onModalClosed() {
    this.showCreateModal.set(false);
    this.showEditModal.set(false);
    this.showDeleteModal.set(false);
    this.editingProject.set(null);
    this.deletingProject.set(null);
  }

  // Project card actions
  onEditProject(project: ProjectEntry) {
    this.editingProject.set(project);
    this.showEditModal.set(true);
  }

  onDeleteProject(project: ProjectEntry) {
    this.deletingProject.set(project);
    this.showDeleteModal.set(true);
  }

  onProjectDeleted(project: ProjectEntry) {
    // Remove from local state
    const updatedProjects = this.allProjects().filter(p => p.id !== project.id);
    this.allProjects.set(updatedProjects);
    this.showDeleteModal.set(false);
    this.deletingProject.set(null);
  }

  private updateSeoTags() {
    const isAr = this.translationService.isRTL();
    const title = isAr ? 'كل المشاريع | معرض الأعمال الكامل | Dev.M.Said' : 'All Projects | Complete Portfolio | Dev.M.Said';
    const description = isAr 
        ? 'استكشف معرض الأعمال الكامل للمهندس مصطفى سعيد. مشاريع في هندسة البرمجيات، تطوير المواقع، والحلول التقنية المبتكرة.' 
        : 'Explore the complete portfolio of Eng. Mostafa Said. Projects in software engineering, web development, and innovative technical solutions.';

    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    // Canonical link
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.href);
  }
}
