@echo off
setlocal enabledelayedexpansion

REM Add system paths
set "PATH=C:\Windows\System32;C:\Windows;%PATH%"

echo ======================================
echo Stopping MariaDB
echo ======================================
echo.

set "DB_PORT=3306"
set "AUTO_MODE=%~1"

REM Find PID
set "PID="
for /f "tokens=5" %%a in ('%SystemRoot%\System32\netstat -ano ^| %SystemRoot%\System32\findstr ":%DB_PORT%" ^| %SystemRoot%\System32\findstr "LISTENING"') do (
    set "PID=%%a"
)

if not defined PID (
    echo [OK] MariaDB is not running
    if not "%AUTO_MODE%"=="--no-pause" pause
    exit /b 0
)

echo Stopping MariaDB (PID: %PID%)...

REM Try graceful shutdown
mysqladmin --user=root --port=%DB_PORT% shutdown >nul 2>&1
if errorlevel 1 (
    echo Graceful shutdown failed, force stopping...
    %SystemRoot%\System32\taskkill /F /PID %PID% >nul 2>&1
)

echo.
echo [OK] MariaDB stopped
if not "%AUTO_MODE%"=="--no-pause" pause
exit /b 0
