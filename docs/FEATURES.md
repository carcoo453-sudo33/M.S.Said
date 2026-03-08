# Detailed Feature Set

The Portfolio platform is designed to be a comprehensive showcase for a modern full-stack developer, offering far more than a simple static HTML page. It operates as a fully dynamic, CMS-driven web application.

## Core Platform Features

### Responsive, Real-time User Interface
* **Dynamic Routing & SEO:** Every project, blog post, and profile section is dynamically generated and routed through Angular, but crafted to emulate a server-side rendered feel with optimal `meta` tags for crawling (when used with Server-Side Rendering or Prerendering tools like Universal).
* **Bilingual Localization (i18n):**
  * Seamless toggling between English (EN) and Arabic (AR).
  * The entire DOM shifts from Left-to-Right (LTR) to Right-to-Left (RTL) instantaneously without page reloads using `ngx-translate`.
  * Database fields support localized strings (e.g., `Title` vs `Title_Ar`) to ensure clean grammar in both languages.
* **Theming Engine:**
  * System-default detection for Light or Dark mode.
  * Manual override toggle.
  * Deep Tailwind integration ensuring perfect contrast ratios (`dark:bg-zinc-950`, `bg-white`) in all components seamlessly.
* **Component-Level Skeleton Loaders:**
  * To prevent layout jank and Cumulative Layout Shift (CLS), independent skeleton placeholders animate while data is fetched from the API.

### Interactive Project Case Studies
* **Grid & List Views:** Projects are displayed on the home page and dedicated catalog with interactive hover states.
* **Rich Media Galleries:** Projects support multiple high-resolution images.
* **Technical DNA Breakdown:** Each project itemizes its Architecture pattern (e.g., Microservices, Monolithic), Language, and Duration.
* **Categorization & Filtering:** Visitors can filter projects by complex tags (e.g., `#Angular`, `#Docker`, `#SQL`).

### Real-Time Discussion Board
* **Live Commenting:** Users can discuss case studies. When a comment is posted, it is immediately rendered for the user, and SignalR broadcasts the comment to any other user viewing that specific project in real-time.
* **Instant Engagement Metrics:** Users can "Like" comments. Like counts update dynamically without a full page refresh.
* **Threaded Replies:** Support for replying to specific comments.

### Robust Admin CMS
* **Authentication:** Secure login for the repository owner via ASP.NET Core Identity.
* **Unified CRUD Modal:** A complex, multi-tab modal interface allowing the admin to build out a project profile:
  * **Basic Info:** Titles, localized descriptions, URLs.
  * **Categorization:** Managing tags and tech stacks.
  * **Media Management:** Adding/removing gallery images.
  * **Features & History:** Building arrays of "Key Features" and tracking iterative "Changelogs".
* **Immutable State Management:** Form interactions strictly utilize immutable array unshifting and filtering to ensure Angular Change Detection works flawlessly.
* **GitHub Integration:** The ability to auto-populate a project's details by importing metadata directly via a GitHub repository URL.

## API Backend Features
* **RESTful Architecture:** Distinct, well-documented controllers for Projects, Identity, and Profiles.
* **Unit of Work Pattern:** Ensures data consistency across complex CRUD operations involving multiple entities (e.g., saving a project, its features, and its images simultaneously).
* **SignalR Hub Integration:** A persistent WebSocket connection for pushing updates (comments, likes) down to the Angular clients instantly.
* **Global Exception Handling:** Custom middleware traps SQL errors or null references, formatting them into polite, standardized `ProblemDetails` JSON responses for the frontend to consume gracefully.
* **Entity Framework Code-First:** The database schema is generated and updated purely through C# code migrations, preventing configuration drift between environments.
