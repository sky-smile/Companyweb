# =============================================
# Server Dockerfile - 多阶段构建
# =============================================

# ── 构建阶段 ──────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

# 复制源码
COPY . .

# 生成 Prisma 客户端（如有）
RUN pnpm run prisma:generate || true

# 构建
RUN pnpm run build

# ── 生产阶段 ──────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# 安全设置
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# 安装生产依赖
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile --prod

# 复制构建产物
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# 创建上传目录
RUN mkdir -p uploads && chown -R nestjs:nodejs uploads

# 复制启动脚本
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

USER nestjs

# 暴露端口
EXPOSE 4000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

# 启动
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "dist/src/main.js"]
