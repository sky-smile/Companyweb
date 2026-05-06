#!/usr/bin/env bash
# =============================================
# CompanyWeb - 一键启动全部开发服务
# =============================================
# 用法: ./scripts/start-all.sh
#
# 启动顺序: MariaDB - Server - Admin - Frontend
# 按 Ctrl+C 停止所有服务
# =============================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/env.sh"

# ── PID 追踪 ──────────────────────────────────
PIDS=()
cleanup() {
  echo ""
  info "正在停止所有服务..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait "${PIDS[@]}" 2>/dev/null || true
  success "所有服务已停止"
}
trap cleanup EXIT SIGINT SIGTERM

# ── 辅助函数 ──────────────────────────────────
run_service() {
  local name="$1"
  shift
  info "[$name] Starting..."
  "$@" &
  PIDS+=($!)
}

# ── 启动流程 ──────────────────────────────────
header "========================================"
header "  CompanyWeb Dev Environment"
header "========================================"
echo ""

require_cmd pnpm docker

# 1. 数据库
info "[1/4] Ensuring MariaDB is running..."
if ! port_in_use "$DB_PORT"; then
  bash "$SCRIPT_DIR/start-database.sh"
else
  success "MariaDB port $DB_PORT is already listening"
fi
echo ""

# 2. 后端
info "[2/4] Starting Backend Server (port $SERVER_PORT)..."
run_service "Server" bash -c "cd '$PROJECT_ROOT/server' && pnpm run start:dev"
sleep 3
echo ""

# 3. 管理后台
info "[3/4] Starting Admin Console (port $ADMIN_PORT)..."
run_service "Admin" bash -c "cd '$PROJECT_ROOT/admin' && pnpm run dev"
sleep 2
echo ""

# 4. 前端网站
info "[4/4] Starting Frontend Website (port $FRONTEND_PORT)..."
run_service "Frontend" bash -c "cd '$PROJECT_ROOT/frontend' && pnpm run dev"
sleep 3
echo ""

# ── 完成 ──────────────────────────────────────
echo ""
header "========================================"
header "  All services started!"
header "========================================"
echo ""
echo "  Frontend:    http://localhost:$FRONTEND_PORT"
echo "  Admin:       http://localhost:$ADMIN_PORT"
echo "  Backend API: http://localhost:$SERVER_PORT/api"
echo "  Database:    127.0.0.1:$DB_PORT"
echo ""
echo "  Default Admin:"
echo "    Username: admin"
echo "    Password: Admin123"
echo ""
echo "  Press Ctrl+C to stop all services"
echo "========================================"
echo ""

# 保持运行，直到被中断
wait || true
