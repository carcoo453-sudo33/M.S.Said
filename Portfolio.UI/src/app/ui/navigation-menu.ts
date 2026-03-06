import { Component, Input, Output, EventEmitter, signal, computed, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

export interface NavigationMenuItem {
  id: string;
  label: string;
  href?: string;
  disabled?: boolean;
  children?: NavigationMenuItem[];
  content?: string; // For custom content
}

@Component({
  selector: 'ui-navigation-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <nav [class]="navigationClasses" #navigationMenu>
      <ul class="group flex flex-1 list-none items-center justify-center space-x-1">
        <li *ngFor="let item of items; trackBy: trackByFn" class="relative">
          
          <!-- Simple Link Item -->
          <a 
            *ngIf="item.href && !item.children; else triggerTemplate"
            [routerLink]="item.href"
            [class]="getLinkClasses(item)"
            [attr.aria-disabled]="item.disabled">
            {{ item.label }}
          </a>

          <!-- Trigger with Dropdown -->
          <ng-template #triggerTemplate>
            <button
              *ngIf="item.children && item.children.length > 0"
              [class]="getTriggerClasses(item)"
              [attr.aria-expanded]="activeItem() === item.id"
              [disabled]="item.disabled"
              (click)="toggleItem(item.id)"
              type="button">
              {{ item.label }}
              <lucide-icon 
                [img]="ChevronDownIcon" 
                [class]="getChevronClasses(item)">
              </lucide-icon>
            </button>
          </ng-template>

          <!-- Dropdown Content -->
          <div 
            *ngIf="item.children && activeItem() === item.id"
            [class]="contentClasses"
            (click)="$event.stopPropagation()">
            
            <!-- Custom Content -->
            <div *ngIf="item.content" [innerHTML]="item.content"></div>
            
            <!-- Child Items -->
            <div *ngIf="!item.content" class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <div class="row-span-3">
                <div class="mb-2 mt-1 text-lg font-medium">
                  {{ item.label }}
                </div>
                <p class="text-sm leading-tight text-muted-foreground">
                  Navigation menu for {{ item.label.toLowerCase() }}
                </p>
              </div>
              
              <div class="space-y-1">
                <a 
                  *ngFor="let child of item.children; trackBy: trackChildByFn"
                  [routerLink]="child.href || ''"
                  [class]="getChildLinkClasses(child)"
                  [attr.aria-disabled]="child.disabled"
                  (click)="selectChild(child)">
                  <div class="text-sm font-medium leading-none">{{ child.label }}</div>
                </a>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <!-- Viewport Indicator -->
      <div 
        *ngIf="activeItem()"
        class="absolute left-0 top-full flex justify-center">
        <div class="relative mt-1.5 h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md animate-in fade-in zoom-in-90"></div>
      </div>
    </nav>
  `
})
export class NavigationMenuComponent {
  @Input() items: NavigationMenuItem[] = [];
  @Input() className = '';
  @Output() itemSelect = new EventEmitter<NavigationMenuItem>();

  @ViewChild('navigationMenu') navigationMenu!: ElementRef;

  ChevronDownIcon = ChevronDown;

  private _activeItem = signal<string | null>(null);
  activeItem = this._activeItem.asReadonly();

  get navigationClasses(): string {
    return `relative z-10 flex max-w-max flex-1 items-center justify-center ${this.className}`;
  }

  get contentClasses(): string {
    return 'absolute left-0 top-full w-full animate-in fade-in zoom-in-95 slide-in-from-top-2 md:absolute md:w-auto z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg';
  }

  toggleItem(itemId: string) {
    const current = this._activeItem();
    this._activeItem.set(current === itemId ? null : itemId);
  }

  closeMenu() {
    this._activeItem.set(null);
  }

  selectChild(child: NavigationMenuItem) {
    if (!child.disabled) {
      this.itemSelect.emit(child);
      this.closeMenu();
    }
  }

  getLinkClasses(item: NavigationMenuItem): string {
    const baseClasses = 'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors';
    const stateClasses = item.disabled 
      ? 'pointer-events-none opacity-50' 
      : 'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none';
    
    return `${baseClasses} ${stateClasses}`;
  }

  getTriggerClasses(item: NavigationMenuItem): string {
    const baseClasses = 'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors';
    const activeClasses = this.activeItem() === item.id ? 'bg-accent/50' : '';
    const stateClasses = item.disabled 
      ? 'pointer-events-none opacity-50' 
      : 'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none';
    
    return `${baseClasses} ${activeClasses} ${stateClasses}`;
  }

  getChevronClasses(item: NavigationMenuItem): string {
    const baseClasses = 'relative top-[1px] ml-1 h-3 w-3 transition duration-200';
    const rotateClass = this.activeItem() === item.id ? 'rotate-180' : '';
    
    return `${baseClasses} ${rotateClass}`;
  }

  getChildLinkClasses(child: NavigationMenuItem): string {
    const baseClasses = 'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors';
    const stateClasses = child.disabled 
      ? 'pointer-events-none opacity-50' 
      : 'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground';
    
    return `${baseClasses} ${stateClasses}`;
  }

  trackByFn(index: number, item: NavigationMenuItem): string {
    return item.id;
  }

  trackChildByFn(index: number, child: NavigationMenuItem): string {
    return child.id;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.activeItem() && !this.navigationMenu?.nativeElement?.contains(event.target)) {
      this.closeMenu();
    }
  }
}