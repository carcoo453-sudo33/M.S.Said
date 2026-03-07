import { Component, inject, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Download, Loader } from 'lucide-angular';
import { ProjectService } from '../../../../services/project.service';
import { ToastService } from '../../../../services/toast.service';
import { ProjectEntry } from '../../../../models';
import { KeyFeature, ChangelogItem } from '../../../../models/project.model';

@Component({
    selector: 'app-project-import-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
    template: `
        <!-- Import from URL Section -->
        <div class="space-y-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <h3 class="text-lg font-semibold">Import from GitHub/URL</h3>
            
            <div class="flex gap-2">
                <input 
                    [(ngModel)]="importUrl"
                    placeholder="Enter GitHub repository URL or project URL"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                    [disabled]="isImporting"
                />
                <button 
                    (click)="importFromUrl()"
                    [disabled]="!importUrl.trim() || isImporting"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2 hover:bg-red-700 transition-colors"
                >
                    <lucide-icon [img]="isImporting ? LoaderIcon : DownloadIcon" 
                                 class="w-4 h-4" 
                                 [class.animate-spin]="isImporting">
                    </lucide-icon>
                    {{ isImporting ? 'Importing...' : 'Import' }}
                </button>
            </div>
            
            <p class="text-sm text-red-700 dark:text-red-400">
                Import project data from GitHub repositories or other project URLs. 
                This will automatically fill in available information like title, description, and technologies.
            </p>
        </div>
    `
})
export class ProjectImportManagerComponent {
    private projectService = inject(ProjectService);
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);

    @Input() editingProject: Partial<ProjectEntry> = {};
    @Input() isImporting = false;
    @Input() importUrl = '';

    @Output() editingProjectChange = new EventEmitter<Partial<ProjectEntry>>();
    @Output() isImportingChange = new EventEmitter<boolean>();
    @Output() importUrlChange = new EventEmitter<string>();
    @Output() responsibilitiesImported = new EventEmitter<string[]>();
    @Output() keyFeaturesImported = new EventEmitter<KeyFeature[]>();
    @Output() changelogImported = new EventEmitter<ChangelogItem[]>();

    DownloadIcon = Download;
    LoaderIcon = Loader;

    importFromUrl() {
        if (!this.importUrl || this.isImporting) return;

        this.isImporting = true;
        this.isImportingChange.emit(this.isImporting);

        this.projectService.importFromUrl(this.importUrl).subscribe({
            next: (importedData) => {
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
                    status: (importedData.status && importedData.status.trim()) || this.editingProject.status || ''
                };

                this.editingProjectChange.emit(this.editingProject);

                if (importedData.responsibilities && importedData.responsibilities.length > 0) {
                    this.responsibilitiesImported.emit(importedData.responsibilities);
                }

                if (importedData.keyFeatures && importedData.keyFeatures.length > 0) {
                    this.keyFeaturesImported.emit(importedData.keyFeatures);
                }

                if (importedData.changelog && importedData.changelog.length > 0) {
                    this.changelogImported.emit(importedData.changelog);
                }

                this.isImporting = false;
                this.isImportingChange.emit(this.isImporting);
                this.cdr.detectChanges();
                this.toast.success('Project data imported successfully! Review and complete any missing fields, then save.');
            },
            error: (err) => {
                this.editingProject.gitHubUrl = this.importUrl;
                this.editingProjectChange.emit(this.editingProject);
                
                this.isImporting = false;
                this.isImportingChange.emit(this.isImporting);

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
}