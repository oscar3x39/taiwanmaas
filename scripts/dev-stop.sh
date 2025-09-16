#!/bin/bash

# ⏹️ 快速停止開發環境

set -e

echo "⏹️ 停止台灣智慧交通開發環境..."

# 停止服務
docker-compose -f docker-compose.dev.yml down

echo "✅ 開發環境已停止"
