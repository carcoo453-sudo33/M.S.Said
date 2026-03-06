import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  disabled?: boolean;
}

@Component({
  selector: 'ui-accordion',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-2">
      <div *ngFor="let item of items; trackBy: trackByFn" 
           class="border-b border-border">
        <ui-accordion-trigger 
          [item]="item"
          [isOpen]="openItems().has(item.id)"
          (toggle)="toggleItem(item.id)">
        </ui-accordion-trigger>
        <ui-accordion-content 
          [isOpen]="openItems().has(item.id)"
          [content]="item.content">
        </ui-accordion-content>
      </div>
    </div>
  `
})
export class AccordionComponent {
  @Input() items: AccordionItem[] = [];
  @Input() type: 'single' | 'multiple' = 'single';
  @Input() collapsible = false;
  @Input() className = '';
  @Output() valueChange = new EventEmitter<string | string[]>();

  private _openItems = signal(new Set<string>());
  openItems = computed(() => this._openItems());

  toggleItem(itemId: string) {
    const current = new Set(this._openItems());
    
    if (this.type === 'single') {
      if (current.has(itemId)) {
        if (this.collapsible) {
          current.clear();
        }
      } else {
        current.clear();
        current.add(itemId);
      }
    } else {
      if (current.has(itemId)) {
        current.delete(itemId);
      } else {
        current.add(itemId);
      }
    }
    
    this._openItems.set(current);
    this.valueChange.emit(this.type === 'single' 
      ? Array.from(current)[0] || '' 
      : Array.from(current)
    );
  }

  trackByFn(index: number, item: AccordionItem): string {
    return item.id;
  }
}

@Component({
  selector: 'ui-accordion-trigger',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex">
      <button 
        [disabled]="item.disabled"
        (click)="toggle.emit()"
        [class]="triggerClasses"
        type="button">
        <span>{{ item.title }}</span>
        <lucide-icon 
          [img]="ChevronDownIcon" 
          [class]="iconClasses">
        </lucide-icon>
      </button>
    </div>
  `
})
export class AccordionTriggerComponent {
  @Input() item!: AccordionItem;
  @Input() isOpen = false;
  @Input() className = '';
  @Output() toggle = new EventEmitter<void>();

  ChevronDownIcon = ChevronDown;

  get triggerClasses(): string {
    return `flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline disabled:opacity-50 disabled:cursor-not-allowed ${this.className}`;
  }

  get iconClasses(): string {
    return `h-4 w-4 shrink-0 transition-transform duration-200 ${this.isOpen ? 'rotate-180' : ''}`;
  }
}

@Component({
  selector: 'ui-accordion-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [class]="contentClasses"
      [style.max-height]="isOpen ? 'none' : '0'"
      [style.opacity]="isOpen ? '1' : '0'">
      <div [class]="innerClasses">
        <ng-content>{{ content }}</ng-content>
      </div>
    </div>
  `
})
export class AccordionContentComponent {
  @Input() isOpen = false;
  @Input() content = '';
  @Input() className = '';

  get contentClasses(): string {
    return `overflow-hidden text-sm transition-all duration-200 ${this.isOpen ? 'animate-accordion-down' : 'animate-accordion-up'}`;
  }

  get innerClasses(): string {
    return `pb-4 pt-0 ${this.className}`;
  }
}