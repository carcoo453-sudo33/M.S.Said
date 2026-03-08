# Full Technology Stack

The Portfolio application represents a modern, separated enterprise-grade architectural approach, utilizing industry-leading frameworks for both the user interface and the backend server.

## Frontend (Client-Side)

The user interface heavily prioritizes speed, responsive design, and maintainability.

* **[Angular 19](https://angular.dev/)**: The core structural framework utilizing the Standalone Components architecture. Known for its robust dependency injection and strictly-typed ecosystem.
* **[TypeScript](https://www.typescriptlang.org/)**: A strict syntactical superset of JavaScript adding optional static typing.
* **[TailwindCSS (v3+)](https://tailwindcss.com/)**: A utility-first CSS framework for rapidly building custom user interfaces without the bloat of traditional CSS pre-processors.
* **[RxJS (Reactive Extensions for JavaScript)](https://rxjs.dev/)**: Used extensively within Angular services to handle asynchronous events, HTTP calls, and state management streams.
* **[ngx-translate](https://github.com/ngx-translate/core)**: The library powering the seamless internationalization (i18n) layer, allowing the app to switch instantly between English and Arabic.
* **[Lucide Angular](https://lucide.dev/)**: A beautiful, consistent open-source icon library.

## Backend (Server-Side)

The backend prioritizes stability, complex relational data integrity, and real-time communication.

* **[.NET 9](https://dotnet.microsoft.com/)**: Microsoft's latest high-performance, cross-platform, open-source developer platform.
* **[C# 13](https://docs.microsoft.com/en-us/dotnet/csharp/)**: The strongly-typed backend language powering the API controllers, services, and models.
* **[ASP.NET Core Web API](https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-web-api)**: The framework used to construct the RESTful endpoints serving JSON data to the Angular client.
* **[Entity Framework Core 9 (EF Core)](https://docs.microsoft.com/en-us/ef/core/)**: The Object-Relational Mapper (ORM) utilized to translate C# objects into SQL Server commands, executing queries and managing database migrations programmatically.
* **[ASP.NET Core SignalR](https://docs.microsoft.com/en-us/aspnet/core/signalr/introduction)**: A library that adds real-time web functionality via WebSockets, allowing the server to push content (like new chat comments) instantly to connected clients.
* **[ASP.NET Core Identity](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity)**: An API that supports user interface login functionality and manages users, passwords, profile data, roles, claims, and securely issues JWT authentication tokens.

## Infrastructure & Tooling

* **[Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/)**: A highly robust relational database management system storing all application state.
* **[Docker & Docker Compose](https://www.docker.com/)**: Used during local development environments (`/devops/docker-compose.yml`) to ensure developers do not need to install complex dependencies like SQL Server natively on their machines.
* **[Git & GitHub](https://github.com/)**: Source control tracking and collaborative development hub.
* **[NPM (Node Package Manager)](https://www.npmjs.com/)**: Used to manage frontend dependencies.
* **[NuGet](https://www.nuget.org/)**: The package manager utilized by the .NET ecosystem to install external C# libraries.
