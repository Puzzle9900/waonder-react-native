/**
 * MapLibre GL Map Configuration
 *
 * Centralized configuration for map rendering and interaction settings.
 *
 * Key decisions:
 * - OpenFreeMap Liberty style: Zero-cost, no API keys, OSM-based
 * - Max zoom 18: Balances detail vs. tile loading performance
 * - World view initial viewport: Shows global context on app launch
 * - Attribution enabled: Required by OSM/MapLibre licenses
 *
 * To change map style, update styleUrl to:
 * - MapTiler free tier: https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY
 * - OpenFreeMap Positron (light): https://tiles.openfreemap.org/styles/positron
 * - Custom style: Any MapLibre GL JSON style URL
 */
export const MAP_CONFIG = {
  // OpenFreeMap Liberty style - free, no API key required
  styleUrl: 'https://tiles.openfreemap.org/styles/liberty',

  // Initial viewport - world view centered slightly north to show more land
  initialViewport: {
    center: [0, 20] as [number, number], // [longitude, latitude]
    zoom: 2,
  },

  // Zoom level constraints
  minZoom: 0,
  maxZoom: 18,

  // Map interaction settings
  compassEnabled: true,
  attributionEnabled: true,
  logoEnabled: true,
} as const;
