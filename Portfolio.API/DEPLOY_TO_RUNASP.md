# 🚀 Deploy Backend to RunASP.net

## ⚠️ Backend Not Deployed Yet

The URL `https://m-protfolio.runasp.net` returns 404 because your backend application isn't deployed yet.

## 📋 Deploy Your Backend

### Option 1: Deploy from Visual Studio (Recommended)

1. **Open Portfolio.API in Visual Studio**

2. **Right-click on Portfolio.API project** → Select **Publish**

3. **Configure Publish Profile:**
   - Target: **Web Server (IIS)** or **Azure App Service**
   - Server: Your RunASP.net server details
   - Site name: `m-protfolio`
   - Username/Password: Your RunASP.net credentials

4. **Click Publish**

5. **Wait for deployment** (2-3 minutes)

### Option 2: Publish to Folder, Then Upload

```bash
cd Portfolio.API
dotnet publish -c Release -o ./publish
```

Then upload the `publish` folder contents to RunASP.net via:
- FTP
- File Manager in RunASP.net control panel
- Git deployment (if supported)

### Option 3: Using RunASP.net Control Panel

1. Log in to your RunASP.net control panel
2. Go to **File Manager** or **Deployment** section
3. Upload your published files
4. Configure the application:
   - Set .NET version to 9.0
   - Set entry point to `Portfolio.API.dll`
   - Configure connection string

## 🔧 After Deployment

### 1. Verify Backend is Running

Try these URLs:
- Root: `https://m-protfolio.runasp.net/`
- Swagger: `https://m-protfolio.runasp.net/swagger`
- API: `https://m-protfolio.runasp.net/api/bio`

### 2. Check Database Connection

The backend will automatically:
- Run migrations
- Create tables
- Seed initial data

Check RunASP.net logs if there are database connection issues.

### 3. Test API Endpoints

In Swagger UI, test:
- GET `/api/bio` - Should return bio data
- GET `/api/projects` - Should return projects
- POST `/identity/login` - Should allow login

## 📊 Your Configuration

| Item | Value |
|------|-------|
| **Backend URL** | https://m-protfolio.runasp.net |
| **Database** | db42665.public.databaseasp.net |
| **Frontend** | https://m-said-portfolio.netlify.app |
| **CORS** | Configured for your Netlify URL |

## 🔐 Connection String

Already configured in `appsettings.json`:
```
Server=db42665.public.databaseasp.net
Database=db42665
User Id=db42665
Password=Fn5+y9!YDj8?
```

## 🚨 Common Issues

### 404 Error
- Backend not deployed yet → Deploy using steps above
- Wrong URL → Verify your RunASP.net URL
- Application not started → Check RunASP.net control panel

### Database Connection Error
- Check connection string is correct
- Verify database server allows connections from RunASP.net
- Check firewall rules

### CORS Error
- Already configured for `https://m-said-portfolio.netlify.app`
- If using different URL, update Program.cs

## 📞 RunASP.net Support

If you need help with deployment:
1. Check RunASP.net documentation
2. Contact RunASP.net support
3. Check deployment logs in control panel

## ✅ Deployment Checklist

- [ ] Publish backend to folder or directly to RunASP.net
- [ ] Upload files to RunASP.net
- [ ] Configure .NET 9.0 runtime
- [ ] Verify connection string
- [ ] Start application
- [ ] Test Swagger UI at `/swagger`
- [ ] Test API endpoints
- [ ] Verify database migrations ran
- [ ] Test from frontend

## 🎯 Next Steps

1. **Deploy backend to RunASP.net** (follow steps above)
2. **Verify backend is accessible** (test Swagger)
3. **Test frontend** at https://m-said-portfolio.netlify.app
4. **Verify API calls work** from frontend to backend

---

**Your frontend is already deployed at:** https://m-said-portfolio.netlify.app
**Now deploy your backend to:** https://m-protfolio.runasp.net
