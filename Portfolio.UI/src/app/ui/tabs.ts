import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-tab-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="active"
      [class]="contentClasses"
      role="tabpanel"
      [attr.tabindex]="0"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class TabContentComponent {
  @Input() value = '';
  @Input() className = '';
  @Input() active = false;

  get contentClasses(): string {
    return `mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${this.className}`.trim();
  }
}

@Component({
  selector: 'ui-tab-trigger',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      role="tab"
      [attr.aria-selected]="active"
      [attr.tabindex]="active ? 0 : -1"
      [class]="triggerClasses"
      (click)="onClick()"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class TabTriggerComponent {
  @Input() value = '';
  @Input() className = '';
  @Input() active = false;
  @Input() disabled = false;
  
  @Output() tabClick = new EventEmitter<string>();

  get triggerClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    const stateClasses = this.active 
      ? 'bg-background text-foreground shadow-sm' 
      : 'text-muted-foreground';
    
    return `${baseClasses} ${stateClasses} ${this.className}`.trim();
  }

  onClick(): void {
    if (!this.disabled) {
      this.tabClick.emit(this.value);
    }
  }
}

@Component({
  selector: 'ui-tabs-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [class]="listClasses"
      role="tablist"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class TabsListComponent {
  @Input() className = '';

  get listClasses(): string {
    return `inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${this.className}`.trim();
  }
}

@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="tabsClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class TabsComponent implements AfterContentInit {
  @Input() defaultValue = '';
  @Input() value = '';
  @Input() className = '';
  
  @Output() valueChange = new EventEmitter<string>();

  @ContentChildren(TabTriggerComponent) triggers!: QueryList<TabTriggerComponent>;
  @ContentChildren(TabContentComponent) contents!: QueryList<TabContentComponent>;

  currentValue = '';

  get tabsClasses(): string {
    return `${this.className}`.trim();
  }

  ngAfterContentInit(): void {
    this.currentValue = this.value || this.defaultValue;
    this.updateActiveStates();
    
    // Subscribe to trigger clicks
    this.triggers.forEach(trigger => {
      trigger.tabClick.subscribe(value => {
        this.selectTab(value);
      });
    });
  }

  selectTab(value: string): void {
    this.currentValue = value;
    this.value = value;
    this.updateActiveStates();
    this.valueChange.emit(value);
  }

  private updateActiveStates(): void {
    this.triggers.forEach(trigger => {
      trigger.active = trigger.value === this.currentValue;
    });
    
    this.contents.forEach(content => {
      content.active = content.value === this.currentValue;
    });
  }
}