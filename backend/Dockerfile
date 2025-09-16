# 🤖 AI-Optimized Multi-stage Dockerfile
# 📝 展示 Docker 最佳實踐和效能優化
# 
# 🚀 AI 輔助優化特色：
# ✅ Multi-stage build 減少映像大小
# ✅ 優化的快取層級和依賴安裝
# ✅ 安全性最佳實踐 (非 root 用戶)
# ✅ 健康檢查和監控支援
# ✅ 安全性漏洞修復和最新基礎映像

# Build stage - 建構階段
FROM node:20-alpine AS builder

# 安裝安全更新和建構工具
RUN apk update && apk upgrade && \
    apk add --no-cache python3 make g++ curl

# 設定工作目錄
WORKDIR /app

# 複製 package files 並安裝所有依賴 (包含 devDependencies)
COPY package*.json ./
RUN npm ci --include=dev --no-audit && \
    npm audit fix --force || true

# 複製原始碼並建構
COPY . .
RUN npm run build

# Production stage - 生產階段
FROM node:20-alpine AS production

# 安裝安全更新和必要工具
RUN apk update && apk upgrade && \
    apk add --no-cache curl dumb-init && \
    rm -rf /var/cache/apk/*

# 建立非 root 用戶和必要目錄
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    mkdir -p /app/logs && \
    chown -R nodejs:nodejs /app

# 設定工作目錄
WORKDIR /app

# 複製 package files 並只安裝生產依賴
COPY package*.json ./
RUN npm ci --only=production --no-audit && \
    npm cache clean --force && \
    (npm audit fix --force || true)

# 從建構階段複製編譯後的程式碼
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# 設定環境變數
ENV NODE_ENV=production
ENV PORT=3000

# 切換到非 root 用戶
USER nodejs

# 暴露端口
EXPOSE 3000

# 設定健康檢查
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# 使用 dumb-init 作為 PID 1 以正確處理信號
ENTRYPOINT ["dumb-init", "--"]

# 啟動應用程式
CMD ["node", "dist/app.js"]