# Security & Vulnerability Policy

Security is a core focus for this project, particularly concerning the administrative CMS capabilities and the database containing public comments.

## Supported Software Versions

Only the `main` branch and the latest deployed production iteration receive security patches. We do not maintain long-term support (LTS) for older, historic branches of this portfolio.

| Version | Supported          |
| ------- | ------------------ |
| v2.x.x  | :white_check_mark: |
| v1.x.x  | :x:                |

## Reporting a Vulnerability

If you identify a security vulnerability in the Portfolio backend (API), the frontend (UI), or the infrastructure configuration, **do not open a public issue.** Public disclosure might allow malicious actors to exploit the vulnerability before a patch can be deployed.

Instead, please send an email to the lead developer:
> **M.Said813@gmail.com**

Please include the following details in your report:
1. **Description of the vulnerability:** What is the issue, and what is its potential impact?
2. **Steps to reproduce:** How can we trigger the vulnerability? (Include code snippets, HTTP requests, or screenshots if possible).
3. **Environment details:** Are you attacking the live production environment or a local Docker build?

You should expect a response acknowledging receipt of your report within 48 hours.

## Implemented Security Measures

This project currently employs the following best practices:

* **Authentication & Authorization:** All administrative endpoints (`POST`, `PUT`, `DELETE` on `/api/projects/*`) require a valid JWT Bearer Token issued by ASP.NET Core Identity.
* **CORS Policies:** The .NET API explicitly defines Cross-Origin Resource Sharing (CORS) origins, allowing requests only from the specified Angular frontend domain.
* **SQL Injection Prevention:** By utilizing Entity Framework Core and parameterized queries for all database interactions, direct SQL injection risks are mitigated.
* **Data Sanitization:** Input limits (e.g., `[StringLength]`) and `[Required]` attributes are enforced at the DTO level to reject malformed requests before they hit the database.
* **Dependency Scanning:** We encourage running `npm audit` and `dotnet list package --vulnerable` regularly to catch known CVEs in upstream libraries.
