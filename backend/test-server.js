const express = require('express');
const cors = require('cors');

const app = express();
const port = 19999;

// 中介軟體
app.use(cors());
app.use(express.json());

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 路線API
app.post('/api/routes', (req, res) => {
  console.log('收到路線請求:', req.body);
  
  // 模擬路線資料 - 更詳細的路線規劃
  const mockRoutes = [
    {
      id: 'route-1',
      type: '最快路線',
      totalTime: 35,
      totalCost: 25,
      transfers: 1,
      segments: [
        {
          mode: 'walking',
          duration: 5,
          distance: 0.4,
          instructions: '從起點步行至台北車站捷運站',
          from: { name: '起點', coordinates: req.body.origin },
          to: { name: '台北車站', coordinates: { latitude: 25.0478, longitude: 121.5170 } }
        },
        {
          mode: 'mrt',
          duration: 25,
          distance: 15.2,
          instructions: '搭乘板南線往南港展覽館方向',
          line: '板南線',
          from: { name: '台北車站', coordinates: { latitude: 25.0478, longitude: 121.5170 } },
          to: { name: '南港展覽館站', coordinates: { latitude: 25.0556, longitude: 121.6181 } },
          stations: ['台北車站', '善導寺', '忠孝新生', '忠孝復興', '忠孝敦化', '國父紀念館', '市政府', '永春', '後山埤', '昆陽', '南港', '南港展覽館']
        },
        {
          mode: 'walking',
          duration: 5,
          distance: 0.3,
          instructions: '從南港展覽館站步行至南港車站',
          from: { name: '南港展覽館站', coordinates: { latitude: 25.0556, longitude: 121.6181 } },
          to: { name: '終點', coordinates: req.body.destination }
        }
      ]
    },
    {
      id: 'route-2',
      type: '最省錢路線',
      totalTime: 45,
      totalCost: 20,
      transfers: 2,
      segments: [
        {
          mode: 'walking',
          duration: 8,
          distance: 0.6,
          instructions: '從起點步行至台北車站',
          from: { name: '起點', coordinates: req.body.origin },
          to: { name: '台北車站', coordinates: { latitude: 25.0478, longitude: 121.5170 } }
        },
        {
          mode: 'mrt',
          duration: 12,
          distance: 8.5,
          instructions: '搭乘淡水信義線往象山方向',
          line: '淡水信義線',
          from: { name: '台北車站', coordinates: { latitude: 25.0478, longitude: 121.5170 } },
          to: { name: '忠孝復興站', coordinates: { latitude: 25.0418, longitude: 121.5440 } },
          stations: ['台北車站', '台大醫院', '中正紀念堂', '東門', '忠孝復興']
        },
        {
          mode: 'mrt',
          duration: 18,
          distance: 10.1,
          instructions: '轉乘板南線往南港展覽館方向',
          line: '板南線',
          from: { name: '忠孝復興站', coordinates: { latitude: 25.0418, longitude: 121.5440 } },
          to: { name: '南港展覽館站', coordinates: { latitude: 25.0556, longitude: 121.6181 } },
          stations: ['忠孝復興', '忠孝敦化', '國父紀念館', '市政府', '永春', '後山埤', '昆陽', '南港', '南港展覽館']
        },
        {
          mode: 'walking',
          duration: 7,
          distance: 0.5,
          instructions: '從南港展覽館站步行至南港車站',
          from: { name: '南港展覽館站', coordinates: { latitude: 25.0556, longitude: 121.6181 } },
          to: { name: '終點', coordinates: req.body.destination }
        }
      ]
    },
    {
      id: 'route-3',
      type: '最少轉乘',
      totalTime: 40,
      totalCost: 350,
      transfers: 0,
      segments: [
        {
          mode: 'taxi',
          duration: 40,
          distance: 18.5,
          instructions: '搭乘計程車直達南港車站（建議路線：經忠孝東路）',
          from: { name: '起點', coordinates: req.body.origin },
          to: { name: '終點', coordinates: req.body.destination },
          estimatedFare: '約 350-400 元',
          route: '建議路線：忠孝東路 → 市民大道 → 南港路'
        }
      ]
    },
    {
      id: 'route-4',
      type: '公車路線',
      totalTime: 55,
      totalCost: 15,
      transfers: 1,
      segments: [
        {
          mode: 'walking',
          duration: 3,
          distance: 0.2,
          instructions: '步行至台北車站公車站',
          from: { name: '起點', coordinates: req.body.origin },
          to: { name: '台北車站公車站', coordinates: { latitude: 25.0478, longitude: 121.5170 } }
        },
        {
          mode: 'bus',
          duration: 45,
          distance: 16.8,
          instructions: '搭乘 205 號公車往南港方向',
          line: '205',
          from: { name: '台北車站', coordinates: { latitude: 25.0478, longitude: 121.5170 } },
          to: { name: '南港車站', coordinates: { latitude: 25.0540, longitude: 121.6066 } },
          busStops: ['台北車站', '忠孝西路', '忠孝復興', '忠孝敦化', '市政府', '永春', '南港車站']
        },
        {
          mode: 'walking',
          duration: 7,
          distance: 0.4,
          instructions: '從公車站步行至南港車站',
          from: { name: '南港車站公車站', coordinates: { latitude: 25.0540, longitude: 121.6066 } },
          to: { name: '終點', coordinates: req.body.destination }
        }
      ]
    }
  ];

  res.json({
    success: true,
    data: {
      routes: mockRoutes,
      origin: {
        coordinates: req.body.origin,
        address: '台北車站',
        name: '台北車站'
      },
      destination: {
        coordinates: req.body.destination,
        address: '南港車站',
        name: '南港車站'
      },
      searchTime: new Date().toISOString(),
      alternatives: mockRoutes.length
    },
    message: `找到 ${mockRoutes.length} 條路線`,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🚀 測試服務器已啟動在 http://localhost:${port}`);
  console.log(`📚 健康檢查: http://localhost:${port}/health`);
});