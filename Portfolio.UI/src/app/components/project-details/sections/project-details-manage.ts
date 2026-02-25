import { Component, Input, Output, EventEmitter, inject, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Edit, Save, X, Plus, Trash2, Code, Clock, Layers, CheckCircle, Github } from 'lucide-angular';
import { ProjectEntry, KeyFeature, ChangelogItem, Metric } from '../../../models';
import { ProjectService } from '../../../services/project.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-project-details-manage',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div *ngIf="project && isEditing" class="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/90 backdrop-blur-sm overflow-y-auto">
        <div class="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-6xl my-8 animate-scale-in">
            <!-- Header -->
            <div class="flex items-center justify-between p-8 border-b border-zinc-800">
                <h2 class="text-2xl font-black italic uppercase tracking-tighter text-white">Manage Project Details</h2>
                <button (click)="closeModal()" class="text-zinc-400 hover:text-white transition-colors">
                    <lucide-icon [img]="XIcon" class="w-6 h-6"></lucide-icon>
                </button>
            </div>

            <!-- GitHub Import Section -->
            <div class="px-8 pt-8">
                <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                    <div class="flex items-center gap-3">
                        <lucide-icon [img]="GithubIcon" class="w-5 h-5 text-red-600"></lucide-icon>
                        <h3 class="text-sm font-black uppercase text-white">Import from GitHub</h3>
                    </div>
                    <p class="text-xs text-zinc-500">Automatically populate features, changelog, and metrics from a GitHub repository</p>
                    <div class="flex gap-3">
                        <input type="text" [(ngModel)]="githubUrl" placeholder="https://github.com/owner/repo"
                            class="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm focus:border-red-600 outline-none">
                        <button (click)="importFromGitHub()" [disabled]="isImporting || !githubUrl"
                            class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-xs font-black uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ isImporting ? 'Importing...' : 'Import' }}
                        </button>
                    </div>
                    <p class="text-[10px] text-zinc-600">Optional: Add GitHub token in settings for private repos and higher rate limits</p>
                </div>
            </div>

            <!-- Content -->
            <div class="p-8 space-y-12 max-h-[70vh] overflow-y-auto">
                <!-- Project Metadata -->
                <section class="space-y-6">
                    <h3 class="text-lg font-black uppercase text-red-600">Project Metadata</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                                <lucide-icon [img]="CodeIcon" class="w-3 h-3 inline mr-1"></lucide-icon>
                                Language
                            </label>
                            <input type="text" [(ngModel)]="editData.language"
                                class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                                <lucide-icon [img]="ClockIcon" class="w-3 h-3 inline mr-1"></lucide-icon>
                                Duration
                            </label>
                            <input type="text" [(ngModel)]="editData.duration"
                                class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                                <lucide-icon [img]="LayersIcon" class="w-3 h-3 inline mr-1"></lucide-icon>
                                Architecture
                            </label>
                            <input type="text" [(ngModel)]="editData.architecture"
                                class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                                <lucide-icon [img]="CheckIcon" class="w-3 h-3 inline mr-1"></lucide-icon>
                                Status
                            </label>
                            <select [(ngModel)]="editData.status"
                                class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Archived">Archived</option>
                            </select>
                        </div>
                    </div>
                </section>

                <!-- Key Features -->
                <section class="space-y-6">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-black uppercase text-red-600">Key Features</h3>
                        <button (click)="addFeature()" 
                            class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-colors">
                            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                            Add Feature
                        </button>
                    </div>
                    <div class="space-y-4">
                        <div *ngFor="let feature of editData.keyFeatures; let i = index"
                            class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-black uppercase text-zinc-600">Feature {{i + 1}}</span>
                                <button (click)="removeFeature(i)" 
                                    class="text-red-600 hover:text-red-500 transition-colors">
                                    <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                                </button>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Icon</label>
                                    <select [(ngModel)]="feature.icon"
                                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                                        <option value="Layers">Layers</option>
                                        <option value="Rocket">Rocket</option>
                                        <option value="Monitor">Monitor</option>
                                        <option value="Code">Code</option>
                                    </select>
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Title (EN)</label>
                                    <input type="text" [(ngModel)]="feature.title"
                                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                                </div>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Title (AR)</label>
                                <input type="text" [(ngModel)]="feature.title_Ar" dir="rtl"
                                    placeholder="العنوان"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Description (EN)</label>
                                <textarea [(ngModel)]="feature.description" rows="2"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none resize-none"></textarea>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Description (AR)</label>
                                <textarea [(ngModel)]="feature.description_Ar" rows="2" dir="rtl"
                                    placeholder="الوصف"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none resize-none"></textarea>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Responsibilities -->
                <section class="space-y-6">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-black uppercase text-red-600">Responsibilities</h3>
                        <button (click)="addResponsibility()" 
                            class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-colors">
                            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                            Add
                        </button>
                    </div>
                    <div class="space-y-3">
                        <div *ngFor="let resp of editData.responsibilities; let i = index"
                            class="flex gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                            <input type="text" [(ngModel)]="editData.responsibilities[i]"
                                class="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                            <button (click)="removeResponsibility(i)" 
                                class="text-red-600 hover:text-red-500 transition-colors">
                                <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Changelog -->
                <section class="space-y-6">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-black uppercase text-red-600">Changelog</h3>
                        <button (click)="addChangelogItem()" 
                            class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-colors">
                            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                            Add Entry
                        </button>
                    </div>
                    <div class="space-y-4">
                        <div *ngFor="let item of editData.changelog; let i = index"
                            class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-black uppercase text-zinc-600">Entry {{i + 1}}</span>
                                <button (click)="removeChangelogItem(i)" 
                                    class="text-red-600 hover:text-red-500 transition-colors">
                                    <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                                </button>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Date</label>
                                    <input type="text" [(ngModel)]="item.date"
                                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Version</label>
                                    <input type="text" [(ngModel)]="item.version"
                                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Title (EN)</label>
                                    <input type="text" [(ngModel)]="item.title"
                                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                                </div>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Title (AR)</label>
                                <input type="text" [(ngModel)]="item.title_Ar" dir="rtl"
                                    placeholder="العنوان"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Description (EN)</label>
                                <textarea [(ngModel)]="item.description" rows="2"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none resize-none"></textarea>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Description (AR)</label>
                                <textarea [(ngModel)]="item.description_Ar" rows="2" dir="rtl"
                                    placeholder="الوصف"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none resize-none"></textarea>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Metrics -->
                <section class="space-y-6">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-black uppercase text-red-600">Metrics</h3>
                        <button (click)="addMetric()" 
                            class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-colors">
                            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                            Add Metric
                        </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div *ngFor="let metric of editData.metrics; let i = index"
                            class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-black uppercase text-zinc-600">Metric {{i + 1}}</span>
                                <button (click)="removeMetric(i)" 
                                    class="text-red-600 hover:text-red-500 transition-colors">
                                    <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                                </button>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Label (EN)</label>
                                    <input type="text" [(ngModel)]="metric.label"
                                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Value</label>
                                    <input type="text" [(ngModel)]="metric.value"
                                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                                </div>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Label (AR)</label>
                                <input type="text" [(ngModel)]="metric.label_Ar" dir="rtl"
                                    placeholder="التسمية"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Trend (optional)</label>
                                <input type="text" [(ngModel)]="metric.trend" placeholder="+12%"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                            </div>
                        </div>
                    </div>
                </section>
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
export class ProjectDetailsManageComponent implements OnChanges {
    private projectService = inject(ProjectService);
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);
    
    @Input() project?: ProjectEntry;
    @Input() canEdit = false;
    @Input() triggerEdit = false;
    @Output() onUpdate = new EventEmitter<ProjectEntry>();

    EditIcon = Edit;
    SaveIcon = Save;
    XIcon = X;
    PlusIcon = Plus;
    TrashIcon = Trash2;
    CodeIcon = Code;
    ClockIcon = Clock;
    LayersIcon = Layers;
    CheckIcon = CheckCircle;
    GithubIcon = Github;

    isEditing = false;
    isSaving = false;
    isImporting = false;
    githubUrl = '';
    editData: any = {};

    ngOnChanges() {
        if (this.triggerEdit && !this.isEditing) {
            this.openModal();
        }
    }

    openModal() {
        if (!this.project) return;
        
        this.editData = {
            language: this.project.language || '',
            duration: this.project.duration || '',
            architecture: this.project.architecture || '',
            status: this.project.status || 'Active',
            keyFeatures: JSON.parse(JSON.stringify(this.project.keyFeatures || [])),
            responsibilities: [...(this.project.responsibilities || [])],
            changelog: JSON.parse(JSON.stringify(this.project.changelog || [])),
            metrics: JSON.parse(JSON.stringify(this.project.metrics || []))
        };
        
        // Pre-fill GitHub URL if available
        this.githubUrl = this.project.gitHubUrl || '';
        
        this.isEditing = true;
    }

    closeModal() {
        this.isEditing = false;
    }

    // Key Features
    addFeature() {
        this.editData.keyFeatures.push({
            icon: 'Layers',
            title: '',
            description: ''
        });
    }

    removeFeature(index: number) {
        this.editData.keyFeatures.splice(index, 1);
    }

    // Responsibilities
    addResponsibility() {
        this.editData.responsibilities.push('');
    }

    removeResponsibility(index: number) {
        this.editData.responsibilities.splice(index, 1);
    }

    // Changelog
    addChangelogItem() {
        this.editData.changelog.push({
            date: '',
            version: '',
            title: '',
            description: ''
        });
    }

    removeChangelogItem(index: number) {
        this.editData.changelog.splice(index, 1);
    }

    // Metrics
    addMetric() {
        this.editData.metrics.push({
            label: '',
            value: '',
            trend: ''
        });
    }

    removeMetric(index: number) {
        this.editData.metrics.splice(index, 1);
    }

    saveChanges() {
        if (!this.project || this.isSaving) return;

        this.isSaving = true;

        const updatedProject = {
            ...this.project,
            language: this.editData.language,
            duration: this.editData.duration,
            architecture: this.editData.architecture,
            status: this.editData.status,
            keyFeatures: this.editData.keyFeatures,
            responsibilities: this.editData.responsibilities.filter((r: string) => r.trim()),
            changelog: this.editData.changelog,
            metrics: this.editData.metrics
        };

        this.projectService.updateProject(this.project.id, updatedProject).subscribe({
            next: (updated) => {
                console.log('Project updated successfully:', updated);
                this.onUpdate.emit(updated);
                this.isEditing = false;
                this.isSaving = false;
                this.cdr.detectChanges();
                this.toast.success('Project details updated successfully');
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

    importFromGitHub() {
        if (!this.project || !this.githubUrl || this.isImporting) return;

        console.log('[ManageComponent] Starting GitHub import...');
        console.log('[ManageComponent] Project ID:', this.project.id);
        console.log('[ManageComponent] GitHub URL:', this.githubUrl);

        this.isImporting = true;
        this.cdr.detectChanges();

        this.projectService.importFromGitHub(this.project.id, this.githubUrl).subscribe({
            next: (updated: ProjectEntry) => {
                console.log('GitHub import successful - Full response:', updated);
                console.log('Key Features:', updated.keyFeatures);
                console.log('Responsibilities:', updated.responsibilities);
                console.log('Changelog:', updated.changelog);
                console.log('Metrics:', updated.metrics);
                console.log('Language:', updated.language);
                console.log('Image URL:', updated.imageUrl);
                console.log('Gallery:', updated.gallery);
                
                // Count imported items
                let importedCount = 0;
                const importedItems: string[] = [];
                
                // Update the edit data with imported values (only if they exist)
                if (updated.keyFeatures && updated.keyFeatures.length > 0) {
                    this.editData.keyFeatures = JSON.parse(JSON.stringify(updated.keyFeatures));
                    importedCount += updated.keyFeatures.length;
                    importedItems.push(`${updated.keyFeatures.length} Key Features`);
                }
                if (updated.responsibilities && updated.responsibilities.length > 0) {
                    this.editData.responsibilities = [...updated.responsibilities];
                    importedCount += updated.responsibilities.length;
                    importedItems.push(`${updated.responsibilities.length} Responsibilities`);
                }
                if (updated.changelog && updated.changelog.length > 0) {
                    this.editData.changelog = JSON.parse(JSON.stringify(updated.changelog));
                    importedCount += updated.changelog.length;
                    importedItems.push(`${updated.changelog.length} Changelog Entries`);
                }
                if (updated.metrics && updated.metrics.length > 0) {
                    this.editData.metrics = JSON.parse(JSON.stringify(updated.metrics));
                    importedCount += updated.metrics.length;
                    importedItems.push(`${updated.metrics.length} Metrics`);
                }
                if (updated.language) {
                    this.editData.language = updated.language;
                    importedItems.push(`Language: ${updated.language}`);
                }
                
                // Note: Images are already saved to the project, just inform the user
                if (updated.imageUrl) {
                    importedItems.push('Main Image');
                }
                if (updated.gallery && updated.gallery.length > 0) {
                    importedItems.push(`${updated.gallery.length} Gallery Images`);
                }
                
                this.isImporting = false;
                this.cdr.detectChanges();
                
                if (importedCount > 0 || updated.imageUrl || (updated.gallery && updated.gallery.length > 0)) {
                    this.toast.success(`Successfully imported: ${importedItems.join(', ')}. Review and save changes.`);
                } else {
                    this.toast.warning('Import completed but no data was found. The repository may not have features, releases, screenshots folder, or README sections.');
                }
            },
            error: (err: any) => {
                console.error('Failed to import from GitHub:', err);
                console.error('Error details:', {
                    status: err.status,
                    statusText: err.statusText,
                    message: err.message,
                    error: err.error,
                    url: err.url
                });
                
                this.isImporting = false;
                this.cdr.detectChanges();
                
                let errorMessage = 'Failed to import from GitHub. ';
                if (err.status === 401) {
                    errorMessage = 'Your session has expired. Please log in again.';
                } else if (err.status === 404) {
                    errorMessage = 'Repository not found. Please check the URL.';
                } else if (err.error?.message) {
                    errorMessage += err.error.message;
                } else {
                    errorMessage += 'Please check the URL and try again.';
                }
                
                this.toast.error(errorMessage);
            }
        });
    }
}
