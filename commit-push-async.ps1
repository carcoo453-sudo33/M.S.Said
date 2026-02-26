# PowerShell script to commit and push changes to GitHub asynchronously
Write-Host "Starting Git operations..." -ForegroundColor Green

# Stage all changes
Write-Host "`nStaging all changes..." -ForegroundColor Yellow
git add -A

# Check if there are changes to commit
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "No changes to commit." -ForegroundColor Red
    exit 0
}

# Commit changes
Write-Host "`nCommitting changes..." -ForegroundColor Yellow
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
    Write-Host "Commit failed!" -ForegroundColor Red
    exit 1
}

# Push to GitHub
Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "`n✗ Push failed! Please check your connection and credentials." -ForegroundColor Red
    exit 1
}

Write-Host "`nAll operations completed successfully!" -ForegroundColor Green
