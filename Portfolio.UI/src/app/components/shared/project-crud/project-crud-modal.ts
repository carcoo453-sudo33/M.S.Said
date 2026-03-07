import { Component, Input, Output, EventEmitter, inject, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, X, Save, Loader } from 'lucide-angular';
import { ProjectEntry } from '../../../models';
import { ProjectCrudService, ProjectFormData } from './project-crud.service';
import { ProjectService } from '../../../services/project.service';
import { AuthService } from '../../../services/auth.service';

// Import all the existing form components
import { 
  ProjectFormBasicComponent,
  ProjectFormCategoriesComponent,
  ProjectFormTagsComponent,
  ProjectFormImagesComponent
} from './forms';

// Import manager components
import { 
  ProjectImportManagerComponent,
  ProjectKeyFeaturesManagerComponent,
  ProjectResponsibilitiesManagerComponent,
  ProjectChangelogManagerComponent,
  ProjectCategoryManagerComponent,
  ProjectNicheManagerComponent
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
    ProjectImportManagerComponent,
    ProjectKeyFeaturesManagerComponent,
    ProjectResponsibilitiesManagerComponent,
    ProjectChangelogManagerComponent,
    ProjectCategoryManagerComponent,
    ProjectNicheManagerComponent
  ],
  template: `
    <div *ngIf="isOpen()" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" (click)="close()">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col" (click)="$event.stopPropagation()">
        
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
          <div *ngIf="isCreating" class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <app-project-import-manager
              [(editingProject)]="formData"
              [(isImporting)]="isImporting"
              [(importUrl)]="importUrl"
              (responsibilitiesImported)="onResponsibilitiesImported($event)"
              (keyFeaturesImported)="onKeyFeaturesImported($event)"
              (changelogImported)="onChangelogImported($event)">
            </app-project-import-manager>
          </div>

          <!-- Basic Information -->
          <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Basic Information</h3>
            <app-project-form-basic 
              [project]="formData"
              [submitted]="submitted()">
            </app-project-form-basic>
          </div>

          <!-- Categories -->
          <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Categories</h3>
            <app-project-form-categories 
              [project]="formData"
              [categories]="getCategorySuggestions()"
              [categoryArSuggestions]="getCategoryArSuggestions()"
              [nicheSuggestions]="getNicheSuggestions()"
              [nicheArSuggestions]="getNicheArSuggestions()"
              (manageCategoriesClick)="onManageCategoriesClick()"
              (manageNichesClick)="onManageNichesClick()">
            </app-project-form-categories>
          </div>

          <!-- Tags -->
          <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Tags</h3>
            <app-project-form-tags 
              [(selectedTags)]="selectedTags">
            </app-project-form-tags>
          </div>

          <!-- Images -->
          <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Images</h3>
            <app-project-form-images 
              [imageUrl]="formData.imageUrl"
              [(galleryImages)]="galleryImages">
            </app-project-form-images>
          </div>

          <!-- Key Features -->
          <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Key Features</h3>
            <app-project-key-features-manager 
              [(keyFeatures)]="keyFeatures">
            </app-project-key-features-manager>
          </div>

          <!-- Responsibilities -->
          <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Responsibilities</h3>
            <app-project-responsibilities-manager 
              [(responsibilities)]="responsibilities">
            </app-project-responsibilities-manager>
          </div>

          <!-- Changelog -->
          <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Changelog</h3>
            <app-project-changelog-manager 
              [(changelog)]="changelog">
            </app-project-changelog-manager>
          </div>

          <!-- Category Management (Collapsible) -->
          <div *ngIf="showCategoryManager()" class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 border-2 border-red-200 dark:border-red-800">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-zinc-900 dark:text-white">Category Management</h3>
              <button 
                (click)="onCategoryManagerClosed()"
                class="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                <lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
            <app-project-category-manager 
              [managedCategories]="managedCategories"
              (categoriesUpdated)="onCategoriesUpdated()">
            </app-project-category-manager>
          </div>

          <!-- Niche Management (Collapsible) -->
          <div *ngIf="showNicheManager()" class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-zinc-900 dark:text-white">Niche Management</h3>
              <button 
                (click)="onNicheManagerClosed()"
                class="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                <lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
            <app-project-niche-manager 
              [managedNiches]="managedNiches"
              (nichesUpdated)="onNichesUpdated()">
            </app-project-niche-manager>
          </div>

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
  `
})
export class ProjectCrudModalComponent implements OnChanges {
  private crudService = inject(ProjectCrudService);
  private projectService = inject(ProjectService);
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
  showCategoryManager = signal(false);
  showNicheManager = signal(false);

  // Form data
  formData: ProjectFormData = this.crudService.createEmptyFormData();
  selectedTags: string[] = [];
  galleryImages: string[] = [];
  keyFeatures: any[] = [];
  responsibilities: string[] = [];
  changelog: any[] = [];
  managedCategories: any[] = [];
  managedNiches: any[] = [];

  get isCreating(): boolean {
    return this.mode === 'create';
  }

  ngOnChanges() {
    this.isOpen.set(this.open);
    
    if (this.open) {
      this.initializeForm();
      this.loadCategoriesAndNiches();
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
    this.projectService.getCategories().subscribe({
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
    this.projectService.getNiches().subscribe({
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
  onResponsibilitiesImported(responsibilities: string[]) {
    this.responsibilities = [...responsibilities];
  }

  onKeyFeaturesImported(features: any[]) {
    this.keyFeatures = [...features];
  }

  onChangelogImported(changelog: any[]) {
    this.changelog = [...changelog];
  }

  // Event handlers for category and niche management
  onManageCategoriesClick() {
    console.log('Manage Categories clicked!');
    this.showCategoryManager.set(true);
  }

  onManageNichesClick() {
    console.log('Manage Niches clicked!');
    this.showNicheManager.set(true);
  }

  onCategoriesUpdated() {
    // Reload categories list
    this.projectService.getCategories().subscribe({
      next: (categories) => {
        this.managedCategories = categories;
        console.log('Categories updated and reloaded:', categories);
      },
      error: (err) => console.error('Failed to reload categories:', err)
    });
  }

  onNichesUpdated() {
    // Reload niches list
    this.projectService.getNiches().subscribe({
      next: (niches) => {
        this.managedNiches = niches;
        console.log('Niches updated and reloaded:', niches);
      },
      error: (err) => console.error('Failed to reload niches:', err)
    });
  }

  onCategoryManagerClosed() {
    this.showCategoryManager.set(false);
  }

  onNicheManagerClosed() {
    this.showNicheManager.set(false);
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
}