// 🤖 AI-Generated Test Setup
// 🧪 測試環境配置

import '@testing-library/jest-dom'

// 🗺️ Mock Leaflet for tests
global.L = {
  map: jest.fn(() => ({
    setView: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    fitBounds: jest.fn(),
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn(),
  })),
  marker: jest.fn(() => ({
    addTo: jest.fn(),
    bindPopup: jest.fn(),
  })),
  polyline: jest.fn(() => ({
    addTo: jest.fn(),
    bindPopup: jest.fn(),
  })),
  divIcon: jest.fn(),
  FeatureGroup: jest.fn(() => ({
    addLayer: jest.fn(),
    getBounds: jest.fn(),
    getLayers: jest.fn(() => []),
  })),
} as any

// 🌐 Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// 🗺️ Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}

Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation,
})

// 💾 Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// 🔄 Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
})