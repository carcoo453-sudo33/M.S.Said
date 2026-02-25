# 🔧 Fix: Netlify Using Wrong Environment

## Problem Identified

Your deployed frontend on Netlify is trying to connect to `http://localhost:5283/api/bio` instead of `https://m-protfolio.runasp.net/api/bio`.

This means Netlify is building with the DEVELOPMENT environment instead of PRODUCTION.

## Verification

I tested the local production build and confirmed:
- ✅ Local build uses production URL correctly
- ✅ Configuration files are correct
- ❌ Netlify build is not using production configuration

## Root Cause

Netlify was not properly applying the `--configuration production` flag during the build.

## Solution Applied

### 1. Updated netlify.toml

Changed the build command from:
```toml
command = "npm install && ng build --configuration=production"
```

To:
```toml
command = "npm install && npm run build:prod"
```

This uses the npm script which is more reliable.

### 2. Added NODE_ENV

Added environment variable to ensure production mode:
```toml
[build.environment]
  NODE_ENV = "production"
  NODE_VERSION = "20"
  NPM_VERSION = "10.9.2"
```

### 3. Created Build Verification Script

Added `check-build.js` script that verifies the build is using the correct environment.

## Next Steps

### Step 1: Push Changes to GitHub

```bash
# Add all changed files
git add netlify.toml Portfolio.UI/package.json Portfolio.UI/check-build.js

# Commit
git commit -m "Fix Netlify production build configuration"

# Push to trigger Netlify deployment
git push origin master
```

### Step 2: Monitor Netlify Build

1. Go to: https://app.netlify.com/sites/m-said-portfolio/deploys
2. Watch the build logs
3. Look for these indicators:

**Good signs:**
```
✔ npm run build:prod
✔ Building with production configuration
✔ Build completed successfully
```

**Bad signs:**
```
✘ Build failed
✘ Error: ...
```

### Step 3: Verify After Deployment

Once the build completes, test the site:

#### Test 1: Check Console Logs
1. Go to https://m-said-portfolio.netlify.app
2. Open DevTools (F12) → Console
3. Look for: "✅ Bio loaded successfully"
4. Should NOT see: "Unable to connect to the server"

#### Test 2: Check Network Requests
1. Open DevTools (F12) → Network tab
2. Refresh the page
3. Look for requests to `https://m-protfolio.runasp.net/api/`
4. Should NOT see requests to `localhost:5283`

#### Test 3: Quick Fetch Test
In browser console on your deployed site:
```javascript
fetch('https://m-protfolio.runasp.net/api/bio')
  .then(r => r.json())
  .then(d => console.log('✅ Success:', d))
  .catch(e => console.error('❌ Error:', e));
```

Expected: Should log your bio data

## Alternative: Manual Netlify Configuration

If the above doesn't work, you can configure Netlify directly:

### Option A: Netlify UI

1. Go to: https://app.netlify.com/sites/m-said-portfolio/settings/deploys
2. Scroll to "Build settings"
3. Click "Edit settings"
4. Set:
   - Base directory: `Portfolio.UI`
   - Build command: `npm run build:prod`
   - Publish directory: `Portfolio.UI/dist/portfolio.ui/browser`
5. Click "Save"
6. Go to "Environment variables"
7. Add: `NODE_ENV` = `production`
8. Trigger a new deploy

### Option B: Clear Cache and Redeploy

Sometimes Netlify caches the build:

1. Go to: https://app.netlify.com/sites/m-said-portfolio/deploys
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Wait for build to complete

## Files Changed

### netlify.toml
```toml
[build]
  base = "Portfolio.UI"
  publish = "Portfolio.UI/dist/portfolio.ui/browser"
  command = "npm install && npm run build:prod"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_ENV = "production"
  NODE_VERSION = "20"
  NPM_VERSION = "10.9.2"
```

### Portfolio.UI/package.json
Added script:
```json
"check:build": "node check-build.js"
```

### Portfolio.UI/check-build.js (NEW)
Script to verify build uses production environment.

## Troubleshooting

### If Build Fails on Netlify

**Error: "ng: command not found"**
- Solution: Ensure `@angular/cli` is in devDependencies
- Run: `npm install --save-dev @angular/cli`

**Error: "Cannot find module '@angular/build'"**
- Solution: Clear Netlify cache and redeploy

**Error: "Build exceeded time limit"**
- Solution: The build is taking too long
- Check for infinite loops or large dependencies

### If Still Connecting to Localhost

1. **Check Netlify Build Logs:**
   - Look for "Building with production configuration"
   - Verify no errors during build

2. **Download Deployed Files:**
   - In Netlify, go to Deploys → Latest deploy
   - Click "Download deploy" (if available)
   - Check main.*.js file for "localhost:5283"

3. **Check Browser Cache:**
   - Clear browser cache completely
   - Try incognito/private window
   - Hard refresh (Ctrl + Shift + R)

4. **Verify Environment File:**
   ```bash
   # Check that environment.prod.ts exists and has correct URL
   cat Portfolio.UI/src/environments/environment.prod.ts
   ```

## Expected Timeline

- **Push to GitHub:** Immediate
- **Netlify detects push:** 10-30 seconds
- **Build starts:** Immediate
- **Build completes:** 2-3 minutes
- **Site updates:** Immediate after build
- **DNS propagation:** Already done (site is live)

**Total time:** ~3-4 minutes from push to working site

## Verification Checklist

After redeployment:

- [ ] Netlify build completed successfully
- [ ] Build logs show "production configuration"
- [ ] Site loads at https://m-said-portfolio.netlify.app
- [ ] Console shows "✅ Bio loaded successfully"
- [ ] No "localhost:5283" requests in Network tab
- [ ] Data displays on home page
- [ ] No CORS errors in console

## Summary

**Problem:** Netlify building with development environment
**Cause:** Build command not properly applying production configuration
**Fix:** Updated netlify.toml to use `npm run build:prod`
**Action:** Push changes to GitHub to trigger new deployment
**Expected Result:** Site will connect to production backend

---

**Status:** Ready to deploy. Push the changes and monitor the build.
