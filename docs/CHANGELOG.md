# Changelog

All notable changes to the Portfolio project will be documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project aims to adhere to Semantic Versioning as it approaches a formal v1.0.0 release.

---

## [Unreleased / Development] - 2026-03-08

### Added
- **Full Architecture Documentation:** Bootstrapped the `/docs` folder with 13 comprehensive markdown files covering ERD schemas, deployment strategies, and UI styling guidelines to assist future contributors.
- **Root Directory Cleanup:** Initiated a cleanup of the repository root, migrating raw `.sql` migration files into an organized `/database` folder, and migrating Docker `.yml` configurations into a `/devops` folder. Removed several conflicting or redundant root files (e.g., stray `node_modules`, `Program.cs`, `package.json`).
- **Feature Limit UI:** Implemented a new UI element on the Project Details page that restricts the "Key Features" display to a maximum of 3 items, generating a dynamic "+N More Features" badge for the remainder to improve visual balance.
- **Missing Translations:** Added necessary cross-lingual support (English/Arabic) in `i18n` dictionaries to support the new Feature Limit UI.

### Fixed
- **Immutable State Synchronization:** Rewrote the internal array management for the Project CRUD Modals (specifically for Responsibilities, Changelog, and Key Features). Transitioned away from mutating methods (`.push()`, `.splice()`) and adopted immutable operations (spread operator `[...]`, `.filter()`). This successfully resolved an intermittent bug where newly added nested items failed to trigger Angular's Change Detection, causing the UI to desynchronize during the save process.
- **Layout Rendering Stability:** Handled numerous edge cases where empty arrays (like tags) or null values (missing project summaries) would generate empty UI divs or `[object Object]` rendering errors.

---

## [0.1.0] - Alpha Release
*(Historical context preceding the documentation push).*

### Added
- Initial creation of the `.NET 9` Web API.
- Implementation of Entity Framework Core and SQL Server schema generation context.
- Initial creation of the `Angular 19` user interface with TailwindCSS.
- Setup of `ngx-translate` for English and Arabic directional translations.
- Core Identity authentication logic and Basic CRUD endpoint scaffolding.
