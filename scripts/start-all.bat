@echo off
echo ========================================
echo CompanyWeb Dev Environment Startup
echo ========================================
echo.

cd /d "%~dp0.."

echo [1/4] Starting MariaDB Database...
call scripts\start-database.bat
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Database startup failed
    pause
    exit /b 1
)

echo.
echo [2/4] Starting Backend Server (port 3000)...
start "CompanyWeb Server" cmd /k "cd server && pnpm run start:dev"
timeout /t 5 /nobreak >nul

echo [3/4] Starting Admin Console (port 3100)...
start "CompanyWeb Admin" cmd /k "cd admin && pnpm run dev"
timeout /t 2 /nobreak >nul

echo [4/4] Starting Frontend Website (port 3001)...
start "CompanyWeb Frontend" cmd /k "cd frontend && pnpm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo [OK] All services started!
echo ========================================
echo.
echo URLs:
echo   Frontend:    http://localhost:3001
echo   Admin:       http://localhost:3100
echo   Backend API: http://localhost:3000/api
echo   Database:    127.0.0.1:3306
echo.
echo Default Admin Account:
echo   Username: admin
echo   Password: Admin1234567
echo.
echo Tips:
echo   - Each service runs in a separate window
echo   - Close window to stop individual service
echo   - Stop database: taskkill /F /IM mysqld.exe
echo.
pause
