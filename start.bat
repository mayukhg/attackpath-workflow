@echo off
:: ─────────────────────────────────────────────────────────────────
:: Attack Path Insights — Startup Script (Windows)
:: Qualys Enterprise TruRisk™ Platform · ETM Attack Path Module
:: ─────────────────────────────────────────────────────────────────
title Attack Path Insights — Server

echo.
echo  ██████╗ ██╗   ██╗ █████╗ ██╗  ██╗   ██╗███████╗
echo  ██╔═══██╗██║   ██║██╔══██╗██║  ╚██╗ ██╔╝██╔════╝
echo  ██║   ██║██║   ██║███████║██║   ╚████╔╝ ███████╗
echo  ██║▄▄ ██║██║   ██║██╔══██║██║    ╚██╔╝  ╚════██║
echo  ╚██████╔╝╚██████╔╝██║  ██║███████╗██║   ███████║
echo   ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝
echo.
echo  Attack Path Insights — ETM Module
echo  ─────────────────────────────────────────────────
echo.

:: ── Check if port 3000 is already in use ─────────────────────────
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING" 2^>nul') do (
    echo  [!] Port 3000 is already in use by PID %%a
    echo      Run stop.bat first, or the server may already be running.
    echo.
    echo  Opening app in browser...
    timeout /t 1 /nobreak >nul
    start "" "http://localhost:3000/insights.html"
    echo.
    echo  URLs:
    echo    Main screen  : http://localhost:3000/insights.html
    echo    Workflow      : http://localhost:3000/workflow.html
    echo    Original      : http://localhost:3000/index.html
    goto :end
)

:: ── Check Node.js is available ───────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found. Please install from https://nodejs.org
    pause
    exit /b 1
)

:: ── Start the server ─────────────────────────────────────────────
echo  [*] Starting server on port 3000...
start /B node "%~dp0server.cjs" > "%~dp0server.log" 2>&1

:: ── Wait for server to be ready ──────────────────────────────────
echo  [*] Waiting for server to initialise...
timeout /t 2 /nobreak >nul

:: ── Verify server started ────────────────────────────────────────
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING" 2^>nul') do (
    echo  [✓] Server started successfully  ^(PID %%a^)
    echo      PID saved to server.pid for shutdown
    echo %%a > "%~dp0server.pid"
)

:: ── Open browser ─────────────────────────────────────────────────
echo.
echo  [*] Opening Attack Path Insights in browser...
timeout /t 1 /nobreak >nul
start "" "http://localhost:3000/insights.html"

echo.
echo  ─────────────────────────────────────────────────
echo  URLs:
echo    Attack Path Insights : http://localhost:3000/insights.html
echo    User Journey Workflow : http://localhost:3000/workflow.html
echo    Original Qualys Screen: http://localhost:3000/index.html
echo  ─────────────────────────────────────────────────
echo  To stop the server, run: stop.bat
echo  Logs: server.log
echo.

:end
