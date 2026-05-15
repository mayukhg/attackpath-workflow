@echo off
:: ─────────────────────────────────────────────────────────────────
:: Attack Path Insights — Shutdown Script (Windows)
:: ─────────────────────────────────────────────────────────────────
title Attack Path Insights — Stopping Server

echo.
echo  [*] Stopping Attack Path Insights server...
echo.

set STOPPED=0

:: ── Try PID file first ───────────────────────────────────────────
if exist "%~dp0server.pid" (
    set /p SAVED_PID=<"%~dp0server.pid"
    echo  [*] Found saved PID: %SAVED_PID%
    taskkill /PID %SAVED_PID% /F >nul 2>&1
    if %errorlevel% equ 0 (
        echo  [✓] Stopped process %SAVED_PID%
        set STOPPED=1
    )
    del "%~dp0server.pid" >nul 2>&1
)

:: ── Fallback: kill by port 3000 ──────────────────────────────────
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING" 2^>nul') do (
    echo  [*] Found process on port 3000: PID %%a
    taskkill /PID %%a /F >nul 2>&1
    if %errorlevel% equ 0 (
        echo  [✓] Stopped process %%a
        set STOPPED=1
    ) else (
        echo  [!] Could not stop PID %%a - try running as Administrator
    )
)

:: ── Result ───────────────────────────────────────────────────────
if %STOPPED%==0 (
    echo  [i] No server found running on port 3000.
) else (
    echo.
    echo  [✓] Server stopped successfully.
    echo      Run start.bat to restart.
)

echo.
