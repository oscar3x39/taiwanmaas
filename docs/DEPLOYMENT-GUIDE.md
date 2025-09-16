# 🚀 部署指南

> **台灣智慧交通系統 - 完整部署手冊** - 從本地開發到生產環境的全流程指南

## 📋 目錄

- [環境需求](#環境需求)
- [本地開發部署](#本地開發部署)
- [Docker 部署](#docker-部署)
- [雲端部署](#雲端部署)
- [監控和維護](#監控和維護)
- [故障排除](#故障排除)

## 🔧 環境需求

### 最低系統需求
- **作業系統**: macOS 10.15+, Ubuntu 18.04+, Windows 10+
- **記憶體**: 4GB RAM (建議 8GB+)
- **儲存空間**: 10GB 可用空間
- **網路**: 穩定的網際網路連線

### 必要軟體
```bash
# Node.js (18.0.0+)
node --version  # v18.0.0+
npm --version   # 9.0.0+

# Docker (20.10.0+)
docker --version         # 20.10.0+
docker-compose --version # 2.0.0+

# Git
git --version  # 2.30.0+
```

### API Keys 需求
- **Google Maps API Key** (必要)
  - Maps JavaScript API
  - Places API
  - Geocoding API

## 🏠 本地開發部署

### 1. 克隆專案
```bash
# 克隆專案
git clone https://github.com/your-username/taiwan-transport-demo.git
cd taiwan-transport-demo

# 檢查專案結構
ls -la
```

### 2. 環境變數設定
```bash
# 複製環境變數範本
cp .env.example .env

# 編輯環境變數
nano .env
```

**必要的環境變數:**
```bash
# Google Maps API Key (必填)
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
VUE_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# 應用程式設定
NODE_ENV=development
BACKEND_PORT=3000
FRONTEND_PORT=8080
REDIS_PORT=6379

# API URLs
VUE_APP_API_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
```

### 3. 安裝依賴
```bash
# 後端依賴
cd backend
npm install
cd ..

# 前端依賴
cd frontend
npm install
cd ..
```

### 4. 啟動服務
```bash
# 方法 1: 使用 Makefile (推薦)
make dev

# 方法 2: 分別啟動
# 終端機 1 - 後端
cd backend && npm run dev

# 終端機 2 - 前端
cd frontend && npm run dev

# 終端機 3 - Redis
redis-server
```

### 5. 驗證部署
```bash
# 檢查服務狀態
curl http://localhost:3000/health
curl http://localhost:8080/health

# 檢查 API 文件
open http://localhost:3000/api-docs

# 檢查前端應用
open http://localhost:8080
```

## 🐳 Docker 部署

### 1. 使用 Docker Compose (推薦)
```bash
# 開發環境
make dev
# 或
docker-compose -f docker-compose.dev.yml up -d

# 生產環境
make prod
# 或
docker-compose up -d
```

### 2. 檢查容器狀態
```bash
# 查看容器狀態
docker-compose ps

# 查看日誌
docker-compose logs -f

# 檢查健康狀態
make health
```

### 3. 容器管理
```bash
# 停止服務
make stop

# 重啟服務
make restart

# 清理資源
make clean

# 重新建構
make build
```

### 4. 進入容器除錯
```bash
# 進入後端容器
make shell-backend

# 進入前端容器
make shell-frontend

# 查看 Redis 狀態
docker-compose exec redis redis-cli ping
```

## ☁️ 雲端部署

### 🚀 Vercel 部署 (前端)

#### 1. 準備部署
```bash
# 安裝 Vercel CLI
npm install -g vercel

# 登入 Vercel
vercel login
```

#### 2. 設定專案
```bash
# 在前端目錄執行
cd frontend
vercel

# 設定環境變數
vercel env add VUE_APP_GOOGLE_MAPS_API_KEY
vercel env add VUE_APP_API_URL
```

#### 3. 部署
```bash
# 部署到生產環境
vercel --prod
```

### 🚂 Railway 部署 (後端)

#### 1. 準備部署
```bash
# 安裝 Railway CLI
npm install -g @railway/cli

# 登入 Railway
railway login
```

#### 2. 建立專案
```bash
# 在後端目錄執行
cd backend
railway init

# 設定環境變數
railway variables set GOOGLE_MAPS_API_KEY=your_key
railway variables set NODE_ENV=production
railway variables set REDIS_URL=redis://redis:6379
```

#### 3. 部署
```bash
# 部署到 Railway
railway up
```

### 🌊 DigitalOcean App Platform

#### 1. 建立 App Spec
```yaml
# .do/app.yaml
name: taiwan-transport-demo
services:
- name: backend
  source_dir: /backend
  github:
    repo: your-username/taiwan-transport-demo
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: GOOGLE_MAPS_API_KEY
    value: ${GOOGLE_MAPS_API_KEY}
  http_port: 3000

- name: frontend
  source_dir: /frontend
  github:
    repo: your-username/taiwan-transport-demo
    branch: main
  run_command: npm run build && npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: VUE_APP_API_URL
    value: ${backend.PUBLIC_URL}
  - key: VUE_APP_GOOGLE_MAPS_API_KEY
    value: ${GOOGLE_MAPS_API_KEY}
  http_port: 8080

databases:
- name: redis
  engine: REDIS
  version: "7"
```

#### 2. 部署
```bash
# 使用 doctl CLI
doctl apps create --spec .do/app.yaml

# 或透過 DigitalOcean 控制台上傳 app.yaml
```

### 🏗️ AWS 部署

#### 1. 使用 AWS ECS + Fargate
```yaml
# docker-compose.aws.yml
version: '3.8'
services:
  backend:
    image: your-account.dkr.ecr.region.amazonaws.com/taiwan-transport-backend:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - REDIS_URL=${REDIS_URL}
      - GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
    
  frontend:
    image: your-account.dkr.ecr.region.amazonaws.com/taiwan-transport-frontend:latest
    ports:
      - "8080:8080"
    environment:
      - VUE_APP_API_URL=${BACKEND_URL}
      - VUE_APP_GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
```

#### 2. 建構和推送映像
```bash
# 建構映像
docker build -t taiwan-transport-backend ./backend
docker build -t taiwan-transport-frontend ./frontend

# 標記映像
docker tag taiwan-transport-backend:latest your-account.dkr.ecr.region.amazonaws.com/taiwan-transport-backend:latest
docker tag taiwan-transport-frontend:latest your-account.dkr.ecr.region.amazonaws.com/taiwan-transport-frontend:latest

# 推送到 ECR
aws ecr get-login-password --region region | docker login --username AWS --password-stdin your-account.dkr.ecr.region.amazonaws.com
docker push your-account.dkr.ecr.region.amazonaws.com/taiwan-transport-backend:latest
docker push your-account.dkr.ecr.region.amazonaws.com/taiwan-transport-frontend:latest
```

## 📊 監控和維護

### 🏥 健康檢查
```bash
# 自動健康檢查腳本
#!/bin/bash
# health-check.sh

echo "🏥 檢查系統健康狀態..."

# 檢查後端
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ 後端服務正常"
else
    echo "❌ 後端服務異常"
    exit 1
fi

# 檢查前端
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ 前端服務正常"
else
    echo "❌ 前端服務異常"
    exit 1
fi

# 檢查 Redis
if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis 服務正常"
else
    echo "❌ Redis 服務異常"
    exit 1
fi

echo "🎉 所有服務運行正常！"
```

### 📈 效能監控
```javascript
// 🤖 AI-Generated Performance Monitoring
const performanceMonitor = {
  // API 回應時間監控
  trackAPIResponse: (endpoint, duration) => {
    console.log(`API ${endpoint}: ${duration}ms`);
    // 發送到監控系統
  },
  
  // 記憶體使用監控
  trackMemoryUsage: () => {
    const usage = process.memoryUsage();
    console.log('Memory Usage:', {
      rss: `${Math.round(usage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)} MB`
    });
  }
};
```

### 📋 日誌管理
```bash
# 查看即時日誌
docker-compose logs -f backend
docker-compose logs -f frontend

# 日誌輪轉設定
# /etc/logrotate.d/taiwan-transport
/app/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 nodejs nodejs
}
```

### 🔄 自動備份
```bash
#!/bin/bash
# backup.sh - 自動備份腳本

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/taiwan-transport"

# 建立備份目錄
mkdir -p $BACKUP_DIR

# 備份 Redis 資料
docker-compose exec redis redis-cli BGSAVE
docker cp $(docker-compose ps -q redis):/data/dump.rdb $BACKUP_DIR/redis_$DATE.rdb

# 備份應用程式日誌
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz logs/

# 清理舊備份 (保留 7 天)
find $BACKUP_DIR -name "*.rdb" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ 備份完成: $DATE"
```

## 🔧 故障排除

### 常見問題和解決方案

#### 1. 容器啟動失敗
```bash
# 檢查容器狀態
docker-compose ps

# 查看詳細錯誤
docker-compose logs backend
docker-compose logs frontend

# 重新建構映像
docker-compose build --no-cache
```

#### 2. API 連線問題
```bash
# 檢查網路連線
docker network ls
docker network inspect taiwan-transport_app-network

# 檢查端口占用
netstat -tulpn | grep :3000
netstat -tulpn | grep :8080
```

#### 3. Redis 連線問題
```bash
# 檢查 Redis 狀態
docker-compose exec redis redis-cli ping

# 檢查 Redis 配置
docker-compose exec redis redis-cli CONFIG GET "*"

# 重啟 Redis
docker-compose restart redis
```

#### 4. 前端建構失敗
```bash
# 清理 node_modules
rm -rf frontend/node_modules
cd frontend && npm install

# 檢查 Node.js 版本
node --version  # 需要 18+

# 清理建構快取
cd frontend && npm run build -- --force
```

#### 5. 記憶體不足
```bash
# 檢查系統資源
docker stats

# 調整容器資源限制
# 在 docker-compose.yml 中修改:
deploy:
  resources:
    limits:
      memory: 1G
    reservations:
      memory: 512M
```

### 🚨 緊急恢復程序

#### 1. 快速重啟
```bash
# 停止所有服務
make stop

# 清理資源
docker system prune -f

# 重新啟動
make dev
```

#### 2. 資料恢復
```bash
# 從備份恢復 Redis
docker cp backup/redis_latest.rdb $(docker-compose ps -q redis):/data/dump.rdb
docker-compose restart redis
```

#### 3. 回滾部署
```bash
# Git 回滾
git log --oneline -10
git checkout <previous-commit>

# 重新部署
make build
make prod
```

### 📞 技術支援

#### 聯絡資訊
- **GitHub Issues**: https://github.com/your-username/taiwan-transport-demo/issues
- **Email**: support@your-domain.com
- **Discord**: https://discord.gg/your-server

#### 報告問題時請提供
1. 錯誤訊息和堆疊追蹤
2. 系統環境資訊
3. 重現步驟
4. 相關日誌檔案

---

**🤖 本部署指南由 AI 輔助生成，涵蓋了從本地開發到生產環境的完整部署流程。**

**遇到問題？請查看故障排除章節或聯絡技術支援團隊！** 🚀