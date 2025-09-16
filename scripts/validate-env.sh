#!/bin/bash

# 🤖 AI-Generated Environment Validation Script
# 📝 展示完整的環境驗證和配置檢查
# 
# 🚀 驗證特色：
# ✅ 環境變數完整性檢查
# ✅ 依賴工具版本驗證
# ✅ 配置檔案語法檢查
# ✅ 自動修復建議

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 環境配置驗證工具${NC}"
echo "=================================================="

# 檢查必要工具
check_required_tools() {
    echo -e "\n${YELLOW}🛠️ 檢查必要工具:${NC}"
    
    local tools=("docker" "node" "npm" "curl" "git")
    local missing_tools=()
    
    for tool in "${tools[@]}"; do
        if command -v $tool &> /dev/null; then
            version=$($tool --version 2>/dev/null | head -1)
            echo -e "${GREEN}✅ $tool: $version${NC}"
        else
            echo -e "${RED}❌ $tool: 未安裝${NC}"
            missing_tools+=($tool)
        fi
    done
    
    # 檢查 Docker Compose
    if command -v docker-compose &> /dev/null; then
        version=$(docker-compose --version)
        echo -e "${GREEN}✅ docker-compose: $version${NC}"
    elif docker compose version &> /dev/null 2>&1; then
        version=$(docker compose version)
        echo -e "${GREEN}✅ docker compose: $version${NC}"
    else
        echo -e "${RED}❌ docker-compose: 未安裝${NC}"
        missing_tools+=("docker-compose")
    fi
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        echo -e "\n${RED}🚨 缺少必要工具: ${missing_tools[*]}${NC}"
        echo -e "${YELLOW}請安裝缺少的工具後重新執行${NC}"
        return 1
    fi
}

# 檢查 Node.js 版本
check_node_version() {
    echo -e "\n${YELLOW}📦 檢查 Node.js 版本:${NC}"
    
    if command -v node &> /dev/null; then
        node_version=$(node --version | sed 's/v//')
        required_version="18.0.0"
        
        if [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" = "$required_version" ]; then
            echo -e "${GREEN}✅ Node.js 版本符合要求: v$node_version (>= v$required_version)${NC}"
        else
            echo -e "${RED}❌ Node.js 版本過舊: v$node_version (需要 >= v$required_version)${NC}"
            echo -e "${YELLOW}💡 建議使用 nvm 安裝最新版本: nvm install 20${NC}"
        fi
    fi
}

# 檢查環境變數
check_environment_variables() {
    echo -e "\n${YELLOW}🔧 檢查環境變數:${NC}"
    
    # 檢查 .env 檔案是否存在
    if [ ! -f .env ]; then
        echo -e "${RED}❌ .env 檔案不存在${NC}"
        echo -e "${YELLOW}💡 建議執行: cp .env.example .env${NC}"
        return 1
    fi
    
    # 載入環境變數
    source .env
    
    # 必要的環境變數
    local required_vars=("GOOGLE_MAPS_API_KEY" "NODE_ENV")
    local optional_vars=("BACKEND_PORT" "FRONTEND_PORT" "REDIS_PORT" "LOG_LEVEL")
    
    echo -e "\n必要環境變數:"
    for var in "${required_vars[@]}"; do
        if [ ! -z "${!var}" ]; then
            # 隱藏敏感資訊
            if [[ $var == *"KEY"* ]] || [[ $var == *"SECRET"* ]] || [[ $var == *"PASSWORD"* ]]; then
                echo -e "${GREEN}✅ $var: ****${NC}"
            else
                echo -e "${GREEN}✅ $var: ${!var}${NC}"
            fi
        else
            echo -e "${RED}❌ $var: 未設定${NC}"
        fi
    done
    
    echo -e "\n可選環境變數:"
    for var in "${optional_vars[@]}"; do
        if [ ! -z "${!var}" ]; then
            echo -e "${GREEN}✅ $var: ${!var}${NC}"
        else
            echo -e "${YELLOW}⚠️ $var: 使用預設值${NC}"
        fi
    done
}

# 檢查 Docker 配置
check_docker_config() {
    echo -e "\n${YELLOW}🐳 檢查 Docker 配置:${NC}"
    
    # 檢查 Docker 是否運行
    if ! docker info &> /dev/null; then
        echo -e "${RED}❌ Docker 守護程式未運行${NC}"
        echo -e "${YELLOW}💡 請啟動 Docker Desktop 或 Docker 服務${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Docker 守護程式正在運行${NC}"
    
    # 檢查 Docker Compose 檔案語法
    local compose_files=("docker-compose.yml" "docker-compose.dev.yml")
    
    for file in "${compose_files[@]}"; do
        if [ -f "$file" ]; then
            if docker-compose -f "$file" config &> /dev/null; then
                echo -e "${GREEN}✅ $file 語法正確${NC}"
            else
                echo -e "${RED}❌ $file 語法錯誤${NC}"
                echo -e "${YELLOW}💡 請檢查 YAML 語法${NC}"
            fi
        fi
    done
}

# 檢查網路連接
check_network_connectivity() {
    echo -e "\n${YELLOW}🌐 檢查網路連接:${NC}"
    
    # 檢查基本網路連接
    if curl -f -s --max-time 5 "https://www.google.com" > /dev/null; then
        echo -e "${GREEN}✅ 網際網路連接正常${NC}"
    else
        echo -e "${RED}❌ 網際網路連接失敗${NC}"
        return 1
    fi
    
    # 檢查 Docker Hub 連接
    if curl -f -s --max-time 5 "https://hub.docker.com" > /dev/null; then
        echo -e "${GREEN}✅ Docker Hub 連接正常${NC}"
    else
        echo -e "${YELLOW}⚠️ Docker Hub 連接可能有問題${NC}"
    fi
    
    # 檢查 Google Maps API (如果有設定)
    if [ ! -z "$GOOGLE_MAPS_API_KEY" ] && [ "$GOOGLE_MAPS_API_KEY" != "your_google_maps_api_key_here" ]; then
        if curl -f -s --max-time 10 "https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}" > /dev/null; then
            echo -e "${GREEN}✅ Google Maps API 連接正常${NC}"
        else
            echo -e "${RED}❌ Google Maps API 連接失敗或 API Key 無效${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ Google Maps API Key 未設定或使用預設值${NC}"
    fi
}

# 檢查專案結構
check_project_structure() {
    echo -e "\n${YELLOW}📁 檢查專案結構:${NC}"
    
    local required_dirs=("backend" "frontend" "scripts")
    local required_files=("docker-compose.yml" "docker-compose.dev.yml" ".env.example" "Makefile")
    
    echo -e "\n必要目錄:"
    for dir in "${required_dirs[@]}"; do
        if [ -d "$dir" ]; then
            echo -e "${GREEN}✅ $dir/${NC}"
        else
            echo -e "${RED}❌ $dir/${NC}"
        fi
    done
    
    echo -e "\n必要檔案:"
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            echo -e "${GREEN}✅ $file${NC}"
        else
            echo -e "${RED}❌ $file${NC}"
        fi
    done
    
    # 檢查 package.json 檔案
    echo -e "\npackage.json 檔案:"
    for dir in "backend" "frontend"; do
        if [ -f "$dir/package.json" ]; then
            echo -e "${GREEN}✅ $dir/package.json${NC}"
            
            # 檢查 package.json 語法
            if node -e "JSON.parse(require('fs').readFileSync('$dir/package.json', 'utf8'))" &> /dev/null; then
                echo -e "   語法正確"
            else
                echo -e "${RED}   ❌ 語法錯誤${NC}"
            fi
        else
            echo -e "${RED}❌ $dir/package.json${NC}"
        fi
    done
}

# 檢查端口可用性
check_port_availability() {
    echo -e "\n${YELLOW}🔌 檢查端口可用性:${NC}"
    
    local ports=("3000" "8080" "6379")
    local port_names=("後端 API" "前端應用" "Redis")
    
    for i in "${!ports[@]}"; do
        port="${ports[$i]}"
        name="${port_names[$i]}"
        
        if lsof -i :$port &> /dev/null; then
            process=$(lsof -i :$port | tail -1 | awk '{print $1}')
            echo -e "${YELLOW}⚠️ 端口 $port ($name) 被 $process 占用${NC}"
        else
            echo -e "${GREEN}✅ 端口 $port ($name) 可用${NC}"
        fi
    done
}

# 生成驗證報告
generate_validation_report() {
    echo -e "\n${BLUE}📋 環境驗證報告${NC}"
    echo "=================================================="
    
    local total_checks=6
    local passed_checks=0
    
    # 重新執行檢查並計算通過的項目
    if check_required_tools &> /dev/null; then ((passed_checks++)); fi
    if check_environment_variables &> /dev/null; then ((passed_checks++)); fi
    if check_docker_config &> /dev/null; then ((passed_checks++)); fi
    if check_network_connectivity &> /dev/null; then ((passed_checks++)); fi
    if check_project_structure &> /dev/null; then ((passed_checks++)); fi
    if check_port_availability &> /dev/null; then ((passed_checks++)); fi
    
    local success_rate=$((passed_checks * 100 / total_checks))
    
    echo -e "檢查項目: $passed_checks/$total_checks 通過"
    echo -e "成功率: $success_rate%"
    
    if [ $success_rate -eq 100 ]; then
        echo -e "${GREEN}🎉 環境配置完美！可以開始開發${NC}"
    elif [ $success_rate -ge 80 ]; then
        echo -e "${YELLOW}⚠️ 環境配置良好，但有些項目需要注意${NC}"
    else
        echo -e "${RED}🚨 環境配置需要修復才能正常運行${NC}"
    fi
    
    echo -e "\n${BLUE}🚀 快速開始指令:${NC}"
    echo -e "   make setup    # 初始化環境"
    echo -e "   make dev      # 啟動開發環境"
    echo -e "   make health   # 檢查服務狀態"
}

# 主要執行流程
main() {
    check_required_tools
    check_node_version
    check_environment_variables
    check_docker_config
    check_network_connectivity
    check_project_structure
    check_port_availability
    generate_validation_report
}

# 執行主程式
main "$@"