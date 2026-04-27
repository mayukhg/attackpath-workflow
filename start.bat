@echo off
:: ─────────────────────────────────────────────────────────────────
:: Qualys Cloud Platform — Startup Script (Windows)
:: Qualys Enterprise TruRisk™ Platform · ETM Module
:: ─────────────────────────────────────────────────────────────────
title Qualys Cloud Platform — Server

echo.
echo  ██████╗ ██╗   ██╗ █████╗ ██╗  ██╗   ██╗███████╗
echo  ██╔═══██╗██║   ██║██╔══██╗██║  ╚██╗ ██╔╝██╔════╝
echo  ██║   ██║██║   ██║███████║██║   ╚████╔╝ ███████╗
echo  ██║▄▄ ██║██║   ██║██╔══██║██║    ╚██╔╝  ╚════██║
echo  ╚██████╔╝╚██████╔╝██║  ██║███████╗██║   ███████║
echo   ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝
echo.
echo  Qualys Cloud Platform — ETM Module
echo  ─────────────────────────────────────────────────
echo.

:: ── Check if port 5173 is already in use ─────────────────────────
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 " ^| findstr "LISTENING" 2^>nul') do (
    echo  [!] Port 5173 is already in use by PID %%a
    echo      Run stop.bat first, or the server may already be running.
    echo.
    echo  Opening app in browser...
    timeout /t 1 /nobreak >nul
    start "" "http://localhost:5173/"
    echo.
    echo  URL: http://localhost:5173/
    goto :end
)

:: ── Check Node.js is available ───────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found. Please install from https://nodejs.org
    pause
    exit /b 1
)

:: ── Start Vite dev server ─────────────────────────────────────────
echo  [*] Starting Vite dev server on port 5173...
start /B node "%~dp0node_modules\vite\bin\vite.js" --port 5173 > "%~dp0vite.log" 2>&1

:: ── Wait for server to be ready ──────────────────────────────────
echo  [*] Waiting for server to initialise...
timeout /t 3 /nobreak >nul

:: ── Verify server started and save PID ───────────────────────────
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 " ^| findstr "LISTENING" 2^>nul') do (
    echo  [OK] Vite dev server started successfully (PID %%a)
    echo %%a > "%~dp0vite.pid"
)

:: ── Open browser ─────────────────────────────────────────────────
echo.
echo  [*] Opening Qualys Cloud Platform in browser...
timeout /t 1 /nobreak >nul
start "" "http://localhost:5173/"

echo.
echo  ─────────────────────────────────────────────────
echo  URL: http://localhost:5173/
echo  ─────────────────────────────────────────────────
echo  To stop the server, run: stop.bat
echo  Logs: vite.log
echo.

:end
