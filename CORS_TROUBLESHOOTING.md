# CORS Troubleshooting Guide

## Problem: "Connection lost" Error

When the frontend at `https://m-said-portfolio.netlify.app` tries to call the backend at `https://m-protfolio.runasp.net`, you get:
```
Connection lost. Please check your internet connection.
```

This is actually a **CORS (Cross-Origin Resource Sharing) error**, not an internet connection issue.

---

## Root Cause

The backend is blocking requests from the Netlify frontend because:
1. Frontend domain: `https://m-said-portfolio.netlify.app`
2. Backend domain: `https://m-protfolio.runasp.net`
3. These are different origins, so CORS must be configured

---

## Solution

### Step 1: Verify CORS Configuration in Code

The backend has CORS configured in:
- **File**: `Portfolio.API/Infrastructure/Configuration/CorsConfiguration.cs`
- **Policy**: `AllowSpecificOrigins`
- **Allowed Origins**: Configured in `appsettings.json`

### Step 2: Check appsettings.json

The `appsettings.json` now includes:
```json
"AllowedOrigins": [
  "https://m-said-portfolio.netlify.app",
  "http://localhost:4200",
  "http://localhost:3000"
]
```

### Step 3: Redeploy Backend

**IMPORTANT**: You must redeploy the backend to MonsterASP for the CORS changes to take effect.

**Steps**:
1. Open Visual Studio
2. Right-click `Portfolio.API` project
3. Select "Publish"
4. Choose publish profile: `site56676-WebDeploy`
5. Click "Publish"
6. Wait for deployment to complete

### Step 4: Verify CORS is Working

After redeployment, test with:
```bash
curl -H "Origin: https://m-said-portfolio.netlify.app" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS https://m-protfolio.runasp.net/api/bio
```

Should return headers like:
```
Access-Control-Allow-Origin: https://m-said-portfolio.netlify.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
```

---

## How CORS Works

1. **Browser sends preflight request** (OPTIONS) before actual request
2. **Backend responds** with allowed origins and methods
3. **Browser checks** if frontend origin is in allowed list
4. **If allowed**: Browser sends actual request
5. **If blocked**: Browser shows "Connection lost" error

---

## Common CORS Issues

### Issue 1: Wrong Domain in AllowedOrigins
**Problem**: Frontend domain not in allowed list
**Solution**: Add to `appsettings.json` AllowedOrigins array

### Issue 2: CORS Middleware Not Applied
**Problem**: CORS configured but not used in pipeline
**Solution**: Verify `app.UseCors("AllowSpecificOrigins")` in `PipelineConfiguration.cs`

### Issue 3: Backend Not Redeployed
**Problem**: Code changes made but backend not redeployed
**Solution**: Redeploy to MonsterASP after code changes

### Issue 4: Wrong Protocol (HTTP vs HTTPS)
**Problem**: Frontend uses HTTPS but backend allows HTTP
**Solution**: Ensure both use HTTPS in production

---

## Current Configuration

**Frontend**: `https://m-said-portfolio.netlify.app`
**Backend**: `https://m-protfolio.runasp.net`
**CORS Status**: ✅ Configured (needs redeployment)

---

## Next Steps

1. **Redeploy backend** to MonsterASP
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Refresh frontend** (Ctrl+F5)
4. **Check browser console** for any remaining errors

If still getting errors, check:
- Browser DevTools > Network tab > look for failed requests
- Browser DevTools > Console tab > look for CORS error messages
- Backend logs at `https://m-protfolio.runasp.net` (if available)

