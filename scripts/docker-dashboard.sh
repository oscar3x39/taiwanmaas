#!/bin/bash

# 📊 Docker 監控儀表板

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

show_dashboard() {
    clear
    echo -e "${BLUE}🐳 台灣智慧交通系統 - Docker 監控儀表板${NC}"
    echo "=================================================="
    echo -e "更新時間: $(date)"
    echo ""
    
    # 容器狀態
    echo -e "${YELLOW}📦 容器狀態:${NC}"
    docker-compose -f docker-compose.dev.yml ps
    echo ""
    
    # 資源使用情況
    echo -e "${YELLOW}💻 資源使用情況:${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}"
    echo ""
    
    # 健康檢查狀態
    echo -e "${YELLOW}🏥 健康檢查狀態:${NC}"
    
    # 後端健康檢查
    if curl -f -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 後端 API: 正常${NC}"
    else
        echo -e "${RED}❌ 後端 API: 異常${NC}"
    fi
    
    # 前端健康檢查
    if curl -f -s http://localhost:8080/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 前端應用: 正常${NC}"
    else
        echo -e "${RED}❌ 前端應用: 異常${NC}"
    fi
    
    # Redis 健康檢查
    if docker-compose -f docker-compose.dev.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Redis: 正常${NC}"
    else
        echo -e "${RED}❌ Redis: 異常${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}🔗 快速連結:${NC}"
    echo -e "   前端應用: http://localhost:8080"
    echo -e "   後端 API: http://localhost:3000"
    echo -e "   API 文件: http://localhost:3000/api-docs"
    echo ""
    echo -e "按 Ctrl+C 退出監控"
}

# 持續監控
while true; do
    show_dashboard
    sleep 5
done
