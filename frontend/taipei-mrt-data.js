// 台北捷運路線資料
const TAIPEI_MRT_DATA = {
    // 捷運站點座標
    stations: {
        '台北車站': { lat: 25.0478, lng: 121.5170, lines: ['淡水信義線', '板南線'] },
        '台大醫院': { lat: 25.0418, lng: 121.5153, lines: ['淡水信義線'] },
        '中正紀念堂': { lat: 25.0329, lng: 121.5186, lines: ['淡水信義線', '松山新店線'] },
        '東門': { lat: 25.0341, lng: 121.5281, lines: ['淡水信義線', '中和新蘆線'] },
        '忠孝復興': { lat: 25.0418, lng: 121.5440, lines: ['淡水信義線', '板南線'] },
        '忠孝敦化': { lat: 25.0418, lng: 121.5494, lines: ['板南線'] },
        '國父紀念館': { lat: 25.0408, lng: 121.5598, lines: ['板南線'] },
        '市政府': { lat: 25.0408, lng: 121.5653, lines: ['板南線'] },
        '永春': { lat: 25.0408, lng: 121.5765, lines: ['板南線'] },
        '後山埤': { lat: 25.0448, lng: 121.5823, lines: ['板南線'] },
        '昆陽': { lat: 25.0501, lng: 121.5932, lines: ['板南線'] },
        '南港': { lat: 25.0540, lng: 121.6066, lines: ['板南線'] },
        '南港展覽館': { lat: 25.0556, lng: 121.6181, lines: ['板南線'] },
        '善導寺': { lat: 25.0448, lng: 121.5240, lines: ['板南線'] },
        '忠孝新生': { lat: 25.0423, lng: 121.5323, lines: ['板南線', '中和新蘆線'] },
        '西門': { lat: 25.0420, lng: 121.5080, lines: ['板南線', '松山新店線'] },
        '龍山寺': { lat: 25.0355, lng: 121.4999, lines: ['板南線'] },
        '江子翠': { lat: 25.0285, lng: 121.4727, lines: ['板南線'] },
        '新埔': { lat: 25.0238, lng: 121.4678, lines: ['板南線'] },
        '板橋': { lat: 25.0138, lng: 121.4627, lines: ['板南線'] },
        '府中': { lat: 25.0089, lng: 121.4590, lines: ['板南線'] },
        '亞東醫院': { lat: 25.0118, lng: 121.4518, lines: ['板南線'] },
        '海山': { lat: 25.0158, lng: 121.4485, lines: ['板南線'] },
        '土城': { lat: 25.0338, lng: 121.4449, lines: ['板南線'] },
        '永寧': { lat: 25.0408, lng: 121.4368, lines: ['板南線'] },
        '頂埔': { lat: 25.0138, lng: 121.4197, lines: ['板南線'] }
    },

    // 路線定義
    lines: {
        '板南線': {
            color: '#0070BD',
            stations: [
                '頂埔', '永寧', '土城', '海山', '亞東醫院', '府中', '板橋', '新埔', '江子翠',
                '龍山寺', '西門', '台北車站', '善導寺', '忠孝新生', '忠孝復興', '忠孝敦化',
                '國父紀念館', '市政府', '永春', '後山埤', '昆陽', '南港', '南港展覽館'
            ]
        },
        '淡水信義線': {
            color: '#E3002C',
            stations: [
                '淡水', '紅樹林', '竹圍', '關渡', '忠義', '復興崗', '北投', '新北投', '奇岩',
                '唭哩岸', '石牌', '明德', '芝山', '士林', '劍潭', '圓山', '民權西路', '雙連',
                '中山', '台北車站', '台大醫院', '中正紀念堂', '東門', '忠孝復興', '大安',
                '信義安和', '台北101/世貿', '象山'
            ]
        }
    },

    // 計算兩站之間的路線
    getRoute: function(fromStation, toStation, line) {
        const lineData = this.lines[line];
        if (!lineData) return null;

        const fromIndex = lineData.stations.indexOf(fromStation);
        const toIndex = lineData.stations.indexOf(toStation);
        
        if (fromIndex === -1 || toIndex === -1) return null;

        const start = Math.min(fromIndex, toIndex);
        const end = Math.max(fromIndex, toIndex);
        
        return {
            stations: lineData.stations.slice(start, end + 1),
            stationCount: end - start,
            color: lineData.color
        };
    },

    // 獲取站點座標路徑
    getStationPath: function(stations) {
        return stations.map(stationName => {
            const station = this.stations[stationName];
            return station ? [station.lat, station.lng] : null;
        }).filter(coord => coord !== null);
    },

    // 計算預估時間（每站2分鐘 + 轉乘時間）
    calculateTime: function(stationCount, transfers = 0) {
        return stationCount * 2 + transfers * 3;
    },

    // 計算費用
    calculateFare: function(stationCount) {
        if (stationCount <= 5) return 20;
        if (stationCount <= 10) return 25;
        if (stationCount <= 15) return 30;
        return 35;
    }
};

// 如果在 Node.js 環境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TAIPEI_MRT_DATA;
}