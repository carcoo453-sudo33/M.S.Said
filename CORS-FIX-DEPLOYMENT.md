# CORS Fix - Deployment Instructions

## Problem Summary
The API at `https://m-protfolio.runasp.net/api` is **ONLINE and WORKING** (verified by direct fetch), but the frontend gets a status 0 error, indicating CORS preflight requests are failing.

## Root Cause
The deployed API doesn't have the latest CORS configuration. The current deployment is missing:
1. Explicit OPTIONS request handler for CORS preflight
2. `.RequireCors("AllowAngular")` on all endpoints
3. Updated web.config with CORS headers

## What Was Fixed

### 1. Program.cs Changes
- ✅ Added explicit middleware to handle OPTIONS requests (CORS preflight)
- ✅ Added `.RequireCors("AllowAngular")` to all endpoints (MapControllers, MapHub, login endpoint)
- ✅ Ensured `UseCors()` is called before any other middleware
- ✅ Removed `UseHttpsRedirection()` that can interfere with CORS

### 2. web.config Changes
- ✅ Added CORS headers at IIS level:
  - Access-Control-Allow-Origin: *
  - Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
  - Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With

### 3. SignalR Service Changes
- ✅ Removed `withCredentials: true` (incompatible with AllowAnyOrigin)

## Deployment Steps

### Step 1: Build the API
```bash
cd Portfolio.API
dotnet publish -c Release -o ./publish
```

### Step 2: Deploy to RunASP.net
1. Go to your RunASP.net control panel
2. Upload ALL files from `Portfolio.API/publish/` folder
3. Ensure `web.config` is included in the upload
4. Restart the application

### Step 3: Verify Deployment
1. Visit `https://m-protfolio.runasp.net/swagger` - should load
2. Open browser console and run:
```javascript
fetch('https://m-protfolio.runasp.net/api/bio')
  .then(r => r.json())
  .then(d => console.log('SUCCESS:', d))
  .catch(e => console.error('FAILED:', e));
```
3. Should see SUCCESS with data (no CORS error)

### Step 4: Rebuild and Redeploy Frontend
```bash
cd Portfolio.UI
ng build --configuration=production
```
Then deploy the `dist/` folder to Netlify

## Testing
After deployment, test from Netlify site:
1. Open `https://m-said-portfolio.netlify.app/`
2. Open browser DevTools Console
3. Should NOT see "Unable to connect to API server" error
4. Data should load on the homepage

## If Still Not Working

### Check 1: Verify API is deployed
```bash
curl -I https://m-protfolio.runasp.net/api/bio
```
Should return `200 OK` with `Access-Control-Allow-Origin: *` header

### Check 2: Test OPTIONS request
```bash
curl -X OPTIONS https://m-protfolio.runasp.net/api/bio -i
```
Should return `200 OK` with CORS headers

### Check 3: Browser Console
Open DevTools Network tab, filter by "bio", check:
- Request Headers: Should have `Origin: https://m-said-portfolio.netlify.app`
- Response Headers: Should have `Access-Control-Allow-Origin: *`

## Files Changed
- `Portfolio.API/Program.cs` - CORS configuration and OPTIONS handler
- `Portfolio.API/web.config` - IIS CORS headers
- `Portfolio.UI/src/app/services/signalr.service.ts` - Removed withCredentials

## Commit Hash
Latest commit: `3682c16` - "Comprehensive CORS fix: Add explicit OPTIONS handler, RequireCors on all endpoints"
