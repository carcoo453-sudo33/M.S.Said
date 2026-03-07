import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Save, Search, User, Mail, Calendar, Settings } from 'lucide-angular';

// Import all UI components
import { ButtonComponent } from '../button/button';
import { InputComponent } from '../input/input';
import { TextareaComponent } from '../textarea/textarea';
import { ModalComponent } from '../modal/modal';
import { CardComponent } from '../card/card';
import { DropdownComponent, type DropdownOption } from '../dropdown/dropdown';
import { CalendarComponent } from '../calendar/calendar';

@Component({
    selector: 'ui-showcase',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        LucideAngularModule,
        ButtonComponent,
        InputComponent,
        TextareaComponent,
        ModalComponent,
        CardComponent,
        DropdownComponent,
        CalendarComponent
    ],
    template: `
        <div class="max-w-6xl mx-auto p-6 space-y-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-zinc-900 dark:text-white mb-2">UI Components Showcase</h1>
                <p class="text-zinc-600 dark:text-zinc-400">Comprehensive UI component library for your portfolio app</p>
            </div>

            <!-- Buttons Section -->
            <ui-card title="Buttons" description="Various button styles and states">
                <div class="space-y-4">
                    <!-- Primary Buttons -->
                    <div>
                        <h4 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Primary Buttons</h4>
                        <div class="flex flex-wrap gap-3">
                            <ui-button variant="primary" size="sm">Small</ui-button>
                            <ui-button variant="primary" size="md">Medium</ui-button>
                            <ui-button variant="primary" size="lg">Large</ui-button>
                            <ui-button variant="primary" [iconLeft]="SaveIcon">With Icon</ui-button>
                            <ui-button variant="primary" [loading]="isLoading" (onClick)="toggleLoading()">
                                {{ isLoading ? 'Loading...' : 'Click to Load' }}
                            </ui-button>
                        </div>
                    </div>

                    <!-- Secondary Buttons -->
                    <div>
                        <h4 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Secondary & Other Variants</h4>
                        <div class="flex flex-wrap gap-3">
                            <ui-button variant="secondary">Secondary</ui-button>
                            <ui-button variant="outline">Outline</ui-button>
                            <ui-button variant="ghost">Ghost</ui-button>
                            <ui-button variant="destructive">Destructive</ui-button>
                            <ui-button variant="primary" [disabled]="true">Disabled</ui-button>
                        </div>
                    </div>
                </div>
            </ui-card>

            <!-- Form Components Section -->
            <ui-card title="Form Components" description="Input fields, textareas, and form controls">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Input Examples -->
                    <div class="space-y-4">
                        <ui-input
                            label="Full Name"
                            placeholder="Enter your full name"
                            [iconLeft]="UserIcon"
                            [(ngModel)]="formData.name"
                            helperText="This will be displayed on your profile">
                        </ui-input>

                        <ui-input
                            label="Email Address"
                            type="email"
                            placeholder="your@email.com"
                            [iconLeft]="MailIcon"
                            [(ngModel)]="formData.email"
                            [required]="true"
                            [error]="emailError">
                        </ui-input>

                        <ui-input
                            label="Search"
                            placeholder="Search anything..."
                            [iconLeft]="SearchIcon"
                            [clearable]="true"
                            [(ngModel)]="searchTerm">
                        </ui-input>
                    </div>

                    <!-- Textarea and Other Inputs -->
                    <div class="space-y-4">
                        <ui-textarea
                            label="Description"
                            placeholder="Tell us about yourself..."
                            [rows]="4"
                            [maxlength]="500"
                            [showCharCount]="true"
                            [(ngModel)]="formData.description">
                        </ui-textarea>

                        <ui-dropdown
                            label="Country"
                            placeholder="Select your country"
                            [options]="countryOptions"
                            [searchable]="true"
                            [(value)]="formData.country">
                        </ui-dropdown>
                    </div>
                </div>
            </ui-card>

            <!-- Calendar Component -->
            <ui-card title="Calendar" description="Date picker component">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ui-calendar
                        label="Birth Date"
                        placeholder="Select your birth date"
                        [(ngModel)]="formData.birthDate">
                    </ui-calendar>

                    <ui-calendar
                        label="Project Deadline"
                        placeholder="Select deadline"
                        [minDate]="today"
                        [(ngModel)]="formData.deadline">
                    </ui-calendar>
                </div>
            </ui-card>

            <!-- Cards Section -->
            <ui-card title="Card Variants" description="Different card styles and layouts">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ui-card variant="default" padding="md" title="Default Card" description="Standard card with border">
                        <p class="text-sm text-zinc-600 dark:text-zinc-400">This is the default card variant with standard styling.</p>
                    </ui-card>

                    <ui-card variant="elevated" padding="md" title="Elevated Card" description="Card with shadow">
                        <p class="text-sm text-zinc-600 dark:text-zinc-400">This card has an elevated appearance with shadow.</p>
                    </ui-card>

                    <ui-card variant="ghost" padding="md" title="Ghost Card" description="Subtle background card">
                        <p class="text-sm text-zinc-600 dark:text-zinc-400">This is a ghost card with subtle background.</p>
                    </ui-card>
                </div>
            </ui-card>

            <!-- Interactive Examples -->
            <ui-card title="Interactive Examples" description="Real-world usage examples">
                <div class="space-y-6">
                    <!-- Form Example -->
                    <div class="p-6 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                        <h4 class="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Contact Form Example</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ui-input
                                label="Name"
                                placeholder="Your name"
                                [(ngModel)]="contactForm.name"
                                [required]="true">
                            </ui-input>
                            
                            <ui-input
                                label="Email"
                                type="email"
                                placeholder="your@email.com"
                                [(ngModel)]="contactForm.email"
                                [required]="true">
                            </ui-input>
                            
                            <div class="md:col-span-2">
                                <ui-textarea
                                    label="Message"
                                    placeholder="Your message..."
                                    [rows]="4"
                                    [(ngModel)]="contactForm.message"
                                    [required]="true">
                                </ui-textarea>
                            </div>
                            
                            <div class="md:col-span-2 flex gap-3">
                                <ui-button variant="primary" [iconLeft]="SaveIcon" (onClick)="submitForm()">
                                    Send Message
                                </ui-button>
                                <ui-button variant="outline" (onClick)="resetForm()">
                                    Reset
                                </ui-button>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Example -->
                    <div class="p-6 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                        <h4 class="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Modal Example</h4>
                        <div class="flex gap-3">
                            <ui-button variant="primary" (onClick)="openModal('sm')">Small Modal</ui-button>
                            <ui-button variant="secondary" (onClick)="openModal('md')">Medium Modal</ui-button>
                            <ui-button variant="outline" (onClick)="openModal('lg')">Large Modal</ui-button>
                        </div>
                    </div>
                </div>
            </ui-card>
        </div>

        <!-- Example Modal -->
        <ui-modal
            [isOpen]="showModal"
            [title]="modalTitle"
            [description]="modalDescription"
            [size]="modalSize"
            (close)="closeModal()">
            
            <div class="space-y-4">
                <p class="text-zinc-600 dark:text-zinc-400">
                    This is an example modal demonstrating the modal component with {{ modalSize }} size.
                    You can customize the content, size, and behavior of the modal.
                </p>
                
                <ui-input
                    label="Example Input"
                    placeholder="Type something..."
                    [(ngModel)]="modalInput">
                </ui-input>
            </div>

            <div slot="footer" class="flex gap-2">
                <ui-button variant="outline" (onClick)="closeModal()">Cancel</ui-button>
                <ui-button variant="primary" (onClick)="closeModal()">Save Changes</ui-button>
            </div>
        </ui-modal>
    `
})
export class UIShowcaseComponent {
    // Icons
    SaveIcon = Save;
    SearchIcon = Search;
    UserIcon = User;
    MailIcon = Mail;
    CalendarIcon = Calendar;
    SettingsIcon = Settings;

    // Component states
    isLoading = false;
    showModal = false;
    modalSize: 'sm' | 'md' | 'lg' = 'md';
    modalTitle = '';
    modalDescription = '';
    modalInput = '';

    // Form data
    formData = {
        name: '',
        email: '',
        description: '',
        country: '',
        birthDate: null as Date | null,
        deadline: null as Date | null
    };

    contactForm = {
        name: '',
        email: '',
        message: ''
    };

    searchTerm = '';
    emailError = '';
    today = new Date();

    // Dropdown options
    countryOptions: DropdownOption[] = [
        { value: 'us', label: 'United States', icon: null },
        { value: 'uk', label: 'United Kingdom', icon: null },
        { value: 'ca', label: 'Canada', icon: null },
        { value: 'au', label: 'Australia', icon: null },
        { value: 'de', label: 'Germany', icon: null },
        { value: 'fr', label: 'France', icon: null },
        { value: 'jp', label: 'Japan', icon: null },
        { value: 'sa', label: 'Saudi Arabia', icon: null },
        { value: 'ae', label: 'United Arab Emirates', icon: null }
    ];

    toggleLoading(): void {
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false;
        }, 2000);
    }

    openModal(size: 'sm' | 'md' | 'lg'): void {
        this.modalSize = size;
        this.modalTitle = `${size.toUpperCase()} Modal Example`;
        this.modalDescription = `This is a ${size} sized modal demonstrating the modal component.`;
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.modalInput = '';
    }

    submitForm(): void {
        // Validate email
        if (this.contactForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.contactForm.email)) {
            this.emailError = 'Please enter a valid email address';
            return;
        }
        this.emailError = '';

        // Simulate form submission
        console.log('Form submitted:', this.contactForm);
        alert('Form submitted successfully!');
    }

    resetForm(): void {
        this.contactForm = {
            name: '',
            email: '',
            message: ''
        };
        this.emailError = '';
    }
}