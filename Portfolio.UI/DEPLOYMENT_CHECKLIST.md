# Netlify Deployment Checklist

## Before You Deploy

### 1. Backend API Setup
- [ ] Backend is deployed and accessible online
- [ ] You have the backend API URL (e.g., `https://your-api.com`)
- [ ] Backend has CORS configured for your domain

### 2. Update Production Environment
- [ ] Open `src/environments/environment.prod.ts`
- [ ] Replace `YOUR_BACKEND_API_URL` with your actual backend URL
- [ ] Example:
  ```typescript
  export const environment = {
      production: true,
      apiUrl: 'https://your-api.azurewebsites.net/api',
      apiBaseUrl: 'https://your-api.azurewebsites.net'
  };
  ```

### 3. Test Local Production Build
```bash
cd Portfolio.UI
npm run build
# Check that dist/portfolio.ui/browser folder is created
```

### 4. Commit and Push to GitHub
```bash
git add .
git commit -m "Configure for Netlify deployment"
git push origin main
```

## Netlify Setup Steps

### 5. Connect to Netlify
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Sign in with GitHub using: **m.ssaid356@gmail.com**
3. Click "Add new site" → "Import an existing project"
4. Select GitHub and authorize
5. Choose your portfolio repository

### 6. Configure Build Settings
Netlify should auto-detect from `netlify.toml`, but verify:
- **Build command**: `npm install && npm run build`
- **Publish directory**: `dist/portfolio.ui/browser`
- **Node version**: 20

### 7. Deploy
- [ ] Click "Deploy site"
- [ ] Wait for build to complete (3-5 minutes)
- [ ] Note your site URL (e.g., `random-name-123.netlify.app`)

## After Deployment

### 8. Update Backend CORS
Add your Netlify URL to backend CORS in `Portfolio.API/Program.cs`:
```csharp
policy.WithOrigins(
    "http://localhost:4200",
    "https://your-site-name.netlify.app"  // Add this line
)
```

### 9. Test Your Site
- [ ] Visit your Netlify URL
- [ ] Test navigation (home, projects, blog, contact)
- [ ] Test API calls (should connect to backend)
- [ ] Test admin login
- [ ] Test on mobile device

### 10. Optional: Custom Domain
- [ ] Purchase domain (if needed)
- [ ] In Netlify: Domain settings → Add custom domain
- [ ] Update DNS records as instructed
- [ ] Wait for SSL certificate (automatic)

## What You Need

| Item | Value |
|------|-------|
| Email | m.ssaid356@gmail.com |
| GitHub | Connected to Netlify |
| Backend URL | _(You need to provide this)_ |
| Frontend Repo | Your GitHub portfolio repo |

## Files Created for Deployment
✅ `netlify.toml` - Build configuration
✅ `environment.prod.ts` - Production settings
✅ `angular.json` - Updated with production config

## Need Help?
- Netlify Docs: https://docs.netlify.com
- Angular Deployment: https://angular.dev/tools/cli/deployment
- Contact: m.ssaid356@gmail.com
