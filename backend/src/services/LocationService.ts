/**
 * 🤖 AI-Generated Location Service
 * 📝 Human-Reviewed and Optimized
 * 
 * 地點服務 - 處理地理座標驗證、地址解析和地點搜尋
 * 展示地理資料處理和驗證邏輯
 */

import { Coordinates, Location, Station, LocationSearchRequest, LocationSearchResponse } from '../types';
import { MockDataService } from './MockDataService';
import { logger } from '../utils/logger';
import { errors } from '../middleware/errorHandler';

export class LocationService {
  private mockDataService: MockDataService;

  constructor() {
    this.mockDataService = MockDataService.getInstance();
  }

  /**
   * 驗證座標是否有效
   */
  public validateCoordinates(coordinates: Coordinates): boolean {
    const { latitude, longitude } = coordinates;
    
    // 基本範圍檢查
    if (latitude < -90 || latitude > 90) {
      return false;
    }
    
    if (longitude < -180 || longitude > 180) {
      return false;
    }

    // 檢查是否為數字
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return false;
    }

    // 檢查是否為 NaN
    if (isNaN(latitude) || isNaN(longitude)) {
      return false;
    }

    return true;
  }

  /**
   * 驗證座標是否在台灣範圍內
   */
  public isInTaiwan(coordinates: Coordinates): boolean {
    const { latitude, longitude } = coordinates;
    
    // 台灣大致範圍
    const taiwanBounds = {
      north: 25.3,
      south: 21.9,
      east: 122.0,
      west: 119.3
    };

    return latitude >= taiwanBounds.south && 
           latitude <= taiwanBounds.north &&
           longitude >= taiwanBounds.west && 
           longitude <= taiwanBounds.east;
  }

  /**
   * 反向地理編碼 - 將座標轉換為地址
   * 在真實環境中會調用 Google Maps API 或其他地理編碼服務
   */
  public async reverseGeocode(coordinates: Coordinates): Promise<Location> {
    logger.info('Reverse geocoding coordinates', { coordinates });

    if (!this.validateCoordinates(coordinates)) {
      throw errors.invalidCoordinates('Invalid coordinates provided');
    }

    if (!this.isInTaiwan(coordinates)) {
      throw errors.locationNotFound('Location is outside Taiwan');
    }

    // 尋找最近的已知地點
    const nearestStations = this.mockDataService.findNearestStations(coordinates, 2000, 1);
    
    if (nearestStations.length > 0) {
      const nearestStation = nearestStations[0];
      if (nearestStation) {
        const distance = this.calculateDistance(coordinates, nearestStation.coordinates);
        
        return {
          coordinates,
          address: distance < 0.5 
            ? nearestStation.name 
            : `${nearestStation.name}附近`,
          name: distance < 0.2 ? nearestStation.name : undefined
        };
      }
    }

    // 根據座標推測地區
    const estimatedAddress = this.estimateAddressByCoordinates(coordinates);
    
    return {
      coordinates,
      address: estimatedAddress,
      name: undefined
    };
  }

  /**
   * 地理編碼 - 將地址轉換為座標
   */
  public async geocode(address: string): Promise<Location[]> {
    logger.info('Geocoding address', { address });

    if (!address || address.trim().length === 0) {
      throw errors.badRequest('Address cannot be empty');
    }

    // 搜尋已知地點
    const searchResults = this.mockDataService.searchLocations(address, 10);
    
    if (searchResults.length === 0) {
      throw errors.locationNotFound(`No locations found for address: ${address}`);
    }

    return searchResults;
  }

  /**
   * 尋找附近的交通站點
   */
  public async findNearbyStations(
    coordinates: Coordinates, 
    maxDistance: number = 1000, 
    limit: number = 10
  ): Promise<Station[]> {
    logger.info('Finding nearby stations', { coordinates, maxDistance, limit });

    if (!this.validateCoordinates(coordinates)) {
      throw errors.invalidCoordinates('Invalid coordinates provided');
    }

    const nearbyStations = this.mockDataService.findNearestStations(coordinates, maxDistance, limit);
    
    logger.info(`Found ${nearbyStations.length} nearby stations`);
    
    return nearbyStations;
  }

  /**
   * 搜尋地點
   */
  public async searchLocations(request: LocationSearchRequest): Promise<LocationSearchResponse> {
    const { query, coordinates, radius = 5000, limit = 20 } = request;
    
    logger.info('Searching locations', { query, coordinates, radius, limit });

    if (!query || query.trim().length === 0) {
      throw errors.badRequest('Search query cannot be empty');
    }

    let results = this.mockDataService.searchLocations(query, limit * 2);

    // 如果提供了中心座標，按距離排序
    if (coordinates && this.validateCoordinates(coordinates)) {
      results = results
        .map(location => ({
          ...location,
          distance: this.calculateDistance(coordinates, location.coordinates)
        }))
        .filter(location => location.distance <= radius / 1000) // 轉換為公里
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit)
        .map(({ distance, ...location }) => location);
    } else {
      results = results.slice(0, limit);
    }

    return {
      locations: results,
      query,
      total: results.length
    };
  }

  /**
   * 計算兩點間距離（公里）
   */
  public calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
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
   * 根據座標推測地址
   */
  private estimateAddressByCoordinates(coordinates: Coordinates): string {
    const { latitude, longitude } = coordinates;

    // 台灣主要城市範圍判斷
    if (latitude >= 24.9 && latitude <= 25.3 && longitude >= 121.3 && longitude <= 121.7) {
      return '台北市';
    } else if (latitude >= 24.0 && latitude <= 24.3 && longitude >= 120.5 && longitude <= 120.8) {
      return '台中市';
    } else if (latitude >= 22.5 && latitude <= 22.8 && longitude >= 120.2 && longitude <= 120.4) {
      return '高雄市';
    } else if (latitude >= 22.9 && latitude <= 23.1 && longitude >= 120.1 && longitude <= 120.3) {
      return '台南市';
    } else if (latitude >= 24.7 && latitude <= 25.0 && longitude >= 121.4 && longitude <= 121.8) {
      return '新北市';
    } else if (latitude >= 24.9 && latitude <= 25.0 && longitude >= 121.1 && longitude <= 121.4) {
      return '桃園市';
    } else {
      return '台灣';
    }
  }

  /**
   * 驗證地點資料
   */
  public validateLocation(location: any): location is Location {
    if (!location || typeof location !== 'object') {
      return false;
    }

    if (!location.coordinates || !this.validateCoordinates(location.coordinates)) {
      return false;
    }

    if (!location.address || typeof location.address !== 'string' || location.address.trim().length === 0) {
      return false;
    }

    return true;
  }

  /**
   * 格式化地點資訊
   */
  public formatLocation(location: Location): Location {
    return {
      coordinates: {
        latitude: Number(location.coordinates.latitude.toFixed(6)),
        longitude: Number(location.coordinates.longitude.toFixed(6))
      },
      address: location.address.trim(),
      name: location.name?.trim() || undefined
    };
  }

  /**
   * 獲取地點的詳細資訊
   */
  public async getLocationDetails(coordinates: Coordinates): Promise<{
    location: Location;
    nearbyStations: Station[];
    estimatedAddress: string;
  }> {
    const location = await this.reverseGeocode(coordinates);
    const nearbyStations = await this.findNearbyStations(coordinates, 1000, 5);
    const estimatedAddress = this.estimateAddressByCoordinates(coordinates);

    return {
      location,
      nearbyStations,
      estimatedAddress
    };
  }
}