# Application Architecture & Structure

This project is a separated, monolithic application consisting of an Angular Single Page Application (SPA) frontend and a .NET Core Web API backend. The two systems communicate exclusively over HTTP REST and WebSockets (SignalR).

## High-Level Architecture

```text
[ Client Browser ] <---HTTP/WebSocket---> [ .NET 9 Web API ] <---EF Core---> [ SQL Server Database ]
  (Angular 19)                                (REST API)                            (Relational Data)
```

## Directory Structure Overview

The root of the repository sits under `Portfolio/` and is divided logically into backend, frontend, deployment, and documentation domains.

```tree
Portfolio/
├── Portfolio.API/        # .NET 9 Backend Application
├── Portfolio.UI/         # Angular 19 Frontend Application
├── database/             # Raw SQL migration scripts and tools
├── devops/               # Docker configurations for infrastructure
└── docs/                 # Project documentation (You are here)
```

## Frontend Architecture (`Portfolio.UI`)

The frontend is built using **Angular 19** utilizing the **Standalone Component** pattern (no `NgModules`).

### Core Design Principles
* **Component-Based UI**: UI elements are broken down into reusable smart and dumb components.
* **Service Layer**: Business logic and HTTP calls are abstracted out of components and into Injectable Services (e.g., `project-crud.service.ts`).
* **Reactive State**: Observables (`rxjs`) and Angular Signals are used to manage state changes synchronously across the app.
* **Internationalization**: `ngx-translate` is utilized to serve the application in both English (LTR) and Arabic (RTL) seamlessly.
* **Component Modals**: Heavy CRUD operations are handled via distinct modal components (e.g., `project-crud-modal.ts`) that orchestrate smaller form components.

### Key Directories
* `src/app/components/`: The visual building blocks of the app separated by feature (e.g., `project-details`, `shared`).
* `src/app/models/`: TypeScript interfaces representing the DTOs expected from the API.
* `src/app/services/`: Singleton services handling data fetching, translation, theme toggling, and notifications.
* `src/assets/i18n/`: JSON translation dictionaries for English (`en.json`) and Arabic (`ar.json`).

## Backend Architecture (`Portfolio.API`)

The backend is a **.NET 9 ASP.NET Core Web API** utilizing **Entity Framework Core** as the ORM.

### Core Design Principles
* **Repository & Unit of Work Pattern**: Data access logic is isolated from controllers. The Unit of Work ensures that multiple repository operations succeed or fail as a single transaction before calling `.SaveChanges()`.
* **DTO Mapping**: Entities are rarely exposed directly to the client. Controllers map internal Database Entities (e.g., `ProjectEntry`) to Data Transfer Objects (e.g., `ProjectDto`) to prevent over-posting and hide relational complexities.
* **Real-time Notifications**: ASP.NET Core SignalR provides a persistent WebSocket connection to push notifications (like new comments or system events) directly to connected Angular clients.
* **Global Error Handling**: A centralized error-handling middleware cleanly catches exceptions and returns uniform JSON problem details to the frontend instead of raw stack traces.

### Key Directories
* `/Controllers`: HTTP endpoints (REST). Thin layers that route requests to internal services or repositories.
* `/Entities`: Models representing the SQL Server schema mapped via EF Core.
* `/DTOs`: Models representing data sent to and received from the Angular client.
* `/Repositories`: The abstraction layer directly querying `PortfolioDbContext`.
* `/Hubs`: SignalR hubs for WebSocket communication.
* `/Data`: Entity Framework `DbContext`, configurations, and initialization seeding logic.

## Data Layer Architecture

The system utilizes Microsoft SQL Server. Entity Framework Core handles Code-First migrations to build the schema based on the C# classes in `/Entities`. Complex collections (like a gallery of image URLs) that do not require independent querying are often serialized into JSON strings (e.g., `GalleryJson`) within a single database column to improve fetch performance and simplify the schema. 
