import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import { MAP_CONFIG } from '../../constants/mapConfig';

// Set access token to null (OpenFreeMap doesn't require authentication)
MapLibreGL.setAccessToken(null);

interface MapViewProps {
  onMapReady?: () => void;
  userLocation?: Location.LocationObject | null;
}

export const MapView: React.FC<MapViewProps> = ({ onMapReady, userLocation }) => {
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (userLocation && cameraRef.current) {
      // Animate camera to user location when it updates
      cameraRef.current.setCamera({
        centerCoordinate: [
          userLocation.coords.longitude,
          userLocation.coords.latitude,
        ],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  }, [userLocation]);

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
        ref={cameraRef}
        zoomLevel={MAP_CONFIG.initialViewport.zoom}
        centerCoordinate={MAP_CONFIG.initialViewport.center}
      />

      {userLocation && (
        <MapLibreGL.PointAnnotation
          id="user-location"
          coordinate={[
            userLocation.coords.longitude,
            userLocation.coords.latitude,
          ]}
        >
          <MapLibreGL.Callout title="Your Location" />
        </MapLibreGL.PointAnnotation>
      )}
    </MapLibreGL.MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
