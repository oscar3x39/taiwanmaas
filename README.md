# 🚇 台灣智慧交通路線規劃系統

一個使用 React + TypeScript 開發的交通路線規劃演示系統。

## 🚀 快速啟動

```bash
./start-demo.sh
```

系統將自動啟動：
- 🌐 前端: http://localhost:8080
- 🔧 後端: http://localhost:19999

## 💻 技術棧

- **前端**: React 18 + TypeScript + Tailwind CSS + Vite
- **後端**: Node.js + Express
- **地圖**: React Leaflet + OpenStreetMap
- **狀態管理**: Redux Toolkit
- **動畫**: Framer Motion

## 📁 專案結構

```
taiwanmaas/
├── 📁 backend/          # Node.js 後端
│   ├── package.json
│   └── test-server.js
├── 📁 frontend/         # React 前端
│   ├── 📁 src/          # 源代碼
│   ├── package.json
│   └── vite.config.ts
├── 📁 docs/             # 文檔
├── README.md
└── start-demo.sh        # 一鍵啟動
```

## 🎯 功能特色

- 🗺️ 互動式地圖 (React Leaflet)
- 🚇 多模式路線規劃 (捷運、公車、步行)
- 📱 響應式設計 (手機、平板、桌面)
- ⚡ 即時路線計算和費用估算
- 🎨 現代化 UI/UX 設計