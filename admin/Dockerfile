# =============================================
# Admin Dockerfile - 多阶段构建
# =============================================

# ── 构建阶段 ──────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# 接收构建参数
ARG VITE_API_BASE_URL

# 安装依赖
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install

# 复制源码
COPY . .

# 设置环境变量（供 Vite 构建时使用）
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL:-/api}

# 构建（跳过类型检查，直接 vite build）
RUN npx vite build

# ── 生产阶段 ──────────────────────────────────
FROM nginx:alpine AS runner

# 复制 nginx 配置（静态文件服务）
COPY docker/nginx-static.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
