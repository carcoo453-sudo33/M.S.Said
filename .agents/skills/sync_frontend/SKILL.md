---
name: sync_backend_to_frontend
description: Scans the .NET backend for API, DTO, and controller changes, and updates the Angular frontend services and models to match.
---

# Sync Backend to Frontend Skill

**Purpose**: This skill ensures the Angular frontend remains perfectly synchronized with the .NET backend. Whenever new endpoints are added, existing routes change, or Data Transfer Objects (DTOs) are modified in the API, this skill will detect those changes and apply the corresponding updates to the TypeScript codebase.

## Prerequisites
- The backend relies on standard ASP.NET Core MVC Controllers (`[ApiController]`).
- The frontend relies on Angular HTTP services and TypeScript interfaces.

## Workflow

### 1. Analyze Backend Changes
First, identify what has changed in the backend. 
- Use the `run_command` tool to check recent git commits: `git log -p -n 3 -- Portfolio.API/Controllers Portfolio.API/Application/DTOs`.
- Use the `grep_search` tool to find all `[HttpGet]`, `[HttpPost]`, `[HttpPut]`, and `[HttpDelete]` attributes in the `Portfolio.API/Controllers` directory to map out the current API surface.
- Understand the shape of returned DTOs in `Portfolio.API/Application`.

### 2. Map to Frontend Entities
For every updated or new backend component, locate its frontend counterpart in `Portfolio.UI/src/app`:
- **Models/DTOs**: Usually located in `models/` or `interfaces/` directories.
- **Services**: Usually located in `services/` or `core/` directories mapping to backend controllers (e.g., `ProfileController` -> `profile.service.ts`).

### 3. Update TypeScript Models
Update or create frontend models to perfectly match the C# DTOs.
- C# `string` -> TS `string`
- C# `int`, `double`, `decimal` -> TS `number`
- C# `bool` -> TS `boolean`
- C# `DateTime` -> TS `string` or `Date`
- C# `Guid` -> TS `string`

Use `view_file` to see the existing TS models, and `replace_file_content` to add or modify fields.

### 4. Update Angular Services
Update the Angular services that communicate with the backend.
- Ensure the `environment.apiUrl` is respected.
- Verify the HTTP methods (GET, POST, PUT, DELETE) match exactly.
- Ensure the route parameters and query strings are constructed correctly based on the C# `[Route]` and `[FromQuery]` attributes.
- Ensure the return types (`Observable<T>`) match the updated TypeScript models.

### 5. Deep Sync Nested Entities
Pay special attention to collections/arrays inside the main DTO (e.g., `List<ProjectImageDto> Images`).
- Ensure nested interfaces are created in the frontend (`export interface ProjectImage { ... }`).
- Update frontend mapping logic (e.g., inside `project.service.ts` -> `normalizeProject()`) to properly inherit, map, or sanitize these nested arrays.
- Watch out for renamed fields between the backend and frontend (e.g., backend `Title` vs frontend `Text`). Ensure the frontend TypeScript component logic is refactored to consume the new field names.

### 6. Standardize UI and Enhance Components
Once the data is flowing from backend to frontend models, you must inject the new properties into the HTML templates.
- **Audit Components:** Use `find_by_name` or `list_dir` to find all components related to the feature (e.g., `project-card`, `project-details`, `projects-list`).
- **Remove Duplicates:** Ensure there aren't multiple unused components doing the same thing. Look at `app.routes.ts` or component selectors to verify usage.
- **Insert New Data:** Add the new properties into the HTML layout natively (e.g., adding a new badging system for `TechStack`).
- **Standardize UI (Tailwind):** Use modern, consistent Tailwind CSS logic (e.g., `bg-zinc-900`, `text-zinc-400`, `rounded-xl`, `hover:border-red-600`, `transition-all`). Avoid mixing different UI paradigms if the rest of the project is using dark mode `zinc` and `red-600` accents.

### 7. Implement SEO Synchronization
Ensure the new data is discoverable by search engines.
- **Dynamic SEO:** Inject `Title` and `Meta` services into the details component.
- **Tag Mapping:** Map backend `Title`, `Summary`, and `ImageUrl` to `titleService`, `description` meta, and OpenGraph (og:) tags.
- **Canonical URLs:** Always update the canonical link tag to match the current `window.location.href`.

### 8. Verify Frontend Build
After making the necessary changes to the frontend codebase, verify that it compiles without errors.
- Use `run_command` in the `Portfolio.UI` directory: `npm run build` or `npm run lint`.
- If type errors occur in frontend components using the services/models, you must update those components to handle `undefined` checks or use the new shapes as well.

## Execution Rules
- Always use **absolute paths** when reading or modifying files.
- Double-check for nullability differences (e.g., `string?` in C# should be `string | null` or an optional property `propertyName?: string` in TS).
- Do not remove frontend properties unless they have been explicitly removed from the backend DTOs and are no longer needed by the UI.
