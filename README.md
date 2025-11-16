# Waonder Mobile App

Location-aware cultural stories and experiences on an interactive world map.

## Overview

Waonder is a React Native mobile application built with Expo that provides an interactive map experience powered by MapLibre GL. The app allows users to explore the world through location-aware cultural stories and experiences.

**Current Status**: Foundation MVP (v0.1.0) - Interactive world map with location services

## Tech Stack

- **Framework**: React Native with Expo SDK 52 (managed workflow)
- **Map Rendering**: MapLibre GL Native v10.4.0
- **Map Tiles**: OpenFreeMap (Liberty style) - free, no API key required
- **Location Services**: expo-location 18.0.x
- **Language**: TypeScript (strict mode)

## Key Features

- Interactive world map with pan, zoom, and rotate gestures
- MapLibre GL rendering with OpenFreeMap tiles (zero-cost, high-performance)
- Location services with permission handling
- User location button with map centering animation
- Comprehensive error handling and loading states
- Permission status banners with settings deep-linking
- Map attribution display (OSM/MapLibre credits)

## Architecture Decisions

### MapLibre v10 + New Architecture Disabled

This project uses MapLibre v10 (stable) with Expo's new architecture **explicitly disabled** (`newArchEnabled: false` in `app.json`). This is a deliberate choice for stability:

- MapLibre v10 has compatibility issues with React Native's new architecture
- MapLibre v11 (alpha) has documented crashes and breaking changes
- Disabling new architecture is an acceptable tradeoff for a stable foundation
- Future maintainers: Do not enable new architecture without thorough testing

### OpenFreeMap Tiles

We use OpenFreeMap's Liberty style for map tiles:
- **Zero cost**: No API keys or rate limits
- **Performance**: CDN-backed tile delivery
- **License**: OpenStreetMap data (ODbL license)
- **Known issue**: GZIP compression errors on some mobile networks (test on real devices)

### Location Services

- **Foreground only**: iOS background location has known bugs in Expo SDK 52
- **Locked version**: expo-location@18.0.x to avoid Android crashes and iOS issues
- **Balanced accuracy**: Optimized for battery life vs. precision
- **Graceful degradation**: App functions without location permission

## Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- **iOS Development** (macOS only):
  - Xcode 15+
  - iOS Simulator configured
  - CocoaPods installed
- **Android Development**:
  - Android Studio
  - Android Emulator configured

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd waonder-react-native

# Install dependencies
npm install

# Generate native code (iOS and Android folders)
npx expo prebuild

# iOS: Install CocoaPods dependencies
cd ios && pod install && cd ..
```

## Running the App

### Development Server

```bash
# Start Expo development server
npm start

# Or use the convenience scripts:
npm run ios      # Run on iOS simulator
npm run android  # Run on Android emulator
```

### iOS Simulator

```bash
npx expo run:ios
```

**Requirements**:
- Xcode must be installed
- iOS simulator must be configured (Xcode > Settings > Platforms)
- CocoaPods dependencies must be installed

### Android Emulator

```bash
npx expo run:android
```

**Requirements**:
- Android Studio must be installed
- Android emulator must be running or device connected via ADB

### Testing on Physical Devices

Physical device testing is **recommended** for:
- GPS/location accuracy validation
- OpenFreeMap tile loading (GZIP issues don't appear in simulators)
- Touch gesture performance
- Real-world network conditions

**Expo Go is NOT supported** - this project requires custom native code (MapLibre plugin).

## Project Structure

```
waonder-react-native/
├── components/
│   ├── Map/
│   │   ├── MapView.tsx           # Main MapLibre map component
│   │   ├── MapControls.tsx       # Location button and controls
│   │   └── MapAttribution.tsx    # OSM/MapLibre credits
│   └── ErrorBoundary.tsx         # Error handling wrapper
├── constants/
│   └── mapConfig.ts              # Map configuration (style, viewport)
├── types/
│   └── map.ts                    # TypeScript interfaces
├── App.tsx                       # Root component with permission handling
├── app.json                      # Expo configuration
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## Configuration

### Map Style

Edit `constants/mapConfig.ts` to change the map style:

```typescript
export const MAP_CONFIG = {
  // Switch to MapTiler (14k free loads/month) if OpenFreeMap has issues:
  // styleUrl: 'https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY',

  styleUrl: 'https://tiles.openfreemap.org/styles/liberty',
  // ... other config
};
```

### Location Permissions

iOS and Android permissions are configured in `app.json`:

- **iOS**: `NSLocationWhenInUseUsageDescription` in `infoPlist`
- **Android**: `ACCESS_FINE_LOCATION` and `ACCESS_COARSE_LOCATION` in `permissions`

Permission prompts appear automatically on first launch.

### New Architecture

**Do not enable** React Native's new architecture without thorough testing:

```json
// app.json
{
  "expo": {
    "newArchEnabled": false  // Keep this disabled for MapLibre v10 compatibility
  }
}
```

## Known Issues & Limitations

### MapLibre v10 Compatibility

- **New architecture**: Not compatible - must remain disabled
- **iOS minimum**: iOS 12+ required
- **Android minimum**: Android 6.0+ (API 23) required

### expo-location Known Bugs

- **Android crashes**: Some devices experience ActivityCompat crashes (fixed in newer versions)
- **iOS background location**: Broken in SDK 52 - foreground only supported
- **Version locked**: Using 18.0.x to avoid these issues

### OpenFreeMap Tile Loading

- **GZIP errors**: Some mobile networks/devices fail to decompress tiles
- **Mitigation**: Test on real devices early
- **Fallback**: Switch to MapTiler if issues persist (see Configuration section)

### Performance Targets

- **Initial render**: <2s on mid-range devices (iPhone 12, Pixel 4a)
- **Frame rate**: 60fps during pan/zoom interactions
- **Memory usage**: <100MB baseline

If targets not met, consider:
- Reducing `maxZoom` to 16 (fewer tiles to load)
- Disabling rotation/tilt gestures
- Switching to simpler map style

## Testing

### Manual Testing Checklist

- [ ] Map renders on iOS simulator
- [ ] Map renders on Android emulator
- [ ] Location permission prompt appears on first launch
- [ ] Location button centers map on user location
- [ ] Pan, zoom, rotate gestures work smoothly
- [ ] OpenFreeMap tiles load without errors
- [ ] Error handling works (airplane mode, permission denied)
- [ ] Attribution display is visible

### Test Locations

Simulate locations in Xcode (iOS) or Android Emulator:
- **New York**: 40.7128, -74.0060
- **London**: 51.5074, -0.1278
- **Tokyo**: 35.6762, 139.6503
- **Sydney**: -33.8688, 151.2093

### Edge Cases to Test

- **Airplane mode**: Map should show cached tiles if available
- **Permission denied**: Permission banner should appear with settings link
- **GPS disabled**: Location button should prompt to enable in settings
- **Slow network**: Tiles should load progressively
- **Low accuracy GPS**: App should log warning (>100m accuracy)

## Troubleshooting

### iOS Build Fails

```bash
# Clean and reinstall CocoaPods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Clean Expo cache
npx expo prebuild --clean
```

### Android Build Fails

```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Rebuild
npx expo prebuild --clean
npx expo run:android
```

### Map Doesn't Render

1. Check console for errors (tiles loading, network issues)
2. Verify OpenFreeMap is accessible: `curl https://tiles.openfreemap.org/styles/liberty`
3. Try alternative style URL (see Configuration section)
4. Test on physical device (simulator may have network restrictions)

### Location Button Not Working

1. Check permission status in console logs
2. Verify location services enabled in device settings
3. Test with simulated location (don't rely on simulator's default location)
4. Check for expo-location errors in console

### Prebuild Fails

```bash
# Ensure Expo SDK 52 is installed
npm install expo@~52.0.0

# Ensure MapLibre plugin is in app.json
# "plugins": ["@maplibre/maplibre-react-native"]

# Run prebuild with clean flag
npx expo prebuild --clean
```

## Development Workflow

### Making Changes

1. Edit source code in `components/`, `constants/`, or `types/`
2. Changes hot-reload automatically in development mode
3. Test on both iOS and Android if changing platform-specific code
4. Run TypeScript type checking: `npx tsc --noEmit`

### Adding New Map Features

1. Check MapLibre React Native docs: https://maplibre.org/maplibre-react-native/
2. Add new components to `components/Map/`
3. Update types in `types/map.ts`
4. Update map config in `constants/mapConfig.ts`
5. Test on both platforms

### Committing Changes

Follow conventional commit format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Testing updates
- `chore:` - Maintenance tasks

```bash
git add .
git commit -m "feat: add map zoom controls"
```

## Performance Optimization

### Current Optimizations

- Balanced location accuracy (not high accuracy for battery)
- Max zoom limited to 18 (fewer tiles to download)
- Error boundaries prevent full app crashes
- Loading indicators for better perceived performance

### Future Optimizations

- Tile caching for offline support
- Lazy loading of map features
- Bundle size optimization
- Image asset optimization

## Next Steps (Post-MVP)

These features are planned but not yet implemented:

1. **Backend Integration**
   - Connect to waonder-backend API
   - Fetch cultural contexts based on map viewport
   - Render markers/annotations on map

2. **H3 Hexagon Rendering**
   - Port H3 geospatial indexing from web playground
   - Render hexagons on map for context density
   - Interactive hexagon selection

3. **Story Viewing**
   - Tap marker to view cultural story
   - Sliding panel UI for story content
   - Navigation to full storytelling experience

4. **Offline Support**
   - Download map tiles for offline use
   - Cache API responses locally
   - Background sync when online

5. **Production Deployment**
   - EAS Build configuration
   - TestFlight beta testing (iOS)
   - Google Play internal testing (Android)
   - App Store/Play Store submission

## License

This project is part of the Waonder ecosystem. See main repository for license details.

## Contributing

This is a foundational MVP. Before contributing:
1. Read this README thoroughly
2. Test changes on both iOS and Android
3. Follow TypeScript strict mode guidelines
4. Add JSDoc comments to public functions
5. Run `npx tsc --noEmit` before committing

## Support

For issues or questions:
1. Check Known Issues section above
2. Review Troubleshooting section
3. Check Expo and MapLibre documentation
4. Test on physical devices (not just simulators)

## Related Projects

- **waonder-backend**: NestJS API for location-aware RAG service
- **waonder-web-map-playground**: Next.js H3 map visualization tool
- **waonder-images**: Python AI image generation for landmarks

See root `CLAUDE.md` for multi-application workspace overview.

---

**Version**: 0.1.0
**Last Updated**: 2025-01-16
**Status**: Foundation MVP - Map rendering and location services complete
