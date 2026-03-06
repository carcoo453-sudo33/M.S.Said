# Angular UI Components Library

A comprehensive collection of Angular components inspired by shadcn/ui, providing a consistent design system for the Portfolio application.

## Overview

This UI library contains 35+ reusable Angular components that follow modern design principles and accessibility standards. All components are standalone, fully typed, and support both light and dark themes.

## Components

### Form Components (9)
- **Button** - Multiple variants (default, destructive, outline, secondary, ghost, link) and sizes
- **Input** - Text input with ControlValueAccessor support
- **Textarea** - Multi-line text input with ControlValueAccessor support
- **Label** - Form labels with proper accessibility
- **Checkbox** - Checkbox input with ControlValueAccessor support
- **Switch** - Toggle switch component
- **Select** - Dropdown select with options
- **Radio Group** - Radio button groups with ControlValueAccessor support
- **Slider** - Range slider with ControlValueAccessor support

### Layout Components (8)
- **Card** - Container with header, content, and footer sections
- **Separator** - Horizontal/vertical dividers
- **Tabs** - Tabbed content navigation
- **Accordion** - Collapsible content sections
- **Scroll Area** - Custom scrollable containers
- **Sheet** - Side panels and drawers
- **Collapsible** - Collapsible content with trigger
- **Toggle** - Toggle button component

### Data Display (5)
- **Table** - Data tables with header, body, footer, and cells
- **Badge** - Status indicators and labels
- **Avatar** - User profile images with fallbacks
- **Progress** - Progress bars and loading indicators
- **Skeleton** - Loading placeholders

### Feedback Components (3)
- **Alert** - Alert messages with variants (default, destructive)
- **Toast** - Notification toasts with service
- **Toaster** - Toast container component

### Overlay Components (5)
- **Dialog** - Modal dialogs and overlays
- **Tooltip** - Hover tooltips and help text
- **Popover** - Contextual popovers
- **Dropdown Menu** - Context menus and dropdowns
- **Hover Card** - Rich hover content cards

### Navigation Components (4)
- **Breadcrumb** - Navigation breadcrumbs
- **Pagination** - Page navigation controls
- **Menubar** - Application menu bars
- **Navigation Menu** - Complex navigation menus

### Specialized Components (3)
- **Calendar** - Date picker and calendar
- **Command** - Command palette and search
- **Scroll Area** - Custom scrollable areas

## Complete Component List (35 Components)

1. **Accordion** - Collapsible content sections
2. **Alert** - Alert messages and notifications
3. **Avatar** - User profile images with fallbacks
4. **Badge** - Status indicators and labels
5. **Breadcrumb** - Navigation breadcrumbs
6. **Button** - Interactive buttons with variants
7. **Calendar** - Date picker and calendar
8. **Card** - Content containers
9. **Checkbox** - Checkbox inputs
10. **Collapsible** - Collapsible content
11. **Command** - Command palette and search
12. **Dialog** - Modal dialogs
13. **Dropdown Menu** - Context menus
14. **Hover Card** - Rich hover content
15. **Input** - Text inputs
16. **Label** - Form labels
17. **Menubar** - Application menu bars
18. **Navigation Menu** - Complex navigation
19. **Pagination** - Page navigation
20. **Popover** - Contextual popovers
21. **Progress** - Progress indicators
22. **Radio Group** - Radio button groups
23. **Scroll Area** - Custom scrollable areas
24. **Select** - Dropdown selects
25. **Separator** - Visual dividers
26. **Sheet** - Side panels and drawers
27. **Skeleton** - Loading placeholders
28. **Slider** - Range sliders
29. **Switch** - Toggle switches
30. **Table** - Data tables
31. **Tabs** - Tabbed content
32. **Textarea** - Multi-line text inputs
33. **Toast** - Notification toasts
34. **Toggle** - Toggle buttons
35. **Tooltip** - Hover tooltips

## Features

### Design System
- **CSS Variables** - Consistent theming with CSS custom properties
- **Dark Mode** - Full dark mode support
- **Responsive** - Mobile-first responsive design
- **Animations** - Smooth transitions and micro-interactions

### Developer Experience
- **TypeScript** - Full TypeScript support with proper typing
- **Standalone Components** - No module dependencies
- **ControlValueAccessor** - Form integration for input components
- **Accessibility** - ARIA labels and keyboard navigation
- **Tree Shakable** - Import only what you need

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Variables** - Theme customization
- **Consistent Spacing** - Standardized spacing scale
- **Focus States** - Proper focus indicators

## Usage

### Basic Import
```typescript
import { ButtonComponent, CardComponent } from './ui';
```

### Component Usage
```typescript
@Component({
  imports: [ButtonComponent, CardComponent],
  template: `
    <ui-card>
      <ui-card-header>
        <ui-card-title>Example</ui-card-title>
      </ui-card-header>
      <ui-card-content>
        <ui-button variant="primary">Click me</ui-button>
      </ui-card-content>
    </ui-card>
  `
})
```

### Form Integration
```typescript
@Component({
  imports: [InputComponent, CheckboxComponent],
  template: `
    <form [formGroup]="form">
      <ui-input formControlName="email" placeholder="Email"></ui-input>
      <ui-checkbox formControlName="newsletter">Subscribe</ui-checkbox>
    </form>
  `
})
```

## Theming

The library uses CSS custom properties for theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  /* ... more variables */
}
```

## Demo

Visit `/ui-demo` to see all components in action with interactive examples.

## File Structure

```
ui/
├── README.md
├── index.ts                 # Barrel exports
├── ui-variables.css         # CSS custom properties
├── accordion.ts             # Accordion components
├── alert.ts                 # Alert components
├── avatar.ts                # Avatar components
├── badge.ts                 # Badge component
├── breadcrumb.ts            # Breadcrumb component
├── button.ts                # Button component
├── calendar.ts              # Calendar component
├── card.ts                  # Card components
├── checkbox.ts              # Checkbox component
├── collapsible.ts           # Collapsible components
├── command.ts               # Command component
├── dialog.ts                # Dialog components
├── dropdown-menu.ts         # Dropdown menu component
├── hover-card.ts            # Hover card component
├── input.ts                 # Input component
├── label.ts                 # Label component
├── menubar.ts               # Menubar component
├── navigation-menu.ts       # Navigation menu component
├── pagination.ts            # Pagination component
├── popover.ts               # Popover component
├── progress.ts              # Progress component
├── radio-group.ts           # Radio group components
├── scroll-area.ts           # Scroll area component
├── select.ts                # Select component
├── separator.ts             # Separator component
├── sheet.ts                 # Sheet components
├── skeleton.ts              # Skeleton component
├── slider.ts                # Slider component
├── switch.ts                # Switch component
├── table.ts                 # Table components
├── tabs.ts                  # Tabs components
├── textarea.ts              # Textarea component
├── toast.ts                 # Toast components & service
├── toggle.ts                # Toggle component
└── tooltip.ts               # Tooltip component
```

## Contributing

When adding new components:

1. Follow the existing naming conventions
2. Include proper TypeScript types
3. Add accessibility attributes
4. Support both light and dark themes
5. Include component in index.ts exports
6. Add demo examples to ui-demo component

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- Angular 18+
- Tailwind CSS 3+
- Lucide Angular (for icons)
- TypeScript 5+