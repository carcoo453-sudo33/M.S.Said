# 🚨 TWO PROBLEMS TO FIX

## Problem 1: API Returns 500 Error (CRITICAL!)

Your API is **crashing** when it receives requests. This is why you see:
- Status: 500
- Content-Type: text/html (error page, not JSON)

### Possible Causes:

1. **Database connection failed** - Can't connect to SQL Server
2. **Missing dependencies** - DLL files not uploaded
3. **Configuration error** - appsettings.json wrong
4. **Startup error** - DbInitializer failing

### How to Fix:

#### Step 1: Check Error Logs

In RunASP.net:
1. Go to File Manager
2. Look for `logs` folder
3. Open the latest `stdout` log file
4. Look for error messages

Common errors:
- "Cannot open database" → Database connection issue
- "Could not load file or assembly" → Missing DLL
- "Connection string not found" → appsettings.json issue

#### Step 2: Verify Database Connection

Check your `appsettings.json` on the server:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=db42665.public.databaseasp.net; Database=db42665; User Id=db42665; Password=Fn5+y9!YDj8?; Encrypt=True; TrustServerCertificate=True; MultipleActiveResultSets=True;"
  }
}
```

Make sure:
- ✅ Server address is correct
- ✅ Database name is correct
- ✅ Username/password are correct
- ✅ Database is accessible from RunASP.net

#### Step 3: Test Database Connection

Try accessing Swagger directly:
```
https://m-protfolio.runasp.net/swagger
```

If Swagger loads but API endpoints fail → Database issue
If Swagger doesn't load → Application startup issue

## Problem 2: CORS Headers Missing

The `<httpProtocol><customHeaders>` section in web.config isn't working on RunASP.net.

### Solution: Use Outbound Rules

Replace your web.config with this:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath="dotnet" arguments=".\Portfolio.API.dll" stdoutLogEnabled="true" stdoutLogFile=".\logs\stdout" hostingModel="inprocess" />
      
      <rewrite>
        <rules>
          <!-- Handle OPTIONS requests -->
          <rule name="Handle OPTIONS" stopProcessing="true">
            <match url=".*" />
            <conditions>
              <add input="{REQUEST_METHOD}" pattern="OPTIONS" />
            </conditions>
            <action type="CustomResponse" statusCode="200" statusReason="OK" />
          </rule>
        </rules>
        
        <!-- Add CORS headers to all responses -->
        <outboundRules>
          <rule name="Add CORS Origin">
            <match serverVariable="RESPONSE_Access_Control_Allow_Origin" pattern=".*" />
            <action type="Rewrite" value="*" />
          </rule>
          <rule name="Add CORS Methods">
            <match serverVariable="RESPONSE_Access_Control_Allow_Methods" pattern=".*" />
            <action type="Rewrite" value="GET, POST, PUT, DELETE, OPTIONS, PATCH" />
          </rule>
          <rule name="Add CORS Headers">
            <match serverVariable="RESPONSE_Access_Control_Allow_Headers" pattern=".*" />
            <action type="Rewrite" value="Content-Type, Authorization, Accept, X-Requested-With, Origin" />
          </rule>
        </outboundRules>
      </rewrite>
    </system.webServer>
  </location>
</configuration>
```

## PRIORITY: Fix the 500 Error First!

The CORS headers won't help if your API is crashing. Fix the 500 error first:

1. **Check logs** in RunASP.net
2. **Verify database connection**
3. **Ensure all DLL files uploaded**
4. **Check appsettings.json**

Once the API returns 200 (not 500), then the CORS headers will work.

## Quick Test

After fixing 500 error, test with:

```javascript
fetch('https://m-protfolio.runasp.net/api/bio')
  .then(r => {
    console.log('Status:', r.status); // Should be 200, not 500
    console.log('CORS:', r.headers.get('Access-Control-Allow-Origin'));
    return r.json();
  })
  .then(d => console.log('Data:', d));
```

Expected:
- Status: 200 ✅
- CORS: * ✅
- Data: Your bio info ✅

## Contact RunASP.net Support

If you can't fix the 500 error, contact RunASP.net support with:

```
Subject: API returning 500 error after deployment

Hi, my API at m-protfolio.runasp.net is returning 500 errors.

Can you please:
1. Check the error logs for my application
2. Verify my database connection is working
3. Confirm all my DLL files were uploaded correctly
4. Help me enable CORS headers

Thank you!
```

---

**Fix the 500 error first, then CORS will work!**
