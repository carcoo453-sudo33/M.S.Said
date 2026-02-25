# Test Connection Script for Portfolio Deployment
# This script tests both backend and CORS configuration

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Portfolio Deployment Connection Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Backend Accessibility
Write-Host "Test 1: Checking if backend is accessible..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://m-protfolio.runasp.net/api/bio" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ SUCCESS: Backend is running" -ForegroundColor Green
    Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED: Backend is not accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Action Required: Check RunASP.net control panel" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test 2: CORS Configuration
Write-Host "Test 2: Checking CORS configuration..." -ForegroundColor Yellow
try {
    $headers = @{
        'Origin' = 'https://m-said-portfolio.netlify.app'
        'Access-Control-Request-Method' = 'GET'
    }
    $response = Invoke-WebRequest -Uri "https://m-protfolio.runasp.net/api/bio" -Method Options -Headers $headers -UseBasicParsing -TimeoutSec 10
    
    $corsHeaders = $response.Headers.GetEnumerator() | Where-Object { $_.Key -like '*Access-Control*' }
    
    if ($corsHeaders) {
        Write-Host "✅ SUCCESS: CORS is configured" -ForegroundColor Green
        foreach ($header in $corsHeaders) {
            Write-Host "   $($header.Key): $($header.Value)" -ForegroundColor Gray
        }
    } else {
        Write-Host "⚠️  WARNING: No CORS headers found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ FAILED: CORS check failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# Test 3: Swagger UI
Write-Host "Test 3: Checking Swagger UI..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://m-protfolio.runasp.net/swagger/index.html" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ SUCCESS: Swagger UI is accessible" -ForegroundColor Green
    Write-Host "   URL: https://m-protfolio.runasp.net/swagger/index.html" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED: Swagger UI is not accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# Test 4: Frontend Accessibility
Write-Host "Test 4: Checking if frontend is accessible..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://m-said-portfolio.netlify.app" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ SUCCESS: Frontend is accessible" -ForegroundColor Green
    Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED: Frontend is not accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. If backend tests passed: Redeploy frontend on Netlify" -ForegroundColor White
Write-Host "2. If backend tests failed: Check RunASP.net control panel" -ForegroundColor White
Write-Host "3. After redeployment: Test the site in your browser" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see: DEPLOYMENT_STATUS_AND_FIX.md" -ForegroundColor Cyan
