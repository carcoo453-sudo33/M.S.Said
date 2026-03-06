import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ProjectService } from '../../../services/project.service';
import { ToastService } from '../../../services/toast.service';
import { LucideAngularModule, X, Save, Plus, AlertTriangle, Github, Info, Star, CheckCircle, Clock, Trash2 } from 'lucide-angular';
import { KeyFeature, ChangelogItem } from '../../../models/project.model';
import { ProjectCardComponent } from './grid/project-card';
import { ProjectFormBasicComponent } from './grid/project-form-basic';
import { ProjectFormCategoriesComponent } from './grid/project-form-categories';
import { ProjectFormImagesComponent } from './grid/project-form-images';
import { ProjectFormTagsComponent } from './grid/project-form-tags';
import { ProjectDeleteModalComponent } from './modals/project-delete-modal';
import { CategoryManagerModalComponent } from './modals/category-manager-modal';
import { NicheManagerModalComponent } from './modals/niche-manager-modal';
import { ProjectDataManagerComponent } from './sections/project-data-manager';
import { ProjectCategoryManagerComponent } from './sections/project-category-manager';
import { ProjectNicheManagerComponent } from './sections/project-niche-manager';
import { ProjectFeaturesManagerComponent } from './sections/project-features-manager';
import { ProjectImportManagerComponent } from './sections/project-import-manager';
import { 
    DialogComponent, 
    DialogContentComponent, 
    DialogHeaderComponent, 
    DialogTitleComponent, 
    DialogFooterComponent 
} from '../../../ui/dialog';
import { ButtonComponent } from '../../../ui/button';
import { CardComponent } from '../../../ui/card';

@Component({
    selector: 'app-projects-grid',
    standalone: true,
    imports: [
        CommonModule, 
        TranslateModule, 
        LucideAngularModule, 
        FormsModule,
        ProjectCardComponent,
        ProjectFormBasicComponent,
        ProjectFormCategoriesComponent,
        ProjectFormImagesComponent,
        ProjectFormTagsComponent,
        ProjectDeleteModalComponent,
        CategoryManagerModalComponent,
        NicheManagerModalComponent,
        ProjectDataManagerComponent,
        ProjectCategoryManagerComponent,
        ProjectNicheManagerComponent,
        ProjectFeaturesManagerComponent,
        ProjectImportManagerComponent,
        DialogComponent,
        DialogContentComponent,
        DialogHeaderComponent,
        DialogTitleComponent,
        DialogFooterComponent,
        ButtonComponent,
        CardComponent
    ],
    templateUrl: './projects-grid.html'
})
export class ProjectsGridComponent implements OnChanges, OnInit {
    public auth = inject(AuthService);
    private projectService = inject(ProjectService);
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);

    @Input() projects: ProjectEntry[] = [];
    @Input() totalCount: number = 0;
    @Input() triggerCreate: boolean = false;
    @Input() hideGrid: boolean = false;
    @Output() edit = new EventEmitter<ProjectEntry>();
    @Output() delete = new EventEmitter<ProjectEntry>();
    @Output() projectsUpdated = new EventEmitter<ProjectEntry[]>();

    XIcon = X;
    SaveIcon = Save;
    PlusIcon = Plus;
    AlertIcon = AlertTriangle;
    GithubIcon = Github;
    InfoIcon = Info;
    StarIcon = Star;
    CheckCircleIcon = CheckCircle;
    ClockIcon = Clock;
    DeleteIcon = Trash2;

    showEditModal = false;
    isSaving = false;
    isDeleting = false;
    submitted = false;
    isCreating = false;
    isImporting = false;
    importUrl = '';
    deleteProject: ProjectEntry | null = null;
    editingProject: Partial<ProjectEntry> = {};
    galleryImages: string[] = [];

    // Key Features, Responsibilities, and Changelog
    keyFeatures: KeyFeature[] = [];
    responsibilities: string[] = [];
    changelog: ChangelogItem[] = [];

    // Data loaded from backend
    selectedTags: string[] = [];

    // Manager modals
    showCategoryManager = false;
    showNicheManager = false;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['triggerCreate'] && !changes['triggerCreate'].firstChange) {
            this.openCreateModal();
        }
    }

    ngOnInit() {
        // Data loading is now handled by child components
    }

    onEdit(project: ProjectEntry) {
        this.editingProject = { ...project };
        this.galleryImages = project.gallery ? [...project.gallery] : [];
        this.selectedTags = project.tags ? project.tags.split(',').map(t => t.trim()).filter(t => t) : [];
        
        this.keyFeatures = project.keyFeatures ? [...project.keyFeatures] : [];
        this.responsibilities = project.responsibilities ? [...project.responsibilities] : [];
        this.changelog = project.changelog ? [...project.changelog] : [];
        
        this.isCreating = false;
        this.submitted = false;
        this.showEditModal = true;
    }

    onDelete(project: ProjectEntry) {
        this.deleteProject = project;
    }

    openCreateModal() {
        this.editingProject = {
            title: '',
            description: '',
            category: '',
            niche: '',
            tags: '',
            imageUrl: '',
            projectUrl: '',
            gitHubUrl: '',
            duration: new Date().getFullYear().toString(),
            views: 0,
            isFeatured: false
        };
        this.galleryImages = [];
        this.selectedTags = [];
        
        this.keyFeatures = [];
        this.responsibilities = [];
        this.changelog = [];
        
        this.isCreating = true;
        this.submitted = false;
        this.importUrl = '';
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
        this.editingProject = {};
        this.galleryImages = [];
        this.selectedTags = [];
        
        this.keyFeatures = [];
        this.responsibilities = [];
        this.changelog = [];
    }

    saveProject() {
        this.submitted = true;

        if (!this.editingProject.title || !this.editingProject.title.trim() ||
            !this.editingProject.description || !this.editingProject.description.trim()) {
            this.toast.error('Please fill in all required fields');
            return;
        }

        this.isSaving = true;

        const projectData: Partial<ProjectEntry> = {
            id: this.editingProject.id || crypto.randomUUID(),
            slug: this.editingProject.slug || this.generateSlug(this.editingProject.title!),
            title: this.editingProject.title!,
            title_Ar: this.editingProject.title_Ar,
            description: this.editingProject.description!,
            description_Ar: this.editingProject.description_Ar,
            category: this.editingProject.category || '',
            category_Ar: this.editingProject.category_Ar,
            niche: this.editingProject.niche,
            niche_Ar: this.editingProject.niche_Ar,
            company: this.editingProject.company,
            company_Ar: this.editingProject.company_Ar,
            tags: this.selectedTags.join(', '),
            imageUrl: this.editingProject.imageUrl,
            gallery: this.galleryImages.length > 0 ? this.galleryImages : undefined,
            projectUrl: this.editingProject.projectUrl,
            gitHubUrl: this.editingProject.gitHubUrl,
            duration: this.editingProject.duration,
            duration_Ar: this.editingProject.duration_Ar,
            language: this.editingProject.language,
            language_Ar: this.editingProject.language_Ar,
            architecture: this.editingProject.architecture,
            architecture_Ar: this.editingProject.architecture_Ar,
            status: this.editingProject.status,
            status_Ar: this.editingProject.status_Ar,
            keyFeatures: this.keyFeatures.length > 0 ? this.keyFeatures : undefined,
            responsibilities: this.responsibilities.length > 0 ? this.responsibilities : undefined,
            changelog: this.changelog.length > 0 ? this.changelog : undefined,
            views: this.editingProject.views || 0,
            isFeatured: this.editingProject.isFeatured || false
        };

        const request = this.isCreating
            ? this.projectService.createProject(projectData as any)
            : this.projectService.updateProject(this.editingProject.id!, projectData as ProjectEntry);

        request.subscribe({
            next: (savedProject: ProjectEntry) => {
                if (this.isCreating) {
                    this.projects = [...this.projects, savedProject];
                } else {
                    const index = this.projects.findIndex(p => p.id === savedProject.id);
                    if (index !== -1) {
                        this.projects[index] = savedProject;
                        this.projects = [...this.projects];
                    }
                }
                this.projectsUpdated.emit(this.projects);
                this.isSaving = false;
                this.showEditModal = false;
                this.cdr.detectChanges();
                this.toast.success(`Project ${this.isCreating ? 'created' : 'updated'} successfully`);
            },
            error: (err) => {
                this.isSaving = false;
                this.cdr.detectChanges();
                this.toast.error(`Failed to ${this.isCreating ? 'create' : 'update'} project`);
                console.error('Project Save Error:', err);
            }
        });
    }

    generateSlug(title: string): string {
        return title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    executeDelete() {
        if (!this.deleteProject?.id) return;

        this.isDeleting = true;
        this.projectService.deleteProject(this.deleteProject.id).subscribe({
            next: () => {
                this.projects = this.projects.filter(p => p.id !== this.deleteProject!.id);
                this.projectsUpdated.emit(this.projects);
                this.delete.emit(this.deleteProject!);
                this.deleteProject = null;
                this.isDeleting = false;
                this.cdr.detectChanges();
                this.toast.success('Project deleted successfully');
            },
            error: (err) => {
                this.isDeleting = false;
                this.deleteProject = null;
                this.cdr.detectChanges();
                if (err.status === 401) {
                    this.toast.error('Authentication failed. Please log in again.');
                    this.auth.logout();
                    window.location.href = '/login';
                } else {
                    this.toast.error('Failed to delete project');
                }
                console.error('Project Delete Error:', err);
            }
        });
    }
}
