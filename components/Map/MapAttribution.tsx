import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

/**
 * MapAttribution component displays required OSM and MapLibre credits
 * Required by OpenStreetMap and OpenFreeMap license terms
 */
export const MapAttribution: React.FC = () => {
  const handleOpenOSM = () => {
    Linking.openURL('https://www.openstreetmap.org/copyright');
  };

  const handleOpenMapLibre = () => {
    Linking.openURL('https://maplibre.org/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Map data{' '}
        <TouchableOpacity onPress={handleOpenOSM} activeOpacity={0.7}>
          <Text style={styles.link}>© OpenStreetMap</Text>
        </TouchableOpacity>
        {' | '}
        <TouchableOpacity onPress={handleOpenMapLibre} activeOpacity={0.7}>
          <Text style={styles.link}>MapLibre</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    fontSize: 10,
    color: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    fontSize: 10,
    color: '#0066CC',
    textDecorationLine: 'underline',
  },
});
