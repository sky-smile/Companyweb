#!/usr/bin/env bash
# =============================================
# CompanyWeb - 测试数据库命令
# =============================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/env.sh"

header "========================================"
header "  测试数据库命令"
header "========================================"
echo ""

require_cmd pnpm

echo -e "${COLOR_CYAN}测试:${COLOR_RESET} 运行 pnpm db:migrate-and-seed..."
echo ""

cd "$PROJECT_ROOT"
set +e
pnpm run db:migrate-and-seed
EXIT_CODE=$?
set -e

if [ "$EXIT_CODE" -eq 0 ]; then
  echo ""
  success "数据库命令正常工作"
else
  echo ""
  warn "命令执行失败 (exit code: $EXIT_CODE)"
  echo ""
  info "常见原因:"
  echo "  1. 数据库未启动 — 运行: scripts/start-database.sh"
  echo "  2. 数据库不存在 — 连接 MariaDB 创建:"
  echo "     docker compose -f docker-compose.yml -f docker-compose.dev.yml exec mariadb mysql -uroot \\"
  echo "       -e \"CREATE DATABASE IF NOT EXISTS company_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\""
  echo "  3. server/.env 未配置 — 运行: scripts/migrate-and-seed.sh"
  echo ""
fi

echo ""
header "========================================"
