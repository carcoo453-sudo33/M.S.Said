# Deploy Fix Script
# This script commits and pushes the Netlify environment fix

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying Netlify Environment Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not in a git repository" -ForegroundColor Red
    Write-Host "   Please run this script from the repository root" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Files to be committed:" -ForegroundColor Yellow
Write-Host "   - netlify.toml (Updated build command)" -ForegroundColor Gray
Write-Host "   - Portfolio.UI/package.json (Added check:build script)" -ForegroundColor Gray
Write-Host "   - Portfolio.UI/check-build.js (New verification script)" -ForegroundColor Gray
Write-Host "   - FIX_NETLIFY_ENVIRONMENT.md (Documentation)" -ForegroundColor Gray
Write-Host "   - FINAL_SOLUTION.md (Summary)" -ForegroundColor Gray
Write-Host "   - deploy-fix.ps1 (This script)" -ForegroundColor Gray
Write-Host ""

# Check git status
Write-Host "🔍 Checking git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "✅ Changes detected" -ForegroundColor Green
} else {
    Write-Host "⚠️  No changes to commit" -ForegroundColor Yellow
    Write-Host "   All files may already be committed" -ForegroundColor Gray
    exit 0
}

Write-Host ""

# Add files
Write-Host "📦 Adding files to git..." -ForegroundColor Yellow
git add netlify.toml
git add Portfolio.UI/package.json
git add Portfolio.UI/check-build.js
git add FIX_NETLIFY_ENVIRONMENT.md
git add FINAL_SOLUTION.md
git add deploy-fix.ps1
git add DEPLOYMENT_STATUS_AND_FIX.md
git add README_DEPLOYMENT.md
git add test-connection.ps1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Files added successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Error adding files" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Commit
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Fix Netlify production build configuration

- Updated netlify.toml to use npm run build:prod
- Added NODE_ENV=production environment variable
- Created build verification script (check-build.js)
- Added comprehensive documentation

This fixes the issue where Netlify was building with development
environment instead of production, causing the frontend to try
connecting to localhost:5283 instead of the production backend."

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Changes committed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Error committing changes" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Push
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin master

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Changes pushed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Error pushing changes" -ForegroundColor Red
    Write-Host "   You may need to pull first: git pull origin master" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Triggered!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Changes pushed to GitHub" -ForegroundColor Green
Write-Host "✅ Netlify will automatically detect the push" -ForegroundColor Green
Write-Host "✅ Build will start in 10-30 seconds" -ForegroundColor Green
Write-Host "✅ Build will complete in 2-3 minutes" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Monitor the build:" -ForegroundColor Yellow
Write-Host "   https://app.netlify.com/sites/m-said-portfolio/deploys" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Your site:" -ForegroundColor Yellow
Write-Host "   https://m-said-portfolio.netlify.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏱️  Expected timeline:" -ForegroundColor Yellow
Write-Host "   - Netlify detects push: 10-30 seconds" -ForegroundColor Gray
Write-Host "   - Build completes: 2-3 minutes" -ForegroundColor Gray
Write-Host "   - Site updates: Immediate" -ForegroundColor Gray
Write-Host "   - Total: ~3-4 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "🧪 After deployment, test:" -ForegroundColor Yellow
Write-Host "   1. Open https://m-said-portfolio.netlify.app" -ForegroundColor Gray
Write-Host "   2. Open DevTools (F12) → Console" -ForegroundColor Gray
Write-Host "   3. Look for '✅ Bio loaded successfully'" -ForegroundColor Gray
Write-Host "   4. Should NOT see 'Unable to connect' errors" -ForegroundColor Gray
Write-Host ""
Write-Host "✨ Done! Your site will be fixed in ~3 minutes." -ForegroundColor Green
