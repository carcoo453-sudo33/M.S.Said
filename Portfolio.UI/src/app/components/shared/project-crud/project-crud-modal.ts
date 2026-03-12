import { Component, Input, Output, EventEmitter, inject, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, X, Save, Loader } from 'lucide-angular';
import { ProjectEntry, Responsibility } from '../../../models';
import { ProjectCrudService, ProjectFormData } from './project-crud.service';
import { ProjectService } from '../../../services/project.service';
import { ProjectsListService } from '../../../services/projects-list.service';
import { AuthService } from '../../../services/auth.service';

// Import all the existing form components
import {
  ProjectFormBasicComponent,
  ProjectFormCategoriesComponent,
  ProjectFormTagsComponent,
  ProjectFormImagesComponent,
  ProjectFormFeaturesComponent,
  ProjectFormResponsibilitiesComponent,
  ProjectFormChangelogComponent
} from './forms';

// Import manager components
import {
  ProjectImportManagerComponent,
  ProjectSuggestionManagerComponent
} from './managers';

@Component({
  selector: 'app-project-crud-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    LucideAngularModule,
    ProjectFormBasicComponent,
    ProjectFormCategoriesComponent,
    ProjectFormTagsComponent,
    ProjectFormImagesComponent,
    ProjectFormFeaturesComponent,
    ProjectFormResponsibilitiesComponent,
    ProjectFormChangelogComponent,
    ProjectImportManagerComponent,
    ProjectSuggestionManagerComponent
  ],
  template: `
    <!-- Main Modal -->
    <div *ngIf="isOpen()" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" (click)="close()">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-2/3 max-h-[90vh] flex flex-col mt-20" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">
            {{ isCreating ? ('projects.create.title' | translate) : ('projects.edit.title' | translate) }}
          </h2>
          <button 
            (click)="close()" 
            class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            [disabled]="isSaving()">
            <lucide-icon [img]="XIcon" class="w-5 h-5 text-zinc-500"></lucide-icon>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8">
          
          <!-- Import Section (only for creation) -->
          <app-project-import-manager *ngIf="isCreating"
            [(editingProject)]="formData"
            [(isImporting)]="isImporting"
            [(importUrl)]="importUrl"
            (responsibilitiesImported)="onResponsibilitiesImported($event)"
            (keyFeaturesImported)="onKeyFeaturesImported($event)"
            (changelogImported)="onChangelogImported($event)">
          </app-project-import-manager>

          <!-- Basic Information -->
          <app-project-form-basic 
            [project]="formData"
            [submitted]="submitted()">
          </app-project-form-basic>

          <!-- Categories -->
          <app-project-form-categories 
            [project]="formData"
            [categories]="getCategorySuggestions()"
            [categoryArSuggestions]="getCategoryArSuggestions()"
            [nicheSuggestions]="getNicheSuggestions()"
            [nicheArSuggestions]="getNicheArSuggestions()"
            (manageCategoriesClick)="onManageCategoriesClick()"
            (manageNichesClick)="onManageNichesClick()">
          </app-project-form-categories>

          <!-- Tags -->
          <app-project-form-tags 
            [(selectedTags)]="selectedTags"
            [techSuggestions]="getTagSuggestions()">
          </app-project-form-tags>

          <!-- Images -->
          <app-project-form-images 
            [imageUrl]="formData.imageUrl"
            [(galleryImages)]="galleryImages">
          </app-project-form-images>

          <!-- Key Features -->
          <app-project-form-features 
            [(keyFeatures)]="keyFeatures">
          </app-project-form-features>

          <!-- Responsibilities -->
          <app-project-form-responsibilities 
            [(responsibilities)]="responsibilities">
          </app-project-form-responsibilities>

          <!-- Changelog -->
          <app-project-form-changelog 
            [(changelog)]="changelog">
          </app-project-form-changelog>

        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-4 p-6 border-t border-zinc-200 dark:border-zinc-800">
          <button 
            (click)="close()" 
            class="px-6 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            [disabled]="isSaving()">
            Cancel
          </button>
          <button 
            (click)="save()" 
            [disabled]="isSaving() || !isFormValid()"
            class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
            <lucide-icon [img]="isSaving() ? LoaderIcon : SaveIcon" class="w-4 h-4" [class.animate-spin]="isSaving()"></lucide-icon>
            {{ isSaving() ? 'Saving...' : (isCreating ? 'Create Project' : 'Save Changes') }}
          </button>
        </div>

      </div>
    </div>

    <!-- Suggestion Management Overlay Modal (Unified) -->
    <div *ngIf="showSuggestionManager()" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" (click)="onSuggestionManagerClosed()">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-zinc-900 dark:text-white">Manage {{ suggestionTitle() }}</h2>
          <button 
            (click)="onSuggestionManagerClosed()"
            class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <lucide-icon [img]="XIcon" class="w-5 h-5 text-zinc-500"></lucide-icon>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <app-project-suggestion-manager 
            [title]="suggestionTitle()"
            [type]="suggestionType()"
            [items]="suggestionType() === 'category' ? managedCategories : managedNiches"
            (updated)="onSuggestionsUpdated()">
          </app-project-suggestion-manager>
        </div>

      </div>
    </div>
  `
})
export class ProjectCrudModalComponent implements OnChanges {
  private crudService = inject(ProjectCrudService);
  private projectService = inject(ProjectService);
  private projectsListService = inject(ProjectsListService);
  public auth = inject(AuthService);

  @Input() project?: ProjectEntry | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() open = false;

  @Output() projectSaved = new EventEmitter<ProjectEntry>();
  @Output() modalClosed = new EventEmitter<void>();

  // Icons
  XIcon = X;
  SaveIcon = Save;
  LoaderIcon = Loader;

  // State
  isOpen = signal(false);
  isSaving = signal(false);
  submitted = signal(false);
  isImporting = false;
  importUrl = '';
  showSuggestionManager = signal(false);
  suggestionTitle = signal('');
  suggestionType = signal<'category' | 'niche'>('category');

  // Form data
  formData: ProjectFormData = this.crudService.createEmptyFormData();
  selectedTags: string[] = [];
  galleryImages: string[] = [];
  keyFeatures: any[] = [];
  responsibilities: Responsibility[] = [];
  changelog: any[] = [];
  managedCategories: any[] = [];
  managedNiches: any[] = [];
  tagSuggestions: string[] = [];

  get isCreating(): boolean {
    return this.mode === 'create';
  }

  ngOnChanges() {
    this.isOpen.set(this.open);

    if (this.open) {
      this.initializeForm();
      this.loadCategoriesAndNiches();
      this.loadTagSuggestions();
    }
  }

  private initializeForm() {
    if (this.project && this.mode === 'edit') {
      // Edit mode - populate with existing data
      this.formData = this.crudService.projectToFormData(this.project);
      this.selectedTags = this.project.tags ? this.project.tags.split(',').map(t => t.trim()).filter(t => t) : [];
      this.galleryImages = this.project.gallery ? [...this.project.gallery] : [];
      this.keyFeatures = this.project.keyFeatures ? JSON.parse(JSON.stringify(this.project.keyFeatures)) : [];
      this.responsibilities = this.project.responsibilities ? [...this.project.responsibilities] : [];
      this.changelog = this.project.changelog ? JSON.parse(JSON.stringify(this.project.changelog)) : [];
    } else {
      // Create mode - empty form
      this.formData = this.crudService.createEmptyFormData();
      this.selectedTags = [];
      this.galleryImages = [];
      this.keyFeatures = [];
      this.responsibilities = [];
      this.changelog = [];
    }

    this.submitted.set(false);
    this.importUrl = '';
  }

  private loadCategoriesAndNiches() {
    // Load categories
    this.projectsListService.getCategories().subscribe({
      next: (categories) => {
        this.managedCategories = categories;
        console.log('Categories loaded:', categories);
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.managedCategories = [];
      }
    });

    // Load niches
    this.projectsListService.getNiches().subscribe({
      next: (niches) => {
        this.managedNiches = niches;
        console.log('Niches loaded:', niches);
      },
      error: (err) => {
        console.error('Failed to load niches:', err);
        this.managedNiches = [];
      }
    });
  }

  private loadTagSuggestions() {
    this.projectsListService.getTagSuggestions().subscribe({
      next: (tags) => {
        this.tagSuggestions = tags;
        console.log('Tag suggestions loaded:', tags);
      },
      error: (err) => {
        console.error('Failed to load tag suggestions:', err);
        this.tagSuggestions = [];
      }
    });
  }

  close() {
    this.isOpen.set(false);
    this.modalClosed.emit();
  }

  async save() {
    this.submitted.set(true);

    if (!this.isFormValid()) {
      return;
    }

    this.isSaving.set(true);

    try {
      // Prepare final form data
      const finalFormData: ProjectFormData = {
        ...this.formData,
        tags: this.selectedTags.join(', '),
        gallery: this.galleryImages,
        keyFeatures: this.keyFeatures,
        responsibilities: this.responsibilities,
        changelog: this.changelog
      };

      let savedProject: ProjectEntry;

      if (this.isCreating) {
        savedProject = await this.crudService.createProject(finalFormData);
      } else {
        savedProject = await this.crudService.updateProject(this.project!.id, finalFormData);
      }

      this.projectSaved.emit(savedProject);
      this.close();
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  isFormValid(): boolean {
    return !!(this.formData.title?.trim() && this.formData.description?.trim());
  }

  // Event handlers for imported data
  onResponsibilitiesImported(responsibilities: Responsibility[]) {
    this.responsibilities = [...responsibilities];
  }

  onKeyFeaturesImported(features: any[]) {
    this.keyFeatures = [...features];
  }

  onChangelogImported(changelog: any[]) {
    this.changelog = [...changelog];
  }

  // Unified Suggestion Management
  onManageCategoriesClick() {
    this.suggestionTitle.set('Categories');
    this.suggestionType.set('category');
    this.showSuggestionManager.set(true);
  }

  onManageNichesClick() {
    this.suggestionTitle.set('Niches');
    this.suggestionType.set('niche');
    this.showSuggestionManager.set(true);
  }

  onSuggestionsUpdated() {
    if (this.suggestionType() === 'category') {
      this.projectsListService.getCategories().subscribe(cats => this.managedCategories = cats);
    } else {
      this.projectsListService.getNiches().subscribe(niches => this.managedNiches = niches);
    }
  }

  onSuggestionManagerClosed() {
    this.showSuggestionManager.set(false);
  }

  // Helper methods to get suggestions for the form
  getCategorySuggestions(): string[] {
    return this.managedCategories.map(cat => cat.name).filter(name => name);
  }

  getCategoryArSuggestions(): string[] {
    return this.managedCategories.map(cat => cat.name_Ar).filter(name => name);
  }

  getNicheSuggestions(): string[] {
    return this.managedNiches.map(niche => niche.name).filter(name => name);
  }

  getNicheArSuggestions(): string[] {
    return this.managedNiches.map(niche => niche.name_Ar).filter(name => name);
  }

  getTagSuggestions(): string[] {
    return this.tagSuggestions;
  }
}