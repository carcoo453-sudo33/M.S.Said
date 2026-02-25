# 🚀 Netlify Deployment Setup

## ✅ Configuration File Location

`netlify.toml` is now in `Portfolio.UI/` (frontend folder)

## 📋 Netlify Dashboard Configuration

When setting up your site on Netlify, configure these settings:

### Build Settings

1. **Base directory:** `Portfolio.UI`
2. **Build command:** `npm install && npm run build`
3. **Publish directory:** `Portfolio.UI/dist/portfolio.ui/browser`

### Environment Variables (Optional)

If needed, you can set:
- `NODE_VERSION`: 20
- `NPM_VERSION`: 10.9.2

(These are already in netlify.toml, so optional)

## 🔧 How to Configure on Netlify

### Method 1: During Initial Setup

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** → Select **M.S.Said** repository
4. Configure build settings:
   - **Base directory:** `Portfolio.UI`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `Portfolio.UI/dist/portfolio.ui/browser`
5. Click **"Deploy site"**

### Method 2: Update Existing Site

If your site is already created:

1. Go to your site dashboard on Netlify
2. Click **"Site settings"**
3. Go to **"Build & deploy"** → **"Build settings"**
4. Update:
   - **Base directory:** `Portfolio.UI`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `Portfolio.UI/dist/portfolio.ui/browser`
5. Save changes
6. Go to **"Deploys"** → **"Trigger deploy"** → **"Deploy site"**

## 📊 Your Configuration

| Setting | Value |
|---------|-------|
| **Repository** | https://github.com/Mostafa-SAID7/M.S.Said |
| **Branch** | master |
| **Base directory** | Portfolio.UI |
| **Build command** | npm install && npm run build |
| **Publish directory** | Portfolio.UI/dist/portfolio.ui/browser |
| **Node version** | 20 |
| **Backend API** | https://m-protfolio.runasp.net |

## ✅ File Structure

```
Portfolio/
├── Portfolio.API/          # Backend (.NET)
└── Portfolio.UI/           # Frontend (Angular)
    ├── netlify.toml        # ✅ Netlify config here
    ├── package.json        # Dependencies
    ├── angular.json        # Angular config
    └── src/                # Source code
```

## 🎯 After Configuration

1. **Trigger deploy** on Netlify
2. **Wait 3-5 minutes** for build
3. **Check build logs** for any errors
4. **Visit your site:** https://m-said-portfolio.netlify.app

## 🔍 Troubleshooting

### Build Fails
- Verify base directory is set to `Portfolio.UI`
- Check build logs for specific errors
- Ensure Node version is 20

### 404 on Site
- Verify publish directory: `Portfolio.UI/dist/portfolio.ui/browser`
- Check that build completed successfully
- Ensure redirects are working (configured in netlify.toml)

### API Connection Issues
- Backend must be deployed to: https://m-protfolio.runasp.net
- Check CORS settings on backend
- Verify environment.prod.ts has correct API URL

## 📞 Support

- **Email:** m.ssaid356@gmail.com
- **Frontend:** https://m-said-portfolio.netlify.app
- **Backend:** https://m-protfolio.runasp.net

---

**Next Step:** Configure base directory on Netlify dashboard and trigger deploy!
