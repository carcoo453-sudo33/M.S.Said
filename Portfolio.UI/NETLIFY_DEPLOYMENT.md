# Netlify Deployment Guide

## Prerequisites
- GitHub account connected to Netlify
- Backend API deployed and accessible (you'll need the URL)
- Email: m.ssaid356@gmail.com

## Step 1: Update Production Environment
Before deploying, update `src/environments/environment.prod.ts` with your actual backend API URL:

```typescript
export const environment = {
    production: true,
    apiUrl: 'https://your-backend-api.com/api',
    apiBaseUrl: 'https://your-backend-api.com'
};
```

## Step 2: Push to GitHub
Make sure all your changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

## Step 3: Deploy to Netlify

### Option A: Using Netlify Dashboard (Recommended)
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Sign in with your GitHub account (m.ssaid356@gmail.com)
3. Click "Add new site" → "Import an existing project"
4. Choose "GitHub" and authorize Netlify
5. Select your portfolio repository
6. Netlify will auto-detect the settings from `netlify.toml`:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist/portfolio.ui/browser`
7. Click "Deploy site"

### Option B: Using Netlify CLI
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from Portfolio.UI directory
cd Portfolio.UI
netlify deploy --prod
```

## Step 4: Configure Environment Variables (if needed)
If you want to use environment variables instead of hardcoding the API URL:

1. In Netlify dashboard, go to: Site settings → Environment variables
2. Add variable:
   - Key: `API_URL`
   - Value: `https://your-backend-api.com`

Then update `environment.prod.ts` to use it (requires additional configuration).

## Step 5: Update Backend CORS
After deployment, update your backend's CORS policy in `Portfolio.API/Program.cs` to include your Netlify URL:

```csharp
policy.WithOrigins(
    "http://localhost:4200", 
    "http://127.0.0.1:4200",
    "https://your-site-name.netlify.app"  // Add this
)
```

## Important Files Created
- `netlify.toml` - Netlify build configuration
- `src/environments/environment.prod.ts` - Production environment settings
- `angular.json` - Updated with file replacements for production

## Troubleshooting

### Build Fails
- Check Node version (should be 20)
- Verify all dependencies are in `package.json`
- Check build logs in Netlify dashboard

### 404 Errors on Refresh
- The `netlify.toml` redirects configuration handles this
- All routes redirect to `index.html` for Angular routing

### API Connection Issues
- Verify the API URL in `environment.prod.ts`
- Check CORS settings on backend
- Ensure backend is accessible from Netlify servers

## Custom Domain (Optional)
1. In Netlify dashboard: Domain settings → Add custom domain
2. Follow DNS configuration instructions
3. Netlify provides free SSL certificates

## Continuous Deployment
Once connected to GitHub, Netlify will automatically:
- Deploy on every push to main branch
- Create preview deployments for pull requests
- Show build status in GitHub

## Contact
Email: m.ssaid356@gmail.com
