@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   数据库迁移和种子脚本
echo ========================================
echo.

REM 检查 server 目录是否存在
if not exist "%~dp0..\server" (
    echo [错误] 找不到 server 目录
    pause
    exit /b 1
)

REM 检查 .env 文件是否存在
if not exist "%~dp0..\server\.env" (
    echo [警告] server\.env 文件不存在
    echo 请确保已创建并配置好 server\.env 文件
    echo 可以复制 server\.env.example 作为模板
    echo.
    pause
    exit /b 1
)

echo [1/3] 进入 server 目录...
cd /d "%~dp0..\server"

echo [2/3] 运行数据库迁移...
echo.
call pnpm run migration:run
if errorlevel 1 (
    echo.
    echo [错误] 数据库迁移失败，请检查数据库连接和迁移文件
    pause
    exit /b 1
)
echo.
echo [√] 数据库迁移完成
echo.

echo [3/3] 运行种子脚本...
echo.
call pnpm run seed:auth
if errorlevel 1 (
    echo.
    echo [错误] 种子脚本执行失败，请检查数据库连接和种子文件
    pause
    exit /b 1
)
echo.
echo [√] 种子脚本执行完成
echo.

echo ========================================
echo   数据库迁移和种子脚本执行成功！
echo ========================================
echo.
echo 默认管理员账号:
echo   用户名: admin
echo   密码: Admin123
echo.
pause
