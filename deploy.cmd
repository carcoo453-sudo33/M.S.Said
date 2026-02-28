@echo off
echo ========================================
echo PORTFOLIO DEPLOYMENT SCRIPT
echo ========================================
echo.

echo [1/4] Building API...
cd Portfolio.API
call dotnet publish -c Release
if %errorlevel% neq 0 (
    echo ERROR: API build failed!
    pause
    exit /b 1
)
cd ..
echo API build complete!
echo.

echo [2/4] Building UI...
cd Portfolio.UI
call ng build --configuration=production
if %errorlevel% neq 0 (
    echo ERROR: UI build failed!
    pause
    exit /b 1
)
cd ..
echo UI build complete!
echo.

echo [3/4] Build Summary:
echo ========================================
echo API Output: Portfolio.API\bin\Release\net9.0\publish\
echo UI Output:  Portfolio.UI\dist\
echo ========================================
echo.

echo [4/4] Next Steps:
echo ========================================
echo 1. Upload API files to RunASP.net:
echo    - Location: Portfolio.API\bin\Release\net9.0\publish\
echo    - IMPORTANT: Include web.config!
echo.
echo 2. Upload UI files to Netlify:
echo    - Location: Portfolio.UI\dist\
echo.
echo 3. Restart both applications
echo.
echo 4. Test at:
echo    - API: https://m-protfolio.runasp.net/swagger
echo    - UI:  https://m-said-portfolio.netlify.app/
echo ========================================
echo.

echo BUILD COMPLETE! Ready to deploy.
pause
