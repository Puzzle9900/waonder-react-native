import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, ActivityIndicator, View, Text, TouchableOpacity, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { MapView } from './components/Map/MapView';
import { MapControls } from './components/Map/MapControls';
import { MapAttribution } from './components/Map/MapAttribution';
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Location permission status type
 * Maps to the various states of location permission on iOS and Android
 */
type LocationPermissionStatus = 'granted' | 'denied' | 'undetermined' | 'restricted';

/**
 * App Component
 *
 * Root component for the Waonder mobile application.
 * Manages location permissions, map state, and coordinates child components.
 *
 * Features:
 * - Automatic location permission request on mount
 * - Permission status banners with settings deep-link
 * - Error boundary wrapping for graceful error handling
 * - Loading states during map initialization
 *
 * @returns Root application component
 */
export default function App() {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState<LocationPermissionStatus>('undetermined');
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  /**
   * Requests foreground location permission from the user
   *
   * Flow:
   * 1. Checks if location services are enabled on device
   * 2. Requests foreground permission (not background - known bugs in SDK 52)
   * 3. If granted, attempts to get initial location
   * 4. Sets permission status for UI rendering
   *
   * Error handling:
   * - Disabled location services → 'restricted' status
   * - Permission denied → 'denied' status
   * - GPS unavailable/timeout → still 'granted' (user can retry with button)
   */
  const requestLocationPermission = async () => {
    try {
      // First check if location services are enabled
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        console.warn('Location services are disabled on device');
        setLocationPermission('restricted');
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        setLocationPermission('granted');
        // Get initial location with timeout and error handling
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 0,
          });
          setCurrentLocation(location);
        } catch (locationError) {
          console.error('Error getting initial location:', locationError);
          // Permission granted but couldn't get location (GPS unavailable, timeout, etc.)
          // We'll still set permission as granted so user can try location button
        }
      } else {
        setLocationPermission('denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationPermission('denied');
    }
  };

  /**
   * Callback fired when map finishes loading
   * Hides the loading indicator overlay
   */
  const handleMapReady = () => {
    setIsMapLoading(false);
  };

  /**
   * Handles location button press
   *
   * Behavior:
   * - If permission granted: Gets current location and centers map
   * - If permission denied/restricted: Opens device settings
   *
   * Error handling:
   * - Timeout errors (10s limit)
   * - GPS unavailable errors
   * - Low accuracy warnings (>100m)
   *
   * @see requestLocationPermission for initial permission flow
   */
  const handleLocationPress = async () => {
    if (locationPermission === 'granted') {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // 10 second timeout
          distanceInterval: 0,
        });

        // Check accuracy and warn if low (> 100m)
        if (location.coords.accuracy && location.coords.accuracy > 100) {
          console.warn(`Low GPS accuracy: ${location.coords.accuracy}m`);
        }

        setCurrentLocation(location);
      } catch (error: any) {
        console.error('Error getting current location:', error);

        // Provide user-friendly error messages based on error type
        let errorMessage = "Couldn't determine your location.";
        if (error?.code === 'E_LOCATION_TIMEOUT') {
          errorMessage = "Location request timed out. Try again.";
        } else if (error?.code === 'E_LOCATION_UNAVAILABLE') {
          errorMessage = "Location services unavailable. Enable GPS.";
        }

        // TODO: Show error message to user (could use Alert or toast)
        console.log('User-friendly error:', errorMessage);
      }
    } else if (locationPermission === 'denied' || locationPermission === 'restricted') {
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

      {(locationPermission === 'denied' || locationPermission === 'restricted') && !isMapLoading && (
        <View style={styles.permissionBanner}>
          <Text style={styles.permissionText}>
            {locationPermission === 'restricted'
              ? 'Location services are disabled. Enable in device settings.'
              : 'Location permission required. Enable in Settings.'}
          </Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      )}

      <ErrorBoundary fallbackMessage="Map failed to initialize. Please restart the app.">
        <MapView
          onMapReady={handleMapReady}
          userLocation={currentLocation}
        />
        <MapControls
          onLocationPress={handleLocationPress}
          hasLocationPermission={locationPermission === 'granted'}
        />
        <MapAttribution />
      </ErrorBoundary>
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
