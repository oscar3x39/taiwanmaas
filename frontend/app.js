// 台北交通路線規劃應用程式
class TransportApp {
    constructor() {
        this.map = null;
        this.routeLayer = null;
        this.markersLayer = null;
        this.currentRoutes = [];
        this.selectedRoute = null;
        
        // 預設座標 (台北車站和南港車站)
        this.locations = {
            '台北車站': { lat: 25.0478, lng: 121.5170 },
            '南港車站': { lat: 25.0540, lng: 121.6066 },
            '台北101': { lat: 25.0340, lng: 121.5645 },
            '西門町': { lat: 25.0420, lng: 121.5080 },
            '信義區': { lat: 25.0330, lng: 121.5654 }
        };
        
        this.init();
    }

    init() {
        this.initMap();
        this.bindEvents();
        this.addDefaultMarkers();
    }

    initMap() {
        // 初始化地圖 (以台北市中心為中心)
        this.map = L.map('map').setView([25.0478, 121.5170], 12);
        
        // 使用 OpenStreetMap 圖層
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);
        
        // 建立圖層群組
        this.markersLayer = L.layerGroup().addTo(this.map);
        this.routeLayer = L.layerGroup().addTo(this.map);
    }

    bindEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const originInput = document.getElementById('origin');
        const destinationInput = document.getElementById('destination');
        
        searchBtn.addEventListener('click', () => this.searchRoutes());
        
        // Enter 鍵搜尋
        [originInput, destinationInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchRoutes();
                }
            });
        });
    }

    addDefaultMarkers() {
        // 添加台北車站和南港車站標記
        const taipeiStation = L.marker([25.0478, 121.5170])
            .bindPopup('<b>台北車站</b><br>台北市中正區')
            .addTo(this.markersLayer);
            
        const nangangStation = L.marker([25.0540, 121.6066])
            .bindPopup('<b>南港車站</b><br>台北市南港區')
            .addTo(this.markersLayer);
    }

    async searchRoutes() {
        const origin = document.getElementById('origin').value.trim();
        const destination = document.getElementById('destination').value.trim();
        
        if (!origin || !destination) {
            this.showError('請輸入起點和終點');
            return;
        }

        this.showLoading(true);
        this.clearRoutes();

        try {
            // 取得座標
            const originCoords = this.getCoordinates(origin);
            const destCoords = this.getCoordinates(destination);
            
            if (!originCoords || !destCoords) {
                throw new Error('找不到指定地點的座標');
            }

            // 呼叫後端API
            const response = await fetch('http://localhost:19999/api/routes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    origin: {
                        latitude: originCoords.lat,
                        longitude: originCoords.lng
                    },
                    destination: {
                        latitude: destCoords.lat,
                        longitude: destCoords.lng
                    },
                    preferences: {
                        prioritize: 'time',
                        maxWalkingDistance: 800
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API 錯誤: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success && result.data.routes) {
                this.currentRoutes = result.data.routes;
                this.displayRoutes(result.data.routes);
                this.updateMapView(originCoords, destCoords);
            } else {
                throw new Error('沒有找到路線');
            }

        } catch (error) {
            console.error('搜尋路線錯誤:', error);
            this.showError(`搜尋失敗: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    getCoordinates(locationName) {
        // 簡單的地點名稱對應座標
        const normalizedName = locationName.replace(/車站|站/g, '').trim();
        
        for (const [key, coords] of Object.entries(this.locations)) {
            if (key.includes(normalizedName) || normalizedName.includes(key.replace(/車站|站/g, ''))) {
                return coords;
            }
        }
        
        // 如果找不到預設地點，返回台北車站座標
        console.warn(`找不到 ${locationName} 的座標，使用台北車站座標`);
        return this.locations['台北車站'];
    }

    displayRoutes(routes) {
        const routesSection = document.getElementById('routesSection');
        routesSection.innerHTML = '';

        routes.forEach((route, index) => {
            const routeCard = this.createRouteCard(route, index);
            routesSection.appendChild(routeCard);
        });
    }

    createRouteCard(route, index) {
        const card = document.createElement('div');
        card.className = 'route-card';
        card.dataset.routeIndex = index;
        
        card.innerHTML = `
            <div class="route-header">
                <div class="route-type">${route.type || '路線 ' + (index + 1)}</div>
                <div class="route-time">${route.totalTime}分鐘</div>
            </div>
            <div class="route-details">
                <span>💰 $${route.totalCost}</span>
                <span>🔄 ${route.transfers}次轉乘</span>
            </div>
            <div class="route-segments">
                ${this.createSegmentsHTML(route.segments)}
            </div>
        `;
        
        card.addEventListener('click', () => this.selectRoute(index));
        
        return card;
    }

    createSegmentsHTML(segments) {
        if (!segments || segments.length === 0) {
            return '<div class="segment">📍 路線詳情載入中...</div>';
        }
        
        return segments.map((segment, index) => {
            const iconClass = this.getSegmentIconClass(segment.mode);
            const icon = this.getSegmentIcon(segment.mode);
            const distance = segment.distance ? `${segment.distance}km` : '';
            const line = segment.line ? `${segment.line}` : '';
            
            let detailInfo = '';
            if (segment.mode === 'mrt' && segment.stations) {
                const stationCount = segment.stations.length - 1;
                detailInfo = `經過 ${stationCount} 站`;
            } else if (segment.mode === 'bus' && segment.line) {
                detailInfo = `${segment.line} 號公車`;
            } else if (segment.mode === 'taxi' && segment.estimatedFare) {
                detailInfo = segment.estimatedFare;
            }
            
            return `
                <div class="segment">
                    <div class="segment-icon ${iconClass}">${icon}</div>
                    <div class="segment-info">
                        <div class="segment-main">
                            ${line ? `<strong>${line}</strong> ` : ''}
                            ${segment.duration}分鐘
                            ${distance ? ` • ${distance}` : ''}
                        </div>
                        <div class="segment-detail">
                            ${segment.instructions || ''}
                            ${detailInfo ? ` • ${detailInfo}` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getSegmentIconClass(mode) {
        const modeMap = {
            'walking': 'walking',
            'mrt': 'mrt',
            'bus': 'bus',
            'taxi': 'taxi'
        };
        return modeMap[mode.toLowerCase()] || 'walking';
    }

    getSegmentIcon(mode) {
        const iconMap = {
            'walking': '🚶',
            'mrt': '🚇',
            'bus': '🚌',
            'taxi': '🚕'
        };
        return iconMap[mode.toLowerCase()] || '📍';
    }

    selectRoute(index) {
        // 移除之前選中的樣式
        document.querySelectorAll('.route-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // 添加選中樣式
        const selectedCard = document.querySelector(`[data-route-index="${index}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        this.selectedRoute = this.currentRoutes[index];
        this.drawRouteOnMap(this.selectedRoute);
    }

    async drawRouteOnMap(route) {
        // 清除之前的路線
        this.routeLayer.clearLayers();
        
        const origin = document.getElementById('origin').value;
        const destination = document.getElementById('destination').value;
        
        const originCoords = this.getCoordinates(origin);
        const destCoords = this.getCoordinates(destination);
        
        if (originCoords && destCoords) {
            // 添加起終點標記
            const startIcon = L.divIcon({
                html: '<div style="background: #28a745; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">起</div>',
                iconSize: [30, 30],
                className: 'custom-marker'
            });
            
            const endIcon = L.divIcon({
                html: '<div style="background: #dc3545; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">終</div>',
                iconSize: [30, 30],
                className: 'custom-marker'
            });
            
            L.marker([originCoords.lat, originCoords.lng], { icon: startIcon })
                .bindPopup(`<b>起點</b><br>${origin}`)
                .addTo(this.routeLayer);
                
            L.marker([destCoords.lat, destCoords.lng], { icon: endIcon })
                .bindPopup(`<b>終點</b><br>${destination}`)
                .addTo(this.routeLayer);

            // 根據路線類型繪製不同的路徑
            await this.drawRouteSegments(route, originCoords, destCoords);
        }
    }

    async drawRouteSegments(route, originCoords, destCoords) {
        const colors = {
            'walking': '#28a745',
            'mrt': '#007bff', 
            'bus': '#ffc107',
            'taxi': '#dc3545'
        };

        if (route.segments && route.segments.length > 0) {
            for (let i = 0; i < route.segments.length; i++) {
                const segment = route.segments[i];
                
                // 根據段落類型繪製路徑
                if (segment.mode === 'mrt' && segment.line && segment.stations) {
                    // 使用真實捷運路線資料
                    this.drawMRTSegment(segment);
                } else if (segment.mode === 'walking') {
                    // 步行路段
                    this.drawWalkingSegment(segment);
                } else if (segment.mode === 'bus') {
                    // 公車路段
                    this.drawBusSegment(segment);
                } else if (segment.mode === 'taxi') {
                    // 計程車路段
                    await this.drawTaxiSegment(segment);
                } else {
                    // 其他交通工具，使用直線
                    this.drawGenericSegment(segment, colors[segment.mode.toLowerCase()] || '#667eea');
                }
            }
        } else {
            // 如果沒有段落資訊，繪製直線路徑
            const routePath = await this.getRouteGeometry(originCoords, destCoords, 'driving');
            
            if (routePath && routePath.length > 0) {
                L.polyline(routePath, {
                    color: '#667eea',
                    weight: 5,
                    opacity: 0.8
                }).addTo(this.routeLayer);
            } else {
                L.polyline([
                    [originCoords.lat, originCoords.lng],
                    [destCoords.lat, destCoords.lng]
                ], {
                    color: '#667eea',
                    weight: 5,
                    opacity: 0.8
                }).addTo(this.routeLayer);
            }
        }
    }

    drawMRTSegment(segment) {
        if (!window.TAIPEI_MRT_DATA || !segment.stations) return;
        
        // 獲取捷運路線顏色
        const lineColor = TAIPEI_MRT_DATA.lines[segment.line]?.color || '#007bff';
        
        // 獲取站點路徑
        const stationPath = TAIPEI_MRT_DATA.getStationPath(segment.stations);
        
        if (stationPath.length > 0) {
            // 繪製捷運路線
            const mrtLine = L.polyline(stationPath, {
                color: lineColor,
                weight: 6,
                opacity: 0.9
            }).addTo(this.routeLayer);
            
            mrtLine.bindPopup(`
                <b>🚇 ${segment.line}</b><br>
                ${segment.stations[0]} → ${segment.stations[segment.stations.length - 1]}<br>
                經過 ${segment.stations.length - 1} 站 • ${segment.duration}分鐘
            `);
            
            // 添加起終點站標記
            if (stationPath.length >= 2) {
                const startStation = L.circleMarker(stationPath[0], {
                    color: lineColor,
                    fillColor: '#fff',
                    fillOpacity: 1,
                    radius: 6,
                    weight: 3
                }).addTo(this.routeLayer);
                
                startStation.bindPopup(`<b>${segment.stations[0]}</b><br>上車站`);
                
                const endStation = L.circleMarker(stationPath[stationPath.length - 1], {
                    color: lineColor,
                    fillColor: '#fff',
                    fillOpacity: 1,
                    radius: 6,
                    weight: 3
                }).addTo(this.routeLayer);
                
                endStation.bindPopup(`<b>${segment.stations[segment.stations.length - 1]}</b><br>下車站`);
            }
        }
    }

    drawWalkingSegment(segment) {
        if (!segment.from || !segment.to) return;
        
        const fromCoords = segment.from.coordinates;
        const toCoords = segment.to.coordinates;
        
        const walkingPath = L.polyline([
            [fromCoords.latitude, fromCoords.longitude],
            [toCoords.latitude, toCoords.longitude]
        ], {
            color: '#28a745',
            weight: 4,
            opacity: 0.7,
            dashArray: '8, 12'
        }).addTo(this.routeLayer);
        
        walkingPath.bindPopup(`
            <b>🚶 步行</b><br>
            ${segment.from.name} → ${segment.to.name}<br>
            ${segment.duration}分鐘 • ${segment.distance}km
        `);
    }

    drawBusSegment(segment) {
        if (!segment.from || !segment.to) return;
        
        const fromCoords = segment.from.coordinates;
        const toCoords = segment.to.coordinates;
        
        const busPath = L.polyline([
            [fromCoords.latitude, fromCoords.longitude],
            [toCoords.latitude, toCoords.longitude]
        ], {
            color: '#ffc107',
            weight: 5,
            opacity: 0.8
        }).addTo(this.routeLayer);
        
        busPath.bindPopup(`
            <b>🚌 ${segment.line} 號公車</b><br>
            ${segment.from.name} → ${segment.to.name}<br>
            ${segment.duration}分鐘 • ${segment.distance}km
        `);
    }

    async drawTaxiSegment(segment) {
        if (!segment.from || !segment.to) return;
        
        const fromCoords = segment.from.coordinates;
        const toCoords = segment.to.coordinates;
        
        // 嘗試獲取真實道路路線
        const routePath = await this.getRouteGeometry(
            { lat: fromCoords.latitude, lng: fromCoords.longitude },
            { lat: toCoords.latitude, lng: toCoords.longitude },
            'driving'
        );
        
        if (routePath && routePath.length > 0) {
            const taxiPath = L.polyline(routePath, {
                color: '#dc3545',
                weight: 5,
                opacity: 0.8
            }).addTo(this.routeLayer);
            
            taxiPath.bindPopup(`
                <b>🚕 計程車</b><br>
                ${segment.from.name} → ${segment.to.name}<br>
                ${segment.duration}分鐘 • ${segment.distance}km<br>
                ${segment.estimatedFare || ''}
            `);
        } else {
            // 備用直線路徑
            this.drawGenericSegment(segment, '#dc3545');
        }
    }

    drawGenericSegment(segment, color) {
        if (!segment.from || !segment.to) return;
        
        const fromCoords = segment.from.coordinates;
        const toCoords = segment.to.coordinates;
        
        const genericPath = L.polyline([
            [fromCoords.latitude, fromCoords.longitude],
            [toCoords.latitude, toCoords.longitude]
        ], {
            color: color,
            weight: 5,
            opacity: 0.8
        }).addTo(this.routeLayer);
        
        genericPath.bindPopup(`
            <b>${this.getSegmentIcon(segment.mode)} ${segment.mode}</b><br>
            ${segment.from.name} → ${segment.to.name}<br>
            ${segment.duration}分鐘
        `);
    }

    async getRouteGeometry(start, end, mode) {
        try {
            // 使用 OpenRouteService 免費 API 獲取路線幾何
            // 注意：這需要註冊免費 API key，這裡提供備用方案
            
            // 備用方案：使用 OSRM 免費路線服務
            const profile = this.getOSRMProfile(mode);
            const url = `https://router.project-osrm.org/route/v1/${profile}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.routes && data.routes[0] && data.routes[0].geometry) {
                // 轉換 GeoJSON 座標為 Leaflet 格式
                return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            }
        } catch (error) {
            console.warn('無法獲取路線幾何，使用直線路徑:', error);
        }
        
        return null;
    }

    getOSRMProfile(mode) {
        const profileMap = {
            'walking': 'foot',
            'mrt': 'driving', // 捷運路線用道路路線近似
            'bus': 'driving',
            'taxi': 'driving',
            'driving': 'driving'
        };
        return profileMap[mode.toLowerCase()] || 'driving';
    }

    updateMapView(originCoords, destCoords) {
        // 調整地圖視野以包含起終點
        const bounds = L.latLngBounds([
            [originCoords.lat, originCoords.lng],
            [destCoords.lat, destCoords.lng]
        ]);
        
        this.map.fitBounds(bounds, { padding: [50, 50] });
    }

    clearRoutes() {
        this.routeLayer.clearLayers();
        this.currentRoutes = [];
        this.selectedRoute = null;
    }

    showLoading(show) {
        const loadingMsg = document.getElementById('loadingMsg');
        const searchBtn = document.getElementById('searchBtn');
        
        if (show) {
            loadingMsg.style.display = 'block';
            searchBtn.disabled = true;
            searchBtn.textContent = '搜尋中...';
        } else {
            loadingMsg.style.display = 'none';
            searchBtn.disabled = false;
            searchBtn.textContent = '🔍 搜尋路線';
        }
    }

    showError(message) {
        const routesSection = document.getElementById('routesSection');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        
        routesSection.innerHTML = '';
        routesSection.appendChild(errorDiv);
        
        // 3秒後自動移除錯誤訊息
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }
}

// 當頁面載入完成後初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    new TransportApp();
});