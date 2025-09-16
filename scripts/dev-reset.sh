#!/bin/bash

# 🔄 重置開發環境

set -e

echo "🔄 重置台灣智慧交通開發環境..."

# 停止並移除所有容器和卷
docker-compose -f docker-compose.dev.yml down -v --remove-orphans

# 重新建構映像
echo "🔨 重新建構映像..."
docker-compose -f docker-compose.dev.yml build --no-cache

# 重新啟動
echo "🚀 重新啟動服務..."
docker-compose -f docker-compose.dev.yml up -d

echo "✅ 開發環境已重置並重新啟動"
