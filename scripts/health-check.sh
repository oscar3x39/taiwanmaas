#!/bin/bash

# 🤖 AI-Generated Health Check Script
# 📝 展示完整的服務健康監控和診斷工具
# 
# 🚀 健康檢查特色：
# ✅ 多服務狀態檢查
# ✅ 詳細的診斷資訊
# ✅ 自動修復建議
# ✅ 彩色輸出和報告

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
BACKEND_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:8080"
REDIS_HOST="localhost"
REDIS_PORT="6379"

echo -e "${BLUE}🏥 台灣智慧交通系統 - 健康檢查${NC}"
echo "=================================================="

# 檢查 Docker 服務狀態
check_docker_services() {
    echo -e "\n${YELLOW}📊 Docker 服務狀態:${NC}"
    
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        echo -e "${RED}❌ Docker Compose 未安裝${NC}"
        return 1
    fi
    
    # 檢查開發環境容器
    if $COMPOSE_CMD -f docker-compose.dev.yml ps --services --filter "status=running" | grep -q .; then
        echo -e "${GREEN}✅ 開發環境容器正在運行${NC}"
        $COMPOSE_CMD -f docker-compose.dev.yml ps
    else
        echo -e "${RED}❌ 開發環境容器未運行${NC}"
        echo -e "${YELLOW}💡 建議執行: make dev${NC}"
    fi
}

# 檢查後端 API
check_backend() {
    echo -e "\n${YELLOW}🔧 後端 API 檢查:${NC}"
    
    if curl -f -s "${BACKEND_URL}/api/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 後端 API 正常運行${NC}"
        
        # 檢查 API 回應時間
        response_time=$(curl -o /dev/null -s -w '%{time_total}' "${BACKEND_URL}/api/health")
        echo -e "   回應時間: ${response_time}s"
        
        # 檢查 API 版本資訊
        if api_info=$(curl -s "${BACKEND_URL}/api/health" 2>/dev/null); then
            echo -e "   API 資訊: ${api_info}"
        fi
    else
        echo -e "${RED}❌ 後端 API 無法連接${NC}"
        echo -e "${YELLOW}💡 檢查項目:${NC}"
        echo -e "   - 容器是否運行: docker ps"
        echo -e "   - 日誌檢查: make logs-backend"
        echo -e "   - 端口是否被占用: lsof -i :3000"
    fi
}

# 檢查前端應用
check_frontend() {
    echo -e "\n${YELLOW}🎨 前端應用檢查:${NC}"
    
    if curl -f -s "${FRONTEND_URL}/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 前端應用正常運行${NC}"
        
        # 檢查回應時間
        response_time=$(curl -o /dev/null -s -w '%{time_total}' "${FRONTEND_URL}/health")
        echo -e "   回應時間: ${response_time}s"
    else
        echo -e "${RED}❌ 前端應用無法連接${NC}"
        echo -e "${YELLOW}💡 檢查項目:${NC}"
        echo -e "   - 容器是否運行: docker ps"
        echo -e "   - 日誌檢查: make logs-frontend"
        echo -e "   - 端口是否被占用: lsof -i :8080"
    fi
}

# 檢查 Redis
check_redis() {
    echo -e "\n${YELLOW}🗄️ Redis 檢查:${NC}"
    
    if command -v redis-cli &> /dev/null; then
        if redis-cli -h $REDIS_HOST -p $REDIS_PORT ping > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Redis 正常運行${NC}"
            
            # 檢查 Redis 資訊
            redis_info=$(redis-cli -h $REDIS_HOST -p $REDIS_PORT info server | grep redis_version)
            echo -e "   ${redis_info}"
            
            # 檢查記憶體使用
            memory_info=$(redis-cli -h $REDIS_HOST -p $REDIS_PORT info memory | grep used_memory_human)
            echo -e "   ${memory_info}"
        else
            echo -e "${RED}❌ Redis 無法連接${NC}"
        fi
    else
        # 使用 Docker 檢查 Redis
        if docker exec taiwan-transport-redis-dev redis-cli ping > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Redis (Docker) 正常運行${NC}"
        else
            echo -e "${RED}❌ Redis 無法連接${NC}"
            echo -e "${YELLOW}💡 檢查項目:${NC}"
            echo -e "   - Redis 容器狀態: docker ps | grep redis"
            echo -e "   - Redis 日誌: docker logs taiwan-transport-redis-dev"
        fi
    fi
}

# 檢查系統資源
check_system_resources() {
    echo -e "\n${YELLOW}💻 系統資源檢查:${NC}"
    
    # 檢查 CPU 使用率
    if command -v top &> /dev/null; then
        cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')
        echo -e "   CPU 使用率: ${cpu_usage}%"
    fi
    
    # 檢查記憶體使用
    if command -v free &> /dev/null; then
        memory_info=$(free -h | grep "Mem:")
        echo -e "   記憶體: ${memory_info}"
    elif command -v vm_stat &> /dev/null; then
        # macOS
        echo -e "   記憶體資訊: $(vm_stat | head -4)"
    fi
    
    # 檢查磁碟空間
    if command -v df &> /dev/null; then
        disk_usage=$(df -h / | tail -1 | awk '{print $5}')
        echo -e "   磁碟使用率: ${disk_usage}"
    fi
}

# 檢查網路連接
check_network() {
    echo -e "\n${YELLOW}🌐 網路連接檢查:${NC}"
    
    # 檢查 Google Maps API (如果有設定)
    if [ ! -z "$GOOGLE_MAPS_API_KEY" ]; then
        if curl -f -s "https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Google Maps API 連接正常${NC}"
        else
            echo -e "${RED}❌ Google Maps API 連接失敗${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ Google Maps API Key 未設定${NC}"
    fi
    
    # 檢查外部網路連接
    if curl -f -s "https://www.google.com" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 外部網路連接正常${NC}"
    else
        echo -e "${RED}❌ 外部網路連接失敗${NC}"
    fi
}

# 生成健康報告
generate_report() {
    echo -e "\n${BLUE}📋 健康檢查報告:${NC}"
    echo "=================================================="
    
    # 檢查所有服務
    services_ok=0
    total_services=4
    
    # 後端檢查
    if curl -f -s "${BACKEND_URL}/api/health" > /dev/null 2>&1; then
        ((services_ok++))
    fi
    
    # 前端檢查
    if curl -f -s "${FRONTEND_URL}/health" > /dev/null 2>&1; then
        ((services_ok++))
    fi
    
    # Redis 檢查
    if docker exec taiwan-transport-redis-dev redis-cli ping > /dev/null 2>&1; then
        ((services_ok++))
    fi
    
    # Docker 檢查
    if docker ps | grep -q "taiwan-transport"; then
        ((services_ok++))
    fi
    
    # 計算健康分數
    health_score=$((services_ok * 100 / total_services))
    
    if [ $health_score -eq 100 ]; then
        echo -e "${GREEN}🎉 系統健康狀態: 優秀 (${health_score}%)${NC}"
    elif [ $health_score -ge 75 ]; then
        echo -e "${YELLOW}⚠️ 系統健康狀態: 良好 (${health_score}%)${NC}"
    else
        echo -e "${RED}🚨 系統健康狀態: 需要注意 (${health_score}%)${NC}"
    fi
    
    echo -e "   運行中的服務: ${services_ok}/${total_services}"
    echo -e "   檢查時間: $(date)"
}

# 主要執行流程
main() {
    check_docker_services
    check_backend
    check_frontend
    check_redis
    check_system_resources
    check_network
    generate_report
    
    echo -e "\n${BLUE}🔗 有用的連結:${NC}"
    echo -e "   前端應用: ${FRONTEND_URL}"
    echo -e "   後端 API: ${BACKEND_URL}/api"
    echo -e "   API 文件: ${BACKEND_URL}/api-docs"
    echo -e "   健康檢查: ${BACKEND_URL}/api/health"
}

# 執行主程式
main "$@"