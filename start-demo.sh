#!/bin/bash

echo "🚀 啟動台灣智慧交通路線規劃系統 (React.js 版本)"
echo "================================================"

# 檢查並停止現有進程
echo "📋 檢查現有進程..."
pkill -f "test-server.js" 2>/dev/null
pkill -f "vite" 2>/dev/null
pkill -f "frontend.*server.js" 2>/dev/null

# 檢查 Node.js 版本
echo "🔍 檢查 Node.js 版本..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ 需要 Node.js 18 或更高版本，當前版本: $(node -v)"
    echo "請升級 Node.js: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js 版本: $(node -v)"

# 檢查前端依賴
echo "📦 檢查前端依賴..."
if [ ! -d "frontend/node_modules" ]; then
    echo "🔧 安裝前端依賴..."
    cd frontend && npm install
    if [ $? -ne 0 ]; then
        echo "❌ 前端依賴安裝失敗"
        exit 1
    fi
    cd ..
fi

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
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# 啟動前端 (React + Vite)
echo "🌐 啟動 React 前端服務器 (Port 8080)..."
cd frontend && npm run dev &
FRONTEND_PID=$!

# 等待前端啟動 (Vite 需要更長時間)
echo "⏳ 等待 React 應用啟動..."
sleep 8

# 檢查前端是否正常
FRONTEND_CHECK=0
for i in {1..10}; do
    if curl -s -I http://localhost:8080 > /dev/null; then
        echo "✅ React 前端服務器啟動成功"
        FRONTEND_CHECK=1
        break
    fi
    echo "⏳ 等待前端啟動... ($i/10)"
    sleep 2
done

if [ $FRONTEND_CHECK -eq 0 ]; then
    echo "❌ React 前端服務器啟動失敗"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 React 系統啟動完成！"
echo "================================================"
echo "🌐 React 前端: http://localhost:8080"
echo "🔧 後端 API: http://localhost:19999"
echo "📚 健康檢查: http://localhost:19999/health"
echo ""
echo "🚀 技術棧:"
echo "   • React 18 + TypeScript"
echo "   • Redux Toolkit 狀態管理"
echo "   • React Leaflet 地圖"
echo "   • Framer Motion 動畫"
echo "   • Tailwind CSS 樣式"
echo "   • Vite 開發伺服器"
echo ""
echo "📍 預設測試路線: 台北車站 → 南港車站"
echo "🗺️  使用 OpenStreetMap 免費地圖"
echo "🚇 包含真實台北捷運路線資料"
echo "🛣️  支援多種交通工具路線規劃"
echo ""
echo "🤖 AI 輔助開發展示:"
echo "   • 85% 程式碼由 AI 生成"
echo "   • 完整 TypeScript 類型安全"
echo "   • 現代化 React 最佳實踐"
echo ""
echo "按 Ctrl+C 停止所有服務"

# 等待用戶中斷
trap 'echo ""; echo "🛑 正在停止服務..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "✅ 所有服務已停止"; exit 0' INT

# 保持腳本運行
wait