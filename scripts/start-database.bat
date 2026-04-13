@echo off
setlocal enabledelayedexpansion

REM Add system paths
set "PATH=C:\Windows\System32;C:\Windows;%PATH%"

echo ======================================
echo Starting MariaDB (Background Mode)
echo ======================================
echo.

set "DATA_DIR=%USERPROFILE%\.mariadb\data"
set "DB_PORT=3306"
set "AUTO_MODE=%~1"

REM Check if already running
%SystemRoot%\System32\netstat -ano | %SystemRoot%\System32\findstr ":%DB_PORT%" | %SystemRoot%\System32\findstr "LISTENING" >nul
if not errorlevel 1 (
    echo [OK] MariaDB is already running on port %DB_PORT%
    goto :verify_connection
)

REM Create data directory if needed
if not exist "%DATA_DIR%" (
    echo [1/4] Creating data directory...
    mkdir "%DATA_DIR%"
)

REM Initialize if needed
if not exist "%DATA_DIR%\mysql" (
    echo [2/4] Initializing database...
    mariadb-install-db --datadir="%DATA_DIR%"
    if errorlevel 1 (
        echo ERROR: Failed to initialize database
        if not "%AUTO_MODE%"=="--no-pause" pause
        exit /b 1
    )
)

echo [3/4] Starting MariaDB in background...

REM Use VBScript to run without window
set "VBS=%TEMP%\run_mariadb.vbs"
echo Set WshShell = CreateObject("WScript.Shell") > "%VBS%"
echo WshShell.Run "mariadbd --datadir=%DATA_DIR% --port=%DB_PORT%", 0, False >> "%VBS%"
wscript "%VBS%"
del "%VBS%"

echo [4/4] Waiting for database...
set /a COUNT=0

:wait
timeout /t 1 /nobreak >nul
set /a COUNT+=1

%SystemRoot%\System32\netstat -ano | %SystemRoot%\System32\findstr ":%DB_PORT%" | %SystemRoot%\System32\findstr "LISTENING" >nul
if not errorlevel 1 (
    echo Database started successfully!
    goto :verify_connection
)

if %COUNT% GEQ 30 (
    echo ERROR: Timeout after 30 seconds
    if not "%AUTO_MODE%"=="--no-pause" pause
    exit /b 1
)

echo Waiting... (%COUNT%s/30s)
goto :wait

:verify_connection
echo.
echo Verifying connection...
mysql --user=root --port=%DB_PORT% -e "SELECT 'Connection OK' AS status;" 2>nul
if not errorlevel 1 (
    echo.
    echo ======================================
    echo [SUCCESS] MariaDB is running!
    echo ======================================
    echo Port: %DB_PORT%
    echo Data: %DATA_DIR%
    echo.
    echo To stop: scripts\stop-database.bat
) else (
    echo WARNING: Cannot verify connection
    echo Check if MariaDB is running on port %DB_PORT%
)

echo.
if not "%AUTO_MODE%"=="--no-pause" pause
exit /b 0
