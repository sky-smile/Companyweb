@echo off
setlocal EnableExtensions
echo ========================================
echo Starting MariaDB Database
echo ========================================
echo.

echo [1/3] Checking if MariaDB is running...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I "mysqld.exe" >nul
if %ERRORLEVEL%==0 (
    echo [OK] MariaDB is already running
    echo.
    goto TEST_CONNECTION
)

where mysqld >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] mysqld not found in PATH.
    echo Install MariaDB/MySQL and ensure its bin directory is on PATH, or use Scoop: scoop install mariadb
    echo.
    pause
    exit /b 1
)

echo [2/3] Starting MariaDB ^(mysqld from PATH^)...
if defined MARIADB_DEFAULTS_FILE if exist "%MARIADB_DEFAULTS_FILE%" (
    echo Using MARIADB_DEFAULTS_FILE=%MARIADB_DEFAULTS_FILE%
    start /B "" mysqld --defaults-file="%MARIADB_DEFAULTS_FILE%"
) else if defined SCOOP if exist "%SCOOP%\persist\mariadb\data\my.ini" (
    echo Using Scoop my.ini: %SCOOP%\persist\mariadb\data\my.ini
    start /B "" mysqld --defaults-file="%SCOOP%\persist\mariadb\data\my.ini"
) else (
    echo No defaults-file ^(optional: set MARIADB_DEFAULTS_FILE, or install Scoop mariadb with persist my.ini^)
    start /B "" mysqld
)
timeout /t 3 /nobreak >nul

echo [3/3] Waiting for database ready...
set MAX_RETRIES=10
set RETRY_COUNT=0

:WAIT_LOOP
timeout /t 1 /nobreak >nul
set /a RETRY_COUNT+=1

echo Waiting... (%RETRY_COUNT%/%MAX_RETRIES%)

mysql -u root -e "SELECT 1" >nul 2>&1
if %ERRORLEVEL%==0 (
    echo.
    echo [OK] MariaDB started successfully!
    echo.
    goto TEST_CONNECTION
)

if %RETRY_COUNT% GEQ %MAX_RETRIES% (
    echo.
    echo [ERROR] MariaDB startup timeout
    echo If using Scoop, set MARIADB_DEFAULTS_FILE to your my.ini, e.g.:
    echo   set MARIADB_DEFAULTS_FILE=%SCOOP%\persist\mariadb\data\my.ini
    echo.
    pause
    exit /b 1
)

goto WAIT_LOOP

:TEST_CONNECTION
echo Testing database connection...
mysql -u root -e "SHOW DATABASES;" 2>nul
if %ERRORLEVEL%==0 (
    echo.
    echo ========================================
    echo [OK] Database connected!
    echo ========================================
    echo.
    echo Available databases:
    mysql -u root -e "SHOW DATABASES;" 2>nul
    echo.
    echo MariaDB is running in background
    echo To stop: taskkill /F /IM mysqld.exe
    echo.
    exit /b 0
) else (
    echo.
    echo [ERROR] Database connection failed
    echo Check the MariaDB error log under your data directory or the path in my.ini.
    echo.
    pause
    exit /b 1
)
