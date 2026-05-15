@echo off
title Attack Path Insights — Dev Server
cd /d "%~dp0"

echo.
echo  Qualys Attack Path Prototype — starting Vite dev server
echo  ───────────────────────────────────────────────────────
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo  [*] Installing dependencies...
    call npm install
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5174 " ^| findstr "LISTENING" 2^>nul') do (
    echo  [!] Port 5174 already in use — opening browser to existing server
    start "" "http://localhost:5174/app.html#/home"
    goto :end
)

echo  [*] Starting Vite on http://localhost:5174 ...
start "Vite Dev" /min cmd /c "npm run dev"
timeout /t 4 /nobreak >nul

start "" "http://localhost:5174/app.html#/home"

echo.
echo  Open these URLs in your browser:
echo    Home            http://localhost:5174/app.html#/home
echo    Risk Management http://localhost:5174/app.html#/findings
echo    Attack Path tab http://localhost:5174/app.html#/attack-path
echo                    (opens inside Risk Management)
echo.
echo  IMPORTANT: Use app.html — NOT insights.html on port 3000
echo  Stop: close the Vite window or run stop.bat
echo.

:end
