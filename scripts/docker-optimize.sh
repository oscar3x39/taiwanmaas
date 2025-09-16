#!/bin/bash

# 🤖 AI-Generated Docker Optimization Script
# 📝 展示 Docker 效能優化和維護最佳實踐
# 
# 🚀 優化特色：
# ✅ 映像和容器清理
# ✅ 快取優化和空間回收
# ✅ 效能監控和調優
# ✅ 安全性檢查和更新

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Docker 系統優化工具${NC}"
echo "=================================================="

# 顯示當前 Docker 使用情況
show_docker_usage() {
    echo -e "\n${YELLOW}📊 當前 Docker 使用情況:${NC}"
    
    echo -e "\n容器狀態:"
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Size}}"
    
    echo -e "\n映像大小:"
    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
    
    echo -e "\n系統使用情況:"
    docker system df
}

# 清理未使用的資源
cleanup_unused() {
    echo -e "\n${YELLOW}🧹 清理未使用的 Docker 資源...${NC}"
    
    # 清理停止的容器
    stopped_containers=$(docker ps -aq --filter "status=exited")
    if [ ! -z "$stopped_containers" ]; then
        echo -e "清理停止的容器..."
        docker rm $stopped_containers
        echo -e "${GREEN}✅ 已清理停止的容器${NC}"
    else
        echo -e "${GREEN}✅ 沒有停止的容器需要清理${NC}"
    fi
    
    # 清理未使用的映像
    echo -e "清理未使用的映像..."
    docker image prune -f
    echo -e "${GREEN}✅ 已清理未使用的映像${NC}"
    
    # 清理未使用的網路
    echo -e "清理未使用的網路..."
    docker network prune -f
    echo -e "${GREEN}✅ 已清理未使用的網路${NC}"
    
    # 清理未使用的卷
    echo -e "清理未使用的卷..."
    docker volume prune -f
    echo -e "${GREEN}✅ 已清理未使用的卷${NC}"
}

# 優化映像大小
optimize_images() {
    echo -e "\n${YELLOW}📦 優化映像大小...${NC}"
    
    # 重建映像以應用最新優化
    echo -e "重建後端映像..."
    docker build --no-cache -t taiwan-transport-backend:optimized ./backend
    
    echo -e "重建前端映像..."
    docker build --no-cache -t taiwan-transport-frontend:optimized ./frontend
    
    echo -e "${GREEN}✅ 映像優化完成${NC}"
}

# 檢查安全性
security_check() {
    echo -e "\n${YELLOW}🔒 安全性檢查...${NC}"
    
    # 檢查映像漏洞 (如果有 docker scan)
    if command -v docker &> /dev/null && docker scan --help &> /dev/null; then
        echo -e "掃描後端映像安全性..."
        docker scan taiwan-transport-backend:latest || true
        
        echo -e "掃描前端映像安全性..."
        docker scan taiwan-transport-frontend:latest || true
    else
        echo -e "${YELLOW}⚠️ Docker scan 不可用，跳過安全性掃描${NC}"
    fi
    
    # 檢查容器配置
    echo -e "檢查容器安全配置..."
    
    # 檢查是否以 root 用戶運行
    running_containers=$(docker ps --format "{{.Names}}")
    for container in $running_containers; do
        user=$(docker exec $container whoami 2>/dev/null || echo "unknown")
        if [ "$user" = "root" ]; then
            echo -e "${RED}⚠️ 容器 $container 以 root 用戶運行${NC}"
        else
            echo -e "${GREEN}✅ 容器 $container 以非 root 用戶運行 ($user)${NC}"
        fi
    done
}

# 效能調優
performance_tuning() {
    echo -e "\n${YELLOW}⚡ 效能調優...${NC}"
    
    # 檢查 Docker 守護程式配置
    echo -e "檢查 Docker 守護程式配置..."
    
    # 建議的 Docker 守護程式配置
    cat > /tmp/docker-daemon-suggestion.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ],
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  }
}
EOF
    
    echo -e "${YELLOW}建議的 Docker 守護程式配置已保存到 /tmp/docker-daemon-suggestion.json${NC}"
    echo -e "${YELLOW}請將此配置複製到 /etc/docker/daemon.json (需要 sudo 權限)${NC}"
    
    # 檢查系統資源
    echo -e "\n系統資源使用情況:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
}

# 建立監控腳本
create_monitoring() {
    echo -e "\n${YELLOW}📊 建立監控腳本...${NC}"
    
    cat > scripts/docker-monitor.sh << 'EOF'
#!/bin/bash

# Docker 監控腳本
while true; do
    clear
    echo "=== Docker 容器監控 ==="
    echo "時間: $(date)"
    echo ""
    
    # 顯示容器狀態
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    
    # 顯示資源使用
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    echo ""
    
    # 顯示系統資源
    echo "=== 系統資源 ==="
    if command -v free &> /dev/null; then
        free -h
    fi
    
    echo ""
    echo "按 Ctrl+C 退出監控"
    sleep 5
done
EOF
    
    chmod +x scripts/docker-monitor.sh
    echo -e "${GREEN}✅ 監控腳本已建立: scripts/docker-monitor.sh${NC}"
}

# 備份重要資料
backup_data() {
    echo -e "\n${YELLOW}💾 備份重要資料...${NC}"
    
    # 建立備份目錄
    backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    # 備份 Redis 資料
    if docker ps | grep -q "redis"; then
        echo -e "備份 Redis 資料..."
        docker exec taiwan-transport-redis-dev redis-cli BGSAVE
        docker cp taiwan-transport-redis-dev:/data/dump.rdb "$backup_dir/redis-dump.rdb"
        echo -e "${GREEN}✅ Redis 資料已備份到 $backup_dir/redis-dump.rdb${NC}"
    fi
    
    # 備份環境配置
    if [ -f .env ]; then
        cp .env "$backup_dir/env-backup"
        echo -e "${GREEN}✅ 環境配置已備份到 $backup_dir/env-backup${NC}"
    fi
    
    # 備份 Docker Compose 配置
    cp docker-compose*.yml "$backup_dir/"
    echo -e "${GREEN}✅ Docker Compose 配置已備份${NC}"
    
    echo -e "${GREEN}✅ 備份完成，位置: $backup_dir${NC}"
}

# 生成優化報告
generate_report() {
    echo -e "\n${BLUE}📋 Docker 優化報告${NC}"
    echo "=================================================="
    
    # 計算節省的空間
    echo -e "\n磁碟空間使用:"
    docker system df
    
    # 顯示映像資訊
    echo -e "\n映像資訊:"
    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"
    
    # 顯示容器資訊
    echo -e "\n容器資訊:"
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Size}}"
    
    echo -e "\n${GREEN}🎉 優化完成！${NC}"
    echo -e "${YELLOW}建議定期執行此腳本以保持系統效能${NC}"
}

# 主選單
show_menu() {
    echo -e "\n${BLUE}請選擇要執行的操作:${NC}"
    echo "1) 顯示 Docker 使用情況"
    echo "2) 清理未使用的資源"
    echo "3) 優化映像大小"
    echo "4) 安全性檢查"
    echo "5) 效能調優"
    echo "6) 建立監控腳本"
    echo "7) 備份重要資料"
    echo "8) 執行完整優化"
    echo "9) 退出"
    echo ""
    read -p "請輸入選項 (1-9): " choice
}

# 主要執行流程
main() {
    if [ "$1" = "--auto" ]; then
        # 自動模式：執行完整優化
        show_docker_usage
        cleanup_unused
        security_check
        performance_tuning
        create_monitoring
        backup_data
        generate_report
    else
        # 互動模式
        while true; do
            show_menu
            case $choice in
                1) show_docker_usage ;;
                2) cleanup_unused ;;
                3) optimize_images ;;
                4) security_check ;;
                5) performance_tuning ;;
                6) create_monitoring ;;
                7) backup_data ;;
                8) 
                    show_docker_usage
                    cleanup_unused
                    security_check
                    performance_tuning
                    create_monitoring
                    backup_data
                    generate_report
                    ;;
                9) echo -e "${GREEN}再見！${NC}"; exit 0 ;;
                *) echo -e "${RED}無效選項，請重新選擇${NC}" ;;
            esac
            echo ""
            read -p "按 Enter 繼續..."
        done
    fi
}

# 執行主程式
main "$@"