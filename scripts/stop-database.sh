#!/usr/bin/env bash
# =============================================
# CompanyWeb - 停止 MariaDB 数据库
# =============================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/env.sh"

header "======================================"
header "  Stopping MariaDB"
header "======================================"
echo ""

require_cmd docker

COMPOSE_FILES=(-f "$PROJECT_ROOT/docker-compose.yml" -f "$PROJECT_ROOT/docker-compose.dev.yml")

if ! docker compose "${COMPOSE_FILES[@]}" ps --status running mariadb 2>/dev/null | grep -q mariadb; then
  info "MariaDB container is not running"
  exit 0
fi

info "Stopping MariaDB container..."
docker compose "${COMPOSE_FILES[@]}" stop mariadb

echo ""
success "MariaDB stopped"
