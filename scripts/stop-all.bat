@echo off
echo ========================================
echo CompanyWeb Stop All Services
echo ========================================
echo.

echo [1/3] Stopping MariaDB...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I "mysqld.exe" >nul
if %ERRORLEVEL%==0 (
    taskkill /F /IM mysqld.exe >nul 2>&1
    echo [OK] MariaDB stopped
) else (
    echo [INFO] MariaDB not running
)
echo.

echo [2/3] Stopping Backend...
taskkill /F /FI "WINDOWTITLE eq CompanyWeb Server" >nul 2>&1
if %ERRORLEVEL%==0 (
    echo [OK] Backend stopped
) else (
    echo [INFO] Backend not running
)
echo.

echo [3/3] Stopping Frontend...
taskkill /F /FI "WINDOWTITLE eq CompanyWeb Admin" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq CompanyWeb Frontend" >nul 2>&1
if %ERRORLEVEL%==0 (
    echo [OK] Frontend services stopped
) else (
    echo [INFO] Frontend services not running
)
echo.

echo ========================================
echo [OK] All services stopped
echo ========================================
echo.
pause
