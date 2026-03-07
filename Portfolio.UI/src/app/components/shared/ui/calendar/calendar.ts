import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule, ChevronLeft, ChevronRight, Calendar } from 'lucide-angular';

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isDisabled: boolean;
}

@Component({
    selector: 'ui-calendar',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CalendarComponent),
            multi: true
        }
    ],
    template: `
        <div class="relative">
            <!-- Label -->
            <label *ngIf="label" [for]="calendarId" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">
                {{ label }}
                <span *ngIf="required" class="text-red-500 ml-1">*</span>
            </label>

            <!-- Date Input Trigger -->
            <button
                [id]="calendarId"
                type="button"
                [disabled]="disabled"
                [class]="inputClasses"
                (click)="toggleCalendar()"
                [attr.aria-expanded]="isOpen"
                [attr.aria-haspopup]="true">
                
                <div class="flex items-center gap-2 flex-1 text-left">
                    <lucide-icon [img]="CalendarIcon" class="w-4 h-4 text-zinc-400"></lucide-icon>
                    <span [class.text-zinc-500]="!selectedDate">
                        {{ selectedDate ? formatDate(selectedDate) : placeholder }}
                    </span>
                </div>
            </button>

            <!-- Calendar Dropdown -->
            <div 
                *ngIf="isOpen"
                class="absolute z-20 mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg p-4 animate-fade-in"
                [class.left-0]="!alignRight"
                [class.right-0]="alignRight">
                
                <!-- Calendar Header -->
                <div class="flex items-center justify-between mb-4">
                    <button
                        type="button"
                        class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                        (click)="previousMonth()">
                        <lucide-icon [img]="ChevronLeftIcon" class="w-4 h-4"></lucide-icon>
                    </button>

                    <h3 class="text-sm font-semibold text-zinc-900 dark:text-white">
                        {{ getMonthYearLabel() }}
                    </h3>

                    <button
                        type="button"
                        class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                        (click)="nextMonth()">
                        <lucide-icon [img]="ChevronRightIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                </div>

                <!-- Days of Week Header -->
                <div class="grid grid-cols-7 gap-1 mb-2">
                    <div 
                        *ngFor="let day of daysOfWeek" 
                        class="text-xs font-medium text-zinc-500 dark:text-zinc-400 text-center py-2">
                        {{ day }}
                    </div>
                </div>

                <!-- Calendar Days -->
                <div class="grid grid-cols-7 gap-1">
                    <button
                        *ngFor="let day of calendarDays"
                        type="button"
                        [disabled]="day.isDisabled"
                        [class]="getDayClasses(day)"
                        (click)="selectDate(day.date)">
                        {{ day.date.getDate() }}
                    </button>
                </div>

                <!-- Today Button -->
                <div class="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    <button
                        type="button"
                        class="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        (click)="selectToday()">
                        Today
                    </button>
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
export class CalendarComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() placeholder = 'Select date';
    @Input() disabled = false;
    @Input() required = false;
    @Input() error = '';
    @Input() helperText = '';
    @Input() minDate: Date | null = null;
    @Input() maxDate: Date | null = null;
    @Input() alignRight = false;

    @Output() dateChange = new EventEmitter<Date | null>();

    selectedDate: Date | null = null;
    currentMonth = new Date();
    isOpen = false;
    calendarDays: CalendarDay[] = [];
    calendarId = `calendar-${Math.random().toString(36).substr(2, 9)}`;

    daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    CalendarIcon = Calendar;
    ChevronLeftIcon = ChevronLeft;
    ChevronRightIcon = ChevronRight;

    // ControlValueAccessor implementation
    private onChange = (value: Date | null) => {};
    private onTouched = () => {};

    ngOnInit(): void {
        this.generateCalendarDays();
    }

    writeValue(value: Date | null): void {
        this.selectedDate = value;
        if (value) {
            this.currentMonth = new Date(value.getFullYear(), value.getMonth(), 1);
        }
        this.generateCalendarDays();
    }

    registerOnChange(fn: (value: Date | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    toggleCalendar(): void {
        if (this.disabled) return;
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.generateCalendarDays();
        }
    }

    selectDate(date: Date): void {
        this.selectedDate = date;
        this.onChange(this.selectedDate);
        this.dateChange.emit(this.selectedDate);
        this.onTouched();
        this.isOpen = false;
    }

    selectToday(): void {
        this.selectDate(new Date());
    }

    previousMonth(): void {
        this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
        this.generateCalendarDays();
    }

    nextMonth(): void {
        this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
        this.generateCalendarDays();
    }

    getMonthYearLabel(): string {
        return `${this.monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
    }

    formatDate(date: Date): string {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    generateCalendarDays(): void {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const today = new Date();
        
        // First day of the month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Start from the first Sunday of the calendar
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        
        // Generate 42 days (6 weeks)
        this.calendarDays = [];
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = date.getMonth() === month;
            const isToday = this.isSameDay(date, today);
            const isSelected = this.selectedDate ? this.isSameDay(date, this.selectedDate) : false;
            const isDisabled = this.isDateDisabled(date);
            
            this.calendarDays.push({
                date,
                isCurrentMonth,
                isToday,
                isSelected,
                isDisabled
            });
        }
    }

    private isSameDay(date1: Date, date2: Date): boolean {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    private isDateDisabled(date: Date): boolean {
        if (this.minDate && date < this.minDate) return true;
        if (this.maxDate && date > this.maxDate) return true;
        return false;
    }

    getDayClasses(day: CalendarDay): string {
        const baseClasses = 'w-8 h-8 text-sm rounded-lg transition-colors';
        
        const classes = [baseClasses];
        
        if (day.isDisabled) {
            classes.push('opacity-50 cursor-not-allowed');
        } else {
            classes.push('hover:bg-zinc-100 dark:hover:bg-zinc-700');
        }
        
        if (!day.isCurrentMonth) {
            classes.push('text-zinc-400 dark:text-zinc-600');
        } else {
            classes.push('text-zinc-900 dark:text-white');
        }
        
        if (day.isSelected) {
            classes.push('bg-red-600 text-white hover:bg-red-700');
        } else if (day.isToday) {
            classes.push('bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400');
        }
        
        return classes.join(' ');
    }

    get inputClasses(): string {
        const baseClasses = 'w-full flex items-center justify-between px-4 py-2.5 text-sm border rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all';
        
        const stateClasses = this.error 
            ? 'border-red-500 ring-2 ring-red-500/30' 
            : 'border-zinc-200 dark:border-zinc-700';

        const disabledClasses = this.disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-zinc-300 dark:hover:border-zinc-600';

        return `${baseClasses} ${stateClasses} ${disabledClasses}`.trim();
    }
}