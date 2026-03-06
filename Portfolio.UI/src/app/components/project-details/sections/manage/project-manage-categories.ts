import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../../services/project.service';

@Component({
    selector: 'app-project-manage-categories',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="grid grid-cols-2 gap-6">
        <!-- Category EN -->
        <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Category (EN)</label>
            <input [(ngModel)]="editData.category" placeholder="e.g. Frontend, Backend"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
        </div>

        <!-- Category AR -->
        <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Category (AR)</label>
            <input [(ngModel)]="editData.category_Ar" placeholder="الفئة" dir="rtl"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
        </div>

        <!-- Niche EN -->
        <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Niche (EN)</label>
            <input [(ngModel)]="editData.niche" placeholder="e.g. SaaS & Productivity"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
        </div>

        <!-- Niche AR -->
        <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Niche (AR)</label>
            <input [(ngModel)]="editData.niche_Ar" placeholder="التخصص" dir="rtl"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
        </div>

        <!-- Company EN -->
        <div class="relative">
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Company (EN)</label>
            <input [(ngModel)]="editData.company" 
                (input)="onCompanyInput($any($event.target).value)"
                (focus)="onCompanyInput(editData.company || '')" 
                (blur)="onCompanyBlur()"
                placeholder="e.g. WE3DS, Remote"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
            
            <!-- Company Suggestions Dropdown -->
            <div *ngIf="showCompanySuggestions && filteredCompanySuggestions.length > 0"
                class="absolute z-20 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                <button *ngFor="let suggestion of filteredCompanySuggestions"
                    (click)="selectCompany(suggestion)" type="button"
                    class="w-full px-4 py-2 text-left text-sm text-white hover:bg-zinc-700 transition-colors">
                    {{ suggestion }}
                </button>
            </div>
        </div>

        <!-- Company AR -->
        <div class="relative">
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Company (AR)</label>
            <input [(ngModel)]="editData.company_Ar" 
                (input)="onCompanyArInput($any($event.target).value)"
                (focus)="onCompanyArInput(editData.company_Ar || '')" 
                (blur)="onCompanyArBlur()"
                placeholder="الشركة" dir="rtl"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
            
            <!-- Company AR Suggestions Dropdown -->
            <div *ngIf="showCompanyArSuggestions && filteredCompanyArSuggestions.length > 0"
                class="absolute z-20 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                <button *ngFor="let suggestion of filteredCompanyArSuggestions"
                    (click)="selectCompanyAr(suggestion)" type="button"
                    class="w-full px-4 py-2 text-right text-sm text-white hover:bg-zinc-700 transition-colors"
                    dir="rtl">
                    {{ suggestion }}
                </button>
            </div>
        </div>
    </div>
  `
})
export class ProjectManageCategoriesComponent implements OnInit {
    private projectService = inject(ProjectService);
    private cdr = inject(ChangeDetectorRef);
    
    @Input() editData: any = {};

    // Company suggestions - loaded dynamically from backend
    companySuggestions: string[] = [];
    filteredCompanySuggestions: string[] = [];
    showCompanySuggestions = false;

    companyArSuggestions: string[] = [];
    filteredCompanyArSuggestions: string[] = [];
    showCompanyArSuggestions = false;

    ngOnInit() {
        this.loadCompanySuggestions();
    }

    private loadCompanySuggestions() {
        this.projectService.getCompanySuggestions().subscribe({
            next: (suggestions) => {
                // Extract English and Arabic company names from the API response
                this.companySuggestions = suggestions.map((item: any) => item.name || item).filter(Boolean);
                this.companyArSuggestions = suggestions.map((item: any) => item.name_Ar || item.nameAr || item).filter(Boolean);
            },
            error: (err) => {
                console.error('Failed to load company suggestions:', err);
                // Fallback to empty arrays - user can still add custom companies
                this.companySuggestions = [];
                this.companyArSuggestions = [];
            }
        });
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
        this.editData.company = company;
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
        this.editData.company_Ar = company;
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