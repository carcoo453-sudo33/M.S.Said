import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectService } from '../../../../services/project.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
    selector: 'app-project-data-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
        <!-- This component handles loading and managing project data suggestions -->
        <div class="hidden">Data Manager Component</div>
    `
})
export class ProjectDataManagerComponent {
    private projectService = inject(ProjectService);
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);

    // Category and Niche options (loaded from backend)
    categories: string[] = [];
    categoryArSuggestions: string[] = [];
    nicheSuggestions: string[] = [];
    nicheArSuggestions: string[] = [];

    // Technology suggestions for tags (loaded from backend)
    techSuggestions: string[] = [];

    // Company suggestions (loaded from backend)
    companySuggestions: string[] = [];
    companyArSuggestions: string[] = [];
    filteredCompanySuggestions: string[] = [];
    showCompanySuggestions = false;
    filteredCompanyArSuggestions: string[] = [];
    showCompanyArSuggestions = false;

    // Manager modals
    managedCategories: any[] = [];
    managedNiches: any[] = [];

    loadTagSuggestions() {
        this.projectService.getTagSuggestions().subscribe({
            next: (tags) => {
                this.techSuggestions = tags.sort();
            },
            error: (err) => console.error('Failed to load tag suggestions:', err)
        });
    }

    loadCategorySuggestions() {
        this.projectService.getCategories().subscribe({
            next: (categories) => {
                this.managedCategories = categories;
                this.categories = categories.map((c: any) => c.name).sort();
                this.categoryArSuggestions = categories
                    .map((c: any) => c.name_Ar)
                    .filter((name: string) => !!name && name.trim() !== '')
                    .sort();
            },
            error: (err) => console.error('Failed to load categories:', err)
        });
    }

    loadCompanySuggestions() {
        this.projectService.getCompanySuggestions().subscribe({
            next: (companies) => {
                this.companySuggestions = companies.map((c: any) => c.name).sort();
                this.companyArSuggestions = companies
                    .map((c: any) => c.name_Ar)
                    .filter((name: string) => !!name && name.trim() !== '')
                    .sort();
            },
            error: (err) => console.error('Failed to load company suggestions:', err)
        });
    }

    loadNicheSuggestions() {
        this.projectService.getNiches().subscribe({
            next: (niches) => {
                this.managedNiches = niches;
                this.nicheSuggestions = niches.map((n: any) => n.name).sort();
                this.nicheArSuggestions = niches
                    .map((n: any) => n.name_Ar)
                    .filter((name: string) => !!name && name.trim() !== '')
                    .sort();
            },
            error: (err) => console.error('Failed to load niches:', err)
        });
    }

    // Company autocomplete methods
    onCompanyInput(value: string, editingProject: any) {
        this.filteredCompanySuggestions = !value || value.trim() === '' 
            ? this.companySuggestions 
            : this.companySuggestions.filter(company => company.toLowerCase().includes(value.toLowerCase()));
        this.showCompanySuggestions = true;
        this.cdr.detectChanges();
    }

    selectCompany(company: string, editingProject: any) {
        editingProject.company = company;
        this.showCompanySuggestions = false;
        this.cdr.detectChanges();
    }

    onCompanyBlur() {
        setTimeout(() => {
            this.showCompanySuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    onCompanyArInput(value: string, editingProject: any) {
        this.filteredCompanyArSuggestions = !value || value.trim() === '' 
            ? this.companyArSuggestions 
            : this.companyArSuggestions.filter(company => company.includes(value));
        this.showCompanyArSuggestions = true;
        this.cdr.detectChanges();
    }

    selectCompanyAr(company: string, editingProject: any) {
        editingProject.company_Ar = company;
        this.showCompanyArSuggestions = false;
        this.cdr.detectChanges();
    }

    onCompanyArBlur() {
        setTimeout(() => {
            this.showCompanyArSuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }
}