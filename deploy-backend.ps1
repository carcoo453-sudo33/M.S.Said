# Deploy Backend API to RunASP.NET
# This script publishes the Portfolio.API project to your hosting server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying Backend API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if dotnet is installed
Write-Host "🔍 Checking .NET SDK..." -ForegroundColor Yellow
$dotnetVersion = dotnet --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: .NET SDK not found" -ForegroundColor Red
    Write-Host "   Please install .NET SDK from https://dotnet.microsoft.com/download" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ .NET SDK version: $dotnetVersion" -ForegroundColor Green
Write-Host ""

# Navigate to API project
$apiPath = "Portfolio.API"
if (-not (Test-Path $apiPath)) {
    Write-Host "❌ Error: Portfolio.API folder not found" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Building project..." -ForegroundColor Yellow
Set-Location $apiPath

# Build the project
dotnet build -c Release
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Publish using the publish profile
Write-Host "🚀 Publishing to RunASP.NET..." -ForegroundColor Yellow
Write-Host "   Profile: site56676-WebDeploy" -ForegroundColor Gray
Write-Host "   Target: m-protfolio.runasp.net" -ForegroundColor Gray
Write-Host ""

dotnet publish -c Release /p:PublishProfile=site56676-WebDeploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Publish failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "⚠️  Common issues:" -ForegroundColor Yellow
    Write-Host "   1. Check your credentials in the publish profile" -ForegroundColor Gray
    Write-Host "   2. Ensure you have internet connection" -ForegroundColor Gray
    Write-Host "   3. Verify the hosting server is accessible" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Alternative: Use Visual Studio" -ForegroundColor Yellow
    Write-Host "   1. Open Portfolio.API project in Visual Studio" -ForegroundColor Gray
    Write-Host "   2. Right-click on Portfolio.API project" -ForegroundColor Gray
    Write-Host "   3. Select 'Publish'" -ForegroundColor Gray
    Write-Host "   4. Click 'Publish' button" -ForegroundColor Gray
    Set-Location ..
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Backend API deployed successfully" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 API URL:" -ForegroundColor Yellow
Write-Host "   https://m-protfolio.runasp.net" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 Test the API:" -ForegroundColor Yellow
Write-Host "   1. Open https://m-protfolio.runasp.net/swagger" -ForegroundColor Gray
Write-Host "   2. Try the /api/bio endpoint" -ForegroundColor Gray
Write-Host "   3. Verify CORS headers in browser DevTools" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 CORS Fix Applied:" -ForegroundColor Yellow
Write-Host "   ✅ Allows https://m-said-portfolio.netlify.app" -ForegroundColor Green
Write-Host "   ✅ Allows all *.netlify.app domains" -ForegroundColor Green
Write-Host "   ✅ Allows localhost for development" -ForegroundColor Green
Write-Host ""
Write-Host "⏱️  Wait 1-2 minutes for the server to restart" -ForegroundColor Yellow
Write-Host "   Then test your frontend at:" -ForegroundColor Gray
Write-Host "   https://m-said-portfolio.netlify.app" -ForegroundColor Cyan
Write-Host ""
