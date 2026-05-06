#!/usr/bin/env bash
# =============================================
# CompanyWeb - 停止所有服务
# =============================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/env.sh"

header "========================================"
header "  CompanyWeb Stop All Services"
header "========================================"
echo ""

# 1. 停止 Server (port $SERVER_PORT)
info "[1/4] Stopping Backend..."
if port_in_use "$SERVER_PORT"; then
  PID=$(fuser "$SERVER_PORT/tcp" 2>/dev/null | awk '{print $1}')
  if [ -n "$PID" ]; then
    kill "$PID" 2>/dev/null && success "Backend (PID $PID) stopped" || warn "Failed to stop Backend"
  fi
else
  info "Backend not running"
fi
echo ""

# 2. 停止 Admin (Vite — port $ADMIN_PORT)
info "[2/4] Stopping Admin Console..."
if port_in_use "$ADMIN_PORT"; then
  PID=$(fuser "$ADMIN_PORT/tcp" 2>/dev/null | awk '{print $1}')
  if [ -n "$PID" ]; then
    kill "$PID" 2>/dev/null && success "Admin (PID $PID) stopped" || warn "Failed to stop Admin"
  fi
else
  info "Admin not running"
fi
echo ""

# 3. 停止 Frontend (Next.js — port 3001)
info "[3/4] Stopping Frontend..."
if port_in_use "$FRONTEND_PORT"; then
  PID=$(fuser "$FRONTEND_PORT/tcp" 2>/dev/null | awk '{print $1}')
  if [ -n "$PID" ]; then
    kill "$PID" 2>/dev/null && success "Frontend (PID $PID) stopped" || warn "Failed to stop Frontend"
  fi
else
  info "Frontend not running"
fi
echo ""

# 4. 停止 MariaDB
info "[4/4] Stopping MariaDB..."
bash "$SCRIPT_DIR/stop-database.sh"
echo ""

header "========================================"
header "  All services stopped"
header "========================================"
