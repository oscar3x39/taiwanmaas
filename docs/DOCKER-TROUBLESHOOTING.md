# 🐳 Docker 故障排除指南

## 常見問題與解決方案

### 1. 容器無法啟動

**問題**: 容器啟動失敗或立即退出

**解決方案**:
```bash
# 檢查容器日誌
docker-compose -f docker-compose.dev.yml logs [service-name]

# 檢查容器狀態
docker-compose -f docker-compose.dev.yml ps

# 重新建構映像
docker-compose -f docker-compose.dev.yml build --no-cache [service-name]
```

### 2. 端口被占用

**問題**: `bind: address already in use`

**解決方案**:
```bash
# 檢查端口使用情況
lsof -i :3000  # 後端端口
lsof -i :8080  # 前端端口
lsof -i :6379  # Redis 端口

# 停止占用端口的程序
kill -9 [PID]

# 或修改 .env 檔案中的端口設定
```

### 3. 記憶體不足

**問題**: 容器因記憶體不足被終止

**解決方案**:
```bash
# 檢查 Docker 記憶體限制
docker system df
docker stats

# 清理未使用的資源
docker system prune -f

# 調整 Docker Desktop 記憶體分配 (macOS)
# Docker Desktop > Preferences > Resources > Memory
```

### 4. 熱重載不工作

**問題**: 程式碼修改後沒有自動重載

**解決方案**:
```bash
# 確保環境變數設定正確
echo $CHOKIDAR_USEPOLLING
echo $WATCHPACK_POLLING

# 重啟開發容器
docker-compose -f docker-compose.dev.yml restart frontend
docker-compose -f docker-compose.dev.yml restart backend
```

### 5. 網路連接問題

**問題**: 容器間無法通信

**解決方案**:
```bash
# 檢查網路狀態
docker network ls
docker network inspect taiwan-transport_app-network

# 重建網路
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
```

### 6. 映像建構失敗

**問題**: Docker build 過程中出錯

**解決方案**:
```bash
# 清理建構快取
docker builder prune -f

# 使用 --no-cache 重新建構
docker-compose -f docker-compose.dev.yml build --no-cache

# 檢查 Dockerfile 語法
docker-compose -f docker-compose.dev.yml config
```

## 效能優化建議

### 1. 調整 Docker Desktop 設定 (macOS)
- CPU: 系統核心數 - 1
- Memory: 系統記憶體的 75%
- Disk: 至少 60GB

### 2. 使用 Docker BuildKit
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

### 3. 優化 .dockerignore
確保 `.dockerignore` 檔案包含不必要的檔案和目錄

## 監控和診斷工具

### 1. 即時監控
```bash
# 啟動監控儀表板
./scripts/docker-dashboard.sh

# 查看資源使用
docker stats

# 查看系統資訊
docker system df
docker system info
```

### 2. 日誌分析
```bash
# 查看所有服務日誌
make logs

# 查看特定服務日誌
make logs-backend
make logs-frontend

# 即時跟蹤日誌
docker-compose -f docker-compose.dev.yml logs -f --tail=100
```

### 3. 健康檢查
```bash
# 完整健康檢查
make health

# 快速健康檢查
make health-quick

# 手動檢查服務
curl http://localhost:3000/api/health
curl http://localhost:8080/health
```

## 緊急重置程序

如果遇到無法解決的問題，可以執行完整重置:

```bash
# 1. 停止所有服務
make stop

# 2. 清理所有資源
make clean

# 3. 重新建構和啟動
make build
make dev

# 或使用一鍵重置腳本
./scripts/dev-reset.sh
```

## 聯絡支援

如果問題仍然存在，請提供以下資訊:
- 作業系統版本
- Docker 版本 (`docker --version`)
- Docker Compose 版本 (`docker-compose --version`)
- 錯誤日誌
- 系統資源使用情況
