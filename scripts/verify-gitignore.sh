#!/bin/bash

# 🔍 Git 忽略設定驗證腳本
# 檢查重要檔案是否被正確忽略

echo "🔍 驗證 .gitignore 設定..."
echo "================================"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 檢查函數
check_ignored() {
    local file_path="$1"
    local description="$2"
    
    if [ -e "$file_path" ]; then
        if git check-ignore "$file_path" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $description${NC} - 已忽略"
        else
            echo -e "${RED}❌ $description${NC} - 未忽略 (可能需要檢查)"
        fi
    else
        echo -e "${YELLOW}⚠️  $description${NC} - 檔案不存在"
    fi
}

echo "📦 檢查依賴目錄..."
check_ignored "backend/node_modules" "後端 node_modules"
check_ignored "frontend/node_modules" "前端 node_modules"

echo ""
echo "🏗️ 檢查建置輸出..."
check_ignored "backend/dist" "後端編譯輸出"
check_ignored "frontend/build" "前端建置輸出"
check_ignored "frontend/dist" "前端編譯輸出"

echo ""
echo "📝 檢查日誌檔案..."
check_ignored "backend/logs" "後端日誌目錄"
check_ignored "backend/logs/error.log" "錯誤日誌"
check_ignored "backend/logs/combined.log" "綜合日誌"

echo ""
echo "🌍 檢查環境變數檔案..."
check_ignored ".env.local" "本地環境變數"
check_ignored ".env.development.local" "開發環境變數"
check_ignored ".env.production.local" "生產環境變數"
check_ignored "config/keys.json" "API 金鑰設定"

echo ""
echo "🐳 檢查 Docker 相關..."
check_ignored "docker-compose.override.yml" "Docker Compose 覆寫檔"
check_ignored "docker-data" "Docker 資料目錄"
check_ignored "volumes" "Docker 卷宗目錄"

echo ""
echo "🗄️ 檢查資料庫檔案..."
check_ignored "dump.rdb" "Redis 資料檔"
check_ignored "redis-data" "Redis 資料目錄"

echo ""
echo "💻 檢查作業系統檔案..."
check_ignored ".DS_Store" "macOS 系統檔案"
check_ignored "Thumbs.db" "Windows 系統檔案"

echo ""
echo "🛠️ 檢查 IDE 設定..."
check_ignored ".vscode/settings.json" "VS Code 個人設定"
check_ignored ".idea" "IntelliJ IDEA 設定"

echo ""
echo "🧹 檢查暫存檔案..."
check_ignored "tmp" "暫存目錄"
check_ignored "temp" "臨時目錄"
check_ignored "*.log" "日誌檔案"

echo ""
echo "🎯 檢查專案特定檔案..."
check_ignored "cache/transport-data" "交通資料快取"
check_ignored "cache/map-tiles" "地圖圖資快取"
check_ignored "test-data/generated" "測試資料"

echo ""
echo "================================"

# 檢查是否有不應該被追蹤的檔案
echo "🔍 檢查是否有不應該被追蹤的檔案..."

# 檢查 node_modules
if git ls-files | grep -q "node_modules"; then
    echo -e "${RED}❌ 發現 node_modules 檔案被追蹤！${NC}"
    git ls-files | grep "node_modules" | head -5
else
    echo -e "${GREEN}✅ node_modules 正確被忽略${NC}"
fi

# 檢查 .env 檔案
if git ls-files | grep -q "\.env\."; then
    echo -e "${RED}❌ 發現環境變數檔案被追蹤！${NC}"
    git ls-files | grep "\.env\." | head -5
else
    echo -e "${GREEN}✅ 環境變數檔案正確被忽略${NC}"
fi

# 檢查日誌檔案
if git ls-files | grep -q "\.log$"; then
    echo -e "${RED}❌ 發現日誌檔案被追蹤！${NC}"
    git ls-files | grep "\.log$" | head -5
else
    echo -e "${GREEN}✅ 日誌檔案正確被忽略${NC}"
fi

echo ""
echo "🎉 .gitignore 驗證完成！"