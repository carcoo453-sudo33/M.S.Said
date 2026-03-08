# Styling, Theming & UI Guidelines

The Portfolio UI relies heavily on Utility-First CSS using **TailwindCSS (v3+)**, negating the need for large, unwieldy global stylesheets containing custom BEM (Block Element Modifier) class chains.

## The Approach: Utility-First

Rather than writing CSS in `.css` or `.scss` files, styling is applied directly to HTML templates using Tailwind's predefined utility classes. 

* **Why?** It enforces a strict design system, reduces CSS bundle size (thanks to PurgeCSS/JIT), and makes it immediately obvious what styles affect a specific DOM element without switching files.

**Example:**
Instead of:
```html
<div class="project-card">...</div>
```
Use:
```html
<div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-red-600 transition-colors">...</div>
```

## Theming (Light vs. Dark Mode)

The application supports dual themes. The `dark:` variant modifier in Tailwind is essential for this.

**Rules for Theming:**
1. **Always style for Light Mode first.** This is your baseline. (e.g., `bg-white text-zinc-900`).
2. **Apply the `dark:` variant for the inversion.** (e.g., `dark:bg-zinc-950 dark:text-zinc-50`).

Example of a fully themed component:
```html
<section class="bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-zinc-300">
  <h1 class="text-red-500 dark:text-red-400">Title</h1>
</section>
```

## The Color Palette

The project utilizes a very specific, strict color palette derived from the Tailwind default configuration, heavily leaning into grayscale (Zinc) with stark, high-contrast accents (Red).

* **Primary Backgrounds:** `bg-white` (Light) / `bg-zinc-950` (Dark)
* **Secondary Backgrounds (Cards, Modals):** `bg-gray-50` (Light) / `bg-zinc-900` (Dark)
* **Borders & Dividers:** `border-gray-200` (Light) / `border-zinc-800` (Dark)
* **Primary Text:** `text-zinc-900` (Light) / `text-white` or `text-zinc-50` (Dark)
* **Brand / Call-to-Action Color:** Red (`text-red-600`, `bg-red-600`)

Never introduce arbitrary hex codes via `bg-[#FF0000]` unless matching a specific third-party logo brand color. Stick to the predefined palette.

## RTL (Right-to-Left) Localization

Because the application supports Arabic, directional styling is crucial.

**DO NOT use explicit left/right properties.** Use logical properties.
* ❌ Bad: `pl-4` (Padding Left), `ml-2` (Margin Left)
* ✅ Good: `ltr:pl-4 rtl:pr-4` (Explicitly defining the padding based on document direction.)
* ✅ Better: `ps-4` (Padding Start), `ms-2` (Margin Start - if supported by your setup).
* ❌ Bad: `border-l-2`
* ✅ Good: `ltr:border-l-2 rtl:border-r-2`

## Global Styles (`styles.css` / `index.css`)

The singular global stylesheet should remain incredibly sparse. It should primarily contain:
1. The `@tailwind base; @tailwind components; @tailwind utilities;` directives.
2. `@layer base { ... }` overrides for bare HTML elements (like setting the core typography font-family).
3. Complex, multi-stage `@keyframes` animations that are too verbose for arbitrary Tailwind utility classes.
