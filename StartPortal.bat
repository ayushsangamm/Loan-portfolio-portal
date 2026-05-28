@echo off
title Enterprise Loan Portal Launcher
echo ===================================================
echo   Enterprise Loan Portfolio Management System
echo   Launching Local Microservices (Self-Hosted)
echo ===================================================
echo.

:: Ensure we start in the correct project directory
cd /d "%~dp0"

echo [1/3] Launching Mock REST API Database (Port 3001)...
:: Starts cmd window and keeps it running npm.cmd run server
start "Enterprise Loan Database Server" cmd /k "npm.cmd run server"

echo [2/3] Launching Vite React Frontend (Port 5173)...
:: Starts cmd window and keeps it running npm.cmd run dev
start "Vite Web Frontend Portal" cmd /k "npm.cmd run dev"

echo [3/3] Initializing Web Browser to http://localhost:5173/ ...
:: Small delay to let Vite spin up
timeout /t 3 /nobreak >nul
start http://localhost:5173/

echo.
echo ===================================================
echo   Bootstrap completed successfully!
echo   - You can safely close this launcher window now.
echo   - Keep the database and web portal windows open.
echo ===================================================
timeout /t 5
exit
