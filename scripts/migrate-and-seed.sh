#!/usr/bin/env bash
# =============================================
# CompanyWeb - 数据库迁移和种子脚本
# =============================================
# 用法: ./scripts/migrate-and-seed.sh
#
# 依赖: 数据库已启动 (scripts/start-database.sh)
#       环境变量已在 server/.env 中配置
# =============================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/env.sh"

header "========================================"
header "  数据库迁移 & 种子脚本"
header "========================================"
echo ""

require_cmd pnpm

SERVER_DIR="$PROJECT_ROOT/server"

# 检查 server/.env
if [ ! -f "$SERVER_DIR/.env" ]; then
  warn "server/.env 不存在"
  if [ -f "$SERVER_DIR/.env.example" ]; then
    info "正在从 .env.example 复制..."
    cp "$SERVER_DIR/.env.example" "$SERVER_DIR/.env"
    success "已创建 server/.env，请根据需要修改配置"
  else
    error "server/.env.example 也不存在，请手动创建 server/.env"
    exit 1
  fi
fi

# 检查数据库连接
if ! port_in_use "$DB_PORT"; then
  warn "MariaDB 可能未启动 (端口 $DB_PORT 未监听)"
  info "尝试启动数据库: scripts/start-database.sh"
  echo ""
fi

info "[1/2] 运行数据库迁移..."
echo ""
cd "$SERVER_DIR"
pnpm run migration:run
success "数据库迁移完成"

echo ""

info "[2/2] 运行种子脚本..."
echo ""
pnpm run seed:auth
success "种子脚本执行完成"

echo ""
header "========================================"
header "  执行成功!"
header "========================================"
echo ""
echo "  默认管理员账号:"
echo "    用户名: admin"
echo "    密码:   Admin123"
echo ""
