# Complete workflow: Commit, Build, and Push to GitHub
Write-Host "=== Portfolio Deployment Workflow ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stage all changes
Write-Host "[1/4] Staging all changes..." -ForegroundColor Yellow
git add -A

# Check if there are changes to commit
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "No changes to commit." -ForegroundColor Red
    exit 0
}

# Step 2: Commit changes
Write-Host "[2/4] Committing changes..." -ForegroundColor Yellow
git commit -m "feat: Add education image lightbox and fix skeleton component warnings

- Add lightbox functionality to education timeline images
  * Click on education card images to open full-screen lightbox
  * Navigation with arrow buttons and keyboard (Arrow keys, Escape)
  * Image counter and thumbnail strip for multiple images
  * Two close buttons (white and red) matching project details style
  * Smooth animations (fadeIn, scaleIn, slideLeft, slideRight)
  * RTL support for Arabic layout

- Fix Angular build warnings for unused skeleton components
  * Remove unused ProjectsHeaderComponent and ProjectsHeaderSkeletonComponent
  * Projects page now uses SharedPageHeaderComponent consistently
  * Delete obsolete header component files
  * All skeleton components now properly matched to templates

- Clean up temporary files
  * Remove unused component imports
  * Verify all main components have no diagnostics"

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Commit failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Commit successful" -ForegroundColor Green

# Step 3: Build with production configuration
Write-Host "[3/4] Building with production configuration..." -ForegroundColor Yellow
Set-Location Portfolio.UI
npm run build -- --configuration=production

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Build successful" -ForegroundColor Green
Set-Location ..

# Step 4: Push to GitHub
Write-Host "[4/4] Pushing to GitHub..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== Deployment Complete ===" -ForegroundColor Cyan
} else {
    Write-Host "✗ Push failed! Please check your connection and credentials." -ForegroundColor Red
    exit 1
}
