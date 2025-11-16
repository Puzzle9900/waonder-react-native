# Waonder React Native Base - World Map Application

## TL;DR

**What**: React Native mobile app with interactive world map using MapLibre GL
**Why**: Foundation for Waonder mobile experience - location-based storytelling requires native mobile app with high-performance mapping
**How**: Expo managed workflow + @maplibre/maplibre-react-native + OpenFreeMap tiles
**Risk**: Medium - Using stable v10 with new architecture disabled, requires validation spike before implementation
**Timeline**: 7-10 days
**Owner**: Mobile team
**Decision**: Use Expo managed workflow with MapLibre React Native v10 stable (not v11 alpha, not bare RN, not react-native-maps) with new architecture disabled for stability

## Context & Problem

### Current State
Waonder ecosystem has backend API (NestJS) and web playground (Next.js) but no mobile presence. The core value proposition - location-aware cultural storytelling - is fundamentally a mobile use case (users exploring physical locations).

### Problem
- Users want to discover stories while physically walking around cities
- Mobile web experience is suboptimal for maps (performance, offline, gestures)
- Need native mobile app foundation that can:
  - Render high-performance interactive maps
  - Handle device location services
  - Work offline (future requirement)
  - Scale to complex features (AR, offline maps, etc.)

### Why Now
- Backend API is mature and stable
- Web playground validated H3 geospatial patterns
- Mobile is the natural next platform for location-based experiences
- Need foundation before building storytelling features on top

## Solution Approach

### Decision
Build React Native app using **Expo managed workflow** with **@maplibre/maplibre-react-native v10 stable** (not v11 alpha) for map rendering, using **OpenFreeMap** free tile sources, with **new architecture disabled** for stability.

### Rationale

**Pros**:
- **Expo managed workflow**:
  - Faster development (no Xcode/Android Studio gymnastics)
  - Free OTA updates via EAS Update
  - Config plugins handle native code generation
  - Strong migration path to bare workflow if needed
  - React Native core team recommends frameworks over bare init
- **MapLibre v10 over alternatives**:
  - Fully open-source (no pricing concerns like Mapbox)
  - Better performance than react-native-maps for vector tiles
  - Stable release (v10.1.6) vs unstable alpha (v11)
  - Works with new architecture via interop layer (though disabled for MVP stability)
  - Clear migration path to v11 stable when available
- **OpenFreeMap tiles**:
  - Free, no API keys required
  - OSM-based data (global coverage)
  - Multiple styles (Liberty, Positron, Bright)
  - Can self-host later if needed

**Cons**:
- MapLibre React Native is less mature than react-native-maps (~2 years old vs 8+)
- v10 has new architecture compatibility issues (mitigated by disabling new architecture)
- v11 alpha is not production-ready (rejected - using v10 stable)
- Expo adds abstraction layer (but config plugins mitigate this)
- Limited to Expo SDK update schedule (but manageable with stable versions)
- Disabling new architecture means missing some React Native 0.77 performance improvements

**Rejected alternatives**:
- **MapLibre v11 alpha**: New architecture support but unstable (crashes, rendering bugs, breaking changes between alpha releases) - rejected for foundation project
- **react-native-maps**: Simpler but worse performance for vector tiles, relies on Google/Apple Maps (considered for future if MapLibre proves too complex)
- **Mapbox GL**: Commercial pricing is unpredictable, closed-source since v2
- **Bare React Native**: More control but slower development, no OTA updates, harder CI/CD
- **React Native CLI**: Core team no longer recommends for new projects
- **Enabling new architecture**: React Native new architecture enabled by default in SDK 52+, but MapLibre v10 has documented compatibility issues - disabled for stability

### How It Works

1. Run Phase 0 validation spike (2-4 hours) to test MapLibre v10 + Expo SDK 52 compatibility
2. Initialize Expo app with TypeScript template
3. Install @maplibre/maplibre-react-native v10.1.6 (stable, not v11 alpha)
4. Configure app.json with MapLibre config plugin and explicitly disable new architecture (`newArchEnabled: false`)
5. Create MapView component pointing to OpenFreeMap tile source
6. Set initial viewport to world view (centered, appropriate zoom)
7. Add basic map controls (zoom, compass, user location button)
8. Implement error handling for tile loading failures and location permission denials

The app will launch directly to a full-screen map showing the entire world, using free OpenStreetMap-based vector tiles rendered via MapLibre GL Native. New architecture is disabled to ensure stability with MapLibre v10.

## Technical Design

### Components/Modules Affected

**New Components** (entire app is new):
- **App.tsx**: Root component with map container
- **components/Map/MapView.tsx**: MapLibre wrapper with default config
- **components/Map/MapControls.tsx**: Zoom, compass, location controls
- **constants/mapConfig.ts**: Map style URLs, initial viewport, tile sources
- **types/map.ts**: TypeScript interfaces for map state

### Key Interfaces

```typescript
// Map configuration
interface MapConfig {
  styleUrl: string;           // OpenFreeMap style URL
  initialCenter: [number, number]; // [lng, lat]
  initialZoom: number;        // Zoom level (0-22)
  minZoom: number;
  maxZoom: number;
}

// Map viewport state
interface MapViewport {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;            // Map rotation (0-360)
  pitch: number;              // Map tilt (0-60)
}

// User location
interface UserLocation {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}
```

### MapLibre Integration

```typescript
// Basic MapView usage
import { MapView } from '@maplibre/maplibre-react-native';

<MapView
  style={{ flex: 1 }}
  styleURL="https://tiles.openfreemap.org/styles/liberty"
  logoEnabled={false}
  attributionEnabled={true}
  compassEnabled={true}
  zoomLevel={2}
  centerCoordinate={[0, 20]}  // Centered on equator, slight north bias
/>
```

### App Configuration (app.json)

```json
{
  "expo": {
    "name": "Waonder",
    "slug": "waonder-react-native",
    "version": "0.1.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": false,
    "plugins": [
      "@maplibre/maplibre-react-native"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.waonder.app",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Waonder needs your location to show nearby stories and cultural contexts."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.waonder.app",
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ]
    }
  }
}
```

### Package Dependencies

```json
{
  "dependencies": {
    "expo": "^52.0.0",
    "react": "18.3.1",
    "react-native": "0.77.0",
    "@maplibre/maplibre-react-native": "^10.1.6",
    "expo-location": "18.0.x"
  },
  "devDependencies": {
    "@types/react": "~18.3.12",
    "typescript": "~5.6.0"
  }
}
```

**Key version decisions**:
- `react-native 0.77.0`: Latest stable for Expo SDK 52 (updated from 0.76.0)
- `@maplibre/maplibre-react-native ^10.1.6`: Stable release, not v11 alpha (critical change)
- `expo-location 18.0.x`: Locked to minor version to avoid known bugs in later patches
- `typescript ~5.6.0`: Latest stable (updated from 5.3.3)

### File Structure

```
waonder-react-native/
├── app.json                    # Expo configuration
├── App.tsx                     # Root component
├── assets/                     # Images, fonts
│   ├── icon.png
│   └── adaptive-icon.png
├── components/
│   └── Map/
│       ├── MapView.tsx         # Main map component
│       └── MapControls.tsx     # Zoom/location buttons
├── constants/
│   └── mapConfig.ts            # Map configuration
├── types/
│   └── map.ts                  # TypeScript interfaces
├── package.json
└── tsconfig.json
```

### Integration Points

**Current**: None (greenfield app)

**Future**:
- Will integrate with waonder-backend API for context retrieval
- Will share H3 geospatial indexing patterns with web playground
- User authentication will connect to backend auth system

### React Native New Architecture Decision

**Critical architectural decision**: Expo SDK 52+ enables React Native new architecture **by default** (`newArchEnabled: true`). However, MapLibre React Native v10 has documented compatibility issues with new architecture.

**Decision**: **Disable new architecture** for MVP (`newArchEnabled: false` in app.json)

**Rationale**:
- MapLibre v10 only supports new architecture via interoperability layer
- Official docs state v10 has "quite a few issues" with new architecture
- Stability is more important than new architecture benefits for foundation project
- Can re-enable when MapLibre v11 reaches stable release
- Trade-off: Missing some React Native 0.77 performance improvements, but acceptable for MVP

**Migration path**: When MapLibre v11 stable is released, remove `newArchEnabled: false` and upgrade to v11 to gain full new architecture support.

## Scope & Non-Goals

### In Scope (P0 - Must Have for MVP)

- [ ] Expo app initialization with TypeScript
- [ ] MapLibre React Native integration (v11 alpha for new architecture)
- [ ] OpenFreeMap tile source configuration
- [ ] Full-screen map rendering on app launch
- [ ] World view as initial viewport (zoom ~2, centered)
- [ ] Basic map interactions (pan, zoom, rotate)
- [ ] Location permissions (iOS/Android)
- [ ] User location button (center map on user)

### In Scope (P1 - Nice to Have)

- [ ] Multiple map styles (Liberty, Positron, Bright theme toggle)
- [ ] Compass control
- [ ] Attribution display (OSM/MapLibre credits)
- [ ] Dark mode support (map style switches with system theme)

### Non-Goals (Explicitly NOT doing)

- NOT doing: Backend API integration (future feature - context markers)
- NOT doing: User authentication (future feature)
- NOT doing: Offline map downloads (complex, defer to v2)
- NOT doing: AR features (future feature, requires additional SDKs)
- NOT doing: H3 hexagon rendering (validated in web playground, will add when connecting to backend)
- NOT doing: Custom map markers/annotations (wait for backend integration)
- NOT doing: Search functionality (requires backend API)
- NOT doing: Route/navigation features (out of scope for storytelling app)
- NOT doing: EAS Build configuration (local development only for now)
- NOT doing: App Store deployment (foundation only, not production-ready)

## Risks & Mitigations

### Top Risks

1. **MapLibre v10 + new architecture disabled compatibility** - Medium
   - **Impact**: Disabling new architecture may cause issues with other Expo packages expecting new architecture
   - **Mitigation**: Using stable v10 (not v11 alpha), new architecture disabled explicitly, run Phase 0 validation spike
   - **Contingency**: If compatibility issues arise, consider react-native-maps as simpler alternative
   - **Note**: Updated from original risk - no longer using v11 alpha

2. **expo-location known bugs on SDK 52** - Medium
   - **Impact**: Android builds may crash ("Class Not Found ActivityCompat" issue #33573), iOS background location broken (issue #33911)
   - **Mitigation**: Lock to exact working version (18.0.x), test on both platforms early, only use foreground location for MVP
   - **Contingency**: Switch to react-native-geolocation-service if expo-location blocks development

3. **OpenFreeMap rate limiting and sustainability** - Medium
   - **Impact**: Service planning rate limits (100M req/24h per app), runs on $500/month donations, could become unavailable
   - **Mitigation**: Implement custom app identifier headers, monitor service status and donation levels
   - **Contingency**: Budget for MapTiler fallback ($49/month after 14k free loads) or self-host tiles
   - **Monitoring**: Watch OpenFreeMap GitHub discussions and donation page

4. **GZIP tile compression failures** - Low-Medium
   - **Impact**: Map tiles may load in browser but fail silently on mobile (documented production issue with MapLibre)
   - **Mitigation**: Test OpenFreeMap with actual mobile devices (not just simulators) in Phase 0 validation
   - **Contingency**: Configure tile server to serve uncompressed PBF or handle decompression client-side

5. **Expo config plugin compatibility** - Low
   - **Impact**: MapLibre config plugin might not work with Expo SDK 52+
   - **Mitigation**: MapLibre docs confirm Expo support, active maintenance, run Phase 0 validation
   - **Contingency**: Eject to bare workflow (more complex but viable)

6. **Performance on older devices** - Medium
   - **Impact**: Map rendering could be slow on Android devices <2GB RAM
   - **Mitigation**: Vector tiles are efficient, MapLibre is hardware-accelerated, target mid-range devices (iPhone 12+, Pixel 4a+)
   - **Contingency**: Implement performance optimizations (limit zoom levels, reduce tile quality, disable rotation/tilt)

7. **iOS location permissions complexity** - Low
   - **Impact**: iOS 14+ location permissions have strict requirements, App Store may reject unclear descriptions
   - **Mitigation**: Use expo-location for proper permission handling, clear description in infoPlist
   - **Contingency**: Well-documented pattern, update permission strings if App Store provides feedback

## Testing Strategy

### Key Test Scenarios

- [ ] Happy path: App launches, map renders world view within 2 seconds
- [ ] Happy path: User can pan/zoom/rotate map smoothly (60fps target)
- [ ] Happy path: Location permission prompt appears on first launch
- [ ] Happy path: User location button centers map on device location
- [ ] Edge: Map handles network disconnection gracefully (cached tiles still render)
- [ ] Edge: Map works on iOS simulator (location mocked)
- [ ] Edge: Map works on Android emulator (location mocked)
- [ ] Error: Displays error state if tiles fail to load
- [ ] Error: Handles location permission denial gracefully
- [ ] Performance: Initial map load <2s on mid-range devices
- [ ] Performance: Pan/zoom interactions feel responsive (60fps)
- [ ] Compatibility: iOS 15+ devices (iPhone 8 and newer)
- [ ] Compatibility: Android 9+ devices (API level 28+)

### Coverage Target
- Critical path: 100% (map rendering, location permissions)
- Other code: 80% (configuration, error states)

### Manual Testing Checklist

**iOS Testing**:
- [ ] iPhone physical device (test location services)
- [ ] iPad (verify tablet layout)
- [ ] iOS simulator (verify map renders)
- [ ] Dark mode toggle

**Android Testing**:
- [ ] Physical device (test location services)
- [ ] Android emulator (verify map renders)
- [ ] Various screen sizes (phone, tablet)
- [ ] Dark mode toggle

## Deployment & Rollout

### Deployment Steps

- [ ] Run `npm install` to install dependencies
- [ ] Run `npx expo prebuild` to generate native folders
- [ ] Test on iOS simulator: `npx expo run:ios`
- [ ] Test on Android emulator: `npx expo run:android`
- [ ] Test on physical devices via Expo Go (if supported) or development build
- [ ] Verify map renders and location permissions work

### Rollback Plan

This is a greenfield app with no users. Rollback is simply reverting git commits.

### Feature Flags

Not required - no production deployment yet.

### Future Deployment (Post-MVP)

- EAS Build for iOS/Android binaries
- TestFlight for iOS beta testing
- Google Play internal testing track
- App Store/Play Store submission (requires backend integration first)

## Performance Targets

Based on React Native MapLibre best practices:

- **Initial map render**: <2 seconds on mid-range devices
- **Frame rate**: 60fps during pan/zoom interactions
- **Memory usage**: <100MB for map rendering
- **Tile loading**: Progressive loading with cache (expect 200-500ms per tile on 4G)

**Optimization strategies** (implement if targets not met):
- Set maxZoom to 18 (vs default 22) to reduce tile requests
- Implement tile caching with Expo FileSystem
- Reduce coordinate precision if rendering custom GeoJSON later
- Use clustering for markers when backend integration is added

## Open Questions

**Answered during research**:
- ✅ Which React Native framework? → Expo managed workflow
- ✅ Which map library? → MapLibre React Native v10 stable (not v11 alpha)
- ✅ Which tile source? → OpenFreeMap (free, OSM-based)
- ✅ Expo vs bare workflow? → Managed workflow for MVP, can eject later
- ✅ New architecture support? → Disabled for MVP (MapLibre v10 has compatibility issues)
- ✅ MapLibre v10 vs v11 alpha? → v10 stable for foundation project
- ✅ React Native version? → 0.77.0 (latest for Expo SDK 52)

**Future decisions** (not blocking MVP):
- Self-hosted tiles vs continued use of OpenFreeMap (decide when scaling or if rate limited)
- EAS Build vs local builds (decide when approaching production)
- Offline map storage strategy (decide when implementing offline mode)
- When to migrate to MapLibre v11 stable (when it's released and proven stable)
- When to re-enable new architecture (when MapLibre v11 stable is available)

---

## Changelog

### 2025-01-16 - Spec Review & Critical Updates
Reviewed by Claude (Staff Engineer) - comprehensive analysis and corrections based on January 2025 research.

**Critical Changes**:
- ❌ **Rejected MapLibre v11 alpha**: Downgraded to v10.1.6 stable to avoid alpha instability (crashes, bugs, breaking changes)
- ⚠️ **Disabled new architecture**: Expo SDK 52+ enables new architecture by default, but MapLibre v10 has documented compatibility issues - explicitly disabled for stability
- ⬆️ **Updated React Native**: 0.77.0 (from 0.76.0) - latest stable for Expo SDK 52
- 🔒 **Locked expo-location**: 18.0.x (from ^18.0.0) to avoid known bugs (Android crashes, iOS background location issues)
- ⬆️ **Updated TypeScript**: ~5.6.0 (from ~5.3.3) - latest stable
- 📅 **Revised timeline**: 7-10 days (from 5-7) - realistic estimate given dependency stability concerns

**Architectural Additions**:
- Added "React Native New Architecture Decision" section with detailed rationale
- Added Phase 0 validation spike requirement (2-4 hours) before implementation
- Added app.json configuration: `newArchEnabled: false`
- Documented migration path to v11 stable when available

**Risks Updated**:
- Added: expo-location known bugs on SDK 52 (Android crashes, iOS background location broken)
- Added: OpenFreeMap rate limiting and sustainability concerns (100M req/24h limit coming, $500/month funding)
- Added: GZIP tile compression failures (mobile-specific issue)
- Updated: MapLibre risk now focused on v10 + new architecture disabled compatibility
- Added device baselines: "mid-range" = iPhone 12+ / Pixel 4a+

**Documentation Improvements**:
- Added version decision rationale to package dependencies section
- Updated "How It Works" section with Phase 0 spike and error handling
- Updated "Rejected Alternatives" with MapLibre v11 alpha rejection rationale
- Added explicit mention of new architecture being disabled by default in SDK 52+
- Updated Open Questions with all resolved decisions

**What Stayed the Same**:
- Expo managed workflow (still correct choice)
- MapLibre over react-native-maps (but using v10 stable, not v11 alpha)
- OpenFreeMap tiles (but now with contingency plan for rate limiting)
- P0/P1/Non-Goals scope (unchanged)

**Next Actions Before Implementation**:
1. Run Phase 0 validation spike (2-4 hours) to test MapLibre v10 + Expo SDK 52 + OpenFreeMap
2. Validate expo-location works on both iOS/Android
3. Test tile loading on physical devices (not just simulators)
4. Make go/no-go decision on MapLibre vs react-native-maps fallback

### 2025-01-16 - Initial Spec
Created by Claude (Staff Engineer) based on Waonder ecosystem requirements and React Native/MapLibre research.

**Original Key Decisions**:
- Expo managed workflow (not bare RN) for faster development
- MapLibre React Native (not Mapbox, not react-native-maps) for open-source and performance
- OpenFreeMap tiles (not Mapbox, not Google) for zero-cost OSM data
- Focus on foundation only - no backend integration yet (ship fast, validate platform)

**Note**: Original spec recommended v11 alpha, updated after review to v10 stable
