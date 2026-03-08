# Contributing to the Portfolio Project

First off, thank you for considering contributing to this portfolio project! It's people like you that make open source and community projects such a great place to learn, inspire, and create.

The following is a set of guidelines for contributing to the Portfolio Application (both UI and API). These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
   - [Issues](#issues)
   - [Pull Requests](#pull-requests)
3. [Development Setup](#development-setup)
4. [Commit Messages](#commit-messages)
5. [Styleguides](#styleguides)
   - [Git Commit Messages](#git-commit-messages)
   - [TypeScript/Angular Styleguide](#typescriptangular-styleguide)
   - [C#/.NET Styleguide](#cnet-styleguide)

---

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Issues
We use GitHub issues to track public bugs and feature requests. 

**Before Submitting an Issue:**
* Check the existing issues to ensure someone hasn't already reported the problem or requested the feature.
* Be sure to include your operating system, browser, and version information if it's a UI bug.

**How to Submit a Good Issue:**
* Provide a clear and descriptive title.
* Explain the expected behavior and the actual behavior.
* Include steps to reproduce the problem.
* Include screenshots or animated GIFs if possible to visually demonstrate the issue.
* For API errors, include the exact error message, stack trace, and request payload if applicable.

### Pull Requests
The process described here has several goals:
* Maintain code quality
* Fix problems that are important to users
* Engage the community in working toward stable, reliable code

**Pull Request Process:**
1. Fork the repo and create your branch from `main`.
2. Title the pull request with a short description of the changes made and the issue or bug number associated with your change. For example, you can title an issue like so "Added more log outputting to resolve #4352".
3. Write a clear description of your PR explaining *why* the change is being made, not just *what* changed.
4. If you've changed APIs, update the documentation (`ERD.md`, `USE_CASES.md`, etc.).
5. Ensure the application still compiles and runs without errors.
6. Make sure your code lints and follows the styleguides below.
7. The PR will be merged once you have the sign-off of the core maintainer.

## Development Setup

Please refer to [`PROJECT_SETUP.md`](PROJECT_SETUP.md) for detailed instructions on setting up your local environment, including connecting the UI, API, and SQL database.

## Commit Messages

We format our commit messages following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
* `feat`: A new feature
* `fix`: A bug fix
* `docs`: Documentation only changes
* `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* `refactor`: A code change that neither fixes a bug nor adds a feature
* `perf`: A code change that improves performance
* `test`: Adding missing tests or correcting existing tests
* `chore`: Changes to the build process or auxiliary tools and libraries

**Example:**
`feat(api): add pagination to project comments endpoint`

## Styleguides

### TypeScript/Angular Styleguide
* We generally follow the official [Angular Coding Style Guide](https://angular.io/guide/styleguide).
* Use single quotes for strings except to avoid escaping.
* Use `camelCase` for variable and function names.
* Use `PascalCase` for class names and interfaces.
* Components should be standalone where possible (Angular 14+).

### C#/.NET Styleguide
* We follow standard Microsoft C# coding conventions.
* Use `PascalCase` for class names, methods, and properties.
* Use `camelCase` with a leading underscore `_camelCase` for private fields.
* Use `camelCase` for local variables and method parameters.
* Keep controllers lightweight; move business logic into Services or the Unit of Work.
* Prefer dependency injection over static classes for testability.
