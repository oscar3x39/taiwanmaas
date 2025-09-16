# 📊 .env 與 .env.example 差異報告

## 🔍 差異摘要

`.env` 檔案相對於 `.env.example` 的主要差異在於**端口配置**，這些修改是為了避免與其他服務的端口衝突。

## 📋 詳細差異

### 🌐 網路和端口設定

| 設定項目 | .env.example | .env | 差異說明 |
|---------|-------------|------|---------|
| `BACKEND_PORT` | `3000` | `19999` | 後端服務端口 |
| `FRONTEND_PORT` | `8080` | `8888` | 前端服務端口 |
| `REDIS_PORT` | `6379` | `6390` | Redis 服務端口 |

### 🔗 服務 URL 設定

| 設定項目 | .env.example | .env | 差異說明 |
|---------|-------------|------|---------|
| `VUE_APP_API_URL` | `http://localhost:3000` | `http://localhost:19999` | API 基礎 URL |
| `REDIS_URL` | `redis://localhost:6379` | `redis://localhost:6390` | Redis 連線 URL |

### 🔒 安全性設定

| 設定項目 | .env.example | .env | 差異說明 |
|---------|-------------|------|---------|
| `CORS_ORIGIN` | `http://localhost:8080` | `http://localhost:8888` | CORS 允許來源 |

### 🧪 測試設定

| 設定項目 | .env.example | .env | 差異說明 |
|---------|-------------|------|---------|
| `TEST_REDIS_URL` | `redis://localhost:6380` | `redis://localhost:6390` | 測試用 Redis URL |

## 🎯 修改原因

### 1. **端口衝突避免**
- **3000 → 19999**: 避免與常見的 React/Node.js 開發服務器衝突
- **8080 → 8888**: 避免與 Tomcat、Jenkins 等服務衝突
- **6379 → 6390**: 避免與系統預設 Redis 實例衝突

### 2. **開發環境優化**
- 使用較高的端口號碼減少與系統服務衝突
- 保持服務間的一致性配置

## ✅ 配置驗證

### 當前運行狀態
```bash
# 後端服務
curl http://localhost:19999/health

# 前端服務  
curl -I http://localhost:8888

# Redis 連線測試
redis-cli -p 6390 ping
```

### 服務對應關係
```
前端 (8888) → 後端 API (19999) → Redis (6390)
```

## 🔧 如何同步設定

### 1. 更新 .env.example
如果要將當前的端口設定作為新的預設值：

```bash
cp .env .env.example
```

### 2. 重置為預設值
如果要回到原始的端口設定：

```bash
cp .env.example .env
```

### 3. 自訂端口設定
編輯 `.env` 檔案來使用不同的端口：

```bash
# 編輯環境變數
vim .env

# 重新啟動服務
./start-demo.sh
```

## ⚠️ 注意事項

### 🔒 安全性
- `.env` 檔案包含實際的配置值，**不應該**被提交到版本控制
- `.env.example` 是範本檔案，**應該**被提交到版本控制

### 🔄 同步性
- 當添加新的環境變數時，記得同時更新 `.env.example`
- 團隊成員應該根據 `.env.example` 建立自己的 `.env` 檔案

### 🚀 部署考量
- 生產環境應該使用不同的端口和設定
- 考慮使用 `.env.production.example` 作為生產環境範本

## 📝 建議操作

### 1. 立即行動
```bash
# 檢查當前服務狀態
./scripts/verify-gitignore.sh

# 確認服務正常運行
curl http://localhost:19999/health
curl -I http://localhost:8888
```

### 2. 團隊協作
- 將端口變更資訊告知團隊成員
- 更新部署文件中的端口資訊
- 考慮是否要更新 `.env.example` 為新的預設值

### 3. 文件更新
- 更新 README.md 中的端口資訊
- 更新 API 文件中的範例 URL
- 更新 Docker Compose 檔案中的端口映射

## 🎉 結論

目前的端口配置變更是合理的，主要是為了避免開發環境中的端口衝突。所有相關的 URL 和 CORS 設定都已經正確更新，系統可以正常運行。

**建議**：考慮將當前的端口設定更新到 `.env.example` 中，作為新的預設配置。