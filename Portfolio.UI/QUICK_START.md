# 🚀 Quick Netlify Deployment

## What I Need From You

Before deploying, I need:

1. **Your Backend API URL** (where your .NET API is hosted)
   - Example: `https://your-api.azurewebsites.net`
   - Example: `https://your-api.herokuapp.com`
   - Example: `https://api.yourdomain.com`

2. **Your GitHub Repository** (should already be set up)
   - Connected to: m.ssaid356@gmail.com

## 3-Step Deployment

### Step 1: Update API URL
Open `Portfolio.UI/src/environments/environment.prod.ts` and replace:
```typescript
apiUrl: 'YOUR_BACKEND_API_URL/api'
apiBaseUrl: 'YOUR_BACKEND_API_URL'
```

With your actual backend URL:
```typescript
apiUrl: 'https://your-actual-api.com/api'
apiBaseUrl: 'https://your-actual-api.com'
```

### Step 2: Check Everything
```bash
cd Portfolio.UI
npm run deploy:check
```

### Step 3: Deploy on Netlify
1. Go to https://app.netlify.com
2. Sign in with GitHub (m.ssaid356@gmail.com)
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repository
5. Click "Deploy site" (settings auto-detected from netlify.toml)

## That's It! 🎉

Your site will be live at: `https://random-name.netlify.app`

You can change the name in Netlify dashboard → Site settings → Change site name

## After Deployment

Update your backend CORS to include your new Netlify URL:
```csharp
// In Portfolio.API/Program.cs
policy.WithOrigins(
    "http://localhost:4200",
    "https://your-site-name.netlify.app"  // Add this
)
```

## Files Created
✅ `netlify.toml` - Netlify configuration
✅ `environment.prod.ts` - Production API settings
✅ `deploy-check.js` - Pre-deployment checker
✅ `NETLIFY_DEPLOYMENT.md` - Full deployment guide
✅ `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist

## Need Help?
Email: m.ssaid356@gmail.com
