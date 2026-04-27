@echo off
:: ─────────────────────────────────────────────────────────────────
:: Qualys Cloud Platform — Shutdown Script (Windows)
:: ─────────────────────────────────────────────────────────────────
title Qualys Cloud Platform — Stopping Server

echo.
echo  [*] Stopping Qualys Cloud Platform server...
echo.

set STOPPED=0

:: ── Try PID file first ───────────────────────────────────────────
if exist "%~dp0vite.pid" (
    set /p SAVED_PID=<"%~dp0vite.pid"
    echo  [*] Found saved PID: %SAVED_PID%
    taskkill /PID %SAVED_PID% /F >nul 2>&1
    if %errorlevel% equ 0 (
        echo  [OK] Stopped process %SAVED_PID%
        set STOPPED=1
    )
    del "%~dp0vite.pid" >nul 2>&1
)

:: ── Fallback: kill by port 5173 ───────────────────────────────────
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 " ^| findstr "LISTENING" 2^>nul') do (
    echo  [*] Found process on port 5173: PID %%a
    taskkill /PID %%a /F >nul 2>&1
    if %errorlevel% equ 0 (
        echo  [OK] Stopped process %%a
        set STOPPED=1
    ) else (
        echo  [!] Could not stop PID %%a - try running as Administrator
    )
)

:: ── Result ───────────────────────────────────────────────────────
if %STOPPED%==0 (
    echo  [i] No server found running on port 5173.
) else (
    echo.
    echo  [OK] Server stopped successfully.
    echo       Run start.bat to restart.
)

echo.
