@echo off
title Attack Path Insights — Stopping Servers
cd /d "%~dp0"

echo.
echo  [*] Stopping servers...
echo.

for %%P in (5174 3000) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%%P " ^| findstr "LISTENING" 2^>nul') do (
        echo  [*] Stopping PID %%a on port %%P
        taskkill /PID %%a /F >nul 2>&1
    )
)

if exist "%~dp0server.pid" del "%~dp0server.pid" >nul 2>&1
echo  [OK] Done.
echo.
