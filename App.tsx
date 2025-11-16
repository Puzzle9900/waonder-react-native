import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MapView } from './components/Map/MapView';
import { MapControls } from './components/Map/MapControls';

export default function App() {
  const [isMapLoading, setIsMapLoading] = useState(true);

  const handleMapReady = () => {
    setIsMapLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {isMapLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      )}

      <MapView onMapReady={handleMapReady} />
      <MapControls />
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
});
