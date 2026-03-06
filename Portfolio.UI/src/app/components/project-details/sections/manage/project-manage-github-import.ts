import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Github } from 'lucide-angular';
import { ProjectService } from '../../../../services/project.service';
import { ToastService } from '../../../../services/toast.service';
import { ProjectEntry } from '../../../../models';

@Component({
    selector: 'app-project-manage-github-import',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <!-- GitHub Import Section -->
    <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
        <div class="flex items-center gap-2">
            <lucide-icon [img]="GithubIcon" class="w-4 h-4 text-red-600"></lucide-icon>
            <h3 class="text-sm font-black uppercase text-white">Import from GitHub</h3>
        </div>
        <p class="text-[10px] text-zinc-500">Automatically populate features and changelog from a GitHub repository</p>
        <div class="flex gap-2">
            <input type="text" [(ngModel)]="githubUrl" placeholder="https://github.com/owner/repo"
                class="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
            <button (click)="importFromGitHub()" [disabled]="isImporting || !githubUrl"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isImporting ? 'Importing...' : 'Import' }}
            </button>
        </div>
    </div>
  `
})
export class ProjectManageGithubImportComponent {
    private projectService = inject(ProjectService);
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);
    
    @Input() project?: ProjectEntry;
    @Input() githubUrl = '';
    @Output() githubUrlChange = new EventEmitter<string>();
    @Output() importCompleted = new EventEmitter<ProjectEntry>();

    GithubIcon = Github;
    isImporting = false;

    importFromGitHub() {
        if (!this.project || !this.githubUrl || this.isImporting) return;

        console.log('[GitHubImport] Starting GitHub import...');
        console.log('[GitHubImport] Project ID:', this.project.id);
        console.log('[GitHubImport] GitHub URL:', this.githubUrl);

        this.isImporting = true;
        this.cdr.detectChanges();

        this.projectService.importFromGitHub(this.project.id, this.githubUrl).subscribe({
            next: (updated: ProjectEntry) => {
                console.log('GitHub import successful - Full response:', updated);
                
                // Count imported items
                let importedCount = 0;
                const importedItems: string[] = [];
                
                if (updated.keyFeatures && updated.keyFeatures.length > 0) {
                    importedCount += updated.keyFeatures.length;
                    importedItems.push(`${updated.keyFeatures.length} Key Features`);
                }
                if (updated.responsibilities && updated.responsibilities.length > 0) {
                    importedCount += updated.responsibilities.length;
                    importedItems.push(`${updated.responsibilities.length} Responsibilities`);
                }
                if (updated.changelog && updated.changelog.length > 0) {
                    importedCount += updated.changelog.length;
                    importedItems.push(`${updated.changelog.length} Changelog Entries`);
                }

                if (updated.language) {
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
                this.importCompleted.emit(updated);
                this.cdr.detectChanges();
                
                if (importedCount > 0 || updated.imageUrl || (updated.gallery && updated.gallery.length > 0)) {
                    this.toast.success(`Successfully imported: ${importedItems.join(', ')}. Review and save changes.`);
                } else {
                    this.toast.warning('Import completed but no data was found. The repository may not have features, releases, screenshots folder, or README sections.');
                }
            },
            error: (err: any) => {
                console.error('Failed to import from GitHub:', err);
                
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