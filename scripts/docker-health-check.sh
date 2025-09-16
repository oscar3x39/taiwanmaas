#!/bin/bash

# 🤖 AI-Generated Docker Health Check Script
# 📝 展示完整的 Docker 服務健康監控
# 
# 🚀 健康檢查特色：
# ✅ 多層級健康檢查
# ✅ 自動故障診斷
# ✅ 效能監控和警告
# ✅ 自動修復建議

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏥 Docker 服務健康檢查${NC}"
echo "=================================================="

# 全域變數
HEALTH_SCORE=0
TOTAL_CHECKS=0
FAILED_SERVICES=()
WARNING_SERVICES=()

# 增加檢查計數
increment_check() {
    ((TOTAL_CHECKS++))
}

# 增加健康分數
increment_score() {
    ((HEALTH_SCORE++))
}

# 記錄失敗服務
add_failed_service() {
    FAILED_SERVICES+=("$1")
}

# 記錄警告服務
add_warning_service() {
    WARNING_SERVICES+=("$1")
}

# 檢查 Docker 守護程式
check_docker_daemon() {
    echo -e "\n${YELLOW}🐳 檢查 Docker 守護程式...${NC}"
    increment_check
    
    if docker info &> /dev/null; then
        echo -e "${GREEN}✅ Docker 守護程式正在運行${NC}"
        increment_score
        
        # 檢查 Docker 版本
        docker_version=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        echo -e "   Docker 版本: ${docker_version}"
        
        # 檢查 Docker Compose 版本
        if command -v docker-compose &> /dev/null; then
            compose_version=$(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)
            echo -e "   Docker Compose 版本: ${compose_version}"
        elif docker compose version &> /dev/null 2>&1; then
            compose_version=$(docker compose version --short)
            echo -e "   Docker Compose 版本: ${compose_version}"
        fi
    else
        echo -e "${RED}❌ Docker 守護程式未運行${NC}"
        add_failed_service "Docker Daemon"
        echo -e "${YELLOW}💡 請啟動 Docker Desktop 或 Docker 服務${NC}"
    fi
}

# 檢查容器狀態
check_container_status() {
    echo -e "\n${YELLOW}📦 檢查容器狀態...${NC}"
    
    local containers=("taiwan-transport-backend-dev" "taiwan-transport-frontend-dev" "taiwan-transport-redis-dev")
    
    for container in "${containers[@]}"; do
        increment_check
        
        if docker ps --format "{{.Names}}" | grep -q "^${container}$"; then
            status=$(docker inspect --format='{{.State.Status}}' "$container")
            health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "none")
            
            if [ "$status" = "running" ]; then
                if [ "$health" = "healthy" ] || [ "$health" = "none" ]; then
                    echo -e "${GREEN}✅ ${container}: 運行中${NC}"
                    increment_score
                else
                    echo -e "${YELLOW}⚠️ ${container}: 運行中但健康檢查失敗 (${health})${NC}"
                    add_warning_service "$container"
                fi
            else
                echo -e "${RED}❌ ${container}: ${status}${NC}"
                add_failed_service "$container"
            fi
        else
            echo -e "${RED}❌ ${container}: 不存在或未運行${NC}"
            add_failed_service "$container"
        fi
    done
}

# 檢查服務端點
check_service_endpoints() {
    echo -e "\n${YELLOW}🌐 檢查服務端點...${NC}"
    
    # 後端 API 檢查
    increment_check
    if curl -f -s --max-time 10 "http://localhost:3000/api/health" > /dev/null 2>&1; then
        response_time=$(curl -o /dev/null -s -w '%{time_total}' "http://localhost:3000/api/health")
        echo -e "${GREEN}✅ 後端 API: 正常 (${response_time}s)${NC}"
        increment_score
        
        # 檢查 API 回應內容
        api_response=$(curl -s "http://localhost:3000/api/health" 2>/dev/null)
        if [ ! -z "$api_response" ]; then
            echo -e "   回應: ${api_response}"
        fi
    else
        echo -e "${RED}❌ 後端 API: 無法連接${NC}"
        add_failed_service "Backend API")
    fi
    
    # 前端應用檢查
    increment_check
    if curl -f -s --max-time 10 "http://localhost:8080/health" > /dev/null 2>&1; then
        response_time=$(curl -o /dev/null -s -w '%{time_total}' "http://localhost:8080/health")
        echo -e "${GREEN}✅ 前端應用: 正常 (${response_time}s)${NC}"
        increment_score
    else
        echo -e "${RED}❌ 前端應用: 無法連接${NC}"
        add_failed_service "Frontend App")
    fi
    
    # Redis 檢查
    increment_check
    if docker exec taiwan-transport-redis-dev redis-cli ping > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Redis: 正常${NC}"
        increment_score
        
        # 檢查 Redis 資訊
        redis_info=$(docker exec taiwan-transport-redis-dev redis-cli info server | grep redis_version | cut -d: -f2 | tr -d '\r')
        memory_info=$(docker exec taiwan-transport-redis-dev redis-cli info memory | grep used_memory_human | cut -d: -f2 | tr -d '\r')
        echo -e "   版本: ${redis_info}"
        echo -e "   記憶體使用: ${memory_info}"
    else
        echo -e "${RED}❌ Redis: 無法連接${NC}"
        add_failed_service "Redis")
    fi
}

# 檢查資源使用情況
check_resource_usage() {
    echo -e "\n${YELLOW}💻 檢查資源使用情況...${NC}"
    
    # 檢查容器資源使用
    if docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" 2>/dev/null | grep -q "taiwan-transport"; then
        echo -e "容器資源使用:"
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | grep -E "(CONTAINER|taiwan-transport)"
        
        # 檢查高資源使用警告
        high_cpu=$(docker stats --no-stream --format "{{.Container}}\t{{.CPUPerc}}" | grep "taiwan-transport" | awk -F'\t' '$2+0 > 80 {print $1}')
        if [ ! -z "$high_cpu" ]; then
            echo -e "${YELLOW}⚠️ 高 CPU 使用率容器: ${high_cpu}${NC}"
            add_warning_service "High CPU Usage")
        fi
        
        high_memory=$(docker stats --no-stream --format "{{.Container}}\t{{.MemPerc}}" | grep "taiwan-transport" | awk -F'\t' '$2+0 > 80 {print $1}')
        if [ ! -z "$high_memory" ]; then
            echo -e "${YELLOW}⚠️ 高記憶體使用率容器: ${high_memory}${NC}"
            add_warning_service "High Memory Usage")
        fi
    fi
    
    # 檢查 Docker 系統使用
    echo -e "\nDocker 系統使用:"
    docker system df
}

# 檢查網路連接
check_network_connectivity() {
    echo -e "\n${YELLOW}🔗 檢查網路連接...${NC}"
    
    # 檢查容器間網路
    increment_check
    if docker network inspect taiwan-transport_app-network &> /dev/null; then
        echo -e "${GREEN}✅ Docker 網路: 正常${NC}"
        increment_score
        
        # 檢查網路中的容器
        network_containers=$(docker network inspect taiwan-transport_app-network --format '{{range .Containers}}{{.Name}} {{end}}')
        echo -e "   網路中的容器: ${network_containers}"
    else
        echo -e "${RED}❌ Docker 網路: 異常${NC}"
        add_failed_service "Docker Network")
    fi
    
    # 檢查外部網路連接
    increment_check
    if curl -f -s --max-time 5 "https://www.google.com" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 外部網路: 正常${NC}"
        increment_score
    else
        echo -e "${RED}❌ 外部網路: 連接失敗${NC}"
        add_failed_service "External Network")
    fi
}

# 檢查日誌錯誤
check_logs_for_errors() {
    echo -e "\n${YELLOW}📋 檢查服務日誌...${NC}"
    
    local services=("backend" "frontend" "redis")
    
    for service in "${services[@]}"; do
        echo -e "\n檢查 ${service} 日誌中的錯誤..."
        
        # 獲取最近的錯誤日誌
        error_count=$(docker-compose -f docker-compose.dev.yml logs --tail=100 "$service" 2>/dev/null | grep -i -E "(error|exception|failed|fatal)" | wc -l)
        
        if [ "$error_count" -gt 0 ]; then
            echo -e "${YELLOW}⚠️ ${service}: 發現 ${error_count} 個錯誤訊息${NC}"
            add_warning_service "${service} logs")
            
            # 顯示最近的錯誤
            echo -e "最近的錯誤:"
            docker-compose -f docker-compose.dev.yml logs --tail=10 "$service" 2>/dev/null | grep -i -E "(error|exception|failed|fatal)" | tail -3
        else
            echo -e "${GREEN}✅ ${service}: 無錯誤訊息${NC}"
        fi
    done
}

# 效能基準測試
performance_benchmark() {
    echo -e "\n${YELLOW}⚡ 效能基準測試...${NC}"
    
    # API 回應時間測試
    echo -e "測試 API 回應時間..."
    api_times=()
    for i in {1..5}; do
        if response_time=$(curl -o /dev/null -s -w '%{time_total}' "http://localhost:3000/api/health" 2>/dev/null); then
            api_times+=($response_time)
        fi
    done
    
    if [ ${#api_times[@]} -gt 0 ]; then
        avg_time=$(echo "${api_times[@]}" | awk '{sum=0; for(i=1;i<=NF;i++)sum+=$i; print sum/NF}')
        echo -e "   API 平均回應時間: ${avg_time}s"
        
        if (( $(echo "$avg_time > 2.0" | bc -l) )); then
            echo -e "${YELLOW}⚠️ API 回應時間較慢${NC}"
            add_warning_service "Slow API Response")
        fi
    fi
    
    # 前端載入時間測試
    echo -e "測試前端載入時間..."
    if frontend_time=$(curl -o /dev/null -s -w '%{time_total}' "http://localhost:8080/" 2>/dev/null); then
        echo -e "   前端載入時間: ${frontend_time}s"
        
        if (( $(echo "$frontend_time > 3.0" | bc -l) )); then
            echo -e "${YELLOW}⚠️ 前端載入時間較慢${NC}"
            add_warning_service "Slow Frontend Loading")
        fi
    fi
}

# 生成健康報告
generate_health_report() {
    echo -e "\n${BLUE}📊 健康檢查報告${NC}"
    echo "=================================================="
    
    # 計算健康分數
    if [ $TOTAL_CHECKS -gt 0 ]; then
        health_percentage=$((HEALTH_SCORE * 100 / TOTAL_CHECKS))
    else
        health_percentage=0
    fi
    
    echo -e "檢查項目: ${HEALTH_SCORE}/${TOTAL_CHECKS}"
    echo -e "健康分數: ${health_percentage}%"
    
    # 根據分數顯示狀態
    if [ $health_percentage -eq 100 ]; then
        echo -e "${GREEN}🎉 系統狀態: 優秀${NC}"
    elif [ $health_percentage -ge 80 ]; then
        echo -e "${GREEN}✅ 系統狀態: 良好${NC}"
    elif [ $health_percentage -ge 60 ]; then
        echo -e "${YELLOW}⚠️ 系統狀態: 需要注意${NC}"
    else
        echo -e "${RED}🚨 系統狀態: 需要修復${NC}"
    fi
    
    # 顯示失敗的服務
    if [ ${#FAILED_SERVICES[@]} -gt 0 ]; then
        echo -e "\n${RED}❌ 失敗的服務:${NC}"
        for service in "${FAILED_SERVICES[@]}"; do
            echo -e "   - $service"
        done
    fi
    
    # 顯示警告的服務
    if [ ${#WARNING_SERVICES[@]} -gt 0 ]; then
        echo -e "\n${YELLOW}⚠️ 需要注意的服務:${NC}"
        for service in "${WARNING_SERVICES[@]}"; do
            echo -e "   - $service"
        done
    fi
    
    echo -e "\n${BLUE}🔗 快速連結:${NC}"
    echo -e "   前端應用: http://localhost:8080"
    echo -e "   後端 API: http://localhost:3000"
    echo -e "   API 文件: http://localhost:3000/api-docs"
    
    echo -e "\n${BLUE}💡 有用的指令:${NC}"
    echo -e "   make logs        # 查看詳細日誌"
    echo -e "   make restart     # 重啟服務"
    echo -e "   make dev-reset   # 完整重置"
    echo -e "   make dashboard   # 監控儀表板"
    
    echo -e "\n檢查完成時間: $(date)"
}

# 主要執行流程
main() {
    check_docker_daemon
    check_container_status
    check_service_endpoints
    check_resource_usage
    check_network_connectivity
    check_logs_for_errors
    performance_benchmark
    generate_health_report
}

# 執行主程式
main "$@"