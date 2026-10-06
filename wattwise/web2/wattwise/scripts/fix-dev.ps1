# Quick Fix - Fast cache clear and restart

Write-Host "[FIX] Quick fixing development issues..." -ForegroundColor Cyan

# Clear cache silently
Remove-Item "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item ".eslintcache" -Force -ErrorAction SilentlyContinue
Write-Host "  [OK] Cache cleared" -ForegroundColor Green

# Kill port 3000
$processes = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | 
             Select-Object -ExpandProperty OwningProcess -Unique
if ($processes) {
    $processes | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
    Write-Host "  [OK] Port 3000 cleared" -ForegroundColor Green
}

Write-Host "[SUCCESS] Fixed! Starting server..." -ForegroundColor Green
Write-Host ""

# Start server
npm start
