# System Use Cases

This document outlines the primary user workflows and expected interactions within the Portfolio application. The system divides users into two major archetypes: **Public Guests** (visitors, recruiters, clients) and **Authenticated Administrators** (the portfolio owner).

## Public Guest Actor

The primary goal of the Guest is to view information, evaluate skills, and initiate contact.

### 1. View Portfolio Profile
* **Trigger:** User navigates to the root domain (`/`).
* **Action:** 
  * View hero section, developer bio, and summarized years of experience.
  * Browse the visually highlighted "Featured Projects".
  * Review the "Tech Stack & Tools" list.
  * View recent work history in the timeline.

### 2. Browse Projects Catalog
* **Trigger:** User clicks "Projects" in the navigation bar.
* **Action:**
  * View all active projects in a grid or list format.
  * Filter projects by tag, category, or technology stack.
  * Search for specific projects by name.

### 3. Consume Detailed Project Case Study
* **Trigger:** User clicks a specific project card.
* **Action:**
  * View in-depth details: Description, architecture, and language specifications.
  * Scroll through the interactive image gallery (if `GalleryJson` contains images).
  * Review "Key Features", "Responsibilities", and visual "Changelog" history.
  * Click external links to view live demos or GitHub repositories.

### 4. Engage in Discussion
* **Trigger:** User reaches the "Discussion" section of a project page.
* **Action:**
  * Read existing comments from other users.
  * Submit a new comment by providing a name, selecting an avatar, and typing a message.
  * "Like" an existing comment.
  * Reply directly to a top-level comment.
  * **System Response:** The UI immediately renders the comment locally, while the Backend broadcasts the new comment via SignalR to anyone else currently viewing that page.

### 5. Accessibility and Localization
* **Trigger:** User interacts with global header controls.
* **Action:**
  * **Translation:** User clicks the language toggle (EN/AR). The UI instantly flips orientation from Left-To-Right to Right-To-Left to accommodate Arabic, and translates all static text strings.
  * **Theme:** User clicks the Light/Dark mode toggle. UI colors invert seamlessly based on defined Tailwind CSS configurations.

## Authenticated Administrator Actor

The primary goal of the Administrator is to actively manage, update, and curate the portfolio data.

### 1. Authenticate
* **Trigger:** Navigates to `/admin` or `/identity/login`.
* **Action:** Enters secure credentials. Upon success, the UI stores a JWT bearer token, unlocking administrative UI elements globally.

### 2. Create / Edit a Project (The CRUD Workflow)
* **Trigger:** Admin clicks "Edit" on a project page or "Create Project" in the project catalog.
* **Action:** A comprehensive modal opens containing multiple distinct sections:
  * **Basic Info:** Edit title, descriptions (in both EN and AR), slugs, URLs, and active status.
  * **Categorization:** Modify Tags, Tech Stack, and Project Niche.
  * **Media:** Add, remove, or reorder gallery images.
  * **Features:** Add new technical "Key Features" with custom icons and translations.
  * **Responsibilities & Changelog:** Iteratively build out arrays of data outlining the history of the project.
* **System Response:** The UI maintains data integrity using immutable state updates across these forms. Once "Save" is clicked, a unified `ProjectDto` is mapped and POSTed/PUT to the backend API.

### 3. Sync from GitHub 
* **Trigger:** Admin chooses to import project data natively.
* **Action:** Provide a GitHub repository URL. The system invokes an external API to scrape the README, tags, and latest release information, pre-filling the Create/Edit modal to save time formatting a new case study.

### 4. Moderate Comments
* **Trigger:** Admin reviews the discussion board.
* **Action:** As an authenticated user, the Admin has "Delete" buttons visible next to all guest comments. Clicking delete sends a secure API request to permanently remove spam or inappropriate feedback.
