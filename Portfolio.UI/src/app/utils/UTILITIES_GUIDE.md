# Utilities Guide

This directory contains static utility classes for common operations across the application. All utilities are exported from `index.ts` for centralized access.

## Available Utilities

### ImageUtil
Handles image URL resolution and error handling.

```typescript
import { ImageUtil } from '../utils';

// Get full image URL (handles relative/absolute paths)
const fullUrl = ImageUtil.getFullImageUrl('uploads/image.jpg');

// Check if URL is external
const isExternal = ImageUtil.isExternalUrl(url);

// Handle image errors
<img [src]="url" (error)="ImageUtil.onImageError($event)" />
```

### ValidationUtil
Provides validation and sanitization functions.

```typescript
import { ValidationUtil } from '../utils';

// Validate email
if (ValidationUtil.isValidEmail(email)) { }

// Validate URL
if (ValidationUtil.isValidUrl(url)) { }

// Sanitize HTML content
const safe = ValidationUtil.sanitizeHtml(userContent);

// Validate comment
const result = ValidationUtil.validateComment(content);
if (result.isValid) {
  // Use result.sanitized
}

// Validate project data
const validation = ValidationUtil.validateProject(project);

// Validate contact form
const validation = ValidationUtil.validateContactForm(form);
```

### RateLimitUtil
Client-side rate limiting for requests.

```typescript
import { RateLimitUtil } from '../utils';

// Check if request is allowed (3 requests per 60 seconds)
if (RateLimitUtil.checkRateLimit('comment_projectId', 3, 60000)) {
  // Proceed with request
}

// Reset specific rate limit
RateLimitUtil.reset('comment_projectId');

// Clear all rate limits
RateLimitUtil.clearAll();
```

### TranslationUtil
Handles bilingual content (English/Arabic).

```typescript
import { TranslationUtil } from '../utils';

// Get translated field
const title = TranslationUtil.getTranslatedField(obj, 'title', 'ar');

// Translate single object
const translated = TranslationUtil.translateObject(obj, ['title', 'description'], 'ar');

// Translate array of objects
const translated = TranslationUtil.translateArray(items, ['title', 'description'], 'ar');
```

### ProjectUtil
Project-specific utilities for normalization and highlights.

```typescript
import { ProjectUtil } from '../utils';

// Normalize project data from backend
const normalized = ProjectUtil.normalizeProject(rawProject);

// Get highlighted projects (most viewed, featured, latest)
const highlights = ProjectUtil.getProjectHighlights(projects);

// Get full image URL
const url = ProjectUtil.getFullImageUrl(imageUrl);
```

### Error Handler Utilities
Centralized error handling functions.

```typescript
import { handleAuthError, handleConnectionError, handleGenericError } from '../utils';

// Handle authentication errors
handleAuthError(error, toast, auth, router);

// Handle connection errors
handleConnectionError(toast);

// Handle generic errors
handleGenericError(error, toast, auth, router, 'Custom message');
```

## Usage Pattern

All utilities are static classes - no instantiation needed:

```typescript
// ✅ Correct
ImageUtil.getFullImageUrl(url);

// ❌ Incorrect
new ImageUtil().getFullImageUrl(url);
```

## Importing

Import from the centralized index:

```typescript
// ✅ Preferred
import { ImageUtil, ValidationUtil } from '../utils';

// ❌ Avoid
import { ImageUtil } from '../utils/image.util';
```

## Adding New Utilities

1. Create a new file: `new-feature.util.ts`
2. Export static class with methods
3. Add export to `index.ts`
4. Document usage in this guide
