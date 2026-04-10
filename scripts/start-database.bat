@echo off
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

echo [2/3] Starting MariaDB...
start /B "" "D:\Programs\Scoop\Scoop\apps\mariadb\current\bin\mysqld.exe" --defaults-file="D:\Programs\Scoop\Scoop\apps\mariadb\current\data\my.ini"
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
    echo Check error logs: D:\Programs\Scoop\Scoop\apps\mariadb\current\data\*.err
    echo.
    pause
    exit /b 1
)
