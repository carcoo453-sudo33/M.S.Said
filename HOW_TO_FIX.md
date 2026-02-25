# 🚀 How to Fix Your Deployment

## The Problem

Your site is trying to connect to `localhost:5283` instead of your production backend.

## The Solution (2 Options)

### Option 1: Automated Script (Easiest)

Run this command:
```powershell
powershell -ExecutionPolicy Bypass -File deploy-fix.ps1
```

This will automatically:
- Add all changed files
- Commit with a descriptive message
- Push to GitHub
- Trigger Netlify deployment

### Option 2: Manual Commands

```bash
# Add files
git add netlify.toml Portfolio.UI/package.json Portfolio.UI/check-build.js FIX_NETLIFY_ENVIRONMENT.md FINAL_SOLUTION.md

# Commit
git commit -m "Fix Netlify production build configuration"

# Push
git push origin master
```

## What Happens Next

1. **GitHub receives your push** (immediate)
2. **Netlify detects the push** (10-30 seconds)
3. **Netlify starts building** (immediate)
4. **Build completes** (2-3 minutes)
5. **Site updates automatically** (immediate)

**Total time: ~3-4 minutes**

## How to Verify It Worked

### Step 1: Wait for Build
Go to: https://app.netlify.com/sites/m-said-portfolio/deploys

Look for:
- ✅ "Building" → "Published"
- ✅ Green checkmark
- ✅ No errors in logs

### Step 2: Test Your Site
Go to: https://m-said-portfolio.netlify.app

You should see:
- ✅ Your profile loads
- ✅ Services display
- ✅ Projects show
- ✅ No error messages

### Step 3: Check Console
Press F12 → Console tab

You should see:
- ✅ "✅ Bio loaded successfully"
- ✅ "✅ Services loaded successfully"
- ❌ NO "Unable to connect" errors

### Step 4: Check Network
Press F12 → Network tab

You should see requests to:
- ✅ `https://m-protfolio.runasp.net/api/bio`
- ❌ NOT `localhost:5283`

## What Was Fixed

1. **netlify.toml** - Changed build command to use `npm run build:prod`
2. **Environment** - Added `NODE_ENV=production`
3. **Verification** - Added script to check builds

## If It Still Doesn't Work

### Try 1: Clear Cache
```powershell
# Go to Netlify dashboard
# Click "Trigger deploy" → "Clear cache and deploy site"
```

### Try 2: Check Build Logs
```powershell
# Go to: https://app.netlify.com/sites/m-said-portfolio/deploys
# Click latest deploy
# Look for errors
```

### Try 3: Clear Browser Cache
```powershell
# Press Ctrl + Shift + Delete
# Clear cached images and files
# Or use incognito window
```

## Quick Reference

**Your Sites:**
- Frontend: https://m-said-portfolio.netlify.app
- Backend: https://m-protfolio.runasp.net
- Netlify Dashboard: https://app.netlify.com/sites/m-said-portfolio

**Test Commands:**
```powershell
# Test backend
powershell -ExecutionPolicy Bypass -File test-connection.ps1

# Deploy fix
powershell -ExecutionPolicy Bypass -File deploy-fix.ps1
```

**Browser Test:**
```javascript
// Open console on your site and run:
fetch('https://m-protfolio.runasp.net/api/bio')
  .then(r => r.json())
  .then(d => console.log('✅ Success:', d))
  .catch(e => console.error('❌ Error:', e));
```

## Documentation

- **FINAL_SOLUTION.md** - Complete explanation
- **FIX_NETLIFY_ENVIRONMENT.md** - Detailed fix guide
- **DEPLOYMENT_STATUS_AND_FIX.md** - Deployment checklist
- **README_DEPLOYMENT.md** - General deployment info

---

## TL;DR

Run this:
```powershell
powershell -ExecutionPolicy Bypass -File deploy-fix.ps1
```

Wait 3 minutes. Done! ✅
