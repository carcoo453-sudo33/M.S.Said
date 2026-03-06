import { Component, Input, Output, EventEmitter, signal, computed, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronRight, Check, Circle } from 'lucide-angular';

export interface MenubarItem {
  id: string;
  label: string;
  type?: 'item' | 'checkbox' | 'radio' | 'separator';
  disabled?: boolean;
  checked?: boolean;
  shortcut?: string;
  icon?: any;
  children?: MenubarItem[];
}

export interface MenubarMenu {
  id: string;
  label: string;
  items: MenubarItem[];
}

@Component({
  selector: 'ui-menubar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [class]="menubarClasses">
      <div 
        *ngFor="let menu of menus; trackBy: trackMenuByFn"
        class="relative">
        
        <!-- Menu Trigger -->
        <button
          [class]="getTriggerClasses(menu)"
          (click)="toggleMenu(menu.id)"
          [attr.aria-expanded]="activeMenu() === menu.id"
          type="button">
          {{ menu.label }}
        </button>

        <!-- Menu Content -->
        <div 
          *ngIf="activeMenu() === menu.id"
          [class]="menuContentClasses"
          (click)="$event.stopPropagation()">
          
          <div *ngFor="let item of menu.items; trackBy: trackItemByFn">
            <!-- Separator -->
            <div *ngIf="item.type === 'separator'" class="menubar-separator"></div>
            
            <!-- Regular Item -->
            <div 
              *ngIf="!item.type || item.type === 'item'"
              [class]="getItemClasses(item)"
              (click)="selectItem(item)">
              
              <lucide-icon 
                *ngIf="item.icon" 
                [img]="item.icon" 
                class="mr-2 h-4 w-4">
              </lucide-icon>
              
              <span>{{ item.label }}</span>
              
              <span *ngIf="item.shortcut" class="menubar-shortcut">
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
    </div>
  `,
  styles: [`
    .menubar-separator {
      @apply -mx-1 my-1 h-px bg-muted;
    }
    
    .menubar-shortcut {
      @apply ml-auto text-xs tracking-widest text-muted-foreground;
    }
  `]
})
export class MenubarComponent {
  @Input() menus: MenubarMenu[] = [];
  @Input() className = '';
  @Output() itemSelect = new EventEmitter<MenubarItem>();

  @ViewChild('menubar') menubar!: ElementRef;

  ChevronRightIcon = ChevronRight;
  CheckIcon = Check;
  CircleIcon = Circle;

  private _activeMenu = signal<string | null>(null);
  activeMenu = this._activeMenu.asReadonly();

  get menubarClasses(): string {
    return `flex h-10 items-center space-x-1 rounded-md border bg-background p-1 ${this.className}`;
  }

  get menuContentClasses(): string {
    return 'absolute top-full left-0 z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2';
  }

  toggleMenu(menuId: string) {
    const current = this._activeMenu();
    this._activeMenu.set(current === menuId ? null : menuId);
  }

  closeMenu() {
    this._activeMenu.set(null);
  }

  selectItem(item: MenubarItem) {
    if (item.disabled) return;
    
    this.itemSelect.emit(item);
    this.closeMenu();
  }

  toggleCheckbox(item: MenubarItem) {
    if (item.disabled) return;
    
    item.checked = !item.checked;
    this.itemSelect.emit(item);
  }

  selectRadio(item: MenubarItem) {
    if (item.disabled) return;
    
    // Find the current menu and uncheck all radio items
    const currentMenu = this.menus.find(menu => menu.id === this.activeMenu());
    if (currentMenu) {
      currentMenu.items.forEach(i => {
        if (i.type === 'radio') {
          i.checked = false;
        }
      });
    }
    
    item.checked = true;
    this.itemSelect.emit(item);
  }

  getTriggerClasses(menu: MenubarMenu): string {
    const baseClasses = 'flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none transition-colors';
    const activeClasses = this.activeMenu() === menu.id ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground';
    
    return `${baseClasses} ${activeClasses}`;
  }

  getItemClasses(item: MenubarItem): string {
    const baseClasses = 'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors';
    const disabledClasses = item.disabled ? 'pointer-events-none opacity-50' : 'hover:bg-accent hover:text-accent-foreground';
    
    return `${baseClasses} ${disabledClasses}`;
  }

  trackMenuByFn(index: number, menu: MenubarMenu): string {
    return menu.id;
  }

  trackItemByFn(index: number, item: MenubarItem): string {
    return item.id;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.activeMenu() && !this.menubar?.nativeElement?.contains(event.target)) {
      this.closeMenu();
    }
  }
}