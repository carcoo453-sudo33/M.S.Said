import { Component, inject, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectService } from '../../../../services/project.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
    selector: 'app-project-niche-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
        <!-- Niche Management Section -->
        <div class="space-y-4">
            <!-- Add New Niche -->
            <div class="flex gap-2">
                <input 
                    [(ngModel)]="newNicheName"
                    placeholder="Niche name"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                />
                <input 
                    [(ngModel)]="newNicheNameAr"
                    placeholder="Arabic name (optional)"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800  dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
                />
                <button 
                    (click)="addNewNiche()"
                    [disabled]="!newNicheName.trim()"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 hover:bg-red-700 transition-colors"
                >
                    Add
                </button>
            </div>

            <!-- Niches List -->
            <div class="space-y-2 max-h-40 overflow-y-auto">
                <div 
                    *ngFor="let niche of managedNiches" 
                    class="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                >
                    <div>
                        <span class="font-medium">{{ niche.name }}</span>
                        <span *ngIf="niche.name_Ar" class="text-sm text-zinc-600 dark:text-zinc-400 ml-2">({{ niche.name_Ar }})</span>
                    </div>
                    <button 
                        (click)="removeNiche(niche.id)"
                        class="text-red-600 hover:text-red-800 text-sm"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    `
})
export class ProjectNicheManagerComponent {
    private projectService = inject(ProjectService);
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);

    @Input() managedNiches: any[] = [];
    @Output() nichesUpdated = new EventEmitter<void>();

    newNicheName = '';
    newNicheNameAr = '';

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
                this.nichesUpdated.emit();
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
                this.nichesUpdated.emit();
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to delete niche:', err);
                this.toast.error('Failed to remove niche');
            }
        });
    }
}