# 🔧 Backend Deployment Guide

## ✅ Configuration Complete!

Your backend is configured with:
- **Database:** db42665.public.databaseasp.net
- **Hosting:** m-protfolio.runasp.net
- **CORS:** Configured for Netlify and local development

## 📊 Database Connection

Already configured in `appsettings.json`:
```
Server=db42665.public.databaseasp.net
Database=db42665
User Id=db42665
Password=Fn5+y9!YDj8?
```

## 🚀 Deploy Backend to RunASP.net

### Option 1: Publish from Visual Studio
1. Right-click on `Portfolio.API` project
2. Select **Publish**
3. Choose **Azure** or **Folder** target
4. Configure for runasp.net
5. Click **Publish**

### Option 2: Using dotnet CLI
```bash
cd Portfolio.API
dotnet publish -c Release -o ./publish
```

Then upload the `publish` folder to runasp.net via FTP or their deployment method.

## 🗄️ Database Migration

When your backend starts on runasp.net, it will automatically:
1. Run all migrations
2. Create database tables
3. Seed initial data (from DbInitializer.cs)

The migrations are already in your project:
- `Portfolio.API/Data/Migrations/`

## ✅ What's Configured

### CORS Settings
Your backend now accepts requests from:
- ✅ `http://localhost:4200` (local development)
- ✅ `https://*.netlify.app` (all Netlify URLs)
- ✅ SignalR connections with credentials

### Database
- ✅ Connection string configured
- ✅ Migrations ready to run
- ✅ Seed data prepared

### Email Service
- ✅ SMTP configured with Gmail
- ✅ From: m.ssaid356@gmail.com
- ✅ To: m.ssaid356@gmail.com

## 🔍 Verify Backend is Running

After deployment, test these endpoints:

1. **Health Check**
   ```
   https://m-protfolio.runasp.net/
   ```
   Should redirect to Swagger UI

2. **API Endpoint**
   ```
   https://m-protfolio.runasp.net/api/bio
   ```
   Should return bio data

3. **Swagger UI**
   ```
   https://m-protfolio.runasp.net/swagger
   ```
   Should show API documentation

## 🔐 Update Database Manually (if needed)

If migrations don't run automatically:

```bash
# From Portfolio.API directory
dotnet ef database update --connection "Server=db42665.public.databaseasp.net; Database=db42665; User Id=db42665; Password=Fn5+y9!YDj8?; Encrypt=True; TrustServerCertificate=True; MultipleActiveResultSets=True;"
```

## 📝 Environment Variables on RunASP.net

If runasp.net supports environment variables, you can set:
- `ConnectionStrings__DefaultConnection` = Your connection string
- `EmailSettings__SmtpPassword` = Your email password

This keeps sensitive data out of appsettings.json

## 🎯 After Backend Deployment

1. ✅ Verify backend is accessible at https://m-protfolio.runasp.net
2. ✅ Test API endpoints in Swagger
3. ✅ Check database has tables and data
4. ✅ Deploy frontend to Netlify
5. ✅ Test full application end-to-end

## 🔧 Troubleshooting

### Database Connection Fails
- Verify connection string is correct
- Check firewall allows connections from runasp.net
- Ensure database server is accessible

### CORS Errors
- Already configured for `*.netlify.app`
- If using custom domain, add it to CORS policy

### Migrations Don't Run
- Check logs on runasp.net
- Run migrations manually using dotnet ef
- Verify database credentials

## 📞 Support
- **Email:** m.ssaid356@gmail.com
- **Database:** db42665.public.databaseasp.net
- **Backend URL:** https://m-protfolio.runasp.net

---

**Next Step:** Deploy frontend to Netlify (see Portfolio.UI/DEPLOY_NOW.md)
