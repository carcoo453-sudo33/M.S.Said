import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import all UI components
import {
  ButtonComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
  InputComponent,
  TextareaComponent,
  LabelComponent,
  BadgeComponent,
  CheckboxComponent,
  SelectComponent,
  SelectOption,
  SeparatorComponent,
  SkeletonComponent,
  SwitchComponent,
  TabsComponent,
  TabsListComponent,
  TabTriggerComponent,
  TabContentComponent,
  DialogComponent,
  DialogContentComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
  DialogDescriptionComponent,
  DialogFooterComponent,
  AlertComponent,
  AlertTitleComponent,
  AlertDescriptionComponent,
  ProgressComponent,
  AccordionComponent,
  AccordionItem,
  AvatarComponent,
  TableComponent,
  TableHeaderComponent,
  TableBodyComponent,
  TableRowComponent,
  TableHeadComponent,
  TableCellComponent,
  DropdownMenuComponent,
  DropdownMenuItem,
  TooltipComponent,
  ToasterComponent,
  PopoverComponent,
  SliderComponent,
  RadioGroupComponent,
  RadioOption,
  BreadcrumbComponent,
  BreadcrumbItem,
  PaginationComponent,
  CalendarComponent,
  CommandComponent,
  CommandItem,
  HoverCardComponent,
  SheetComponent,
  SheetHeaderComponent,
  SheetTitleComponent,
  SheetDescriptionComponent,
  ToggleComponent,
  CollapsibleComponent
} from '../../ui';

@Component({
  selector: 'app-ui-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CardFooterComponent,
    InputComponent,
    TextareaComponent,
    LabelComponent,
    BadgeComponent,
    CheckboxComponent,
    SelectComponent,
    SeparatorComponent,
    SkeletonComponent,
    SwitchComponent,
    TabsComponent,
    TabsListComponent,
    TabTriggerComponent,
    TabContentComponent,
    DialogComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    DialogFooterComponent,
    AlertComponent,
    AlertTitleComponent,
    AlertDescriptionComponent,
    ProgressComponent,
    AccordionComponent,
    AvatarComponent,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableHeadComponent,
    TableCellComponent,
    DropdownMenuComponent,
    TooltipComponent,
    ToasterComponent,
    PopoverComponent,
    SliderComponent,
    RadioGroupComponent,
    BreadcrumbComponent,
    PaginationComponent,
    CalendarComponent,
    CommandComponent,
    HoverCardComponent,
    SheetComponent,
    SheetHeaderComponent,
    SheetTitleComponent,
    SheetDescriptionComponent,
    ToggleComponent,
    CollapsibleComponent
  ],
  template: `
    <div class="min-h-screen bg-background text-foreground p-8">
      <div class="max-w-6xl mx-auto space-y-8">
        <!-- Header -->
        <div class="text-center space-y-4">
          <h1 class="text-4xl font-bold">Angular UI Components</h1>
          <p class="text-muted-foreground">shadcn/ui style components for Angular</p>
        </div>

        <!-- Buttons -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Buttons</ui-card-title>
            <ui-card-description>Different button variants and sizes</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <div class="flex flex-wrap gap-4">
              <ui-button>Default</ui-button>
              <ui-button variant="destructive">Destructive</ui-button>
              <ui-button variant="outline">Outline</ui-button>
              <ui-button variant="secondary">Secondary</ui-button>
              <ui-button variant="ghost">Ghost</ui-button>
              <ui-button variant="link">Link</ui-button>
            </div>
            <ui-separator className="my-4"></ui-separator>
            <div class="flex flex-wrap gap-4">
              <ui-button size="sm">Small</ui-button>
              <ui-button>Default</ui-button>
              <ui-button size="lg">Large</ui-button>
              <ui-button size="icon">🚀</ui-button>
            </div>
          </ui-card-content>
        </ui-card>

        <!-- Form Elements -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Form Elements</ui-card-title>
            <ui-card-description>Input fields, selects, and form controls</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <ui-label htmlFor="email">Email</ui-label>
                  <ui-input 
                    type="email" 
                    placeholder="Enter your email"
                    [(ngModel)]="formData.email"
                  ></ui-input>
                </div>
                
                <div>
                  <ui-label htmlFor="message">Message</ui-label>
                  <ui-textarea 
                    placeholder="Type your message here"
                    [(ngModel)]="formData.message"
                  ></ui-textarea>
                </div>
              </div>
              
              <div class="space-y-4">
                <div>
                  <ui-label htmlFor="country">Country</ui-label>
                  <ui-select 
                    [options]="countryOptions"
                    placeholder="Select a country"
                    [(ngModel)]="formData.country"
                  ></ui-select>
                </div>
                
                <div class="flex items-center space-x-2">
                  <ui-checkbox [(ngModel)]="formData.newsletter"></ui-checkbox>
                  <ui-label>Subscribe to newsletter</ui-label>
                </div>
                
                <div class="flex items-center space-x-2">
                  <ui-switch [(ngModel)]="formData.notifications"></ui-switch>
                  <ui-label>Enable notifications</ui-label>
                </div>
              </div>
            </div>
          </ui-card-content>
        </ui-card>

        <!-- Badges and Status -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Badges & Status</ui-card-title>
            <ui-card-description>Status indicators and labels</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <div class="flex flex-wrap gap-4">
              <ui-badge>Default</ui-badge>
              <ui-badge variant="secondary">Secondary</ui-badge>
              <ui-badge variant="destructive">Destructive</ui-badge>
              <ui-badge variant="outline">Outline</ui-badge>
            </div>
          </ui-card-content>
        </ui-card>

        <!-- Tabs -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Tabs</ui-card-title>
            <ui-card-description>Tabbed content navigation</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <ui-tabs defaultValue="account" className="w-full">
              <ui-tabs-list className="grid w-full grid-cols-2">
                <ui-tab-trigger value="account">Account</ui-tab-trigger>
                <ui-tab-trigger value="password">Password</ui-tab-trigger>
              </ui-tabs-list>
              <ui-tab-content value="account" className="space-y-4">
                <div>
                  <ui-label htmlFor="name">Name</ui-label>
                  <ui-input placeholder="Your name"></ui-input>
                </div>
                <div>
                  <ui-label htmlFor="username">Username</ui-label>
                  <ui-input placeholder="Your username"></ui-input>
                </div>
              </ui-tab-content>
              <ui-tab-content value="password" className="space-y-4">
                <div>
                  <ui-label htmlFor="current">Current password</ui-label>
                  <ui-input type="password"></ui-input>
                </div>
                <div>
                  <ui-label htmlFor="new">New password</ui-label>
                  <ui-input type="password"></ui-input>
                </div>
              </ui-tab-content>
            </ui-tabs>
          </ui-card-content>
        </ui-card>

        <!-- Progress & Loading -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Progress & Loading</ui-card-title>
            <ui-card-description>Progress bars and skeleton loaders</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <div class="space-y-6">
              <div>
                <ui-label>Progress: {{ progressValue() }}%</ui-label>
                <ui-progress [value]="progressValue()"></ui-progress>
                <ui-button 
                  (onClick)="updateProgress()" 
                  className="mt-2"
                  size="sm"
                >
                  Update Progress
                </ui-button>
              </div>
              
              <ui-separator></ui-separator>
              
              <div class="space-y-2">
                <ui-skeleton className="h-4 w-[250px]"></ui-skeleton>
                <ui-skeleton className="h-4 w-[200px]"></ui-skeleton>
                <ui-skeleton className="h-4 w-[150px]"></ui-skeleton>
              </div>
            </div>
          </ui-card-content>
        </ui-card>

        <!-- Alerts -->
        <ui-alert>
          <ui-alert-title>Heads up!</ui-alert-title>
          <ui-alert-description>
            You can add components to your app using the cli.
          </ui-alert-description>
        </ui-alert>

        <ui-alert variant="destructive">
          <ui-alert-title>Error</ui-alert-title>
          <ui-alert-description>
            Your session has expired. Please log in again.
          </ui-alert-description>
        </ui-alert>

        <!-- Dialog Demo -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Dialog</ui-card-title>
            <ui-card-description>Modal dialogs and overlays</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <ui-button (onClick)="showDialog = true">Open Dialog</ui-button>
          </ui-card-content>
        </ui-card>

        <!-- Accordion -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Accordion</ui-card-title>
            <ui-card-description>Collapsible content sections</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <ui-accordion [items]="accordionItems" type="single" [collapsible]="true"></ui-accordion>
          </ui-card-content>
        </ui-card>

        <!-- Avatar -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Avatar</ui-card-title>
            <ui-card-description>User profile images with fallbacks</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <div class="flex items-center space-x-4">
              <ui-avatar src="https://github.com/shadcn.png" alt="User" fallback="CN" size="sm"></ui-avatar>
              <ui-avatar src="https://github.com/shadcn.png" alt="User" fallback="CN" size="md"></ui-avatar>
              <ui-avatar src="https://github.com/shadcn.png" alt="User" fallback="CN" size="lg"></ui-avatar>
              <ui-avatar src="" alt="User" fallback="JD" size="md"></ui-avatar>
            </div>
          </ui-card-content>
        </ui-card>

        <!-- Table -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Table</ui-card-title>
            <ui-card-description>Data tables with sorting and selection</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <ui-table>
              <ui-table-header>
                <ui-table-row>
                  <ui-table-head>Name</ui-table-head>
                  <ui-table-head>Status</ui-table-head>
                  <ui-table-head>Role</ui-table-head>
                </ui-table-row>
              </ui-table-header>
              <ui-table-body>
                <ui-table-row>
                  <ui-table-cell>John Doe</ui-table-cell>
                  <ui-table-cell><ui-badge variant="secondary">Active</ui-badge></ui-table-cell>
                  <ui-table-cell>Developer</ui-table-cell>
                </ui-table-row>
                <ui-table-row>
                  <ui-table-cell>Jane Smith</ui-table-cell>
                  <ui-table-cell><ui-badge variant="destructive">Inactive</ui-badge></ui-table-cell>
                  <ui-table-cell>Designer</ui-table-cell>
                </ui-table-row>
              </ui-table-body>
            </ui-table>
          </ui-card-content>
        </ui-card>

        <!-- Dropdown Menu -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Dropdown Menu</ui-card-title>
            <ui-card-description>Context menus and dropdowns</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <ui-dropdown-menu [items]="dropdownItems" (itemSelect)="onDropdownSelect($event)">
              <ui-button slot="trigger" variant="outline">Open Menu</ui-button>
            </ui-dropdown-menu>
          </ui-card-content>
        </ui-card>

        <!-- Slider & Radio Group -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Form Controls</ui-card-title>
            <ui-card-description>Sliders and radio groups</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <div class="space-y-6">
              <div>
                <ui-label>Volume: {{ sliderValue() }}%</ui-label>
                <ui-slider 
                  [min]="0" 
                  [max]="100" 
                  [(ngModel)]="sliderValue"
                  class="mt-2">
                </ui-slider>
              </div>
              
              <ui-separator></ui-separator>
              
              <div>
                <ui-label>Choose a plan:</ui-label>
                <ui-radio-group 
                  [options]="radioOptions" 
                  [(ngModel)]="selectedPlan"
                  class="mt-2">
                </ui-radio-group>
              </div>
            </div>
          </ui-card-content>
        </ui-card>

        <!-- Tooltip Demo -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Tooltip</ui-card-title>
            <ui-card-description>Hover tooltips and help text</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <div class="flex space-x-4">
              <ui-tooltip content="This is a tooltip">
                <ui-button variant="outline">Hover me</ui-button>
              </ui-tooltip>
              
              <ui-tooltip content="Another tooltip" side="right">
                <ui-button variant="secondary">Right tooltip</ui-button>
              </ui-tooltip>
            </div>
          </ui-card-content>
        </ui-card>

        <!-- Calendar -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Calendar</ui-card-title>
            <ui-card-description>Date picker and calendar component</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <ui-calendar 
              [selectedDate]="selectedDate"
              (dateSelect)="onDateSelect($event)">
            </ui-calendar>
            <p *ngIf="selectedDate" class="mt-4 text-sm text-muted-foreground">
              Selected: {{ selectedDate | date:'fullDate' }}
            </p>
          </ui-card-content>
        </ui-card>

        <!-- Command Palette -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Command</ui-card-title>
            <ui-card-description>Command palette and search</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <ui-command 
              [items]="commandItems"
              placeholder="Type a command..."
              (itemSelect)="onCommandSelect($event)">
            </ui-command>
          </ui-card-content>
        </ui-card>

        <!-- Breadcrumb -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Breadcrumb</ui-card-title>
            <ui-card-description>Navigation breadcrumbs</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <ui-breadcrumb [items]="breadcrumbItems"></ui-breadcrumb>
          </ui-card-content>
        </ui-card>

        <!-- Pagination -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Pagination</ui-card-title>
            <ui-card-description>Page navigation controls</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <ui-pagination 
              [currentPage]="currentPage"
              [totalPages]="10"
              (pageChange)="onPageChange($event)">
            </ui-pagination>
            <p class="mt-4 text-sm text-muted-foreground">
              Current page: {{ currentPage }}
            </p>
          </ui-card-content>
        </ui-card>

        <!-- Toggle & Collapsible -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Toggle & Collapsible</ui-card-title>
            <ui-card-description>Toggle buttons and collapsible content</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <ui-toggle [(ngModel)]="togglePressed">
                  Toggle me
                </ui-toggle>
                <span class="text-sm text-muted-foreground">
                  {{ togglePressed ? 'Pressed' : 'Not pressed' }}
                </span>
              </div>
              
              <ui-separator></ui-separator>
              
              <ui-collapsible [open]="collapsibleOpen" (openChange)="collapsibleOpen = $event">
                <ui-button (click)="collapsibleOpen = !collapsibleOpen" variant="outline">
                  {{ collapsibleOpen ? 'Hide' : 'Show' }} Details
                </ui-button>
                <ui-collapsible-content [isOpen]="collapsibleOpen" class="mt-2">
                  <div class="p-4 border rounded-md bg-muted">
                    <p class="text-sm">This is collapsible content that can be shown or hidden.</p>
                  </div>
                </ui-collapsible-content>
              </ui-collapsible>
            </div>
          </ui-card-content>
        </ui-card>

        <!-- Sheet Demo -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Sheet</ui-card-title>
            <ui-card-description>Side panels and drawers</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <ui-button (click)="showSheet = true">Open Sheet</ui-button>
          </ui-card-content>
        </ui-card>

        <!-- Sheet Component -->
        <ui-sheet 
          [open]="showSheet" 
          (openChange)="showSheet = $event"
          side="right">
          <ui-sheet-header>
            <ui-sheet-title>Sheet Title</ui-sheet-title>
            <ui-sheet-description>
              This is a sheet component that slides in from the side.
            </ui-sheet-description>
          </ui-sheet-header>
          
          <div class="py-4">
            <p class="text-sm text-muted-foreground">
              Sheet content goes here. You can put forms, lists, or any other content.
            </p>
          </div>
        </ui-sheet>

        <!-- Dialog Component -->
        <ui-dialog-content 
          [open]="showDialog" 
          (openChange)="showDialog = $event"
        >
          <ui-dialog-header>
            <ui-dialog-title>Are you absolutely sure?</ui-dialog-title>
            <ui-dialog-description>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </ui-dialog-description>
          </ui-dialog-header>
          <ui-dialog-footer>
            <ui-button variant="outline" (onClick)="showDialog = false">Cancel</ui-button>
            <ui-button variant="destructive" (onClick)="showDialog = false">Continue</ui-button>
          </ui-dialog-footer>
        </ui-dialog-content>

        <!-- Toast Container -->
        <ui-toaster></ui-toaster>
      </div>
    </div>
  `
})
export class UIDemoComponent {
  showDialog = false;
  showSheet = false;
  progressValue = signal(33);
  sliderValue = signal(50);
  selectedPlan = 'basic';
  selectedDate?: Date;
  currentPage = 1;
  togglePressed = false;
  collapsibleOpen = false;

  formData = {
    email: '',
    message: '',
    country: '',
    newsletter: false,
    notifications: true
  };

  countryOptions: SelectOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' }
  ];

  accordionItems: AccordionItem[] = [
    {
      id: 'item-1',
      title: 'Is it accessible?',
      content: 'Yes. It adheres to the WAI-ARIA design pattern.'
    },
    {
      id: 'item-2',
      title: 'Is it styled?',
      content: 'Yes. It comes with default styles that matches the other components aesthetic.'
    },
    {
      id: 'item-3',
      title: 'Is it animated?',
      content: 'Yes. It\'s animated by default, but you can disable it if you prefer.'
    }
  ];

  dropdownItems: DropdownMenuItem[] = [
    { id: 'profile', label: 'Profile', type: 'item' },
    { id: 'settings', label: 'Settings', type: 'item' },
    { id: 'sep1', label: '', separator: true },
    { id: 'notifications', label: 'Notifications', type: 'checkbox', checked: true },
    { id: 'emails', label: 'Email alerts', type: 'checkbox', checked: false },
    { id: 'sep2', label: '', separator: true },
    { id: 'logout', label: 'Logout', type: 'item' }
  ];

  radioOptions: RadioOption[] = [
    { value: 'basic', label: 'Basic Plan - $9/month' },
    { value: 'pro', label: 'Pro Plan - $19/month' },
    { value: 'enterprise', label: 'Enterprise Plan - $49/month' }
  ];

  commandItems: CommandItem[] = [
    { id: 'calendar', label: 'Calendar', value: 'calendar', group: 'Apps' },
    { id: 'search', label: 'Search Emoji', value: 'search', group: 'Apps' },
    { id: 'calculator', label: 'Calculator', value: 'calculator', group: 'Apps' },
    { id: 'profile', label: 'Profile', value: 'profile', group: 'Settings', keywords: ['user', 'account'] },
    { id: 'billing', label: 'Billing', value: 'billing', group: 'Settings', keywords: ['payment', 'subscription'] },
    { id: 'logout', label: 'Log out', value: 'logout', group: 'Settings' }
  ];

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Components', href: '/components' },
    { label: 'UI Demo', current: true }
  ];

  updateProgress(): void {
    const current = this.progressValue();
    const newValue = current >= 100 ? 0 : current + 25;
    this.progressValue.set(newValue);
  }

  onDropdownSelect(item: DropdownMenuItem): void {
    console.log('Selected:', item);
  }

  onDateSelect(date: Date): void {
    this.selectedDate = date;
  }

  onCommandSelect(item: CommandItem): void {
    console.log('Command selected:', item);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}