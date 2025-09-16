# 🤖 AI-Generated Makefile for Docker Management
# 📝 展示現代開發工具鏈和自動化最佳實踐
# 
# 🚀 自動化特色：
# ✅ 一鍵式開發環境啟動
# ✅ 多環境部署支援
# ✅ 清理和維護工具
# ✅ 開發者友善的指令介面

.PHONY: help dev prod build clean logs test lint format health

# 預設目標
.DEFAULT_GOAL := help

# 顏色定義
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

# 環境變數
COMPOSE_FILE := docker-compose.yml
COMPOSE_DEV_FILE := docker-compose.dev.yml

help: ## 📖 顯示可用的指令
	@echo "$(BLUE)🚀 台灣智慧交通系統 - Docker 管理工具$(RESET)"
	@echo ""
	@echo "$(GREEN)可用指令:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-15s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

dev: ## 🔧 啟動開發環境
	@echo "$(BLUE)🔧 啟動開發環境...$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) up -d
	@echo "$(GREEN)✅ 開發環境已啟動$(RESET)"
	@echo "$(YELLOW)前端: http://localhost:8080$(RESET)"
	@echo "$(YELLOW)後端: http://localhost:3000$(RESET)"
	@echo "$(YELLOW)API 文件: http://localhost:3000/api-docs$(RESET)"

prod: ## 🚀 啟動生產環境
	@echo "$(BLUE)🚀 啟動生產環境...$(RESET)"
	docker-compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)✅ 生產環境已啟動$(RESET)"

build: ## 🔨 重新建構所有映像
	@echo "$(BLUE)🔨 重新建構映像...$(RESET)"
	docker-compose -f $(COMPOSE_FILE) build --no-cache
	docker-compose -f $(COMPOSE_DEV_FILE) build --no-cache
	@echo "$(GREEN)✅ 映像建構完成$(RESET)"

stop: ## ⏹️ 停止所有服務
	@echo "$(BLUE)⏹️ 停止服務...$(RESET)"
	docker-compose -f $(COMPOSE_FILE) down
	docker-compose -f $(COMPOSE_DEV_FILE) down
	@echo "$(GREEN)✅ 服務已停止$(RESET)"

clean: ## 🧹 清理 Docker 資源
	@echo "$(BLUE)🧹 清理 Docker 資源...$(RESET)"
	docker-compose -f $(COMPOSE_FILE) down -v --remove-orphans
	docker-compose -f $(COMPOSE_DEV_FILE) down -v --remove-orphans
	docker system prune -f
	@echo "$(GREEN)✅ 清理完成$(RESET)"

logs: ## 📋 查看服務日誌
	@echo "$(BLUE)📋 查看服務日誌...$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) logs -f

logs-backend: ## 📋 查看後端日誌
	@echo "$(BLUE)📋 查看後端日誌...$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) logs -f backend

logs-frontend: ## 📋 查看前端日誌
	@echo "$(BLUE)📋 查看前端日誌...$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) logs -f frontend

health: ## 🏥 檢查服務健康狀態
	@echo "$(BLUE)🏥 執行完整健康檢查...$(RESET)"
	@./scripts/docker-health-check.sh

health-quick: ## ⚡ 快速健康檢查
	@echo "$(BLUE)⚡ 快速健康檢查...$(RESET)"
	@echo "$(YELLOW)後端健康檢查:$(RESET)"
	@curl -f http://localhost:3000/api/health 2>/dev/null && echo "$(GREEN)✅ 後端正常$(RESET)" || echo "$(RED)❌ 後端異常$(RESET)"
	@echo "$(YELLOW)前端健康檢查:$(RESET)"
	@curl -f http://localhost:8080/health 2>/dev/null && echo "$(GREEN)✅ 前端正常$(RESET)" || echo "$(RED)❌ 前端異常$(RESET)"
	@echo "$(YELLOW)Redis 健康檢查:$(RESET)"
	@docker-compose -f $(COMPOSE_DEV_FILE) exec redis redis-cli ping 2>/dev/null && echo "$(GREEN)✅ Redis 正常$(RESET)" || echo "$(RED)❌ Redis 異常$(RESET)"

test: ## 🧪 執行測試
	@echo "$(BLUE)🧪 執行測試...$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) exec backend npm test
	docker-compose -f $(COMPOSE_DEV_FILE) exec frontend npm test

lint: ## 🔍 執行程式碼檢查
	@echo "$(BLUE)🔍 執行程式碼檢查...$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) exec backend npm run lint
	docker-compose -f $(COMPOSE_DEV_FILE) exec frontend npm run lint

format: ## 💅 格式化程式碼
	@echo "$(BLUE)💅 格式化程式碼...$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) exec backend npm run format
	docker-compose -f $(COMPOSE_DEV_FILE) exec frontend npm run format

shell-backend: ## 🐚 進入後端容器 shell
	@echo "$(BLUE)🐚 進入後端容器...$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) exec backend sh

shell-frontend: ## 🐚 進入前端容器 shell
	@echo "$(BLUE)🐚 進入前端容器...$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) exec frontend sh

restart: ## 🔄 重啟所有服務
	@echo "$(BLUE)🔄 重啟服務...$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) restart
	@echo "$(GREEN)✅ 服務已重啟$(RESET)"

ps: ## 📊 查看容器狀態
	@echo "$(BLUE)📊 容器狀態:$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) ps

install: ## 📦 安裝依賴
	@echo "$(BLUE)📦 安裝依賴...$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) exec backend npm install
	docker-compose -f $(COMPOSE_DEV_FILE) exec frontend npm install
	@echo "$(GREEN)✅ 依賴安裝完成$(RESET)"

setup: ## 🚀 初始化專案環境
	@echo "$(BLUE)🚀 初始化專案環境...$(RESET)"
	@if [ ! -f .env ]; then cp .env.example .env && echo "$(GREEN)✅ 已建立 .env 檔案$(RESET)"; fi
	@echo "$(YELLOW)請編輯 .env 檔案並設定必要的環境變數$(RESET)"
	@echo "$(YELLOW)特別是 GOOGLE_MAPS_API_KEY$(RESET)"
	@./scripts/docker-env-setup.sh
	@./scripts/validate-env.sh

validate: ## 🔍 驗證環境配置
	@echo "$(BLUE)🔍 驗證環境配置...$(RESET)"
	@./scripts/validate-env.sh

update: ## 🔄 更新依賴
	@echo "$(BLUE)🔄 更新依賴...$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) exec backend npm update
	docker-compose -f $(COMPOSE_DEV_FILE) exec frontend npm update
	@echo "$(GREEN)✅ 依賴更新完成$(RESET)"

security-scan: ## 🔒 安全性掃描
	@echo "$(BLUE)🔒 執行安全性掃描...$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) exec backend npm audit
	docker-compose -f $(COMPOSE_DEV_FILE) exec frontend npm audit
	@echo "$(GREEN)✅ 安全性掃描完成$(RESET)"

backup: ## 💾 備份資料
	@echo "$(BLUE)💾 備份 Redis 資料...$(RESET)"
	docker-compose -f $(COMPOSE_DEV_FILE) exec redis redis-cli BGSAVE
	@echo "$(GREEN)✅ 備份完成$(RESET)"

monitor: ## 📊 監控系統資源
	@echo "$(BLUE)📊 監控系統資源...$(RESET)"
	docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

optimize: ## 🚀 Docker 系統優化
	@echo "$(BLUE)🚀 執行 Docker 系統優化...$(RESET)"
	@./scripts/docker-optimize.sh --auto

optimize-interactive: ## 🎯 互動式 Docker 優化
	@echo "$(BLUE)🎯 啟動互動式 Docker 優化...$(RESET)"
	@./scripts/docker-optimize.sh

dashboard: ## 📊 啟動 Docker 監控儀表板
	@echo "$(BLUE)📊 啟動 Docker 監控儀表板...$(RESET)"
	@./scripts/docker-dashboard.sh

dev-start: ## 🚀 快速啟動開發環境
	@echo "$(BLUE)🚀 快速啟動開發環境...$(RESET)"
	@./scripts/dev-start.sh

dev-stop: ## ⏹️ 快速停止開發環境
	@echo "$(BLUE)⏹️ 快速停止開發環境...$(RESET)"
	@./scripts/dev-stop.sh

dev-reset: ## 🔄 重置開發環境
	@echo "$(BLUE)🔄 重置開發環境...$(RESET)"
	@./scripts/dev-reset.sh