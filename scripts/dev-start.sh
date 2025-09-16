#!/bin/bash

# 🚀 快速啟動開發環境

set -e

echo "🔧 啟動台灣智慧交通開發環境..."

# 載入 Docker 環境配置
if [ -f .env.docker ]; then
    source .env.docker
    echo "✅ 已載入 Docker 環境配置 (${DOCKER_PROFILE} 模式)"
fi

# 檢查 Docker 是否運行
if ! docker info &> /dev/null; then
    echo "❌ Docker 未運行，請啟動 Docker Desktop"
    exit 1
fi

# 啟動服務
echo "🐳 啟動 Docker 服務..."
docker-compose -f docker-compose.dev.yml up -d

# 等待服務啟動
echo "⏳ 等待服務啟動..."
sleep 10

# 檢查服務狀態
echo "📊 檢查服務狀態..."
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "🎉 開發環境已啟動！"
echo "📱 前端應用: http://localhost:8080"
echo "🔧 後端 API: http://localhost:3000"
echo "📚 API 文件: http://localhost:3000/api-docs"
echo ""
echo "💡 有用的指令:"
echo "   make logs        # 查看日誌"
echo "   make health      # 健康檢查"
echo "   make stop        # 停止服務"
