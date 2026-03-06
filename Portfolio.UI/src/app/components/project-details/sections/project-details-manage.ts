import { Component, Input, Output, EventEmitter, inject, OnChanges, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Edit, Save, X } from 'lucide-angular';
import { ProjectEntry } from '../../../models';
import { ProjectService } from '../../../services/project.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';

// Import sub-components
import { ProjectManageBasicInfoComponent } from './manage/project-manage-basic-info';
import { ProjectManageCategoriesComponent } from './manage/project-manage-categories';
import { ProjectManageTagsComponent } from './manage/project-manage-tags';
import { ProjectManageMetadataComponent } from './manage/project-manage-metadata';
import { ProjectManageImagesComponent } from './manage/project-manage-images';
import { ProjectManageFeaturesComponent } from './manage/project-manage-features';
import { ProjectManageResponsibilitiesComponent } from './manage/project-manage-responsibilities';
import { ProjectManageChangelogComponent } from './manage/project-manage-changelog';
import { ProjectManageGithubImportComponent } from './manage/project-manage-github-import';

@Component({
    selector: 'app-project-details-manage',
    standalone: true,
    imports: [
        CommonModule, 
        FormsModule, 
        LucideAngularModule,
        ProjectManageBasicInfoComponent,
        ProjectManageCategoriesComponent,
        ProjectManageTagsComponent,
        ProjectManageMetadataComponent,
        ProjectManageImagesComponent,
        ProjectManageFeaturesComponent,
        ProjectManageResponsibilitiesComponent,
        ProjectManageChangelogComponent,
        ProjectManageGithubImportComponent
    ],
    template: `
    <div *ngIf="project && isEditing" class="modal-overlay">
        <div class="modal-content max-w-6xl" (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="sticky top-0 bg-zinc-950 border-b border-zinc-800 p-6 flex items-center justify-between z-10">
                <h2 class="text-xl font-black uppercase text-white">Edit Project</h2>
                <button (click)="closeModal()" class="text-zinc-400 hover:text-white transition-colors">
                    <lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon>
                </button>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                <!-- GitHub Import Section -->
                <app-project-manage-github-import 
                    [project]="project"
                    [(githubUrl)]="githubUrl"
                    (importCompleted)="onImportCompleted($event)">
                </app-project-manage-github-import>

                <!-- Basic Info Section -->
                <app-project-manage-basic-info [editData]="editData"></app-project-manage-basic-info>

                <!-- Categories Section -->
                <app-project-manage-categories [editData]="editData"></app-project-manage-categories>

                <!-- Tags Section -->
                <app-project-manage-tags 
                    [editData]="editData" 
                    [(selectedTags)]="selectedTags">
                </app-project-manage-tags>

                <!-- Metadata Section -->
                <app-project-manage-metadata [editData]="editData"></app-project-manage-metadata>

                <!-- Images Section -->
                <app-project-manage-images 
                    [editData]="editData"
                    (imageUploaded)="onImageUploaded($event)"
                    (galleryUpdated)="onGalleryUpdated($event)">
                </app-project-manage-images>

                <!-- Features Section -->
                <app-project-manage-features [editData]="editData"></app-project-manage-features>

                <!-- Responsibilities Section -->
                <app-project-manage-responsibilities [editData]="editData"></app-project-manage-responsibilities>

                <!-- Changelog Section -->
                <app-project-manage-changelog [editData]="editData"></app-project-manage-changelog>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-4 p-8 border-t border-zinc-800">
                <button (click)="closeModal()" 
                    class="px-8 py-3 rounded-xl font-black text-[10px] uppercase text-zinc-400 hover:text-white transition-colors">
                    Cancel
                </button>
                <button (click)="saveChanges()" [disabled]="isSaving"
                    class="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all disabled:opacity-50">
                    <lucide-icon [img]="SaveIcon" class="w-4 h-4"></lucide-icon>
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
            </div>
        </div>
    </div>
    `
})
export class ProjectDetailsManageComponent implements OnChanges, OnInit {
    private projectService = inject(ProjectService);
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);
    private auth = inject(AuthService);
    
    @Input() project?: ProjectEntry;
    @Input() canEdit = false;
    @Input() triggerEdit = false;
    @Output() onUpdate = new EventEmitter<ProjectEntry>();

    EditIcon = Edit;
    SaveIcon = Save;
    XIcon = X;

    isEditing = false;
    isSaving = false;
    githubUrl = '';
    editData: any = {};
    selectedTags: string[] = [];

    ngOnChanges() {
        if (this.triggerEdit && !this.isEditing) {
            this.openModal();
        }
    }

    ngOnInit() {
        // Sub-components handle their own data loading
    }

    openModal() {
        if (!this.project) return;
        
        this.editData = {
            title: this.project.title || '',
            title_Ar: this.project.title_Ar || '',
            description: this.project.description || '',
            description_Ar: this.project.description_Ar || '',
            summary: this.project.summary || '',
            summary_Ar: this.project.summary_Ar || '',
            category: this.project.category || '',
            category_Ar: this.project.category_Ar || '',
            niche: this.project.niche || '',
            niche_Ar: this.project.niche_Ar || '',
            company: this.project.company || '',
            company_Ar: this.project.company_Ar || '',
            tags: this.project.tags || '',
            imageUrl: this.project.imageUrl || '',
            gallery: this.project.gallery ? [...this.project.gallery] : [],
            projectUrl: this.project.projectUrl || '',
            gitHubUrl: this.project.gitHubUrl || '',
            language: this.project.language || '',
            language_Ar: this.project.language_Ar || '',
            duration: this.project.duration || '',
            duration_Ar: this.project.duration_Ar || '',
            architecture: this.project.architecture || '',
            architecture_Ar: this.project.architecture_Ar || '',
            status: this.project.status || 'Active',
            status_Ar: this.project.status_Ar || '',
            isFeatured: this.project.isFeatured || false,
            keyFeatures: JSON.parse(JSON.stringify(this.project.keyFeatures || [])),
            responsibilities: [...(this.project.responsibilities || [])],
            changelog: JSON.parse(JSON.stringify(this.project.changelog || []))
        };
        
        // Parse tags into selectedTags array
        this.selectedTags = this.project.tags ? this.project.tags.split(',').map(t => t.trim()).filter(t => t) : [];
        
        // Pre-fill GitHub URL if available
        this.githubUrl = this.project.gitHubUrl || '';
        
        this.isEditing = true;
    }

    closeModal() {
        this.isEditing = false;
    }

    onImportCompleted(updated: ProjectEntry) {
        // Update the edit data with imported values (only if they exist)
        if (updated.keyFeatures && updated.keyFeatures.length > 0) {
            this.editData.keyFeatures = JSON.parse(JSON.stringify(updated.keyFeatures));
        }
        if (updated.responsibilities && updated.responsibilities.length > 0) {
            this.editData.responsibilities = [...updated.responsibilities];
        }
        if (updated.changelog && updated.changelog.length > 0) {
            this.editData.changelog = JSON.parse(JSON.stringify(updated.changelog));
        }
        if (updated.language) {
            this.editData.language = updated.language;
        }
        
        this.cdr.detectChanges();
    }

    onImageUploaded(url: string) {
        this.editData.imageUrl = url;
    }

    onGalleryUpdated(gallery: string[]) {
        this.editData.gallery = gallery;
    }

    saveChanges() {
        if (!this.project || this.isSaving) return;

        this.isSaving = true;

        const updatedProject = {
            ...this.project,
            title: this.editData.title,
            title_Ar: this.editData.title_Ar,
            description: this.editData.description,
            description_Ar: this.editData.description_Ar,
            summary: this.editData.summary,
            summary_Ar: this.editData.summary_Ar,
            category: this.editData.category,
            category_Ar: this.editData.category_Ar,
            niche: this.editData.niche,
            niche_Ar: this.editData.niche_Ar,
            company: this.editData.company,
            company_Ar: this.editData.company_Ar,
            tags: this.editData.tags,
            imageUrl: this.editData.imageUrl,
            gallery: this.editData.gallery,
            projectUrl: this.editData.projectUrl,
            gitHubUrl: this.editData.gitHubUrl,
            language: this.editData.language,
            language_Ar: this.editData.language_Ar,
            duration: this.editData.duration,
            duration_Ar: this.editData.duration_Ar,
            architecture: this.editData.architecture,
            architecture_Ar: this.editData.architecture_Ar,
            status: this.editData.status,
            status_Ar: this.editData.status_Ar,
            isFeatured: this.editData.isFeatured,
            keyFeatures: this.editData.keyFeatures,
            responsibilities: this.editData.responsibilities.filter((r: string) => r.trim()),
            changelog: this.editData.changelog
        };

        console.log('Saving project with data:', updatedProject);

        this.projectService.updateProject(this.project.id, updatedProject).subscribe({
            next: (updated) => {
                console.log('Project updated successfully:', updated);
                this.onUpdate.emit(updated);
                this.isEditing = false;
                this.isSaving = false;
                this.cdr.detectChanges();
                this.toast.success('Project updated successfully');
            },
            error: (err) => {
                console.error('Failed to update project:', err);
                this.isSaving = false;
                this.cdr.detectChanges();
                
                let errorMessage = 'Failed to save changes. ';
                
                if (err.status === 401) {
                    errorMessage = 'Your session has expired. Please log in again to continue editing.';
                } else if (err.error?.message) {
                    errorMessage += err.error.message;
                } else {
                    errorMessage += 'Please try again.';
                }
                
                this.toast.error(errorMessage);
            }
        });
    }
}