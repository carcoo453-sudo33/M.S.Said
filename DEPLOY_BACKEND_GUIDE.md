# Backend Deployment Guide

## Problem
The frontend at `https://m-said-portfolio.netlify.app` is getting CORS errors when trying to connect to the backend API at `https://m-protfolio.runasp.net`.

## Solution
The CORS configuration has been updated in `Portfolio.API/Program.cs` to allow requests from your Netlify domain. However, you need to deploy this updated code to your hosting server.

## Deployment Options

### Option 1: Using PowerShell Script (Recommended)
```powershell
.\deploy-backend.ps1
```

This script will:
1. Build the project in Release mode
2. Publish to your RunASP.NET hosting using the configured publish profile
3. Display deployment status and testing instructions

### Option 2: Using Visual Studio
1. Open the solution in Visual Studio
2. Right-click on `Portfolio.API` project
3. Select **Publish**
4. Select the `site56676-WebDeploy` profile
5. Click **Publish** button
6. Wait for deployment to complete

### Option 3: Using Command Line
```bash
cd Portfolio.API
dotnet publish -c Release /p:PublishProfile=site56676-WebDeploy
```

## What Was Fixed

The CORS configuration in `Program.cs` now:
- ✅ Allows `https://m-said-portfolio.netlify.app` (your production site)
- ✅ Allows all `*.netlify.app` domains (preview deployments)
- ✅ Allows `localhost` for development
- ✅ Uses proper origin validation instead of wildcards

## After Deployment

1. **Wait 1-2 minutes** for the server to restart
2. **Test the API** at: https://m-protfolio.runasp.net/swagger
3. **Test your frontend** at: https://m-said-portfolio.netlify.app
4. **Check browser console** - CORS errors should be gone

## Verify CORS Headers

Open browser DevTools (F12) → Network tab:
1. Visit https://m-said-portfolio.netlify.app
2. Look for API requests to `m-protfolio.runasp.net`
3. Check Response Headers for:
   - `Access-Control-Allow-Origin: https://m-said-portfolio.netlify.app`
   - `Access-Control-Allow-Credentials: true`

## Troubleshooting

### If deployment fails:
- Check your internet connection
- Verify credentials in the publish profile
- Try using Visual Studio instead of command line

### If CORS errors persist:
- Clear browser cache
- Wait 2-3 minutes for server to fully restart
- Check that the deployment actually completed
- Verify the API is running at https://m-protfolio.runasp.net/swagger

### If API is not responding:
- Check hosting provider dashboard
- Verify the application is running
- Check application logs on the hosting server
