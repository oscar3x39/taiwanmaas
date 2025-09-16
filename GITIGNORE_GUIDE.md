# 📋 .gitignore 設定指南

## 🎯 概述

這個 `.gitignore` 檔案專為**台灣交通路線規劃系統**設計，涵蓋了 Node.js、TypeScript、Docker 等技術棧的常見忽略需求。

## 🗂️ 忽略類別

### 📦 依賴與套件管理
```
node_modules/           # Node.js 依賴
npm-debug.log*         # npm 除錯日誌
yarn-debug.log*        # Yarn 除錯日誌
pnpm-debug.log*        # pnpm 除錯日誌
```

### 🌍 環境變數與設定
```
.env.local             # 本地環境變數
.env.development.local # 開發環境變數
.env.production.local  # 生產環境變數
.env.staging          # 測試環境變數
config/keys.json      # API 金鑰設定
secrets/              # 敏感資料目錄
```

### 🏗️ 建置輸出
```
dist/                 # 編譯輸出
build/                # 建置輸出
backend/dist/         # 後端編譯檔案
frontend/build/       # 前端建置檔案
*.tsbuildinfo         # TypeScript 建置資訊
```

### 📝 日誌與執行資料
```
logs/                 # 日誌目錄
*.log                 # 所有日誌檔案
pids/                 # 程序 ID 檔案
*.pid                 # 程序 ID
```

### 🧪 測試與覆蓋率
```
coverage/             # 測試覆蓋率報告
test-results/         # 測試結果
.nyc_output          # NYC 覆蓋率工具輸出
```

### 🐳 Docker 相關
```
docker-compose.override.yml  # Docker Compose 覆寫
docker-data/                 # Docker 資料目錄
volumes/                     # Docker 卷宗
```

### 🗄️ 資料庫與快取
```
dump.rdb              # Redis 資料檔
redis-data/           # Redis 資料目錄
*.sqlite              # SQLite 資料庫
mongodb-data/         # MongoDB 資料
```

### 💻 作業系統檔案
```
.DS_Store             # macOS 系統檔案
Thumbs.db             # Windows 縮圖快取
*~                    # Linux 備份檔案
```

### 🛠️ IDE 與編輯器
```
.vscode/settings.json # VS Code 個人設定
.idea/                # IntelliJ IDEA 設定
*.swp                 # Vim 交換檔案
```

### 🎯 專案特定忽略
```
cache/transport-data/ # 交通資料快取
cache/map-tiles/      # 地圖圖資快取
test-data/generated/  # 產生的測試資料
scripts/generated/    # 產生的腳本檔案
```

## 🔧 使用方式

### 驗證 .gitignore 設定
```bash
# 執行驗證腳本
./scripts/verify-gitignore.sh
```

### 檢查特定檔案是否被忽略
```bash
# 檢查單一檔案
git check-ignore backend/node_modules

# 檢查多個檔案
git check-ignore backend/node_modules frontend/node_modules backend/dist
```

### 查看被忽略的檔案
```bash
# 顯示所有被忽略的檔案
git status --ignored

# 只顯示被忽略的檔案
git status --ignored --porcelain | grep '^!!'
```

## ⚠️ 重要注意事項

### 🔒 安全考量
- **絕對不要**提交包含 API 金鑰的檔案
- **絕對不要**提交 `.env` 檔案（除了 `.env.example`）
- **絕對不要**提交 SSL 憑證或私鑰

### 📦 套件管理
- 只保留一種 lock 檔案類型（npm、yarn 或 pnpm）
- `node_modules` 永遠不應該被提交

### 🏗️ 建置檔案
- 編譯後的檔案不應該被提交
- 只提交原始碼，讓 CI/CD 處理建置

## 🛠️ 自訂設定

### 添加新的忽略規則
```bash
# 編輯 .gitignore
echo "my-custom-file.txt" >> .gitignore

# 或直接編輯檔案
vim .gitignore
```

### 移除已追蹤的檔案
```bash
# 如果檔案已經被 Git 追蹤，需要先移除
git rm --cached filename

# 移除整個目錄
git rm -r --cached directory/
```

### 強制添加被忽略的檔案
```bash
# 如果真的需要添加被忽略的檔案
git add -f filename
```

## 📋 檢查清單

在提交程式碼前，確認：

- [ ] 沒有 `node_modules` 被提交
- [ ] 沒有 `.env` 檔案被提交
- [ ] 沒有編譯後的檔案被提交
- [ ] 沒有日誌檔案被提交
- [ ] 沒有個人 IDE 設定被提交
- [ ] 沒有作業系統產生的檔案被提交

## 🔍 常見問題

### Q: 為什麼我的 .env 檔案還是被追蹤？
A: 如果檔案已經被 Git 追蹤，需要先移除：
```bash
git rm --cached .env
git commit -m "Remove .env from tracking"
```

### Q: 如何檢查哪些檔案被忽略了？
A: 使用驗證腳本或 Git 命令：
```bash
./scripts/verify-gitignore.sh
# 或
git status --ignored
```

### Q: 可以忽略特定副檔名嗎？
A: 可以，使用萬用字元：
```
*.log    # 忽略所有 .log 檔案
*.tmp    # 忽略所有 .tmp 檔案
```

### Q: 如何忽略除了特定檔案外的所有檔案？
A: 使用否定模式：
```
# 忽略 logs 目錄下的所有檔案
logs/*
# 但保留 logs/README.md
!logs/README.md
```

## 🎉 最佳實踐

1. **定期檢查**：使用驗證腳本定期檢查設定
2. **團隊一致**：確保團隊成員使用相同的 .gitignore
3. **文件化**：記錄特殊的忽略規則原因
4. **安全第一**：永遠不要提交敏感資料
5. **保持更新**：隨著專案發展更新忽略規則

---

💡 **提示**：這個 .gitignore 檔案是為台灣交通路線規劃系統特別設計的，可以根據專案需求進行調整。