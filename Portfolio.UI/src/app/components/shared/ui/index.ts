// UI Components Barrel Export
// This file provides a centralized way to import all UI components

// Button Component
export { ButtonComponent, type ButtonVariant, type ButtonSize } from './button/button';

// Input Components
export { InputComponent, type InputSize, type InputType } from './input/input';
export { TextareaComponent, type TextareaSize } from './textarea/textarea';

// Layout Components
export { ModalComponent, type ModalSize } from './modal/modal';
export { CardComponent, type CardVariant, type CardPadding } from './card/card';

// Form Components
export { DropdownComponent, type DropdownOption } from './dropdown/dropdown';
export { CalendarComponent } from './calendar/calendar';

// Re-export commonly used types
export interface UIComponentConfig {
    theme: 'light' | 'dark';
    primaryColor: string;
    borderRadius: string;
}

// Utility functions for UI components
export class UIUtils {
    static generateId(prefix: string = 'ui'): string {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    }

    static combineClasses(...classes: (string | undefined | null | false)[]): string {
        return classes.filter(Boolean).join(' ').trim();
    }

    static debounce<T extends (...args: any[]) => any>(
        func: T,
        wait: number
    ): (...args: Parameters<T>) => void {
        let timeout: any;
        return (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

// Common validation patterns
export const ValidationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    url: /^https?:\/\/.+/,
    strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// Animation utilities
export const AnimationUtils = {
    fadeIn: 'animate-fade-in',
    fadeInUp: 'animate-fade-in-up',
    modalEnter: 'animate-modal-enter',
    spin: 'animate-spin'
};

// Color utilities based on your app's theme
export const ThemeColors = {
    primary: 'red-600',
    secondary: 'zinc-100',
    success: 'green-600',
    warning: 'yellow-600',
    error: 'red-500',
    info: 'blue-600'
};