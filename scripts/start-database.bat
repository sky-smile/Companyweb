@echo off
setlocal EnableExtensions EnableDelayedExpansion

echo ========================================
echo   MariaDB Startup Script
echo ========================================
echo.

REM ========== Config ==========
set "DB_DATA_DIR=D:\Programs\Scoop\Scoop\apps\mariadb\current\data"
set "MAX_WAIT=15"
REM ============================

REM [1] Check if already running
echo [1/4] Checking MariaDB status...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I "mysqld.exe" >nul
if not errorlevel 1 (
    echo       OK - MariaDB is already running
    goto :TEST_CONN
)
echo       - MariaDB not running, starting...

REM [2] Find mysqld
echo [2/4] Locating mysqld...
set "FOUND=0"

if defined MARIADB_DEFAULTS_FILE (
    where mysqld >nul 2>&1
    if not errorlevel 1 (
        if exist "%MARIADB_DEFAULTS_FILE%" (
            echo       Using MARIADB_DEFAULTS_FILE
            set "FOUND=1"
            set "LAUNCH_MYSQLD=mysqld"
            set "LAUNCH_OPTS=--defaults-file=%MARIADB_DEFAULTS_FILE%"
        )
    )
)

if "!FOUND!"=="0" if defined SCOOP (
    if exist "%SCOOP%\apps\mariadb\current\bin\mysqld.exe" (
        set "LAUNCH_MYSQLD=%SCOOP%\apps\mariadb\current\bin\mysqld.exe"
        if exist "%SCOOP%\persist\mariadb\data\my.ini" (
            echo       Using Scoop path + my.ini
            set "LAUNCH_OPTS=--defaults-file=%SCOOP%\persist\mariadb\data\my.ini"
        ) else (
            echo       Using Scoop path without my.ini
            set "LAUNCH_OPTS="
        )
        set "FOUND=1"
    )
)

if "!FOUND!"=="0" (
    where mysqld >nul 2>&1
    if not errorlevel 1 (
        set "LAUNCH_MYSQLD=mysqld"
        if exist "%DB_DATA_DIR%\my.ini" (
            echo       Using mysqld from PATH + local my.ini
            set "LAUNCH_OPTS=--defaults-file=%DB_DATA_DIR%\my.ini"
        ) else (
            echo       Using mysqld from PATH without my.ini
            set "LAUNCH_OPTS="
        )
        set "FOUND=1"
    )
)

if "!FOUND!"=="0" (
    echo.
    echo   ERROR: mysqld not found.
    echo   Install MariaDB: scoop install mariadb
    echo.
    pause
    exit /b 1
)

REM [3] Start MariaDB in a new minimized window to avoid stdin issues
echo [3/4] Starting MariaDB...
start "MariaDB" /MIN "%LAUNCH_MYSQLD%" %LAUNCH_OPTS%

REM Wait for process to appear (up to 5s)
set "WAITED=0"
:WAIT_START
if !WAITED! GEQ 5 goto :WAIT_READY
timeout /t 1 /nobreak >nul
set /a WAITED+=1
tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I "mysqld.exe" >nul
if not errorlevel 1 (
    echo       OK - mysqld process started
    goto :WAIT_READY
)
goto :WAIT_START

:WAIT_READY
REM [4] Wait for database ready
echo [4/4] Waiting for database ready (max %MAX_WAIT%s)...
set "RETRY=0"

:CONN_LOOP
set /a RETRY+=1
mysql -u root -e "SELECT 1" >nul 2>&1
if not errorlevel 1 (
    echo       OK - Database connected [!RETRY!s]
    goto :TEST_CONN
)
if !RETRY! GEQ %MAX_WAIT% (
    echo.
    echo   ERROR: Database startup timeout
    echo.
    echo   Troubleshooting:
    echo     1. Check error log: dir "%DB_DATA_DIR%\*.err"
    echo     2. Check port conflict: netstat -ano | findstr :3306
    echo     3. Try manual: "%LAUNCH_MYSQLD%" %LAUNCH_OPTS% --console
    echo.
    pause
    exit /b 1
)
echo       Waiting... [!RETRY!/%MAX_WAIT%]
timeout /t 1 /nobreak >nul
goto :CONN_LOOP

:TEST_CONN
echo.
echo ========================================
echo   MariaDB Connection Test
echo ========================================
mysql -u root -e "SHOW DATABASES;" 2>nul
if not errorlevel 1 (
    echo.
    echo   OK - Database is running
    echo.
    echo   Databases:
    mysql -u root -e "SHOW DATABASES;"
    echo.
    echo   Stop: taskkill /F /IM mysqld.exe
    echo   Or:   scripts\stop-all.bat
    echo.
) else (
    echo.
    echo   ERROR: Database connection failed
    echo   Check the error log in: %DB_DATA_DIR%
    echo.
    pause
    exit /b 1
)
