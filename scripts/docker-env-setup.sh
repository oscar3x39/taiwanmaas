#!/bin/bash

# 🤖 AI-Generated Docker Environment Setup Script
# 📝 展示完整的 Docker 環境初始化和配置管理
# 
# 🚀 環境設定特色：
# ✅ 自動環境檢測和配置
# ✅ 多平台支援 (macOS/Linux)
# ✅ 智慧型資源分配
# ✅ 開發者友善的設定流程

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Docker 環境設定工具${NC}"
echo "=================================================="

# 檢測系統資源
detect_system_resources() {
    echo -e "\n${YELLOW}🔍 檢測系統資源...${NC}"
    
    # 檢測 CPU 核心數
    if command -v nproc &> /dev/null; then
        CPU_CORES=$(nproc)
    elif command -v sysctl &> /dev/null; then
        CPU_CORES=$(sysctl -n hw.ncpu)
    else
        CPU_CORES=2
    fi
    
    # 檢測記憶體大小 (GB)
    if command -v free &> /dev/null; then
        MEMORY_GB=$(free -g | awk '/^Mem:/{print $2}')
    elif command -v sysctl &> /dev/null; then
        MEMORY_BYTES=$(sysctl -n hw.memsize)
        MEMORY_GB=$((MEMORY_BYTES / 1024 / 1024 / 1024))
    else
        MEMORY_GB=8
    fi
    
    echo -e "   CPU 核心數: ${CPU_CORES}"
    echo -e "   記憶體大小: ${MEMORY_GB}GB"
    
    # 根據系統資源調整 Docker 配置
    if [ $MEMORY_GB -lt 4 ]; then
        echo -e "${YELLOW}⚠️ 記憶體較少，將使用輕量化配置${NC}"
        DOCKER_PROFILE="light"
    elif [ $MEMORY_GB -lt 8 ]; then
        echo -e "${GREEN}✅ 記憶體適中，使用標準配置${NC}"
        DOCKER_PROFILE="standard"
    else
        echo -e "${GREEN}🚀 記憶體充足，使用高效能配置${NC}"
        DOCKER_PROFILE="performance"
    fi
}

# 建立環境配置檔案
create_docker_env() {
    echo -e "\n${YELLOW}📝 建立 Docker 環境配置...${NC}"
    
    # 建立 .env.docker 檔案
    cat > .env.docker << EOF
# 🤖 AI-Generated Docker Environment Configuration
# 📝 根據系統資源自動調整的 Docker 配置

# 系統資源資訊
DETECTED_CPU_CORES=${CPU_CORES}
DETECTED_MEMORY_GB=${MEMORY_GB}
DOCKER_PROFILE=${DOCKER_PROFILE}

# Docker Compose 配置
COMPOSE_PROJECT_NAME=taiwan-transport
COMPOSE_FILE=docker-compose.dev.yml

# 資源限制配置
EOF

    # 根據系統資源設定不同的配置
    case $DOCKER_PROFILE in
        "light")
            cat >> .env.docker << EOF
# 輕量化配置 (< 4GB RAM)
BACKEND_CPU_LIMIT=0.5
BACKEND_MEMORY_LIMIT=256m
FRONTEND_CPU_LIMIT=0.3
FRONTEND_MEMORY_LIMIT=128m
REDIS_CPU_LIMIT=0.2
REDIS_MEMORY_LIMIT=64m
EOF
            ;;
        "standard")
            cat >> .env.docker << EOF
# 標準配置 (4-8GB RAM)
BACKEND_CPU_LIMIT=1.0
BACKEND_MEMORY_LIMIT=512m
FRONTEND_CPU_LIMIT=0.5
FRONTEND_MEMORY_LIMIT=256m
REDIS_CPU_LIMIT=0.3
REDIS_MEMORY_LIMIT=128m
EOF
            ;;
        "performance")
            cat >> .env.docker << EOF
# 高效能配置 (> 8GB RAM)
BACKEND_CPU_LIMIT=2.0
BACKEND_MEMORY_LIMIT=1g
FRONTEND_CPU_LIMIT=1.0
FRONTEND_MEMORY_LIMIT=512m
REDIS_CPU_LIMIT=0.5
REDIS_MEMORY_LIMIT=256m
EOF
            ;;
    esac
    
    echo -e "${GREEN}✅ Docker 環境配置已建立: .env.docker${NC}"
}

# 優化 Docker 設定
optimize_docker_settings() {
    echo -e "\n${YELLOW}⚡ 優化 Docker 設定...${NC}"
    
    # 檢查 Docker Desktop 設定 (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo -e "檢測到 macOS 系統..."
        
        # 建議的 Docker Desktop 設定
        cat > /tmp/docker-desktop-settings.json << EOF
{
  "memoryMiB": $((MEMORY_GB * 1024 * 3 / 4)),
  "cpus": $((CPU_CORES - 1)),
  "diskSizeMiB": 61440,
  "swapMiB": 1024
}
EOF
        
        echo -e "${YELLOW}建議的 Docker Desktop 設定已保存到 /tmp/docker-desktop-settings.json${NC}"
        echo -e "${YELLOW}請在 Docker Desktop > Preferences > Resources 中調整設定${NC}"
    fi
    
    # 建立 Docker daemon 配置建議
    cat > /tmp/docker-daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  },
  "features": {
    "buildkit": true
  }
}
EOF
    
    echo -e "${GREEN}✅ Docker daemon 配置建議已保存到 /tmp/docker-daemon.json${NC}"
}

# 建立開發環境快速啟動腳本
create_dev_scripts() {
    echo -e "\n${YELLOW}📜 建立開發環境腳本...${NC}"
    
    # 快速啟動腳本
    cat > scripts/dev-start.sh << 'EOF'
#!/bin/bash

# 🚀 快速啟動開發環境

set -e

echo "🔧 啟動台灣智慧交通開發環境..."

# 載入 Docker 環境配置
if [ -f .env.docker ]; then
    source .env.docker
    echo "✅ 已載入 Docker 環境配置 (${DOCKER_PROFILE} 模式)"
fi

# 檢查 Docker 是否運行
if ! docker info &> /dev/null; then
    echo "❌ Docker 未運行，請啟動 Docker Desktop"
    exit 1
fi

# 啟動服務
echo "🐳 啟動 Docker 服務..."
docker-compose -f docker-compose.dev.yml up -d

# 等待服務啟動
echo "⏳ 等待服務啟動..."
sleep 10

# 檢查服務狀態
echo "📊 檢查服務狀態..."
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "🎉 開發環境已啟動！"
echo "📱 前端應用: http://localhost:8080"
echo "🔧 後端 API: http://localhost:3000"
echo "📚 API 文件: http://localhost:3000/api-docs"
echo ""
echo "💡 有用的指令:"
echo "   make logs        # 查看日誌"
echo "   make health      # 健康檢查"
echo "   make stop        # 停止服務"
EOF

    chmod +x scripts/dev-start.sh
    
    # 快速停止腳本
    cat > scripts/dev-stop.sh << 'EOF'
#!/bin/bash

# ⏹️ 快速停止開發環境

set -e

echo "⏹️ 停止台灣智慧交通開發環境..."

# 停止服務
docker-compose -f docker-compose.dev.yml down

echo "✅ 開發環境已停止"
EOF

    chmod +x scripts/dev-stop.sh
    
    # 重置環境腳本
    cat > scripts/dev-reset.sh << 'EOF'
#!/bin/bash

# 🔄 重置開發環境

set -e

echo "🔄 重置台灣智慧交通開發環境..."

# 停止並移除所有容器和卷
docker-compose -f docker-compose.dev.yml down -v --remove-orphans

# 重新建構映像
echo "🔨 重新建構映像..."
docker-compose -f docker-compose.dev.yml build --no-cache

# 重新啟動
echo "🚀 重新啟動服務..."
docker-compose -f docker-compose.dev.yml up -d

echo "✅ 開發環境已重置並重新啟動"
EOF

    chmod +x scripts/dev-reset.sh
    
    echo -e "${GREEN}✅ 開發環境腳本已建立${NC}"
    echo -e "   scripts/dev-start.sh  # 快速啟動"
    echo -e "   scripts/dev-stop.sh   # 快速停止"
    echo -e "   scripts/dev-reset.sh  # 重置環境"
}

# 建立監控儀表板
create_monitoring_dashboard() {
    echo -e "\n${YELLOW}📊 建立監控儀表板...${NC}"
    
    cat > scripts/docker-dashboard.sh << 'EOF'
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
EOF

    chmod +x scripts/docker-dashboard.sh
    
    echo -e "${GREEN}✅ 監控儀表板已建立: scripts/docker-dashboard.sh${NC}"
}

# 建立故障排除指南
create_troubleshooting_guide() {
    echo -e "\n${YELLOW}🔧 建立故障排除指南...${NC}"
    
    cat > docs/DOCKER-TROUBLESHOOTING.md << 'EOF'
# 🐳 Docker 故障排除指南

## 常見問題與解決方案

### 1. 容器無法啟動

**問題**: 容器啟動失敗或立即退出

**解決方案**:
```bash
# 檢查容器日誌
docker-compose -f docker-compose.dev.yml logs [service-name]

# 檢查容器狀態
docker-compose -f docker-compose.dev.yml ps

# 重新建構映像
docker-compose -f docker-compose.dev.yml build --no-cache [service-name]
```

### 2. 端口被占用

**問題**: `bind: address already in use`

**解決方案**:
```bash
# 檢查端口使用情況
lsof -i :3000  # 後端端口
lsof -i :8080  # 前端端口
lsof -i :6379  # Redis 端口

# 停止占用端口的程序
kill -9 [PID]

# 或修改 .env 檔案中的端口設定
```

### 3. 記憶體不足

**問題**: 容器因記憶體不足被終止

**解決方案**:
```bash
# 檢查 Docker 記憶體限制
docker system df
docker stats

# 清理未使用的資源
docker system prune -f

# 調整 Docker Desktop 記憶體分配 (macOS)
# Docker Desktop > Preferences > Resources > Memory
```

### 4. 熱重載不工作

**問題**: 程式碼修改後沒有自動重載

**解決方案**:
```bash
# 確保環境變數設定正確
echo $CHOKIDAR_USEPOLLING
echo $WATCHPACK_POLLING

# 重啟開發容器
docker-compose -f docker-compose.dev.yml restart frontend
docker-compose -f docker-compose.dev.yml restart backend
```

### 5. 網路連接問題

**問題**: 容器間無法通信

**解決方案**:
```bash
# 檢查網路狀態
docker network ls
docker network inspect taiwan-transport_app-network

# 重建網路
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
```

### 6. 映像建構失敗

**問題**: Docker build 過程中出錯

**解決方案**:
```bash
# 清理建構快取
docker builder prune -f

# 使用 --no-cache 重新建構
docker-compose -f docker-compose.dev.yml build --no-cache

# 檢查 Dockerfile 語法
docker-compose -f docker-compose.dev.yml config
```

## 效能優化建議

### 1. 調整 Docker Desktop 設定 (macOS)
- CPU: 系統核心數 - 1
- Memory: 系統記憶體的 75%
- Disk: 至少 60GB

### 2. 使用 Docker BuildKit
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

### 3. 優化 .dockerignore
確保 `.dockerignore` 檔案包含不必要的檔案和目錄

## 監控和診斷工具

### 1. 即時監控
```bash
# 啟動監控儀表板
./scripts/docker-dashboard.sh

# 查看資源使用
docker stats

# 查看系統資訊
docker system df
docker system info
```

### 2. 日誌分析
```bash
# 查看所有服務日誌
make logs

# 查看特定服務日誌
make logs-backend
make logs-frontend

# 即時跟蹤日誌
docker-compose -f docker-compose.dev.yml logs -f --tail=100
```

### 3. 健康檢查
```bash
# 完整健康檢查
make health

# 快速健康檢查
make health-quick

# 手動檢查服務
curl http://localhost:3000/api/health
curl http://localhost:8080/health
```

## 緊急重置程序

如果遇到無法解決的問題，可以執行完整重置:

```bash
# 1. 停止所有服務
make stop

# 2. 清理所有資源
make clean

# 3. 重新建構和啟動
make build
make dev

# 或使用一鍵重置腳本
./scripts/dev-reset.sh
```

## 聯絡支援

如果問題仍然存在，請提供以下資訊:
- 作業系統版本
- Docker 版本 (`docker --version`)
- Docker Compose 版本 (`docker-compose --version`)
- 錯誤日誌
- 系統資源使用情況
EOF

    echo -e "${GREEN}✅ 故障排除指南已建立: docs/DOCKER-TROUBLESHOOTING.md${NC}"
}

# 生成設定報告
generate_setup_report() {
    echo -e "\n${BLUE}📋 Docker 環境設定報告${NC}"
    echo "=================================================="
    
    echo -e "系統資源:"
    echo -e "   CPU 核心數: ${CPU_CORES}"
    echo -e "   記憶體大小: ${MEMORY_GB}GB"
    echo -e "   Docker 配置: ${DOCKER_PROFILE}"
    
    echo -e "\n建立的檔案:"
    echo -e "   ✅ .env.docker - Docker 環境配置"
    echo -e "   ✅ scripts/dev-start.sh - 快速啟動腳本"
    echo -e "   ✅ scripts/dev-stop.sh - 快速停止腳本"
    echo -e "   ✅ scripts/dev-reset.sh - 環境重置腳本"
    echo -e "   ✅ scripts/docker-dashboard.sh - 監控儀表板"
    echo -e "   ✅ docs/DOCKER-TROUBLESHOOTING.md - 故障排除指南"
    
    echo -e "\n${GREEN}🎉 Docker 環境設定完成！${NC}"
    echo -e "\n${YELLOW}下一步:${NC}"
    echo -e "   1. 檢查並編輯 .env 檔案"
    echo -e "   2. 執行 ./scripts/dev-start.sh 啟動開發環境"
    echo -e "   3. 使用 ./scripts/docker-dashboard.sh 監控系統"
}

# 主要執行流程
main() {
    detect_system_resources
    create_docker_env
    optimize_docker_settings
    create_dev_scripts
    create_monitoring_dashboard
    create_troubleshooting_guide
    generate_setup_report
}

# 執行主程式
main "$@"