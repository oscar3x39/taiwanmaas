#!/bin/bash

echo "🚀 啟動台北交通路線規劃系統"
echo "================================"

# 檢查並停止現有進程
echo "📋 檢查現有進程..."
pkill -f "test-server.js" 2>/dev/null
pkill -f "frontend.*server.js" 2>/dev/null

# 啟動後端
echo "🔧 啟動後端服務器 (Port 19999)..."
cd backend && node test-server.js &
BACKEND_PID=$!

# 等待後端啟動
sleep 3

# 檢查後端是否正常
if curl -s http://localhost:19999/health > /dev/null; then
    echo "✅ 後端服務器啟動成功"
else
    echo "❌ 後端服務器啟動失敗"
    exit 1
fi

# 啟動前端
echo "🌐 啟動前端服務器 (Port 8888)..."
cd ../frontend && npm start &
FRONTEND_PID=$!

# 等待前端啟動
sleep 3

# 檢查前端是否正常
if curl -s -I http://localhost:8888 > /dev/null; then
    echo "✅ 前端服務器啟動成功"
else
    echo "❌ 前端服務器啟動失敗"
    exit 1
fi

echo ""
echo "🎉 系統啟動完成！"
echo "================================"
echo "🌐 前端網址: http://localhost:8888"
echo "🔧 後端API: http://localhost:19999"
echo "📚 API文件: http://localhost:19999/api-docs (如果使用完整後端)"
echo ""
echo "📍 預設路線: 台北車站 → 南港車站"
echo "🗺️  使用免費的OpenStreetMap地圖"
echo "🚇 包含真實台北捷運路線資料"
echo "🛣️  支援真實道路路線規劃"
echo ""
echo "按 Ctrl+C 停止所有服務"

# 等待用戶中斷
trap 'echo ""; echo "🛑 正在停止服務..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "✅ 所有服務已停止"; exit 0' INT

# 保持腳本運行
wait