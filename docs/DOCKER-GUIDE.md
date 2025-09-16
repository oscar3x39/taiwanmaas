# 🐳 Docker 配置指南

## 概述

本專案使用 Docker 和 Docker Compose 來提供一致的開發和部署環境。

## 快速開始

```bash
# 1. 初始化環境
make setup

# 2. 啟動開發環境
make dev

# 3. 檢查服務狀態
make health
```

## 環境配置

### 開發環境
- 使用 `docker-compose.dev.yml`
- 支援熱重載和即時程式碼同步
- 包含除錯工具和開發依賴

### 生產環境
- 使用 `docker-compose.prod.yml`
- 優化的映像大小和效能
- 包含監控和日誌配置

## 常用指令

```bash
make dev          # 啟動開發環境
make prod         # 啟動生產環境
make health       # 健康檢查
make logs         # 查看日誌
make clean        # 清理資源
make optimize     # 系統優化
```
## 優化
特色

### 安全性優化
- ✅ 使用最新的 Node.js 20 Alpine 基礎映像
- ✅ 非 root 用戶執行容器
- ✅ 安全性標頭配置
- ✅ 定期安全更新和漏洞掃描

### 效能優化
- ✅ Multi-stage Docker builds 減少映像大小
- ✅ 優化的快取層級和依賴安裝
- ✅ Gzip 壓縮和靜態資源快取
- ✅ 健康檢查和自動重啟策略

### 開發體驗
- ✅ 熱重載和即時程式碼同步
- ✅ 除錯工具和開發依賴
- ✅ 彩色日誌和監控工具
- ✅ 一鍵式環境設定

### 監控和維護
- ✅ 完整的健康檢查腳本
- ✅ 系統資源監控
- ✅ 自動化備份和清理
- ✅ 詳細的錯誤診斷

## 故障排除

### 常見問題

1. **端口被占用**
   ```bash
   lsof -i :3000  # 檢查端口使用
   make clean     # 清理容器
   ```

2. **映像建構失敗**
   ```bash
   make build     # 重新建構映像
   make optimize  # 清理和優化
   ```

3. **服務無法啟動**
   ```bash
   make logs      # 查看詳細日誌
   make health    # 執行健康檢查
   ```

## 最佳實踐

1. 定期執行 `make optimize` 清理系統
2. 使用 `make validate` 驗證環境配置
3. 監控容器資源使用情況
4. 定期備份重要資料
5. 保持 Docker 和依賴更新