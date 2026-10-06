# Clear WattWise Development Cache
# This script removes all cache files that might cause hot reload issues

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Clearing WattWise Development Cache" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Function to remove directory if exists
function Remove-DirectoryIfExists {
    param([string]$Path, [string]$Description)
    
    if (Test-Path $Path) {
        Write-Host "[*] Removing $Description..." -ForegroundColor Yellow
        Remove-Item -Path $Path -Recurse -Force -ErrorAction SilentlyContinue
        if ($?) {
            Write-Host "    [OK] $Description removed" -ForegroundColor Green
        } else {
            Write-Host "    [FAIL] Failed to remove $Description" -ForegroundColor Red
        }
    } else {
        Write-Host "    [INFO] $Description not found (already clean)" -ForegroundColor Gray
    }
}

# Clear all caches
Write-Host "Step 1: Clearing Node modules cache..." -ForegroundColor White
Remove-DirectoryIfExists "node_modules\.cache" "Node modules cache"

Write-Host ""
Write-Host "Step 2: Clearing build directory..." -ForegroundColor White
Remove-DirectoryIfExists "build" "Build directory"

Write-Host ""
Write-Host "Step 3: Clearing project cache..." -ForegroundColor White
Remove-DirectoryIfExists ".cache" "Project cache"

Write-Host ""
Write-Host "Step 4: Clearing Babel loader cache..." -ForegroundColor White
Remove-DirectoryIfExists "node_modules\.cache\babel-loader" "Babel loader cache"

Write-Host ""
Write-Host "Step 5: Clearing Terser cache..." -ForegroundColor White
Remove-DirectoryIfExists "node_modules\.cache\terser-webpack-plugin" "Terser cache"

Write-Host ""
Write-Host "Step 6: Clearing ESLint cache..." -ForegroundColor White
if (Test-Path ".eslintcache") {
    Remove-Item ".eslintcache" -Force -ErrorAction SilentlyContinue
    Write-Host "    [OK] ESLint cache removed" -ForegroundColor Green
} else {
    Write-Host "    [INFO] ESLint cache not found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 7: Clearing TypeScript build info..." -ForegroundColor White
if (Test-Path "tsconfig.tsbuildinfo") {
    Remove-Item "tsconfig.tsbuildinfo" -Force -ErrorAction SilentlyContinue
    Write-Host "    [OK] TypeScript build info removed" -ForegroundColor Green
} else {
    Write-Host "    [INFO] TypeScript build info not found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Cache cleared successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm start" -ForegroundColor White
Write-Host "  2. Hard refresh browser: Ctrl + Shift + R" -ForegroundColor White
Write-Host ""
