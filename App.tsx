import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, ActivityIndicator, View, Text, TouchableOpacity, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { MapView } from './components/Map/MapView';
import { MapControls } from './components/Map/MapControls';

type LocationPermissionStatus = 'granted' | 'denied' | 'undetermined' | 'restricted';

export default function App() {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState<LocationPermissionStatus>('undetermined');
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        setLocationPermission('granted');
        // Get initial location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setCurrentLocation(location);
      } else {
        setLocationPermission('denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationPermission('denied');
    }
  };

  const handleMapReady = () => {
    setIsMapLoading(false);
  };

  const handleLocationPress = async () => {
    if (locationPermission === 'granted') {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setCurrentLocation(location);
      } catch (error) {
        console.error('Error getting current location:', error);
      }
    } else if (locationPermission === 'denied') {
      // Prompt user to enable location in settings
      Linking.openSettings();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {isMapLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      )}

      {locationPermission === 'denied' && !isMapLoading && (
        <View style={styles.permissionBanner}>
          <Text style={styles.permissionText}>
            Location permission required. Enable in Settings.
          </Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      )}

      <MapView
        onMapReady={handleMapReady}
        userLocation={currentLocation}
      />
      <MapControls
        onLocationPress={handleLocationPress}
        hasLocationPermission={locationPermission === 'granted'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },
  permissionBanner: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#FF9800',
    padding: 16,
    borderRadius: 8,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  permissionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  settingsButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  settingsButtonText: {
    color: '#FF9800',
    fontSize: 14,
    fontWeight: '600',
  },
});
