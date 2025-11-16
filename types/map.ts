export interface MapConfig {
  styleUrl: string;
  initialViewport: MapViewport;
  minZoom: number;
  maxZoom: number;
  compassEnabled: boolean;
  attributionEnabled: boolean;
  logoEnabled: boolean;
}

export interface MapViewport {
  center: [number, number]; // [longitude, latitude]
  zoom: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}
