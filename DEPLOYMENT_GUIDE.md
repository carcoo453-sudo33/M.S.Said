# Deployment Guide

## Backend Deployment (Azure App Service)

### Prerequisites
- Azure account with App Service created
- Visual Studio or Visual Studio Code with .NET 9 SDK
- Git repository with latest code

### Steps to Deploy Backend

#### Option 1: Using Visual Studio (Recommended)

1. **Open the solution** in Visual Studio
2. **Right-click** on `Portfolio.API` project
3. **Select** "Publish"
4. **Choose** the publish profile: `site56676-WebDeploy` or `site56676-WebDeploy1`
5. **Click** "Publish"
6. **Wait** for deployment to complete

The migrations will run automatically when the app starts.

#### Option 2: Using Command Line

```bash
cd Portfolio.API
dotnet publish -c Release -o ./publish
# Then use Azure CLI or FTP to upload the publish folder
```

#### Option 3: Using Azure CLI

```bash
# Login to Azure
az login

# Deploy using git
git push azure main
```

### What Happens During Deployment

1. **Code is deployed** to Azure App Service
2. **App starts** and runs `ConfigureDatabaseAsync()`
3. **Migrations are applied** automatically to the remote database
4. **Schema updates** are applied for any missing columns
5. **Admin user** is seeded if configured
6. **API is ready** to serve requests

### Verify Deployment

After deployment, check:

1. **Health endpoint**: `https://m-portfolio.runasp.net/health`
2. **Swagger UI**: `https://m-portfolio.runasp.net/swagger`
3. **Check logs** in Azure App Service > Monitoring > Log stream

### Database Connection String

The connection string should be configured in Azure App Service:
- **Settings** > **Configuration** > **Connection strings**
- Add `DefaultConnection` with your SQL Server connection string

### Environment Variables

Ensure these are set in Azure App Service Configuration:

```
AdminUser:Email = your-admin-email@example.com
AdminUser:Password = your-secure-password
AllowedOrigins:0 = https://m-said-portfolio.netlify.app
AllowedOrigins:1 = http://localhost:4200
```

---

## Frontend Deployment (Netlify)

### Prerequisites
- Netlify account connected to GitHub repository
- Latest code pushed to main branch

### Automatic Deployment

Netlify automatically deploys when you push to the main branch:

1. **Push code** to GitHub: `git push origin main`
2. **Netlify detects** the push
3. **Build starts** automatically
4. **Site deploys** to `https://m-said-portfolio.netlify.app/`

### Manual Build (if needed)

```bash
cd Portfolio.UI
npm run build
# Output is in dist/ folder
```

### Verify Frontend Deployment

1. Visit `https://m-said-portfolio.netlify.app/`
2. Check browser console for any errors
3. Verify API calls are reaching the backend

---

## Troubleshooting

### "Connection lost" Error on Frontend

**Cause**: Backend is not accessible

**Solutions**:
1. Verify backend is deployed and running
2. Check Azure App Service status
3. Verify connection string is correct
4. Check CORS configuration allows Netlify domain
5. Check firewall rules allow connections

### Database Migration Errors

**Check logs**:
```
Azure Portal > App Service > Monitoring > Log stream
```

**Common issues**:
- Connection string is incorrect
- Database doesn't exist
- Insufficient permissions
- Network connectivity issues

### Swagger Not Loading

**Cause**: Swagger is disabled in production

**Solution**: Already enabled in `PipelineConfiguration.cs`

---

## Current Status

✅ Backend code is ready for deployment
✅ Migrations are configured to run automatically
✅ Frontend is deployed on Netlify
✅ CORS is configured for Netlify domain
✅ Swagger is enabled in production

**Next Step**: Deploy backend to Azure App Service

