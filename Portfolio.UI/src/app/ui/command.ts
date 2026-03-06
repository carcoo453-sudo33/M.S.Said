import { Component, Input, Output, EventEmitter, signal, computed, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search } from 'lucide-angular';

export interface CommandItem {
  id: string;
  label: string;
  value: string;
  keywords?: string[];
  group?: string;
  disabled?: boolean;
  icon?: any;
}

export interface CommandGroup {
  heading: string;
  items: CommandItem[];
}

@Component({
  selector: 'ui-command',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div [class]="commandClasses">
      <!-- Search Input -->
      <div class="flex items-center border-b px-3">
        <lucide-icon [img]="SearchIcon" class="mr-2 h-4 w-4 shrink-0 opacity-50"></lucide-icon>
        <input
          #searchInput
          type="text"
          [(ngModel)]="searchQuery"
          [placeholder]="placeholder"
          (input)="onSearchChange()"
          [class]="inputClasses"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false" />
      </div>

      <!-- Command List -->
      <div [class]="listClasses">
        <!-- Empty State -->
        <div *ngIf="filteredItems().length === 0" class="py-6 text-center text-sm">
          {{ emptyMessage }}
        </div>

        <!-- Groups -->
        <div *ngFor="let group of groupedItems(); trackBy: trackGroupByFn">
          <!-- Group Heading -->
          <div *ngIf="group.heading" [class]="groupHeadingClasses">
            {{ group.heading }}
          </div>

          <!-- Group Items -->
          <div 
            *ngFor="let item of group.items; let i = index; trackBy: trackItemByFn"
            [class]="getItemClasses(item, i)"
            [attr.data-selected]="selectedIndex() === getGlobalIndex(group, i)"
            (click)="selectItem(item)"
            (mouseenter)="setSelectedIndex(getGlobalIndex(group, i))">
            
            <lucide-icon 
              *ngIf="item.icon" 
              [img]="item.icon" 
              class="mr-2 h-4 w-4">
            </lucide-icon>
            
            <span>{{ item.label }}</span>
            
            <span *ngIf="item.keywords && item.keywords.length > 0" class="ml-auto text-xs text-muted-foreground">
              {{ item.keywords.join(', ') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  host: {
    '(keydown)': 'onKeyDown($event)'
  }
})
export class CommandComponent implements AfterViewInit {
  @Input() items: CommandItem[] = [];
  @Input() placeholder = 'Type a command or search...';
  @Input() emptyMessage = 'No results found.';
  @Input() className = '';
  @Input() filter = true;
  @Output() itemSelect = new EventEmitter<CommandItem>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  SearchIcon = Search;

  searchQuery = '';
  private _selectedIndex = signal(-1);
  selectedIndex = this._selectedIndex.asReadonly();

  get commandClasses(): string {
    return `flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground ${this.className}`;
  }

  get inputClasses(): string {
    return 'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50';
  }

  get listClasses(): string {
    return 'max-h-[300px] overflow-y-auto overflow-x-hidden';
  }

  get groupHeadingClasses(): string {
    return 'px-2 py-1.5 text-xs font-medium text-muted-foreground';
  }

  filteredItems = computed(() => {
    if (!this.filter || !this.searchQuery.trim()) {
      return this.items;
    }

    const query = this.searchQuery.toLowerCase();
    return this.items.filter(item => {
      const labelMatch = item.label.toLowerCase().includes(query);
      const valueMatch = item.value.toLowerCase().includes(query);
      const keywordMatch = item.keywords?.some(keyword => 
        keyword.toLowerCase().includes(query)
      );
      
      return labelMatch || valueMatch || keywordMatch;
    });
  });

  groupedItems = computed(() => {
    const items = this.filteredItems();
    const groups = new Map<string, CommandItem[]>();
    
    items.forEach(item => {
      const groupName = item.group || '';
      if (!groups.has(groupName)) {
        groups.set(groupName, []);
      }
      groups.get(groupName)!.push(item);
    });

    const result: CommandGroup[] = [];
    groups.forEach((items, heading) => {
      result.push({ heading, items });
    });

    return result;
  });

  ngAfterViewInit() {
    // Focus the search input
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    });
  }

  onSearchChange() {
    this._selectedIndex.set(-1);
  }

  onKeyDown(event: KeyboardEvent) {
    const totalItems = this.getTotalItemCount();
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = this.selectedIndex() < totalItems - 1 ? this.selectedIndex() + 1 : 0;
        this._selectedIndex.set(nextIndex);
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = this.selectedIndex() > 0 ? this.selectedIndex() - 1 : totalItems - 1;
        this._selectedIndex.set(prevIndex);
        break;
        
      case 'Enter':
        event.preventDefault();
        const selectedItem = this.getItemByGlobalIndex(this.selectedIndex());
        if (selectedItem && !selectedItem.disabled) {
          this.selectItem(selectedItem);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        this.searchInput?.nativeElement?.blur();
        break;
    }
  }

  selectItem(item: CommandItem) {
    if (!item.disabled) {
      this.itemSelect.emit(item);
    }
  }

  setSelectedIndex(index: number) {
    this._selectedIndex.set(index);
  }

  getItemClasses(item: CommandItem, localIndex: number): string {
    const baseClasses = 'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none';
    const globalIndex = this.getGlobalIndex(this.getCurrentGroup(item), localIndex);
    
    let classes = baseClasses;
    
    if (item.disabled) {
      classes += ' pointer-events-none opacity-50';
    } else if (this.selectedIndex() === globalIndex) {
      classes += ' bg-accent text-accent-foreground';
    } else {
      classes += ' hover:bg-accent hover:text-accent-foreground';
    }
    
    return classes;
  }

  getGlobalIndex(group: CommandGroup, localIndex: number): number {
    const groups = this.groupedItems();
    let globalIndex = 0;
    
    for (const g of groups) {
      if (g === group) {
        return globalIndex + localIndex;
      }
      globalIndex += g.items.length;
    }
    
    return -1;
  }

  getItemByGlobalIndex(globalIndex: number): CommandItem | null {
    const groups = this.groupedItems();
    let currentIndex = 0;
    
    for (const group of groups) {
      if (globalIndex < currentIndex + group.items.length) {
        return group.items[globalIndex - currentIndex];
      }
      currentIndex += group.items.length;
    }
    
    return null;
  }

  getCurrentGroup(item: CommandItem): CommandGroup {
    return this.groupedItems().find(group => 
      group.items.some(i => i.id === item.id)
    ) || { heading: '', items: [] };
  }

  getTotalItemCount(): number {
    return this.groupedItems().reduce((total, group) => total + group.items.length, 0);
  }

  trackGroupByFn(index: number, group: CommandGroup): string {
    return group.heading;
  }

  trackItemByFn(index: number, item: CommandItem): string {
    return item.id;
  }
}