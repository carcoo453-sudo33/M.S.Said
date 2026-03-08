# Deployment & Infrastructure Guide

Deploying separating frontend (Angular) and backend (.NET Core) applications usually involves hosting them in distinct environments that specialize in their respective needs.

## 1. Deploying the Database (SQL Server)

For production, it is rarely advisable to host your own SQL Server via Docker unless you have significant database administration experience. 

* **Recommended Options:**
  * **Azure SQL Database:** Seamless integration with .NET, high availability, and automated backups.
  * **AWS RDS for SQL Server:** Robust and scalable.
* **Migration Strategy:** Once your cloud database instance is running, you can apply migrations securely by obtaining the production connection string and running:
  ```bash
  dotnet ef database update --connection "Server=tcp:<your-server>.database.windows.net,1433;Initial Catalog=PortfolioDb;User ID=<user>;Password=<pass>;"
  ```
  *(Never commit your production connection string to `appsettings.json` in GitHub. Use Environment Variables or Azure KeyVault.)*

## 2. Deploying the Backend (.NET 9 Web API)

The backend handles computationally heavy processes and WebSocket (SignalR) connections.

* **Recommended Options:**
  * **Azure App Service:** The easiest and most native path for .NET applications. Enables easy scaling and environment variable injection.
  * **AWS Elastic Beanstalk / ECS:** Excellent for containerized deployments if wrapping the API in a Docker container.
  * **DigitalOcean Droplet (Ubuntu):** Cost-effective, but requires manually setting up reverse proxies (Nginx/Apache) to forward external traffic to the Kestrel server running on localhost:5000.

**Publishing the API:**
1. Navigate to `Portfolio.API/`.
2. Produce a release build (omitting development configs):
   ```bash
   dotnet publish -c Release -o ./publish
   ```
3. Copy the contents of the `./publish` folder to your server, or utilize a CI/CD pipeline (like GitHub Actions) to automate the deployment to Azure App Service.

## 3. Deploying the Frontend (Angular 19)

Angular builds into a static bundle (HTML, JS, CSS). It can be hosted entirely for free on Content Delivery Networks (CDNs) without requiring a dedicated server to execute code.

* **Recommended Options:**
  * **Netlify:** Extremely fast setup, free tier, excellent PR preview environments.
  * **Vercel:** Similarly excellent developer experience and free tier.
  * **Azure Static Web Apps:** Integrates perfectly if your backend is also on Azure.
  * **GitHub Pages:** A simple, free option, though SPA routing requires a `404.html` redirect hack.

**Build Process for Production:**
1. Ensure your `src/environments/environment.ts` (or `environment.prod.ts`) points to your newly deployed production backend API URL (e.g., `https://api.myweb.com/`).
2. Run the production build command:
   ```bash
   ng build --configuration production
   ```
3. This creates a `/dist/portfolio-ui/` folder containing your static assets.

### Using the `netlify.toml` file
If deploying to Netlify, this repository includes a `netlify.toml` file at the root. This file tells Netlify's servers two critical things:
1. Whenever a user hits a route like `/projects/my-first-app`, redirect that request back to `/index.html`. This ensures Angular's internal router can take over and prevents 404 Page Not Found errors upon refreshing the page.
2. Build commands to run `npm i` and `ng build`.
