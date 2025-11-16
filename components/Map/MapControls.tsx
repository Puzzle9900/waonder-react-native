import React from 'react';
import { View, StyleSheet } from 'react-native';

interface MapControlsProps {
  onLocationPress?: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({ onLocationPress }) => {
  // Placeholder for map controls (zoom buttons, location button)
  // Will be implemented in Phase 4
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    gap: 10,
  },
});
