# 🚨 Backend Deployment Checklist - ERR_CONNECTION_REFUSED

## Current Error: ERR_CONNECTION_REFUSED

This means your backend at `https://m-protfolio.runasp.net` is:
- ❌ Not running
- ❌ Not accepting connections
- ❌ Crashed during startup

## ✅ Pre-Deployment Checklist

### 1. Verify Files Are Ready
Check that `Portfolio.API/publish/` folder contains:
- [ ] `Portfolio.API.dll` (main application)
- [ ] `appsettings.json` (configuration)
- [ ] `web.config` (IIS configuration)
- [ ] All DLL dependencies
- [ ] `wwwroot/` folder (if exists)

### 2. Check Configuration Files

**appsettings.json must have:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=db42665.public.databaseasp.net; Database=db42665; User Id=db42665; Password=Fn5+y9!YDj8?; Encrypt=True; TrustServerCertificate=True; MultipleActiveResultSets=True;"
  },
  "Jwt": {
    "Issuer": "https://m-protfolio.runasp.net",
    "Audience": "https://m-said-portfolio.netlify.app",
    "SecretKey": "YourSuperSecretKeyForJWTTokenGenerationMinimum32Characters!",
    "ExpiryInMinutes": 60
  }
}
```

**web.config must exist** (for IIS/RunASP.net)

### 3. Verify Database Connection
Test the connection string:
```bash
Server=db42665.public.databaseasp.net
Database=db42665
User Id=db42665
Password=Fn5+y9!YDj8?
```

## 📤 Deployment Steps for RunASP.net

### Step 1: Publish Application
```bash
cd Portfolio.API
dotnet publish -c Release -o ./publish
```

### Step 2: Upload Files to RunASP.net

**Via FTP:**
1. Get FTP credentials from RunASP.net control panel
2. Connect using FileZilla or similar
3. Navigate to site root (usually `wwwroot` or `site/wwwroot`)
4. Upload ALL files from `publish` folder
5. Ensure file permissions are correct

**Via Control Panel:**
1. Log in to RunASP.net control panel
2. Go to File Manager
3. Navigate to your site folder
4. Delete old files (backup first!)
5. Upload all files from `publish` folder

### Step 3: Configure Application on RunASP.net

**Required Settings:**
- [ ] .NET Runtime: 9.0
- [ ] Application Pool: Running
- [ ] Entry Point: `Portfolio.API.dll`
- [ ] Environment: Production
- [ ] HTTPS: Enabled

### Step 4: Start/Restart Application

In RunASP.net control panel:
1. Find your application
2. Click "Stop" (if running)
3. Wait 10 seconds
4. Click "Start"
5. Wait 30 seconds for startup

### Step 5: Check Application Logs

**Critical:** Check RunASP.net logs for errors:
- Look for startup errors
- Check database connection errors
- Verify no missing dependencies

Common startup errors:
- Missing DLL files
- Database connection failed
- Invalid configuration
- Port already in use

## 🔍 Verification Steps

### Test 1: Check if Server Responds
```bash
curl -I https://m-protfolio.runasp.net
```

**Expected:** HTTP 200 or 307 (redirect)
**If fails:** Server is not running

### Test 2: Check Swagger
Open in browser:
```
https://m-protfolio.runasp.net/swagger/index.html
```

**Expected:** Swagger UI loads
**If fails:** Application not started or crashed

### Test 3: Test API Endpoint
```bash
curl https://m-protfolio.runasp.net/api/bio
```

**Expected:** JSON data
**If fails:** Check logs for errors

### Test 4: Check CORS
From browser console on https://m-said-portfolio.netlify.app:
```javascript
fetch('https://m-protfolio.runasp.net/api/bio')
  .then(r => r.json())
  .then(d => console.log('✅ Success:', d))
  .catch(e => console.error('❌ Error:', e));
```

## 🐛 Troubleshooting

### Issue 1: ERR_CONNECTION_REFUSED
**Cause:** Server not running or not accepting connections
**Fix:**
1. Check RunASP.net control panel - is app running?
2. Check logs for startup errors
3. Verify all files uploaded correctly
4. Restart application
5. Check firewall settings on RunASP.net

### Issue 2: Application Won't Start
**Cause:** Missing files or configuration error
**Fix:**
1. Check logs for specific error
2. Verify all DLL files uploaded
3. Check appsettings.json is valid JSON
4. Verify database connection string
5. Ensure .NET 9.0 runtime is available

### Issue 3: Database Connection Error
**Cause:** Invalid connection string or database not accessible
**Fix:**
1. Test connection string separately
2. Verify database server allows connections from RunASP.net
3. Check username/password are correct
4. Ensure database exists

### Issue 4: 500 Internal Server Error
**Cause:** Application started but crashed on request
**Fix:**
1. Check application logs
2. Look for missing dependencies
3. Verify database migrations ran
4. Check for code errors

## 📋 RunASP.net Specific Checks

### Control Panel Checklist:
- [ ] Application is in "Running" state
- [ ] No error messages in dashboard
- [ ] Correct .NET version selected (9.0)
- [ ] HTTPS binding configured
- [ ] Custom domain configured (if using)

### File Structure on Server:
```
site/
├── wwwroot/
│   └── (your uploaded files)
│       ├── Portfolio.API.dll
│       ├── appsettings.json
│       ├── web.config
│       └── (all other files)
```

### Environment Variables (if supported):
Set these in RunASP.net control panel:
- `ASPNETCORE_ENVIRONMENT` = `Production`
- `ASPNETCORE_URLS` = `https://+:443;http://+:80`

## 🎯 Quick Fix Checklist

If you're getting ERR_CONNECTION_REFUSED:

1. **Is the app running?**
   - Check RunASP.net control panel
   - Look for "Running" status

2. **Are all files uploaded?**
   - Verify `Portfolio.API.dll` exists
   - Check file count matches publish folder

3. **Check the logs**
   - Look for startup errors
   - Check for missing dependencies

4. **Restart the application**
   - Stop → Wait → Start
   - Wait 30 seconds

5. **Test basic connectivity**
   - Try accessing root URL
   - Check if Swagger loads

## 📞 Support Resources

- **RunASP.net Documentation:** Check their deployment guide
- **RunASP.net Support:** Contact if server issues
- **Application Logs:** Critical for diagnosing issues

## ⚠️ Important Notes

1. **ERR_CONNECTION_REFUSED is NOT a CORS issue**
   - CORS errors happen AFTER connection is established
   - This error means no connection at all

2. **Server must be running first**
   - Fix server startup issues before worrying about CORS
   - Check logs for the real error

3. **All files must be uploaded**
   - Missing DLL files will cause startup failure
   - Verify file count and sizes

---

**Next Step:** Check RunASP.net control panel to see if your application is running. If not, check the logs for startup errors.
