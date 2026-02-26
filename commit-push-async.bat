@echo off
echo Starting Git operations...
echo.

echo Staging all changes...
git add -A
if %errorlevel% neq 0 (
    echo Failed to stage changes!
    pause
    exit /b 1
)

echo.
echo Committing changes...
git commit -m "feat: Add education image lightbox and fix skeleton component warnings - Add lightbox functionality to education timeline images - Fix Angular build warnings for unused skeleton components - Clean up temporary files"
if %errorlevel% neq 0 (
    echo Commit failed!
    pause
    exit /b 1
)

echo.
echo Pushing to GitHub...
git push
if %errorlevel% equ 0 (
    echo.
    echo Successfully pushed to GitHub!
) else (
    echo.
    echo Push failed! Please check your connection and credentials.
    pause
    exit /b 1
)

echo.
echo All operations completed successfully!
pause
