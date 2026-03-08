import { Component, inject, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Download, Loader } from 'lucide-angular';
import { ProjectService } from '../../../../services/project.service';
import { ToastService } from '../../../../services/toast.service';
import { ProjectEntry } from '../../../../models';
import { KeyFeature, ChangelogItem, Responsibility } from '../../../../models/project.model';

@Component({
    selector: 'app-project-import-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
    template: `
        <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Import from URL</h3>
            <div class="space-y-4">
                <div class="flex gap-2">
                    <input 
                        id="import-url-field"
                        name="import-url-field"
                        [(ngModel)]="importUrl"
                        placeholder="Enter GitHub repository URL or project URL"
                        class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all font-medium"
                        [disabled]="isImporting"
                        (keyup.enter)="importFromUrl()"
                    />
                    <button 
                        (click)="importFromUrl()"
                        [disabled]="!importUrl.trim() || isImporting"
                        class="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-black/5"
                    >
                        <lucide-icon [img]="isImporting ? LoaderIcon : DownloadIcon" 
                                     class="w-4 h-4" 
                                     [class.animate-spin]="isImporting">
                        </lucide-icon>
                        {{ isImporting ? 'Importing...' : 'Import' }}
                    </button>
                </div>
                
                <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <span class="w-1 h-1 rounded-full bg-red-600"></span>
                    Supported: GitHub, Behance, and other common project URLs
                </p>
            </div>
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
    @Output() responsibilitiesImported = new EventEmitter<Responsibility[]>();
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