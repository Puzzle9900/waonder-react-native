import React from 'react';
import { StyleSheet } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { MAP_CONFIG } from '../../constants/mapConfig';

// Set access token to null (OpenFreeMap doesn't require authentication)
MapLibreGL.setAccessToken(null);

interface MapViewProps {
  onMapReady?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({ onMapReady }) => {
  return (
    <MapLibreGL.MapView
      style={styles.map}
      mapStyle={MAP_CONFIG.styleUrl}
      compassEnabled={MAP_CONFIG.compassEnabled}
      attributionEnabled={MAP_CONFIG.attributionEnabled}
      logoEnabled={MAP_CONFIG.logoEnabled}
      onDidFinishLoadingMap={onMapReady}
    >
      <MapLibreGL.Camera
        zoomLevel={MAP_CONFIG.initialViewport.zoom}
        centerCoordinate={MAP_CONFIG.initialViewport.center}
      />
    </MapLibreGL.MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
