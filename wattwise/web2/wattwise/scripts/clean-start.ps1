# Clean Start - Clear cache and restart development server

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  WattWise Clean Start" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clear cache
Write-Host "[STEP 1/3] Clearing cache..." -ForegroundColor Yellow
Write-Host ""
& "$PSScriptRoot\clear-cache.ps1"

# Step 2: Kill any running node processes on port 3000
Write-Host ""
Write-Host "[STEP 2/3] Checking for processes on port 3000..." -ForegroundColor Yellow

$port = 3000
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
             Select-Object -ExpandProperty OwningProcess -Unique

if ($processes) {
    Write-Host "   [WARNING] Found processes using port $port" -ForegroundColor Yellow
    foreach ($pid in $processes) {
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "      Killing process: $($process.Name) (PID: $pid)" -ForegroundColor Red
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Host "   [OK] Processes stopped" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "   [INFO] No processes found on port $port" -ForegroundColor Gray
}

# Step 3: Start development server
Write-Host ""
Write-Host "[STEP 3/3] Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Server will open at: http://localhost:3000" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Start the server
npm start
