import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

export interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'ui-calendar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [class]="calendarClasses">
      <!-- Header -->
      <div class="flex justify-center pt-1 relative items-center">
        <button 
          (click)="previousMonth()"
          [class]="navButtonClasses"
          type="button"
          aria-label="Previous month">
          <lucide-icon [img]="ChevronLeftIcon" class="h-4 w-4"></lucide-icon>
        </button>
        
        <div class="text-sm font-medium">
          {{ currentMonthYear() }}
        </div>
        
        <button 
          (click)="nextMonth()"
          [class]="navButtonClasses"
          type="button"
          aria-label="Next month">
          <lucide-icon [img]="ChevronRightIcon" class="h-4 w-4"></lucide-icon>
        </button>
      </div>

      <!-- Calendar Grid -->
      <div class="w-full border-collapse space-y-1 mt-4">
        <!-- Day Headers -->
        <div class="flex">
          <div 
            *ngFor="let day of dayHeaders" 
            class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center">
            {{ day }}
          </div>
        </div>

        <!-- Calendar Days -->
        <div *ngFor="let week of calendarWeeks()" class="flex w-full mt-2">
          <button
            *ngFor="let day of week"
            type="button"
            [class]="getDayClasses(day)"
            [disabled]="day.isDisabled"
            (click)="selectDate(day.date)"
            [attr.aria-selected]="day.isSelected"
            [attr.aria-label]="formatDateLabel(day.date)">
            {{ day.date.getDate() }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class CalendarComponent {
  @Input() selectedDate?: Date;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() disabledDates: Date[] = [];
  @Input() showOutsideDays = true;
  @Input() className = '';
  @Output() dateSelect = new EventEmitter<Date>();

  ChevronLeftIcon = ChevronLeft;
  ChevronRightIcon = ChevronRight;

  private _currentDate = signal(new Date());
  currentDate = this._currentDate.asReadonly();

  dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  get calendarClasses(): string {
    return `p-3 ${this.className}`;
  }

  get navButtonClasses(): string {
    return 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  }

  currentMonthYear = computed(() => {
    const date = this._currentDate();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  calendarWeeks = computed(() => {
    const date = this._currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the first Sunday of the calendar view
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // End at the last Saturday of the calendar view
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const weeks: CalendarDate[][] = [];
    let currentWeek: CalendarDate[] = [];
    
    const currentDateIter = new Date(startDate);
    
    while (currentDateIter <= endDate) {
      const isCurrentMonth = currentDateIter.getMonth() === month;
      const isToday = this.isSameDay(currentDateIter, new Date());
      const isSelected = this.selectedDate ? this.isSameDay(currentDateIter, this.selectedDate) : false;
      const isDisabled = this.isDateDisabled(currentDateIter);
      
      if (this.showOutsideDays || isCurrentMonth) {
        currentWeek.push({
          date: new Date(currentDateIter),
          isCurrentMonth,
          isToday,
          isSelected,
          isDisabled
        });
      } else {
        currentWeek.push({
          date: new Date(currentDateIter),
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          isDisabled: true
        });
      }
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }
    
    return weeks;
  });

  previousMonth() {
    const current = this._currentDate();
    const newDate = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    this._currentDate.set(newDate);
  }

  nextMonth() {
    const current = this._currentDate();
    const newDate = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    this._currentDate.set(newDate);
  }

  selectDate(date: Date) {
    if (!this.isDateDisabled(date)) {
      this.dateSelect.emit(date);
    }
  }

  getDayClasses(day: CalendarDate): string {
    const baseClasses = 'h-9 w-9 p-0 font-normal inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    let classes = baseClasses;
    
    if (day.isSelected) {
      classes += ' bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground';
    } else if (day.isToday) {
      classes += ' bg-accent text-accent-foreground';
    } else {
      classes += ' hover:bg-accent hover:text-accent-foreground';
    }
    
    if (!day.isCurrentMonth) {
      classes += ' text-muted-foreground opacity-50';
    }
    
    if (day.isDisabled) {
      classes += ' text-muted-foreground opacity-50';
    }
    
    return classes;
  }

  formatDateLabel(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  private isDateDisabled(date: Date): boolean {
    if (this.minDate && date < this.minDate) return true;
    if (this.maxDate && date > this.maxDate) return true;
    
    return this.disabledDates.some(disabledDate => 
      this.isSameDay(date, disabledDate)
    );
  }
}