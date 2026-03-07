import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

export interface DropdownOption {
    value: any;
    label: string;
    disabled?: boolean;
    icon?: any;
}

@Component({
    selector: 'ui-dropdown',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
        <div class="relative">
            <!-- Label -->
            <label *ngIf="label" [for]="dropdownId" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">
                {{ label }}
                <span *ngIf="required" class="text-red-500 ml-1">*</span>
            </label>

            <!-- Dropdown Trigger -->
            <button
                [id]="dropdownId"
                type="button"
                [disabled]="disabled"
                [class]="triggerClasses"
                (click)="toggleDropdown()"
                [attr.aria-expanded]="isOpen"
                [attr.aria-haspopup]="true">
                
                <!-- Selected Option Content -->
                <div class="flex items-center gap-2 flex-1 text-left">
                    <lucide-icon 
                        *ngIf="selectedOption?.icon" 
                        [img]="selectedOption?.icon" 
                        class="w-4 h-4 text-zinc-500">
                    </lucide-icon>
                    <span [class.text-zinc-500]="!selectedOption">
                        {{ selectedOption?.label || placeholder }}
                    </span>
                </div>

                <!-- Chevron Icon -->
                <lucide-icon 
                    [img]="ChevronDownIcon" 
                    class="w-4 h-4 text-zinc-400 transition-transform duration-200"
                    [class.rotate-180]="isOpen">
                </lucide-icon>
            </button>

            <!-- Dropdown Menu -->
            <div 
                *ngIf="isOpen"
                [class]="menuClasses"
                role="listbox"
                [attr.aria-labelledby]="dropdownId">
                
                <!-- Search Input -->
                <div *ngIf="searchable" class="p-2 border-b border-zinc-200 dark:border-zinc-700">
                    <input
                        type="text"
                        placeholder="Search options..."
                        class="w-full px-3 py-2 text-sm bg-transparent border-none outline-none text-zinc-900 dark:text-white placeholder:text-zinc-500"
                        [(ngModel)]="searchTerm"
                        (input)="filterOptions()"
                        #searchInput>
                </div>

                <!-- Options List -->
                <div class="max-h-60 overflow-y-auto">
                    <button
                        *ngFor="let option of filteredOptions; trackBy: trackByValue"
                        type="button"
                        [disabled]="option.disabled"
                        [class]="getOptionClasses(option)"
                        (click)="selectOption(option)"
                        role="option"
                        [attr.aria-selected]="isSelected(option)">
                        
                        <div class="flex items-center gap-2">
                            <lucide-icon 
                                *ngIf="option.icon" 
                                [img]="option.icon" 
                                class="w-4 h-4">
                            </lucide-icon>
                            <span>{{ option.label }}</span>
                        </div>

                        <!-- Selected Indicator -->
                        <div *ngIf="isSelected(option)" class="w-2 h-2 bg-red-600 rounded-full"></div>
                    </button>

                    <!-- No Options Message -->
                    <div *ngIf="filteredOptions.length === 0" class="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 text-center">
                        {{ searchTerm ? 'No options found' : 'No options available' }}
                    </div>
                </div>
            </div>

            <!-- Helper Text -->
            <p *ngIf="helperText && !error" class="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                {{ helperText }}
            </p>

            <!-- Error Message -->
            <p *ngIf="error" class="text-xs text-red-500 dark:text-red-400 mt-1.5">
                {{ error }}
            </p>
        </div>
    `
})
export class DropdownComponent {
    @Input() label = '';
    @Input() placeholder = 'Select an option';
    @Input() options: DropdownOption[] = [];
    @Input() value: any = null;
    @Input() disabled = false;
    @Input() required = false;
    @Input() error = '';
    @Input() helperText = '';
    @Input() searchable = false;
    @Input() clearable = false;

    @Output() valueChange = new EventEmitter<any>();
    @Output() selectionChange = new EventEmitter<DropdownOption | null>();

    isOpen = false;
    searchTerm = '';
    filteredOptions: DropdownOption[] = [];
    dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;

    ChevronDownIcon = ChevronDown;

    constructor(private elementRef: ElementRef) {}

    ngOnInit(): void {
        this.filteredOptions = [...this.options];
    }

    ngOnChanges(): void {
        this.filteredOptions = [...this.options];
        this.filterOptions();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.closeDropdown();
        }
    }

    toggleDropdown(): void {
        if (this.disabled) return;
        
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.searchTerm = '';
            this.filterOptions();
        }
    }

    closeDropdown(): void {
        this.isOpen = false;
        this.searchTerm = '';
    }

    selectOption(option: DropdownOption): void {
        if (option.disabled) return;

        this.value = option.value;
        this.valueChange.emit(this.value);
        this.selectionChange.emit(option);
        this.closeDropdown();
    }

    filterOptions(): void {
        if (!this.searchTerm.trim()) {
            this.filteredOptions = [...this.options];
            return;
        }

        const term = this.searchTerm.toLowerCase();
        this.filteredOptions = this.options.filter(option =>
            option.label.toLowerCase().includes(term)
        );
    }

    isSelected(option: DropdownOption): boolean {
        return this.value === option.value;
    }

    trackByValue(index: number, option: DropdownOption): any {
        return option.value;
    }

    get selectedOption(): DropdownOption | undefined {
        return this.options.find(option => option.value === this.value);
    }

    get triggerClasses(): string {
        const baseClasses = 'w-full flex items-center justify-between px-4 py-2.5 text-sm border rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all';
        
        const stateClasses = this.error 
            ? 'border-red-500 ring-2 ring-red-500/30' 
            : 'border-zinc-200 dark:border-zinc-700';

        const disabledClasses = this.disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-zinc-300 dark:hover:border-zinc-600';

        return `${baseClasses} ${stateClasses} ${disabledClasses}`.trim();
    }

    get menuClasses(): string {
        return 'absolute z-20 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg animate-fade-in';
    }

    getOptionClasses(option: DropdownOption): string {
        const baseClasses = 'w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors';
        
        const stateClasses = option.disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer';

        const selectedClasses = this.isSelected(option)
            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            : 'text-zinc-900 dark:text-white';

        return `${baseClasses} ${stateClasses} ${selectedClasses}`.trim();
    }
}