// 台北捷運路線資料
const TAIPEI_MRT_DATA = {
    // 捷運站點座標
    stations: {
        // 板南線
        '台北車站': { lat: 25.0478, lng: 121.5170, lines: ['淡水信義線', '板南線'] },
        '善導寺': { lat: 25.0448, lng: 121.5240, lines: ['板南線'] },
        '忠孝新生': { lat: 25.0423, lng: 121.5323, lines: ['板南線', '中和新蘆線'] },
        '忠孝復興': { lat: 25.0418, lng: 121.5440, lines: ['淡水信義線', '板南線'] },
        '忠孝敦化': { lat: 25.0418, lng: 121.5494, lines: ['板南線'] },
        '國父紀念館': { lat: 25.0408, lng: 121.5598, lines: ['板南線'] },
        '市政府': { lat: 25.0408, lng: 121.5653, lines: ['板南線'] },
        '永春': { lat: 25.0408, lng: 121.5765, lines: ['板南線'] },
        '後山埤': { lat: 25.0448, lng: 121.5823, lines: ['板南線'] },
        '昆陽': { lat: 25.0501, lng: 121.5932, lines: ['板南線'] },
        '南港': { lat: 25.0540, lng: 121.6066, lines: ['板南線'] },
        '南港展覽館': { lat: 25.0556, lng: 121.6181, lines: ['板南線'] },
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
        '頂埔': { lat: 25.0138, lng: 121.4197, lines: ['板南線'] },
        
        // 淡水信義線
        '淡水': { lat: 25.1678, lng: 121.4395, lines: ['淡水信義線'] },
        '紅樹林': { lat: 25.1548, lng: 121.4588, lines: ['淡水信義線'] },
        '竹圍': { lat: 25.1378, lng: 121.4598, lines: ['淡水信義線'] },
        '關渡': { lat: 25.1258, lng: 121.4678, lines: ['淡水信義線'] },
        '忠義': { lat: 25.1308, lng: 121.4738, lines: ['淡水信義線'] },
        '復興崗': { lat: 25.1378, lng: 121.4858, lines: ['淡水信義線'] },
        '北投': { lat: 25.1318, lng: 121.5018, lines: ['淡水信義線'] },
        '奇岩': { lat: 25.1258, lng: 121.5008, lines: ['淡水信義線'] },
        '唭哩岸': { lat: 25.1208, lng: 121.5058, lines: ['淡水信義線'] },
        '石牌': { lat: 25.1148, lng: 121.5158, lines: ['淡水信義線'] },
        '明德': { lat: 25.1098, lng: 121.5198, lines: ['淡水信義線'] },
        '芝山': { lat: 25.1028, lng: 121.5228, lines: ['淡水信義線'] },
        '士林': { lat: 25.0938, lng: 121.5268, lines: ['淡水信義線'] },
        '劍潭': { lat: 25.0848, lng: 121.5248, lines: ['淡水信義線'] },
        '圓山': { lat: 25.0718, lng: 121.5208, lines: ['淡水信義線'] },
        '民權西路': { lat: 25.0628, lng: 121.5198, lines: ['淡水信義線', '中和新蘆線'] },
        '雙連': { lat: 25.0578, lng: 121.5208, lines: ['淡水信義線'] },
        '中山': { lat: 25.0528, lng: 121.5208, lines: ['淡水信義線'] },
        '台大醫院': { lat: 25.0418, lng: 121.5153, lines: ['淡水信義線'] },
        '中正紀念堂': { lat: 25.0329, lng: 121.5186, lines: ['淡水信義線', '松山新店線'] },
        '東門': { lat: 25.0341, lng: 121.5281, lines: ['淡水信義線', '中和新蘆線'] },
        '大安': { lat: 25.0338, lng: 121.5438, lines: ['淡水信義線'] },
        '信義安和': { lat: 25.0338, lng: 121.5538, lines: ['淡水信義線'] },
        '台北101/世貿': { lat: 25.0338, lng: 121.5638, lines: ['淡水信義線'] },
        '象山': { lat: 25.0328, lng: 121.5698, lines: ['淡水信義線'] },
        
        // 松山新店線
        '松山': { lat: 25.0498, lng: 121.5778, lines: ['松山新店線'] },
        '南京三民': { lat: 25.0518, lng: 121.5648, lines: ['松山新店線'] },
        '台北小巨蛋': { lat: 25.0518, lng: 121.5518, lines: ['松山新店線'] },
        '南京復興': { lat: 25.0518, lng: 121.5448, lines: ['松山新店線', '文湖線'] },
        '松江南京': { lat: 25.0518, lng: 121.5328, lines: ['松山新店線', '中和新蘆線'] },
        '北門': { lat: 25.0498, lng: 121.5108, lines: ['松山新店線'] },
        '小南門': { lat: 25.0358, lng: 121.5098, lines: ['松山新店線'] },
        '古亭': { lat: 25.0268, lng: 121.5228, lines: ['松山新店線', '中和新蘆線'] },
        '台電大樓': { lat: 25.0208, lng: 121.5278, lines: ['松山新店線'] },
        '公館': { lat: 25.0148, lng: 121.5348, lines: ['松山新店線'] },
        '萬隆': { lat: 25.0028, lng: 121.5398, lines: ['松山新店線'] },
        '景美': { lat: 24.9928, lng: 121.5418, lines: ['松山新店線'] },
        '大坪林': { lat: 24.9828, lng: 121.5418, lines: ['松山新店線'] },
        '七張': { lat: 24.9758, lng: 121.5408, lines: ['松山新店線'] },
        '新店區公所': { lat: 24.9678, lng: 121.5418, lines: ['松山新店線'] },
        '新店': { lat: 24.9578, lng: 121.5378, lines: ['松山新店線'] }
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
                '淡水', '紅樹林', '竹圍', '關渡', '忠義', '復興崗', '北投', '奇岩',
                '唭哩岸', '石牌', '明德', '芝山', '士林', '劍潭', '圓山', '民權西路', '雙連',
                '中山', '台北車站', '台大醫院', '中正紀念堂', '東門', '忠孝復興', '大安',
                '信義安和', '台北101/世貿', '象山'
            ]
        },
        '松山新店線': {
            color: '#00B04F',
            stations: [
                '新店', '新店區公所', '七張', '大坪林', '景美', '萬隆', '公館', '台電大樓',
                '古亭', '中正紀念堂', '小南門', '西門', '北門', '松江南京', '南京復興',
                '台北小巨蛋', '南京三民', '松山'
            ]
        },
        '中和新蘆線': {
            color: '#FFA500',
            stations: [
                '南勢角', '景安', '永安市場', '頂溪', '古亭', '東門', '忠孝新生', '松江南京',
                '行天宮', '中山國小', '民權西路', '大橋頭', '台北橋', '菜寮', '三重', '先嗇宮',
                '頭前庄', '新莊', '輔大', '丹鳳', '迴龍'
            ]
        },
        '文湖線': {
            color: '#8B4513',
            stations: [
                '動物園', '木柵', '萬芳社區', '萬芳醫院', '辛亥', '麟光', '六張犁', '科技大樓',
                '大安', '忠孝復興', '南京復興', '中山國中', '松山機場', '大直', '劍南路',
                '西湖', '港墘', '文德', '內湖', '大湖公園', '葫洲', '東湖', '南港軟體園區', '南港展覽館'
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