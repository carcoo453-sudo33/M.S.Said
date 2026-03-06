import { Component, Input, Output, EventEmitter, signal, computed, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronRight, Check, Circle } from 'lucide-angular';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: any;
  disabled?: boolean;
  separator?: boolean;
  shortcut?: string;
  checked?: boolean;
  type?: 'item' | 'checkbox' | 'radio';
  children?: DropdownMenuItem[];
}

@Component({
  selector: 'ui-dropdown-menu',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="relative inline-block">
      <!-- Trigger -->
      <div #trigger (click)="toggleMenu()" class="cursor-pointer">
        <ng-content select="[slot=trigger]"></ng-content>
      </div>

      <!-- Menu Content -->
      <div 
        *ngIf="isOpen()"
        #content
        [class]="menuClasses"
        (click)="$event.stopPropagation()">
        
        <div *ngFor="let item of items; trackBy: trackByFn">
          <!-- Separator -->
          <div *ngIf="item.separator" class="ui-dropdown-separator"></div>
          
          <!-- Regular Item -->
          <div 
            *ngIf="!item.separator && item.type !== 'checkbox' && item.type !== 'radio'"
            [class]="getItemClasses(item)"
            (click)="selectItem(item)">
            
            <lucide-icon 
              *ngIf="item.icon" 
              [img]="item.icon" 
              class="mr-2 h-4 w-4">
            </lucide-icon>
            
            <span>{{ item.label }}</span>
            
            <span *ngIf="item.shortcut" class="ui-dropdown-shortcut">
              {{ item.shortcut }}
            </span>
            
            <lucide-icon 
              *ngIf="item.children && item.children.length > 0"
              [img]="ChevronRightIcon" 
              class="ml-auto h-4 w-4">
            </lucide-icon>
          </div>

          <!-- Checkbox Item -->
          <div 
            *ngIf="item.type === 'checkbox'"
            [class]="getItemClasses(item)"
            (click)="toggleCheckbox(item)">
            
            <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
              <lucide-icon 
                *ngIf="item.checked"
                [img]="CheckIcon" 
                class="h-4 w-4">
              </lucide-icon>
            </span>
            
            <span class="pl-6">{{ item.label }}</span>
          </div>

          <!-- Radio Item -->
          <div 
            *ngIf="item.type === 'radio'"
            [class]="getItemClasses(item)"
            (click)="selectRadio(item)">
            
            <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
              <lucide-icon 
                *ngIf="item.checked"
                [img]="CircleIcon" 
                class="h-2 w-2 fill-current">
              </lucide-icon>
            </span>
            
            <span class="pl-6">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ui-dropdown-separator {
      @apply -mx-1 my-1 h-px bg-muted;
    }
    
    .ui-dropdown-shortcut {
      @apply ml-auto text-xs tracking-widest opacity-60;
    }
  `]
})
export class DropdownMenuComponent {
  @Input() items: DropdownMenuItem[] = [];
  @Input() className = '';
  @Input() align: 'start' | 'center' | 'end' = 'start';
  @Input() side: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Output() itemSelect = new EventEmitter<DropdownMenuItem>();
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  private _isOpen = signal(false);
  isOpen = computed(() => this._isOpen());

  ChevronRightIcon = ChevronRight;
  CheckIcon = Check;
  CircleIcon = Circle;

  get menuClasses(): string {
    const alignClasses = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0'
    };

    const sideClasses = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2 top-0',
      right: 'left-full ml-2 top-0'
    };

    return `absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 ${alignClasses[this.align]} ${sideClasses[this.side]} ${this.className}`;
  }

  toggleMenu() {
    const newState = !this._isOpen();
    this._isOpen.set(newState);
    this.openChange.emit(newState);
  }

  closeMenu() {
    this._isOpen.set(false);
    this.openChange.emit(false);
  }

  selectItem(item: DropdownMenuItem) {
    if (item.disabled) return;
    
    this.itemSelect.emit(item);
    this.closeMenu();
  }

  toggleCheckbox(item: DropdownMenuItem) {
    if (item.disabled) return;
    
    item.checked = !item.checked;
    this.itemSelect.emit(item);
  }

  selectRadio(item: DropdownMenuItem) {
    if (item.disabled) return;
    
    // Uncheck all radio items in the same group
    this.items.forEach(i => {
      if (i.type === 'radio') {
        i.checked = false;
      }
    });
    
    item.checked = true;
    this.itemSelect.emit(item);
  }

  getItemClasses(item: DropdownMenuItem): string {
    const baseClasses = 'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors';
    const disabledClasses = item.disabled ? 'pointer-events-none opacity-50' : 'hover:bg-accent hover:text-accent-foreground';
    
    return `${baseClasses} ${disabledClasses}`;
  }

  trackByFn(index: number, item: DropdownMenuItem): string {
    return item.id;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isOpen() && 
        !this.trigger?.nativeElement?.contains(event.target) && 
        !this.content?.nativeElement?.contains(event.target)) {
      this.closeMenu();
    }
  }
}