@echo off
chcp 65001 >nul
echo ========================================
echo   测试数据库命令是否正常工作
echo ========================================
echo.

echo 测试 1: 检查 pnpm db:migrate-and-seed 命令...
cd /d "%~dp0.."
call pnpm run db:migrate-and-seed

if errorlevel 1 (
    echo.
    echo [提示] 如果看到 "Unknown database" 错误，这是正常的
    echo 你需要先创建数据库，请按照以下步骤操作：
    echo.
    echo 1. 运行: scripts\start-database.bat
    echo 2. 创建数据库:
    echo    mysql -u root -p
    echo    CREATE DATABASE company_web;
    echo 3. 然后再运行: scripts\migrate-and-seed.bat
    echo.
)

echo.
echo ========================================
pause
