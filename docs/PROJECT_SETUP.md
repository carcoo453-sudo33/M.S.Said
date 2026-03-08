# Project Setup Guide

This document provides a comprehensive step-by-step guide to setting up the Portfolio application on your local machine for development and testing.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
* **Node.js** (v18.0.0 or higher recommended) & npm
* **.NET SDK** (v9.0)
* **SQL Server** (LocalDB, Developer Edition, or via Docker)
* **Git**
* A code editor (e.g., **Visual Studio Code**, **Visual Studio 2022**, or **Rider**)

## 1. Clone the Repository

```bash
git clone https://github.com/Mostafa-SAID7/Portfolio.git
cd Portfolio
```

## 2. Database Configuration

The application uses Microsoft SQL Server. If you do not have a local instance running, you can easily spin one up using the provided `docker-compose.yml` file located in the `/devops` directory.

### Using Docker (Recommended)
```bash
cd devops
docker-compose up -d
```
This will start a SQL Server instance on `localhost:1433`. The default SA password is configured inside the `docker-compose.yml` file.

### Connection String Setup
Navigate to the API directory:
```bash
cd ../Portfolio.API
```
Open `appsettings.Development.json` and ensure your `DefaultConnection` string points to your running SQL Server instance. It should look something like this:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost,1433;Database=PortfolioDb;User Id=SA;Password=YourStrongPassword!;TrustServerCertificate=True"
}
```

## 3. Running the Backend API (.NET 9)

With your database running and connection string configured, you can apply migrations and start the API.

1. Install Entity Framework Core CLI tools (if you haven't already):
   ```bash
   dotnet tool install --global dotnet-ef
   ```
2. Apply Entity Framework Migrations to create the database schema:
   ```bash
   dotnet ef database update
   ```
   *(Note: The `Program.cs` might be configured to automatically run `.Migrate()` in development, but it's good practice to verify.)*
3. Run the API:
   ```bash
   dotnet run
   ```
   The API will typically start on `http://localhost:5000` or `https://localhost:5001`. A Swagger UI interface is available at `/swagger` for testing endpoints interactively.

## 4. Running the Frontend UI (Angular 19)

Open a new terminal window or tab and navigate to the frontend directory from the root of the project:

```bash
cd Portfolio.UI
```

1. Install the node modules dependencies:
   ```bash
   npm install
   ```
2. Configure the API URL. Open `src/environments/environment.ts` and `src/environments/environment.development.ts` to ensure the `apiBaseUrl` matches your running .NET API backend (e.g., `https://localhost:5001/api`).
3. Start the Angular development server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:4200/`.

## 5. First-Time Admin Login

By default, the system requires authentication for administrative actions (like creating or deleting projects). 

To log in, navigate to the `/admin` path or click the "Admin System" link in the navigation bar. You will need to use the default administrator credentials seeded in the database or register a new user depending on your authentication setup in `Portfolio.API/Data/DbInitializer.cs`.

## Troubleshooting

* **CORS Errors**: Ensure that the `AllowAngular` CORS policy in `Program.cs` includes `http://localhost:4200`.
* **Database Connection Failed**: Double-check your `appsettings.json` connection string and verify that the SQL Server Docker container is actually running using `docker ps`.
* **Missing npm packages**: If you encounter Module Not Found errors in the UI, try deleting the `node_modules` folder inside `Portfolio.UI` and re-running `npm install`.
