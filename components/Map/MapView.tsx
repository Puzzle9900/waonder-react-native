import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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
  const [mapError, setMapError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

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

  const handleMapLoadError = () => {
    console.error('Map failed to load');
    setMapError("Map tiles couldn't load. Check your connection.");
  };

  const handleRetry = () => {
    setMapError(null);
    setRetryCount(prev => prev + 1);
  };

  if (mapError) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorIcon}>🗺️</Text>
          <Text style={styles.errorTitle}>Map Loading Failed</Text>
          <Text style={styles.errorMessage}>{mapError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <MapLibreGL.MapView
      key={`map-${retryCount}`}
      style={styles.map}
      mapStyle={MAP_CONFIG.styleUrl}
      compassEnabled={MAP_CONFIG.compassEnabled}
      attributionEnabled={MAP_CONFIG.attributionEnabled}
      logoEnabled={MAP_CONFIG.logoEnabled}
      onDidFinishLoadingMap={onMapReady}
      onDidFailLoadingMap={handleMapLoadError}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
