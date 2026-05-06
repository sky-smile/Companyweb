#!/usr/bin/env bash
# =============================================
# CompanyWeb 环境配置 (WSL2/Linux)
# =============================================
# 用法: source scripts/env.sh
#
# 确保 pnpm 和 docker 在 PATH 中，设置通用变量
# =============================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

export PROJECT_ROOT
export SCRIPT_DIR

# 颜色定义
export COLOR_RESET='\033[0m'
export COLOR_RED='\033[0;31m'
export COLOR_GREEN='\033[0;32m'
export COLOR_YELLOW='\033[0;33m'
export COLOR_CYAN='\033[0;36m'
export COLOR_BOLD='\033[1m'

# 端口定义
export DB_PORT=3306
export SERVER_PORT=4000
export ADMIN_PORT=3000
export FRONTEND_PORT=3001

# ── 工具函数 ──────────────────────────────────

info()    { echo -e "${COLOR_CYAN}[INFO]${COLOR_RESET}  $*"; }
success() { echo -e "${COLOR_GREEN}[OK]${COLOR_RESET}    $*"; }
warn()    { echo -e "${COLOR_YELLOW}[WARN]${COLOR_RESET}  $*"; }
error()   { echo -e "${COLOR_RED}[ERROR]${COLOR_RESET} $*" >&2; }
header()  { echo -e "${COLOR_BOLD}$*${COLOR_RESET}"; }

# 检查命令是否存在
require_cmd() {
  for cmd in "$@"; do
    if ! command -v "$cmd" &>/dev/null; then
      error "缺少命令: $cmd，请先安装"
      exit 1
    fi
  done
}

# 检查端口是否被占用
port_in_use() {
  ss -tlnp 2>/dev/null | grep -q ":$1 " || netstat -tlnp 2>/dev/null | grep -q ":$1 "
}

# 列出占用某端口的进程
port_process() {
  ss -tlnp 2>/dev/null | grep ":$1 " || netstat -tlnp 2>/dev/null | grep ":$1 "
}
