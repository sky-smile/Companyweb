#!/bin/sh
set -e

echo "Waiting for database to be ready..."
sleep 5

# 运行迁移（可选，生产环境建议手动执行）
# npx prisma migrate deploy

exec "$@"
