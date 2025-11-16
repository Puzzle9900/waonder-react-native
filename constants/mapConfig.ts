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
