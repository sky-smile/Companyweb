#!/usr/bin/env bash
# =============================================
# CompanyWeb - 启动 MariaDB 数据库 (Docker)
# =============================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/env.sh"

header "======================================"
header "  Starting MariaDB (Docker)"
header "======================================"
echo ""

require_cmd docker

COMPOSE_FILES=(-f "$PROJECT_ROOT/docker-compose.yml" -f "$PROJECT_ROOT/docker-compose.dev.yml")

# 检查是否已在运行
if docker compose "${COMPOSE_FILES[@]}" ps --status running mariadb 2>/dev/null | grep -q mariadb; then
  success "MariaDB container is already running"
  echo ""
  info "Port: $DB_PORT"
  info "To stop: scripts/stop-database.sh"
  exit 0
fi

# 检查端口是否被占用（可能由外部进程占用）
if port_in_use "$DB_PORT"; then
  warn "Port $DB_PORT is already in use by another process:"
  port_process "$DB_PORT"
  echo ""
  warn "If this is expected, ignore this warning."
  echo ""
fi

info "Pulling MariaDB image..."
docker compose "${COMPOSE_FILES[@]}" pull mariadb

info "Starting MariaDB container..."
docker compose "${COMPOSE_FILES[@]}" up -d mariadb

# 等待就绪
info "Waiting for database to be ready..."
ATTEMPTS=0
MAX_ATTEMPTS=30
until docker compose "${COMPOSE_FILES[@]}" exec -T mariadb healthcheck.sh --connect --innodb_initialized 2>/dev/null; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge "$MAX_ATTEMPTS" ]; then
    error "Database failed to start after ${MAX_ATTEMPTS}s"
    docker compose "${COMPOSE_FILES[@]}" logs --tail=20 mariadb
    exit 1
  fi
  echo -n "."
  sleep 1
done

echo ""
echo ""
success "MariaDB is running!"
echo ""
header "======================================"
echo "  Port:  $DB_PORT"
echo "  Data:  docker volume (companyweb_mariadb_data)"
echo ""
echo "  To stop: scripts/stop-database.sh"
echo "  To connect:"
echo "    docker compose -f docker-compose.yml -f docker-compose.dev.yml exec mariadb mysql -uroot"
echo "======================================"
