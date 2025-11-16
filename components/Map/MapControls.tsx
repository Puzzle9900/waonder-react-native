import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

/**
 * Props for the MapControls component
 */
interface MapControlsProps {
  /** Callback fired when the location button is pressed */
  onLocationPress?: () => void;
  /** Whether location permission has been granted */
  hasLocationPermission?: boolean;
}

/**
 * MapControls Component
 *
 * Renders map control buttons overlaid on the map.
 * Currently includes a user location button that centers the map on the user's position.
 *
 * Features:
 * - Location button with 48x48pt touch target for accessibility
 * - Disabled state when location permission not granted
 * - Positioned in bottom-right corner with elevation/shadow
 *
 * @param props - MapControls component props
 * @returns Map control buttons
 *
 * @example
 * ```tsx
 * <MapControls
 *   onLocationPress={handleLocationPress}
 *   hasLocationPermission={true}
 * />
 * ```
 */
export const MapControls: React.FC<MapControlsProps> = ({
  onLocationPress,
  hasLocationPermission = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          !hasLocationPermission && styles.buttonDisabled,
        ]}
        onPress={onLocationPress}
        disabled={!hasLocationPermission && !onLocationPress}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonIcon}>📍</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    gap: 10,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  buttonIcon: {
    fontSize: 24,
  },
});
