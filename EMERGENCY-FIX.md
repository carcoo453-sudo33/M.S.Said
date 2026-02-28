# 🚨 EMERGENCY CORS FIX - DO THIS NOW

## The Problem
Your API is deployed but WITHOUT the CORS fix. The `web.config` file on the server doesn't have CORS headers.

## Quick Fix (5 minutes)

### Option 1: Replace web.config (EASIEST)

1. **Download this file:** `web.config.UPLOAD-THIS`
2. **Go to RunASP.net File Manager**
3. **Find the current `web.config`** in your site root
4. **Delete or rename** the old web.config
5. **Upload** the new `web.config.UPLOAD-THIS` file
6. **Rename it to** `web.config` (remove the .UPLOAD-THIS part)
7. **Restart** your application
8. **Test:** Visit https://m-said-portfolio.netlify.app/

### Option 2: Edit web.config Directly

1. **Go to RunASP.net File Manager**
2. **Open `web.config`** for editing
3. **Find this section:**
```xml
<system.webServer>
  <handlers>
    <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
  </handlers>
  <aspNetCore processPath="dotnet" arguments=".\Portfolio.API.dll" stdoutLogEnabled="true" stdoutLogFile=".\logs\stdout" hostingModel="inprocess" />
</system.webServer>
```

4. **Add this BEFORE the closing `</system.webServer>` tag:**
```xml
  <httpProtocol>
    <customHeaders>
      <add name="Access-Control-Allow-Origin" value="*" />
      <add name="Access-Control-Allow-Methods" value="GET, POST, PUT, DELETE, OPTIONS, PATCH" />
      <add name="Access-Control-Allow-Headers" value="Content-Type, Authorization, Accept, X-Requested-With" />
      <add name="Access-Control-Max-Age" value="86400" />
    </customHeaders>
  </httpProtocol>
```

5. **Save** the file
6. **Restart** your application
7. **Test:** Visit https://m-said-portfolio.netlify.app/

### Complete web.config Should Look Like This:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath="dotnet" arguments=".\Portfolio.API.dll" stdoutLogEnabled="true" stdoutLogFile=".\logs\stdout" hostingModel="inprocess" />
      <httpProtocol>
        <customHeaders>
          <add name="Access-Control-Allow-Origin" value="*" />
          <add name="Access-Control-Allow-Methods" value="GET, POST, PUT, DELETE, OPTIONS, PATCH" />
          <add name="Access-Control-Allow-Headers" value="Content-Type, Authorization, Accept, X-Requested-With" />
          <add name="Access-Control-Max-Age" value="86400" />
        </customHeaders>
      </httpProtocol>
    </system.webServer>
  </location>
</configuration>
```

## Verify It Worked

1. **Open browser console** (F12)
2. **Run this:**
```javascript
fetch('https://m-protfolio.runasp.net/api/bio')
  .then(r => {
    console.log('CORS Header:', r.headers.get('Access-Control-Allow-Origin'));
    return r.json();
  })
  .then(d => console.log('Data:', d));
```

3. **Should see:**
   - `CORS Header: *`
   - Data returned
   - No errors

4. **Visit:** https://m-said-portfolio.netlify.app/
   - Should load without errors
   - Data should display

## Why This Happened

When you deployed the API, the `web.config` file either:
- Wasn't uploaded
- Was overwritten by an old version
- Didn't include the CORS headers

This manual fix adds CORS headers at the IIS level, which will make it work immediately.

## After This Works

You still need to deploy the full API with the OPTIONS handler for complete CORS support. But this fix will make your site work RIGHT NOW.

---

**DO THIS NOW - It takes 5 minutes and will fix the issue!**
