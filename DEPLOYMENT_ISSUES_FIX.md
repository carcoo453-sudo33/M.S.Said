# 🔧 Fixing Deployment Issues

## Current Problems

1. ❌ **Netlify Frontend:** 404 "Site not found" at https://m-said-portfolio.netlify.app
2. ❌ **Backend:** 404 error at https://m-protfolio.runasp.net

## Fix 1: Netlify Frontend 404

### Problem
Netlify couldn't find the built files because `netlify.toml` was in the wrong location.

### Solution Applied
✅ Moved `netlify.toml` to repository root
✅ Added `base = "Portfolio.UI"` to tell Netlify where the Angular app is
✅ Updated publish path to `Portfolio.UI/dist/portfolio.ui/browser`

### What You Need to Do

1. **Push the updated netlify.toml:**
```bash
git add netlify.toml
git commit -m "Fix Netlify configuration - move to root"
git push origin master
```

2. **Trigger Netlify Rebuild:**
   - Go to: https://app.netlify.com
   - Find your site: `m-said-portfolio`
   - Click: **Deploys** tab
   - Click: **Trigger deploy** → **Deploy site**
   - Wait 3-5 minutes for build

3. **Check Build Logs:**
   - Watch the build process in real-time
   - Look for errors in the log
   - Build should complete successfully

### Expected Result
After rebuild, https://m-said-portfolio.netlify.app should show your portfolio homepage.

## Fix 2: Backend 404 on RunASP.net

### Problem
Your .NET backend is NOT deployed to RunASP.net yet. The domain exists but no application is running.

### Solution: Deploy Backend

You need to deploy your `Portfolio.API` project to RunASP.net. Here's how:

#### Method 1: Visual Studio Publish (Recommended)

1. **Open Visual Studio**
2. **Load Portfolio.API project**
3. **Right-click on Portfolio.API** → Select **Publish**
4. **Create New Publish Profile:**
   - Target: **Web Server (IIS)** or **Folder**
   - If Folder: Choose a local folder, then upload to RunASP.net
5. **Configure Settings:**
   - Configuration: **Release**
   - Target Framework: **net9.0**
   - Deployment Mode: **Self-contained** or **Framework-dependent**
6. **Click Publish**

#### Method 2: Command Line Publish

```bash
cd Portfolio.API
dotnet publish -c Release -o ./publish
```

This creates a `publish` folder with all files needed.

#### Method 3: Upload to RunASP.net

After publishing, upload files to RunASP.net:

**Via FTP:**
1. Get FTP credentials from RunASP.net control panel
2. Use FileZilla or similar FTP client
3. Upload all files from `publish` folder to your site root
4. Ensure `Portfolio.API.dll` is in the root

**Via Control Panel:**
1. Log in to RunASP.net control panel
2. Go to File Manager
3. Navigate to your site: `m-protfolio`
4. Upload all files from `publish` folder
5. Set permissions if needed

#### Method 4: Configure on RunASP.net

After uploading files:
1. **Set .NET Version:** 9.0
2. **Set Entry Point:** `Portfolio.API.dll`
3. **Configure Connection String:** Already in appsettings.json
4. **Start Application**

### Expected Result
After deployment:
- `https://m-protfolio.runasp.net/` → Redirects to Swagger
- `https://m-protfolio.runasp.net/swagger` → Shows API documentation
- `https://m-protfolio.runasp.net/api/bio` → Returns JSON data

## Verification Steps

### After Netlify Fix:
```bash
# Test frontend
curl https://m-said-portfolio.netlify.app
# Should return HTML, not 404
```

### After Backend Deployment:
```bash
# Test backend
curl https://m-protfolio.runasp.net/api/bio
# Should return JSON with bio data
```

## Complete Deployment Checklist

### Frontend (Netlify)
- [x] netlify.toml moved to root
- [x] Configuration updated with base directory
- [ ] Push changes to GitHub
- [ ] Trigger Netlify rebuild
- [ ] Verify site loads at https://m-said-portfolio.netlify.app

### Backend (RunASP.net)
- [ ] Publish Portfolio.API project
- [ ] Upload files to RunASP.net
- [ ] Configure .NET 9.0 runtime
- [ ] Start application
- [ ] Verify Swagger at https://m-protfolio.runasp.net/swagger
- [ ] Test API endpoints

### Integration Test
- [ ] Open frontend: https://m-said-portfolio.netlify.app
- [ ] Check browser console for API errors
- [ ] Test navigation (home, projects, blog, contact)
- [ ] Test admin login
- [ ] Verify data loads from backend

## Common Issues

### Netlify Build Fails
**Check:**
- Build logs in Netlify dashboard
- Node version (should be 20)
- npm install completed successfully
- Angular build command runs without errors

**Fix:**
- Review error messages in build log
- Ensure all dependencies are in package.json
- Check for TypeScript errors

### Backend Still 404
**Check:**
- Files uploaded to correct directory
- .NET 9.0 runtime installed on RunASP.net
- Application started in control panel
- No errors in RunASP.net logs

**Fix:**
- Verify all files from publish folder are uploaded
- Check RunASP.net documentation for .NET 9 support
- Contact RunASP.net support if needed

### CORS Errors
**Already Fixed:**
- Backend CORS configured for https://m-said-portfolio.netlify.app
- Wildcard configured for *.netlify.app

## Next Steps

1. **Push netlify.toml fix:**
   ```bash
   git add netlify.toml
   git commit -m "Fix Netlify build configuration"
   git push origin master
   ```

2. **Rebuild on Netlify:**
   - Go to Netlify dashboard
   - Trigger new deployment
   - Wait for build to complete

3. **Deploy Backend:**
   - Publish Portfolio.API
   - Upload to RunASP.net
   - Configure and start

4. **Test Everything:**
   - Frontend loads
   - Backend responds
   - API calls work
   - Full functionality

## Support

- **Netlify Docs:** https://docs.netlify.com
- **RunASP.net Support:** Check their control panel
- **Email:** m.ssaid356@gmail.com

---

**Priority:** Fix Netlify first (easier), then deploy backend.
