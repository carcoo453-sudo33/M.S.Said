# 🔧 Troubleshooting: Frontend Can't Connect to Backend

## Current Status

✅ **Frontend Deployed:** https://m-said-portfolio.netlify.app/
✅ **Backend Deployed:** https://m-protfolio.runasp.net/swagger/index.html
❌ **Connection:** Frontend shows "Unable to connect to the server"

## Root Cause

The backend is deployed but the frontend can't connect. This is most likely a CORS issue.

## Solution: Redeploy Backend with Updated CORS

Your backend code has the correct CORS configuration, but the deployed version on RunASP.net might have the old configuration. You need to redeploy.

### Step 1: Verify Backend is Accessible

Test these URLs in your browser:

1. **Swagger UI:**
   ```
   https://m-protfolio.runasp.net/swagger/index.html
   ```
   ✅ Should show API documentation

2. **Root endpoint:**
   ```
   https://m-protfolio.runasp.net/
   ```
   Should redirect to Swagger

3. **API endpoint:**
   ```
   https://m-protfolio.runasp.net/api/bio
   ```
   Should return JSON data

### Step 2: Test CORS from Browser Console

Open https://m-said-portfolio.netlify.app/ and open browser console (F12), then run:

```javascript
fetch('https://m-protfolio.runasp.net/api/bio')
  .then(r => r.json())
  .then(d => console.log('Success:', d))
  .catch(e => console.error('Error:', e));
```

**If you see CORS error:**
- Backend needs to be redeployed with updated CORS settings

**If you see network error:**
- Backend might not be running
- Check RunASP.net control panel

### Step 3: Redeploy Backend

#### Option 1: Visual Studio
1. Open `Portfolio.API` in Visual Studio
2. Right-click project → **Publish**
3. Select your RunASP.net profile
4. Click **Publish**

#### Option 2: Command Line
```bash
cd Portfolio.API
dotnet publish -c Release -o ./publish
```
Then upload the `publish` folder to RunASP.net

### Step 4: Verify CORS Configuration

After redeploying, check that your backend has these CORS settings:

```csharp
policy.WithOrigins(
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "https://m-said-portfolio.netlify.app",  // Your Netlify URL
    "https://*.netlify.app"
)
```

## Current Configuration

### Frontend (environment.prod.ts)
```typescript
apiUrl: 'https://m-protfolio.runasp.net/api'
apiBaseUrl: 'https://m-protfolio.runasp.net'
```

### Backend (Program.cs)
```csharp
WithOrigins(
    "https://m-said-portfolio.netlify.app",
    "https://*.netlify.app"
)
```

## Quick Checks

### 1. Backend is Running
```bash
curl https://m-protfolio.runasp.net/api/bio
```
Should return JSON data

### 2. CORS Headers Present
```bash
curl -I -X OPTIONS https://m-protfolio.runasp.net/api/bio \
  -H "Origin: https://m-said-portfolio.netlify.app" \
  -H "Access-Control-Request-Method: GET"
```
Should include `Access-Control-Allow-Origin` header

### 3. Frontend Build is Correct
Check Netlify build logs to ensure:
- Build used production configuration
- No build errors
- Files published to correct directory

## Common Issues

### Issue 1: CORS Error
**Symptom:** Console shows "CORS policy" error
**Solution:** Redeploy backend with updated CORS settings

### Issue 2: Network Error
**Symptom:** Console shows "Failed to fetch" or "Network error"
**Solution:** 
- Check backend is running on RunASP.net
- Verify backend URL is correct
- Check RunASP.net logs for errors

### Issue 3: 404 Not Found
**Symptom:** API endpoints return 404
**Solution:**
- Verify backend routes are correct
- Check backend is deployed to correct path
- Ensure all controllers are registered

### Issue 4: SSL/Certificate Error
**Symptom:** "Certificate error" or "SSL handshake failed"
**Solution:**
- Ensure backend uses HTTPS
- Check SSL certificate is valid on RunASP.net

## Testing Checklist

After redeploying backend:

- [ ] Swagger UI loads: https://m-protfolio.runasp.net/swagger/index.html
- [ ] API endpoint works: https://m-protfolio.runasp.net/api/bio
- [ ] CORS headers present (check with curl or browser devtools)
- [ ] Frontend can fetch data (check browser console)
- [ ] No CORS errors in browser console
- [ ] Data displays on frontend

## Next Steps

1. **Redeploy backend** to RunASP.net with latest code
2. **Wait 2-3 minutes** for deployment to complete
3. **Test API endpoint** directly in browser
4. **Refresh frontend** and check if data loads
5. **Check browser console** for any errors

## Support

- **Frontend:** https://m-said-portfolio.netlify.app/
- **Backend:** https://m-protfolio.runasp.net/
- **Email:** m.ssaid356@gmail.com

---

**Most likely fix:** Redeploy your backend to RunASP.net with the updated CORS configuration.
