import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ProjectEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ProjectService } from '../../../services/project.service';
import { ToastService } from '../../../services/toast.service';
import { TranslationHelperService } from '../../../services/translation-helper.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, Edit3, Trash2, X, Save, Plus, AlertTriangle, Upload, Image, Github, ArrowRight } from 'lucide-angular';

@Component({
    selector: 'app-projects-grid',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, LucideAngularModule, FormsModule],
    templateUrl: './projects-grid.html'
})
export class ProjectsGridComponent implements OnChanges, OnInit {
    public auth = inject(AuthService);
    private projectService = inject(ProjectService);
    private toast = inject(ToastService);
    private translationHelper = inject(TranslationHelperService);
    private http = inject(HttpClient);
    private cdr = inject(ChangeDetectorRef);
    
    @Input() projects: ProjectEntry[] = [];
    @Input() totalCount: number = 0;
    @Input() triggerCreate: boolean = false;
    @Output() edit = new EventEmitter<ProjectEntry>();
    @Output() delete = new EventEmitter<ProjectEntry>();
    @Output() projectsUpdated = new EventEmitter<ProjectEntry[]>();
    
    EditIcon = Edit3;
    DeleteIcon = Trash2;
    XIcon = X;
    SaveIcon = Save;
    PlusIcon = Plus;
    AlertIcon = AlertTriangle;
    UploadIcon = Upload;
    ImageIcon = Image;
    GithubIcon = Github;
    ArrowRightIcon = ArrowRight;

    showEditModal = false;
    isSaving = false;
    isDeleting = false;
    isUploading = false;
    isUploadingGallery = false;
    submitted = false;
    isCreating = false;
    isImporting = false;
    importUrl = '';
    deleteProject: ProjectEntry | null = null;
    editingProject: Partial<ProjectEntry> = {};
    galleryImages: string[] = [];
    
    // Category options
    categories = ['Frontend', 'Backend', 'Fullstack'];
    
    // Niche options (what used to be categories)
    nicheOptions = ['E-Commerce', 'Healthcare', 'Portfolio', 'Productivity', 'Education', 'Finance', 'Social Media', 'Entertainment', 'SaaS & Productivity', 'Real Estate', 'Travel & Tourism', 'Food & Beverage', 'Gaming', 'IoT & Smart Devices', 'Other'];
    
    // Technology suggestions for tags
    techSuggestions = [
        'Angular', 'React', 'Vue', 'TypeScript', 'JavaScript',
        '.NET Core', 'ASP.NET', 'C#', 'Node.js', 'Express',
        'SQL Server', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis',
        'Azure', 'AWS', 'Docker', 'Kubernetes', 'CI/CD',
        'Tailwind CSS', 'Bootstrap', 'Material UI', 'SASS', 'CSS3',
        'REST API', 'GraphQL', 'SignalR', 'WebSockets', 'gRPC',
        'Entity Framework', 'Dapper', 'Prisma', 'TypeORM',
        'JWT', 'OAuth', 'Identity Server', 'Auth0',
        'Git', 'GitHub Actions', 'Azure DevOps', 'Jenkins',
        'Microservices', 'Clean Architecture', 'DDD', 'CQRS',
        'RxJS', 'NgRx', 'Redux', 'MobX', 'Zustand',
        'Jest', 'Vitest', 'Cypress', 'Playwright', 'xUnit',
        'Webpack', 'Vite', 'Rollup', 'ESBuild'
    ];
    filteredTechSuggestions: string[] = [];
    showTechSuggestions = false;
    currentTagInput = '';
    selectedTags: string[] = [];
    tagInput = '';
    
    // Niche suggestions
    nicheSuggestions: string[] = [];
    filteredNicheSuggestions: string[] = [];
    showNicheSuggestions = false;
    
    // Category suggestions
    categorySuggestions: string[] = [];
    filteredCategorySuggestions: string[] = [];
    showCategorySuggestions = false;
    
    // Category AR suggestions
    categoryArSuggestions: string[] = [];
    filteredCategoryArSuggestions: string[] = [];
    showCategoryArSuggestions = false;
    
    // Niche AR suggestions
    nicheArSuggestions: string[] = [];
    filteredNicheArSuggestions: string[] = [];
    showNicheArSuggestions = false;
    
    // Company suggestions
    companySuggestions: string[] = ['WE3DS', 'Remote', 'Self Work', 'Freelance', 'Contract'];
    filteredCompanySuggestions: string[] = [];
    showCompanySuggestions = false;
    
    // Company AR suggestions
    companyArSuggestions: string[] = ['WE3DS', 'عن بعد', 'عمل حر', 'مستقل', 'عقد'];
    filteredCompanyArSuggestions: string[] = [];
    showCompanyArSuggestions = false;
    
    // Manager modals
    showCategoryManager = false;
    showNicheManager = false;
    newCategoryName = '';
    newCategoryNameAr = '';
    newNicheName = '';
    newNicheNameAr = '';
    managedCategories: any[] = [];
    managedNiches: any[] = [];
    
    ngOnChanges(changes: SimpleChanges) {
        if (changes['triggerCreate'] && !changes['triggerCreate'].firstChange) {
            this.openCreateModal();
        }
    }

    ngOnInit() {
        this.loadTagSuggestions();
        this.loadCategorySuggestions();
    }

    loadTagSuggestions() {
        this.projectService.getTagSuggestions().subscribe({
            next: (tags) => {
                // Merge with predefined suggestions
                this.techSuggestions = [...new Set([...this.techSuggestions, ...tags])].sort();
            },
            error: (err) => {
                console.error('Failed to load tag suggestions:', err);
            }
        });
    }

    loadCategorySuggestions() {
        this.projectService.getCategories().subscribe({
            next: (categories) => {
                this.managedCategories = categories;
                // Extract names for autocomplete
                this.categories = categories.map((c: any) => c.name).sort();
                this.categoryArSuggestions = categories
                    .map((c: any) => c.name_Ar)
                    .filter((name: string) => !!name && name.trim() !== '')
                    .sort();
            },
            error: (err) => {
                console.error('Failed to load categories:', err);
                // Fallback to predefined categories
                this.categories = ['Frontend', 'Backend', 'Fullstack'];
            }
        });
    }

    onEdit(event: Event, project: ProjectEntry) {
        event.stopPropagation();
        event.preventDefault();
        this.editingProject = { ...project };
        this.galleryImages = project.gallery ? [...project.gallery] : [];
        this.selectedTags = project.tags ? project.tags.split(',').map(t => t.trim()).filter(t => t) : [];
        this.tagInput = '';
        this.isCreating = false;
        this.submitted = false;
        this.loadNicheSuggestions();
        this.showEditModal = true;
    }

    onDelete(event: Event, project: ProjectEntry) {
        event.stopPropagation();
        event.preventDefault();
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
            isTrendy: false
        };
        this.galleryImages = [];
        this.selectedTags = [];
        this.tagInput = '';
        this.isCreating = true;
        this.submitted = false;
        this.importUrl = '';
        this.loadNicheSuggestions();
        this.showEditModal = true;
    }

    importFromUrl() {
        if (!this.importUrl || this.isImporting) return;

        this.isImporting = true;

        this.projectService.importFromUrl(this.importUrl).subscribe({
            next: (importedData) => {
                console.log('Successfully imported project data:', importedData);
                
                // Populate form with imported data (only if values are not empty)
                this.editingProject = {
                    ...this.editingProject,
                    title: (importedData.title && importedData.title.trim()) || this.editingProject.title || '',
                    description: (importedData.description && importedData.description.trim()) || (importedData.summary && importedData.summary.trim()) || this.editingProject.description || '',
                    summary: (importedData.summary && importedData.summary.trim()) || this.editingProject.summary || '',
                    gitHubUrl: this.importUrl,
                    projectUrl: (importedData.projectUrl && importedData.projectUrl.trim()) || this.editingProject.projectUrl || '',
                    category: (importedData.category && importedData.category.trim()) || this.editingProject.category || '',
                    tags: (importedData.tags && importedData.tags.trim()) || this.editingProject.tags || '',
                    language: (importedData.language && importedData.language.trim()) || this.editingProject.language || '',
                    duration: (importedData.duration && importedData.duration.trim()) || this.editingProject.duration || '',
                    architecture: (importedData.architecture && importedData.architecture.trim()) || this.editingProject.architecture || '',
                    status: (importedData.status && importedData.status.trim()) || this.editingProject.status || '',
                    responsibilities: importedData.responsibilities && importedData.responsibilities.length > 0 ? importedData.responsibilities : this.editingProject.responsibilities || [],
                    keyFeatures: importedData.keyFeatures && importedData.keyFeatures.length > 0 ? importedData.keyFeatures : this.editingProject.keyFeatures || [],
                    changelog: importedData.changelog && importedData.changelog.length > 0 ? importedData.changelog : this.editingProject.changelog || []
                };

                console.log('Populated editingProject:', this.editingProject);
                this.isImporting = false;
                this.cdr.detectChanges();
                this.toast.success('Project data imported successfully! Review and complete any missing fields, then save.');
            },
            error: (err) => {
                console.error('Failed to import from URL:', err);
                
                // Even on error, set the GitHub URL
                this.editingProject.gitHubUrl = this.importUrl;
                this.isImporting = false;
                
                let errorMessage = 'Could not automatically fetch project data. ';
                
                if (err.status === 401) {
                    errorMessage = 'Your session has expired. Please log in again.';
                } else if (err.error?.message) {
                    errorMessage = err.error.message;
                } else {
                    errorMessage += 'The URL has been set. Please fill in the remaining fields manually.';
                }
                
                this.cdr.detectChanges();
                this.toast.error(errorMessage);
            }
        });
    }

    closeEditModal() {
        this.showEditModal = false;
        this.editingProject = {};
        this.galleryImages = [];
        this.selectedTags = [];
        this.tagInput = '';
        this.showNicheSuggestions = false;
        this.showTechSuggestions = false;
    }

    loadNicheSuggestions() {
        this.projectService.getNiches().subscribe({
            next: (niches) => {
                this.managedNiches = niches;
                // Extract names for autocomplete
                this.nicheSuggestions = niches.map((n: any) => n.name).sort();
                this.nicheArSuggestions = niches
                    .map((n: any) => n.name_Ar)
                    .filter((name: string) => !!name && name.trim() !== '')
                    .sort();
            },
            error: (err) => {
                console.error('Failed to load niches:', err);
                // Fallback to predefined niches
                this.nicheSuggestions = this.nicheOptions;
            }
        });
    }

    onNicheInput(value: string) {
        if (!value || value.trim() === '') {
            this.filteredNicheSuggestions = this.nicheOptions;
            this.showNicheSuggestions = true;
            this.cdr.detectChanges();
            return;
        }
        
        this.filteredNicheSuggestions = this.nicheSuggestions.filter(niche =>
            niche.toLowerCase().includes(value.toLowerCase())
        );
        this.showNicheSuggestions = true;
        this.cdr.detectChanges();
    }

    selectNiche(niche: string) {
        this.editingProject.niche = niche;
        this.showNicheSuggestions = false;
        this.cdr.detectChanges();
    }

    onNicheBlur() {
        // Delay to allow click on suggestion
        setTimeout(() => {
            this.showNicheSuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    // Category autocomplete
    onCategoryInput(value: string) {
        if (!value || value.trim() === '') {
            this.filteredCategorySuggestions = this.categories;
            this.showCategorySuggestions = true;
            this.cdr.detectChanges();
            return;
        }
        
        this.filteredCategorySuggestions = this.categories.filter(cat =>
            cat.toLowerCase().includes(value.toLowerCase())
        );
        this.showCategorySuggestions = true;
        this.cdr.detectChanges();
    }

    selectCategory(category: string) {
        this.editingProject.category = category;
        this.showCategorySuggestions = false;
        this.cdr.detectChanges();
    }

    onCategoryBlur() {
        setTimeout(() => {
            this.showCategorySuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    // Category AR autocomplete
    onCategoryArInput(value: string) {
        if (!value || value.trim() === '') {
            this.filteredCategoryArSuggestions = this.categoryArSuggestions;
            this.showCategoryArSuggestions = true;
            this.cdr.detectChanges();
            return;
        }
        
        this.filteredCategoryArSuggestions = this.categoryArSuggestions.filter(cat =>
            cat.includes(value)
        );
        this.showCategoryArSuggestions = true;
        this.cdr.detectChanges();
    }

    selectCategoryAr(category: string) {
        this.editingProject.category_Ar = category;
        this.showCategoryArSuggestions = false;
        this.cdr.detectChanges();
    }

    onCategoryArBlur() {
        setTimeout(() => {
            this.showCategoryArSuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    // Niche AR autocomplete
    onNicheArInput(value: string) {
        if (!value || value.trim() === '') {
            this.filteredNicheArSuggestions = this.nicheArSuggestions;
            this.showNicheArSuggestions = true;
            this.cdr.detectChanges();
            return;
        }
        
        this.filteredNicheArSuggestions = this.nicheArSuggestions.filter(niche =>
            niche.includes(value)
        );
        this.showNicheArSuggestions = true;
        this.cdr.detectChanges();
    }

    selectNicheAr(niche: string) {
        this.editingProject.niche_Ar = niche;
        this.showNicheArSuggestions = false;
        this.cdr.detectChanges();
    }

    onNicheArBlur() {
        setTimeout(() => {
            this.showNicheArSuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    // Company autocomplete methods
    onCompanyInput(value: string) {
        if (!value || value.trim() === '') {
            this.filteredCompanySuggestions = this.companySuggestions;
            this.showCompanySuggestions = true;
            this.cdr.detectChanges();
            return;
        }
        
        this.filteredCompanySuggestions = this.companySuggestions.filter(company =>
            company.toLowerCase().includes(value.toLowerCase())
        );
        this.showCompanySuggestions = true;
        this.cdr.detectChanges();
    }

    selectCompany(company: string) {
        this.editingProject.company = company;
        this.showCompanySuggestions = false;
        this.cdr.detectChanges();
    }

    onCompanyBlur() {
        setTimeout(() => {
            this.showCompanySuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    // Company AR autocomplete methods
    onCompanyArInput(value: string) {
        if (!value || value.trim() === '') {
            this.filteredCompanyArSuggestions = this.companyArSuggestions;
            this.showCompanyArSuggestions = true;
            this.cdr.detectChanges();
            return;
        }
        
        this.filteredCompanyArSuggestions = this.companyArSuggestions.filter(company =>
            company.includes(value)
        );
        this.showCompanyArSuggestions = true;
        this.cdr.detectChanges();
    }

    selectCompanyAr(company: string) {
        this.editingProject.company_Ar = company;
        this.showCompanyArSuggestions = false;
        this.cdr.detectChanges();
    }

    onCompanyArBlur() {
        setTimeout(() => {
            this.showCompanyArSuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    // Category management
    addNewCategory() {
        const name = this.newCategoryName?.trim();
        if (!name) return;
        
        this.projectService.createCategory({ 
            name: name, 
            name_Ar: this.newCategoryNameAr?.trim() || undefined 
        }).subscribe({
            next: (category) => {
                this.managedCategories.push(category);
                this.managedCategories.sort((a, b) => a.name.localeCompare(b.name));
                this.toast.success(`Category "${name}" added`);
                this.newCategoryName = '';
                this.newCategoryNameAr = '';
                this.loadCategorySuggestions(); // Refresh suggestions
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to create category:', err);
                this.toast.error('Failed to add category');
            }
        });
    }

    removeCategory(id: string) {
        const category = this.managedCategories.find(c => c.id === id);
        if (!category) return;
        
        this.projectService.deleteCategory(id).subscribe({
            next: () => {
                this.managedCategories = this.managedCategories.filter(c => c.id !== id);
                this.toast.success(`Category "${category.name}" removed`);
                this.loadCategorySuggestions(); // Refresh suggestions
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to delete category:', err);
                this.toast.error('Failed to remove category');
            }
        });
    }

    // Niche management
    addNewNiche() {
        const name = this.newNicheName?.trim();
        if (!name) return;
        
        this.projectService.createNiche({ 
            name: name, 
            name_Ar: this.newNicheNameAr?.trim() || undefined 
        }).subscribe({
            next: (niche) => {
                this.managedNiches.push(niche);
                this.managedNiches.sort((a, b) => a.name.localeCompare(b.name));
                this.toast.success(`Niche "${name}" added`);
                this.newNicheName = '';
                this.newNicheNameAr = '';
                this.loadNicheSuggestions(); // Refresh suggestions
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to create niche:', err);
                this.toast.error('Failed to add niche');
            }
        });
    }

    removeNiche(id: string) {
        const niche = this.managedNiches.find(n => n.id === id);
        if (!niche) return;
        
        this.projectService.deleteNiche(id).subscribe({
            next: () => {
                this.managedNiches = this.managedNiches.filter(n => n.id !== id);
                this.toast.success(`Niche "${niche.name}" removed`);
                this.loadNicheSuggestions(); // Refresh suggestions
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to delete niche:', err);
                this.toast.error('Failed to remove niche');
            }
        });
    }

    // Tag/Technology management
    onTagInputChange(value: string) {
        this.tagInput = value;
        
        if (!value || value.trim() === '') {
            // Show all suggestions when field is empty
            this.filteredTechSuggestions = this.techSuggestions.filter(tech => 
                !this.selectedTags.includes(tech)
            );
            this.showTechSuggestions = true;
            this.cdr.detectChanges();
            return;
        }

        // Filter suggestions based on input and exclude already selected
        this.filteredTechSuggestions = this.techSuggestions.filter(tech =>
            tech.toLowerCase().includes(value.toLowerCase()) &&
            !this.selectedTags.includes(tech)
        );

        this.showTechSuggestions = this.filteredTechSuggestions.length > 0;
        this.cdr.detectChanges();
    }

    selectTech(tech: string) {
        // Check if tag already exists
        if (this.selectedTags.includes(tech)) {
            this.toast.warning(`"${tech}" is already added`);
            return;
        }
        
        // Add the selected tag
        this.selectedTags.push(tech);
        
        // Update the editingProject.tags field
        this.editingProject.tags = this.selectedTags.join(', ');
        
        // Clear input and hide suggestions
        this.tagInput = '';
        this.showTechSuggestions = false;
        
        this.cdr.detectChanges();
    }

    addCustomTag() {
        const tag = this.tagInput.trim();
        if (!tag) return;
        
        // Check if tag already exists
        if (this.selectedTags.includes(tag)) {
            this.toast.warning(`"${tag}" is already added`);
            this.tagInput = '';
            return;
        }
        
        // Add the custom tag
        this.selectedTags.push(tag);
        
        // Update the editingProject.tags field
        this.editingProject.tags = this.selectedTags.join(', ');
        
        // Clear input
        this.tagInput = '';
        this.showTechSuggestions = false;
        
        this.cdr.detectChanges();
    }

    removeTag(index: number) {
        this.selectedTags.splice(index, 1);
        
        // Update the editingProject.tags field
        this.editingProject.tags = this.selectedTags.join(', ');
        
        this.cdr.detectChanges();
    }

    onTagsBlur() {
        // Delay to allow click on suggestion
        setTimeout(() => {
            this.showTechSuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    onGalleryFilesSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        // Check if user is logged in
        if (!this.auth.isLoggedIn()) {
            this.toast.error('You must be logged in to upload images');
            return;
        }

        const files = Array.from(input.files);
        
        // Validate total number of images (max 10)
        if (this.galleryImages.length + files.length > 10) {
            this.toast.error('Maximum 10 gallery images allowed');
            return;
        }

        // Validate each file
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                this.toast.error(`${file.name} is not an image file`);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                this.toast.error(`${file.name} is larger than 5MB`);
                return;
            }
        }

        this.uploadGalleryImages(files);
    }

    uploadGalleryImages(files: File[]) {
        this.isUploadingGallery = true;
        let uploadedCount = 0;
        const totalFiles = files.length;

        files.forEach(file => {
            const formData = new FormData();
            formData.append('file', file);

            this.http.post<{ url: string }>(`${environment.apiUrl}/uploads/project-image`, formData)
                .subscribe({
                    next: (response) => {
                        this.galleryImages.push(response.url);
                        uploadedCount++;
                        
                        if (uploadedCount === totalFiles) {
                            this.isUploadingGallery = false;
                            this.cdr.detectChanges();
                            this.toast.success(`${totalFiles} image(s) uploaded successfully`);
                        }
                    },
                    error: (err) => {
                        uploadedCount++;
                        console.error('Gallery Upload Error:', err);
                        
                        if (uploadedCount === totalFiles) {
                            this.isUploadingGallery = false;
                            this.cdr.detectChanges();
                        }
                        
                        if (err.status === 401) {
                            this.toast.error('Authentication failed. Please log in again.');
                            this.auth.logout();
                            window.location.href = '/login';
                        } else {
                            this.toast.error(`Failed to upload ${file.name}`);
                        }
                    }
                });
        });
    }

    removeGalleryImage(index: number) {
        this.galleryImages.splice(index, 1);
        this.toast.success('Image removed from gallery');
    }

    onImageFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.toast.error('Image size must be less than 5MB');
            return;
        }

        this.uploadImage(file);
    }

    uploadImage(file: File) {
        // Check if user is logged in
        if (!this.auth.isLoggedIn()) {
            this.toast.error('You must be logged in to upload images');
            return;
        }

        this.isUploading = true;
        const formData = new FormData();
        formData.append('file', file);

        this.http.post<{ url: string }>(`${environment.apiUrl}/uploads/project-image`, formData)
            .subscribe({
                next: (response) => {
                    this.editingProject.imageUrl = response.url;
                    this.isUploading = false;
                    this.cdr.detectChanges();
                    this.toast.success('Image uploaded successfully');
                },
                error: (err) => {
                    this.isUploading = false;
                    this.cdr.detectChanges();
                    console.error('Image Upload Error:', err);
                    
                    if (err.status === 401) {
                        this.toast.error('Authentication failed. Please log in again.');
                        this.auth.logout();
                        window.location.href = '/login';
                    } else if (err.status === 400) {
                        this.toast.error(err.error?.message || 'Invalid file. Please check file type and size.');
                    } else if (err.status === 500) {
                        this.toast.error(err.error || 'Server error while uploading image');
                    } else {
                        this.toast.error('Failed to upload image. Please try again.');
                    }
                }
            });
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
            tags: this.selectedTags.join(', '),
            imageUrl: this.editingProject.imageUrl,
            gallery: this.galleryImages.length > 0 ? this.galleryImages : undefined,
            projectUrl: this.editingProject.projectUrl,
            gitHubUrl: this.editingProject.gitHubUrl,
            duration: this.editingProject.duration,
            views: this.editingProject.views || 0,
            isTrendy: this.editingProject.isTrendy || false
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

    getProjectTitle(project: ProjectEntry): string {
        return this.translationHelper.getTranslatedField(project, 'title');
    }

    getProjectDescription(project: ProjectEntry): string {
        return this.translationHelper.getTranslatedField(project, 'description');
    }

    getProjectNiche(project: ProjectEntry): string {
        return this.translationHelper.getTranslatedField(project, 'niche');
    }
}
