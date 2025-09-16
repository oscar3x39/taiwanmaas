/**
 * 🤖 AI-Generated Mock Data Service
 * 📝 Human-Reviewed and Optimized
 * 
 * 台灣交通模擬資料服務
 * 提供真實的台灣地理位置和交通站點資料用於展示
 */

import {
  Coordinates,
  Location,
  Station,
  TransportMode,
  TaiwanCity,
  TransportInfo,
  Route,
  RouteSegment,
  RealTimeInfo
} from '../types';

export class MockDataService {
  private static instance: MockDataService;
  
  // 台灣主要城市資料
  private readonly taiwanCities: TaiwanCity[] = [
    {
      id: 'taipei',
      name: '台北市',
      englishName: 'Taipei',
      coordinates: { latitude: 25.0330, longitude: 121.5654 },
      popularDestinations: [
        { coordinates: { latitude: 25.0478, longitude: 121.5170 }, address: '台北車站', name: '台北車站' },
        { coordinates: { latitude: 25.0340, longitude: 121.5645 }, address: '台北101', name: '台北101' },
        { coordinates: { latitude: 25.0418, longitude: 121.5071 }, address: '西門町', name: '西門町' },
        { coordinates: { latitude: 25.0881, longitude: 121.5240 }, address: '士林夜市', name: '士林夜市' },
        { coordinates: { latitude: 25.0197, longitude: 121.5408 }, address: '國父紀念館', name: '國父紀念館' }
      ],
      transportHubs: []
    },
    {
      id: 'taichung',
      name: '台中市',
      englishName: 'Taichung',
      coordinates: { latitude: 24.1477, longitude: 120.6736 },
      popularDestinations: [
        { coordinates: { latitude: 24.1369, longitude: 120.6861 }, address: '台中車站', name: '台中車站' },
        { coordinates: { latitude: 24.1631, longitude: 120.6467 }, address: '逢甲夜市', name: '逢甲夜市' },
        { coordinates: { latitude: 24.1378, longitude: 120.6658 }, address: '一中街', name: '一中街' }
      ],
      transportHubs: []
    },
    {
      id: 'kaohsiung',
      name: '高雄市',
      englishName: 'Kaohsiung',
      coordinates: { latitude: 22.6273, longitude: 120.3014 },
      popularDestinations: [
        { coordinates: { latitude: 22.6391, longitude: 120.3018 }, address: '高雄車站', name: '高雄車站' },
        { coordinates: { latitude: 22.6205, longitude: 120.2647 }, address: '西子灣', name: '西子灣' },
        { coordinates: { latitude: 22.6264, longitude: 120.2813 }, address: '駁二藝術特區', name: '駁二藝術特區' }
      ],
      transportHubs: []
    }
  ];

  // 台北捷運站點資料
  private readonly mrtStations: Station[] = [
    // 淡水信義線
    { id: 'r28', name: '淡水', coordinates: { latitude: 25.1678, longitude: 121.4395 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r27', name: '紅樹林', coordinates: { latitude: 25.1538, longitude: 121.4581 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r26', name: '竹圍', coordinates: { latitude: 25.1370, longitude: 121.4593 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r25', name: '關渡', coordinates: { latitude: 25.1257, longitude: 121.4671 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r24', name: '忠義', coordinates: { latitude: 25.1307, longitude: 121.4748 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r23', name: '復興崗', coordinates: { latitude: 25.1375, longitude: 121.4853 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r22', name: '北投', coordinates: { latitude: 25.1317, longitude: 121.4985 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r21', name: '奇岩', coordinates: { latitude: 25.1258, longitude: 121.5016 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r20', name: '唭哩岸', coordinates: { latitude: 25.1201, longitude: 121.5063 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r19', name: '石牌', coordinates: { latitude: 25.1142, longitude: 121.5158 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r18', name: '明德', coordinates: { latitude: 25.1097, longitude: 121.5190 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r17', name: '芝山', coordinates: { latitude: 25.1032, longitude: 121.5225 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r16', name: '士林', coordinates: { latitude: 25.0938, longitude: 121.5260 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r15', name: '劍潭', coordinates: { latitude: 25.0847, longitude: 121.5251 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r14', name: '圓山', coordinates: { latitude: 25.0719, longitude: 121.5200 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r13', name: '民權西路', coordinates: { latitude: 25.0627, longitude: 121.5200 }, type: TransportMode.MRT, lines: ['淡水信義線', '松山新店線'] },
    { id: 'r12', name: '雙連', coordinates: { latitude: 25.0574, longitude: 121.5200 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r11', name: '中山', coordinates: { latitude: 25.0521, longitude: 121.5200 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r10', name: '台北車站', coordinates: { latitude: 25.0478, longitude: 121.5170 }, type: TransportMode.MRT, lines: ['淡水信義線', '板南線'] },
    { id: 'r09', name: '台大醫院', coordinates: { latitude: 25.0418, longitude: 121.5170 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r08', name: '中正紀念堂', coordinates: { latitude: 25.0329, longitude: 121.5180 }, type: TransportMode.MRT, lines: ['淡水信義線', '松山新店線'] },
    { id: 'r07', name: '東門', coordinates: { latitude: 25.0341, longitude: 121.5288 }, type: TransportMode.MRT, lines: ['淡水信義線', '中和新蘆線'] },
    { id: 'r06', name: '大安森林公園', coordinates: { latitude: 25.0329, longitude: 121.5358 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r05', name: '大安', coordinates: { latitude: 25.0329, longitude: 121.5434 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r04', name: '信義安和', coordinates: { latitude: 25.0329, longitude: 121.5527 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r03', name: '台北101/世貿', coordinates: { latitude: 25.0329, longitude: 121.5627 }, type: TransportMode.MRT, lines: ['淡水信義線'] },
    { id: 'r02', name: '象山', coordinates: { latitude: 25.0329, longitude: 121.5697 }, type: TransportMode.MRT, lines: ['淡水信義線'] }
  ];

  // 公車站點資料（部分）
  private readonly busStations: Station[] = [
    { id: 'bus_001', name: '台北車站（忠孝）', coordinates: { latitude: 25.0478, longitude: 121.5170 }, type: TransportMode.BUS, lines: ['299', '307', '重慶幹線'] },
    { id: 'bus_002', name: '西門町', coordinates: { latitude: 25.0418, longitude: 121.5071 }, type: TransportMode.BUS, lines: ['299', '307'] },
    { id: 'bus_003', name: '台北101', coordinates: { latitude: 25.0340, longitude: 121.5645 }, type: TransportMode.BUS, lines: ['信義幹線', '藍5'] },
    { id: 'bus_004', name: '士林夜市', coordinates: { latitude: 25.0881, longitude: 121.5240 }, type: TransportMode.BUS, lines: ['紅30', '255'] }
  ];

  // 高鐵站點資料
  private readonly hsrStations: Station[] = [
    { id: 'hsr_nangang', name: '南港站', coordinates: { latitude: 25.0626, longitude: 121.6066 }, type: TransportMode.HSR, lines: ['台灣高鐵'] },
    { id: 'hsr_taipei', name: '台北站', coordinates: { latitude: 25.0478, longitude: 121.5170 }, type: TransportMode.HSR, lines: ['台灣高鐵'] },
    { id: 'hsr_banqiao', name: '板橋站', coordinates: { latitude: 25.0138, longitude: 121.4627 }, type: TransportMode.HSR, lines: ['台灣高鐵'] },
    { id: 'hsr_taoyuan', name: '桃園站', coordinates: { latitude: 25.0112, longitude: 121.2148 }, type: TransportMode.HSR, lines: ['台灣高鐵'] },
    { id: 'hsr_hsinchu', name: '新竹站', coordinates: { latitude: 24.8066, longitude: 121.0404 }, type: TransportMode.HSR, lines: ['台灣高鐵'] },
    { id: 'hsr_taichung', name: '台中站', coordinates: { latitude: 24.1135, longitude: 120.6169 }, type: TransportMode.HSR, lines: ['台灣高鐵'] },
    { id: 'hsr_chiayi', name: '嘉義站', coordinates: { latitude: 23.4593, longitude: 120.3123 }, type: TransportMode.HSR, lines: ['台灣高鐵'] },
    { id: 'hsr_tainan', name: '台南站', coordinates: { latitude: 22.9244, longitude: 120.2873 }, type: TransportMode.HSR, lines: ['台灣高鐵'] },
    { id: 'hsr_zuoying', name: '左營站', coordinates: { latitude: 22.6871, longitude: 120.3072 }, type: TransportMode.HSR, lines: ['台灣高鐵'] }
  ];

  // 交通工具資訊
  private readonly transportInfo: TransportInfo[] = [
    {
      mode: TransportMode.WALK,
      name: '步行',
      avgSpeed: 5,
      costPerKm: 0,
      carbonPerKm: 0,
      availability: { startTime: '00:00', endTime: '23:59', frequency: 0 }
    },
    {
      mode: TransportMode.MRT,
      name: '台北捷運',
      avgSpeed: 35,
      costPerKm: 8,
      carbonPerKm: 15,
      availability: { startTime: '06:00', endTime: '24:00', frequency: 3 }
    },
    {
      mode: TransportMode.BUS,
      name: '公車',
      avgSpeed: 20,
      costPerKm: 6,
      carbonPerKm: 80,
      availability: { startTime: '05:30', endTime: '23:30', frequency: 10 }
    },
    {
      mode: TransportMode.HSR,
      name: '台灣高鐵',
      avgSpeed: 250,
      costPerKm: 25,
      carbonPerKm: 30,
      availability: { startTime: '06:30', endTime: '23:30', frequency: 30 }
    },
    {
      mode: TransportMode.TRAIN,
      name: '台鐵',
      avgSpeed: 80,
      costPerKm: 12,
      carbonPerKm: 45,
      availability: { startTime: '05:00', endTime: '24:00', frequency: 60 }
    },
    {
      mode: TransportMode.YOUBIKE,
      name: 'YouBike',
      avgSpeed: 15,
      costPerKm: 2,
      carbonPerKm: 0,
      availability: { startTime: '00:00', endTime: '23:59', frequency: 0 }
    }
  ];

  private constructor() {
    // 初始化交通樞紐資料
    this.initializeTransportHubs();
  }

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  /**
   * 初始化交通樞紐資料
   */
  private initializeTransportHubs(): void {
    // 為台北市添加交通樞紐
    const taipeiCity = this.taiwanCities.find(city => city.id === 'taipei');
    if (taipeiCity) {
      taipeiCity.transportHubs = [
        ...this.mrtStations.slice(0, 10), // 部分捷運站
        ...this.busStations,
        ...this.hsrStations.filter(station => station.name.includes('台北') || station.name.includes('南港'))
      ];
    }
  }

  /**
   * 獲取台灣城市列表
   */
  public getTaiwanCities(): TaiwanCity[] {
    return [...this.taiwanCities];
  }

  /**
   * 根據城市 ID 獲取城市資訊
   */
  public getCityById(cityId: string): TaiwanCity | undefined {
    return this.taiwanCities.find(city => city.id === cityId);
  }

  /**
   * 獲取所有捷運站點
   */
  public getMRTStations(): Station[] {
    return [...this.mrtStations];
  }

  /**
   * 獲取所有公車站點
   */
  public getBusStations(): Station[] {
    return [...this.busStations];
  }

  /**
   * 獲取所有高鐵站點
   */
  public getHSRStations(): Station[] {
    return [...this.hsrStations];
  }

  /**
   * 獲取所有交通站點
   */
  public getAllStations(): Station[] {
    return [...this.mrtStations, ...this.busStations, ...this.hsrStations];
  }

  /**
   * 根據座標尋找最近的交通站點
   */
  public findNearestStations(coordinates: Coordinates, maxDistance: number = 1000, limit: number = 5): Station[] {
    const allStations = this.getAllStations();
    
    const stationsWithDistance = allStations.map(station => ({
      ...station,
      distance: this.calculateDistance(coordinates, station.coordinates)
    }));

    return stationsWithDistance
      .filter(station => station.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .map(({ distance, ...station }) => station);
  }

  /**
   * 根據交通工具類型獲取站點
   */
  public getStationsByMode(mode: TransportMode): Station[] {
    return this.getAllStations().filter(station => station.type === mode);
  }

  /**
   * 獲取交通工具資訊
   */
  public getTransportInfo(): TransportInfo[] {
    return [...this.transportInfo];
  }

  /**
   * 根據交通工具類型獲取資訊
   */
  public getTransportInfoByMode(mode: TransportMode): TransportInfo | undefined {
    return this.transportInfo.find(info => info.mode === mode);
  }

  /**
   * 生成模擬路線資料
   */
  public generateMockRoutes(origin: Coordinates, destination: Coordinates): Route[] {
    const routes: Route[] = [];
    
    // 最快路線（捷運 + 步行）
    const fastestRoute = this.generateFastestRoute(origin, destination);
    if (fastestRoute) routes.push(fastestRoute);

    // 最便宜路線（公車）
    const cheapestRoute = this.generateCheapestRoute(origin, destination);
    if (cheapestRoute) routes.push(cheapestRoute);

    // 最少轉乘路線
    const leastTransferRoute = this.generateLeastTransferRoute(origin, destination);
    if (leastTransferRoute) routes.push(leastTransferRoute);

    return routes;
  }

  /**
   * 生成最快路線
   */
  private generateFastestRoute(origin: Coordinates, destination: Coordinates): Route | null {
    const nearestOriginStation = this.findNearestStations(origin, 1000, 1)[0];
    const nearestDestStation = this.findNearestStations(destination, 1000, 1)[0];

    if (!nearestOriginStation || !nearestDestStation) return null;

    const segments: RouteSegment[] = [
      {
        mode: TransportMode.WALK,
        from: { id: 'origin', name: '起點', coordinates: origin, type: TransportMode.WALK },
        to: nearestOriginStation,
        duration: Math.ceil(this.calculateDistance(origin, nearestOriginStation.coordinates) / 5 * 60), // 步行速度 5km/h
        cost: 0,
        instructions: [`步行至${nearestOriginStation.name}`],
        distance: this.calculateDistance(origin, nearestOriginStation.coordinates)
      },
      {
        mode: nearestOriginStation.type,
        from: nearestOriginStation,
        to: nearestDestStation,
        duration: Math.ceil(this.calculateDistance(nearestOriginStation.coordinates, nearestDestStation.coordinates) / 35 * 60), // 捷運速度 35km/h
        cost: 25,
        instructions: [`搭乘${nearestOriginStation.lines?.[0] || '捷運'}至${nearestDestStation.name}`],
        line: nearestOriginStation.lines?.[0] || undefined,
        distance: this.calculateDistance(nearestOriginStation.coordinates, nearestDestStation.coordinates)
      },
      {
        mode: TransportMode.WALK,
        from: nearestDestStation,
        to: { id: 'destination', name: '終點', coordinates: destination, type: TransportMode.WALK },
        duration: Math.ceil(this.calculateDistance(nearestDestStation.coordinates, destination) / 5 * 60),
        cost: 0,
        instructions: [`步行至目的地`],
        distance: this.calculateDistance(nearestDestStation.coordinates, destination)
      }
    ];

    const totalTime = segments.reduce((sum, segment) => sum + segment.duration, 0);
    const totalCost = segments.reduce((sum, segment) => sum + segment.cost, 0);
    const totalDistance = segments.reduce((sum, segment) => sum + (segment.distance || 0), 0);

    return {
      id: `route_fastest_${Date.now()}`,
      type: '最快路線',
      totalTime,
      totalCost,
      totalDistance,
      transfers: 1,
      segments,
      carbonFootprint: this.calculateCarbonFootprint(segments)
    };
  }

  /**
   * 生成最便宜路線
   */
  private generateCheapestRoute(origin: Coordinates, destination: Coordinates): Route | null {
    const busStations = this.getBusStations();
    const nearestOriginBus = busStations.find(station => 
      this.calculateDistance(origin, station.coordinates) <= 0.5
    );
    const nearestDestBus = busStations.find(station => 
      this.calculateDistance(destination, station.coordinates) <= 0.5
    );

    if (!nearestOriginBus || !nearestDestBus) return null;

    const segments: RouteSegment[] = [
      {
        mode: TransportMode.WALK,
        from: { id: 'origin', name: '起點', coordinates: origin, type: TransportMode.WALK },
        to: nearestOriginBus,
        duration: Math.ceil(this.calculateDistance(origin, nearestOriginBus.coordinates) / 5 * 60),
        cost: 0,
        instructions: [`步行至${nearestOriginBus.name}`],
        distance: this.calculateDistance(origin, nearestOriginBus.coordinates)
      },
      {
        mode: TransportMode.BUS,
        from: nearestOriginBus,
        to: nearestDestBus,
        duration: Math.ceil(this.calculateDistance(nearestOriginBus.coordinates, nearestDestBus.coordinates) / 20 * 60),
        cost: 15,
        instructions: [`搭乘${nearestOriginBus.lines?.[0] || '公車'}至${nearestDestBus.name}`],
        line: nearestOriginBus.lines?.[0] || undefined,
        distance: this.calculateDistance(nearestOriginBus.coordinates, nearestDestBus.coordinates)
      },
      {
        mode: TransportMode.WALK,
        from: nearestDestBus,
        to: { id: 'destination', name: '終點', coordinates: destination, type: TransportMode.WALK },
        duration: Math.ceil(this.calculateDistance(nearestDestBus.coordinates, destination) / 5 * 60),
        cost: 0,
        instructions: [`步行至目的地`],
        distance: this.calculateDistance(nearestDestBus.coordinates, destination)
      }
    ];

    const totalTime = segments.reduce((sum, segment) => sum + segment.duration, 0);
    const totalCost = segments.reduce((sum, segment) => sum + segment.cost, 0);
    const totalDistance = segments.reduce((sum, segment) => sum + (segment.distance || 0), 0);

    return {
      id: `route_cheapest_${Date.now()}`,
      type: '最便宜路線',
      totalTime,
      totalCost,
      totalDistance,
      transfers: 0,
      segments,
      carbonFootprint: this.calculateCarbonFootprint(segments)
    };
  }

  /**
   * 生成最少轉乘路線
   */
  private generateLeastTransferRoute(origin: Coordinates, destination: Coordinates): Route | null {
    // 簡化版：直接搭乘計程車
    const distance = this.calculateDistance(origin, destination);
    const duration = Math.ceil(distance / 30 * 60); // 計程車平均速度 30km/h
    const cost = Math.ceil(distance * 40); // 每公里約 40 元

    const segments: RouteSegment[] = [
      {
        mode: TransportMode.TAXI,
        from: { id: 'origin', name: '起點', coordinates: origin, type: TransportMode.WALK },
        to: { id: 'destination', name: '終點', coordinates: destination, type: TransportMode.WALK },
        duration,
        cost,
        instructions: ['搭乘計程車直達目的地'],
        distance
      }
    ];

    return {
      id: `route_no_transfer_${Date.now()}`,
      type: '最少轉乘',
      totalTime: duration,
      totalCost: cost,
      totalDistance: distance,
      transfers: 0,
      segments,
      carbonFootprint: this.calculateCarbonFootprint(segments)
    };
  }

  /**
   * 計算兩點間距離（公里）
   */
  private calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // 地球半徑（公里）
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(coord1.latitude)) * 
              Math.cos(this.toRadians(coord2.latitude)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * 角度轉弧度
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * 計算路線碳足跡
   */
  private calculateCarbonFootprint(segments: RouteSegment[]): number {
    return segments.reduce((total, segment) => {
      const transportInfo = this.getTransportInfoByMode(segment.mode);
      if (transportInfo && segment.distance) {
        return total + (transportInfo.carbonPerKm * segment.distance);
      }
      return total;
    }, 0);
  }

  /**
   * 獲取模擬即時資訊
   */
  public getMockRealTimeInfo(stationId: string): RealTimeInfo | null {
    const station = this.getAllStations().find(s => s.id === stationId);
    if (!station) return null;

    return {
      stationId,
      mode: station.type,
      line: station.lines?.[0] || undefined,
      arrivals: [
        {
          destination: '終點站',
          estimatedTime: Math.floor(Math.random() * 10) + 1,
          status: 'on-time'
        },
        {
          destination: '終點站',
          estimatedTime: Math.floor(Math.random() * 15) + 5,
          status: 'on-time'
        }
      ],
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * 搜尋地點
   */
  public searchLocations(query: string, limit: number = 10): Location[] {
    const allLocations: Location[] = [];
    
    // 搜尋城市熱門景點
    this.taiwanCities.forEach(city => {
      allLocations.push(...city.popularDestinations);
    });

    // 搜尋交通站點
    this.getAllStations().forEach(station => {
      allLocations.push({
        coordinates: station.coordinates,
        address: station.address || station.name,
        name: station.name
      });
    });

    // 模糊搜尋
    const results = allLocations.filter(location => 
      location.name?.toLowerCase().includes(query.toLowerCase()) ||
      location.address.toLowerCase().includes(query.toLowerCase())
    );

    return results.slice(0, limit);
  }
}