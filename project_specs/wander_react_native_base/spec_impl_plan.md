# Implementation Plan: Waonder React Native Base

## Overview

Build foundational React Native mobile app with MapLibre GL for interactive world map rendering. Uses Expo managed workflow with OpenFreeMap tiles for zero-cost, high-performance mapping.

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Xcode 15+ (for iOS development) - macOS only
- [ ] Android Studio (for Android development)
- [ ] iOS Simulator configured (macOS)
- [ ] Android Emulator configured
- [ ] Physical devices for testing (optional but recommended)

## Implementation Steps

### Phase 0: Technical Validation Spike (2-4 hours) - **PARTIALLY COMPLETE**

**Status**: Partially complete (60% done, blocked by iOS simulator configuration)
**Time Spent**: 1 hour
**Findings Document**: `phase0_validation_findings.md`

**Critical pre-implementation validation** to test architectural assumptions before committing to full implementation.

- [x] Create throwaway test project
  ```bash
  npx create-expo-app@latest test-waonder-maplibre --template expo-template-blank-typescript
  cd test-waonder-maplibre
  ```
  **Result**: ✅ Success (manually downgraded to SDK 52 from auto-generated SDK 54)

- [x] Install MapLibre v10 and test basic rendering
  ```bash
  npm install @maplibre/maplibre-react-native@^10.1.6
  ```
  **Result**: ✅ Success (no dependency conflicts)

- [x] Configure app.json with MapLibre plugin and `newArchEnabled: false`
  ```json
  {
    "expo": {
      "newArchEnabled": false,
      "plugins": ["@maplibre/maplibre-react-native"]
    }
  }
  ```
  **Result**: ✅ Success (config accepted, prebuild successful)

- [x] Run prebuild and test on both iOS and Android
  ```bash
  npx expo prebuild
  npx expo run:ios
  npx expo run:android
  ```
  **Result**: ⚠️ Partially complete
  - Prebuild: ✅ Success (native folders generated, CocoaPods installed)
  - iOS run: ❌ Blocked (no iOS simulators configured)
  - Android run: ⏸️ Not attempted (blocked on iOS first)

- [ ] Test OpenFreeMap tile loading with actual mobile devices (not just simulators)
  - Test styleURL: `https://tiles.openfreemap.org/styles/liberty`
  - Verify tiles load without GZIP errors
  - Check network tab for tile requests
  **Result**: ⏸️ Blocked by simulator availability

- [ ] Test expo-location on both platforms
  ```bash
  npx expo install expo-location@18.0.x
  ```
  - Verify no Android crashes (ActivityCompat issue)
  - Test foreground location only (iOS background location has known bugs)
  **Result**: ⏸️ Blocked by simulator availability

- [ ] Measure baseline performance
  - Initial map render time on mid-range device (iPhone 12 or Pixel 4a)
  - FPS during pan/zoom interactions
  - Memory usage
  **Result**: ⏸️ Blocked by simulator availability

- [x] Document findings in spike results document
  - MapLibre v10 + new architecture disabled: Works? Any issues?
  - OpenFreeMap tiles: Load successfully? Any errors?
  - expo-location: Works on both platforms?
  - Performance baselines: Meet <2s render, 60fps targets?
  **Result**: ✅ Complete (see `phase0_validation_findings.md`)

- [x] Make go/no-go decision
  - Go: Continue with MapLibre v10 as planned
  - No-go: Pivot to react-native-maps if critical issues found
  **Result**: ✅ **CONDITIONAL GO** (proceed after iOS simulator configuration)

- [ ] Delete test project
  ```bash
  cd ..
  rm -rf test-waonder-maplibre
  ```
  **Result**: ⏸️ Deferred (keep for device testing)

**Success criteria**: MapLibre v10 renders world map successfully on both iOS/Android with new architecture disabled, OpenFreeMap tiles load without errors, expo-location works for foreground location.

**Current Status**: Install/configuration validated ✅, runtime validation blocked ❌

**Escalation**: If any critical issues found, escalate to stakeholders for decision on react-native-maps fallback.

**BLOCKER IDENTIFIED**: No iOS simulators configured. Requires:
- XCode > Settings > Platforms > Download iOS Simulator
- Or use physical iPhone for testing

**Next Steps**:
1. Configure iOS simulator
2. Complete runtime validation (tiles, location, performance)
3. Make final go/no-go decision

### Phase 1: Project Initialization (2-3 hours) - ✅ COMPLETE

- [x] Initialize Expo app with TypeScript template
  ```bash
  npx create-expo-app@latest waonder-react-native --template expo-template-blank-typescript
  cd waonder-react-native
  ```
- [x] Verify base app runs
  ```bash
  npx expo start
  # Test in iOS simulator and/or Android emulator
  ```
- [x] Install MapLibre React Native v10 stable (NOT v11 alpha)
  ```bash
  npm install @maplibre/maplibre-react-native@^10.1.6
  ```
  **Actual**: Installed v10.4.0 (latest stable in v10 line)
- [x] Install location services package (locked to 18.0.x to avoid known bugs)
  ```bash
  npx expo install expo-location@18.0.x
  ```
- [x] Configure TypeScript strict mode in `tsconfig.json`
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true
    }
  }
  ```
- [x] Update `package.json` with project metadata
  - Set name to "Waonder"
  - Set version to "0.1.0"
  - Add description
- [x] Create `.gitignore` if not present (Expo template should include)
- [x] Initialize git repository
  ```bash
  git init
  git add .
  git commit -m "feat: initialize Expo app with TypeScript"
  ```
  **Actual**: Repository already initialized, committed initial setup

### Phase 2: MapLibre Configuration (3-4 hours) - ✅ COMPLETE

- [x] Add MapLibre config plugin to `app.json` and explicitly disable new architecture
  ```json
  {
    "expo": {
      "newArchEnabled": false,
      "plugins": [
        "@maplibre/maplibre-react-native"
      ]
    }
  }
  ```
  **Important**: `newArchEnabled: false` is required because MapLibre v10 has compatibility issues with new architecture (which is enabled by default in Expo SDK 52+)
- [x] Configure iOS permissions in `app.json`
  ```json
  {
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Waonder needs your location to show nearby stories and cultural contexts."
      }
    }
  }
  ```
- [x] Configure Android permissions in `app.json`
  ```json
  {
    "android": {
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ]
    }
  }
  ```
- [x] Run prebuild to generate native folders
  ```bash
  npx expo prebuild
  ```
- [x] Create `constants/mapConfig.ts` with OpenFreeMap configuration
  - Define styleUrl: `https://tiles.openfreemap.org/styles/liberty`
  - Set initial viewport (center: [0, 20], zoom: 2)
  - Configure min/max zoom levels
- [x] Create `types/map.ts` with TypeScript interfaces
  - MapConfig interface
  - MapViewport interface
  - UserLocation interface
- [x] Test prebuild generates `ios/` and `android/` folders correctly
- [x] Commit changes
  ```bash
  git add .
  git commit -m "feat: configure MapLibre and native permissions"
  ```

### Phase 3: Map Component Implementation (4-5 hours) - ✅ COMPLETE

- [x] Create `components/Map/` directory
- [x] Implement `components/Map/MapView.tsx`
  - Import MapView from @maplibre/maplibre-react-native
  - Apply mapStyle from mapConfig (note: prop is `mapStyle` not `styleURL`)
  - Set initial center and zoom
  - Configure map properties (compass, attribution, logo)
  - Add TypeScript props interface
  - Export component
- [x] Create basic `components/Map/MapControls.tsx` stub
  - Placeholder for zoom buttons (implement in Phase 4)
  - Placeholder for location button (implement in Phase 4)
- [x] Update `App.tsx` to render MapView
  - Import MapView component
  - Render full-screen (flex: 1)
  - Remove Expo template boilerplate
  - Add SafeAreaView for iOS notch/status bar
  - Add loading indicator while map initializes
- [ ] Test map renders in iOS simulator
  ```bash
  npx expo run:ios
  ```
  **Status**: Blocked - iOS simulator not configured
- [ ] Test map renders in Android emulator
  ```bash
  npx expo run:android
  ```
  **Status**: Not tested yet (blocked on iOS first)
- [ ] Verify map interactions (pan, zoom, rotate)
  **Status**: Pending device testing
- [ ] Verify map loads tiles from OpenFreeMap
  **Status**: Pending device testing
- [x] Commit changes
  ```bash
  git add .
  git commit -m "feat: implement MapView component with OpenFreeMap"
  ```
  **Note**: TypeScript compilation verified successfully

### Phase 4: Map Controls & Location Services (3-4 hours)

- [ ] Implement location permission request in `App.tsx`
  - Use expo-location to request foreground permissions
  - Handle permission granted/denied states
  - Show appropriate UI for permission status
- [ ] Implement user location button in `MapControls.tsx`
  - Create TouchableOpacity button
  - Get current location via expo-location
  - Animate map to user location
  - Handle location errors gracefully
- [ ] Add location dot on map
  - Use MapLibre UserLocation component (if available in v11)
  - OR render custom marker at user location
- [ ] Test location services on iOS simulator
  - Simulate location in Xcode (Features > Location > Custom Location)
  - Verify permission prompt appears
  - Verify location button centers map
- [ ] Test location services on Android emulator
  - Set location in Android emulator controls
  - Verify permission prompt appears
  - Verify location button works
- [ ] Test on physical devices (iOS and Android)
  - Verify real GPS location works
  - Test permission flows on real OS versions
- [ ] Commit changes
  ```bash
  git add .
  git commit -m "feat: add location services and user location button"
  ```

### Phase 5: Polish & Error Handling (3-4 hours)

- [ ] Implement comprehensive error handling strategy
  - Create error boundary component around MapView
  - Define error states for different failure modes
  - Add error tracking (consider Sentry or similar)
- [ ] Handle tile loading failures
  - Catch network errors (offline, timeout, 404s)
  - Show error message: "Map tiles couldn't load. Check your connection."
  - Implement retry logic with exponential backoff
  - Test with airplane mode to verify graceful degradation
- [ ] Handle MapLibre initialization errors
  - Catch invalid style URL or config errors
  - Show error message: "Map failed to initialize. Please restart the app."
  - Log errors to console for debugging
- [ ] Handle location permission errors
  - Permission denied: "Location permission required. Enable in Settings."
  - Permission restricted: "Location services are restricted on this device."
  - Link to device settings (iOS Settings.app, Android app settings)
- [ ] Handle GPS/location service errors
  - GPS unavailable: "Location services unavailable. Enable in device settings."
  - Location timeout: "Couldn't determine your location. Try again."
  - Low accuracy warning (if accuracy > 100m)
- [ ] Style map controls (zoom, location buttons)
  - Position in bottom-right corner
  - Add shadows/elevation for visibility
  - Use consistent sizing and spacing
  - Ensure buttons are accessible (48x48pt minimum)
- [ ] Add loading state while map initializes
  - Show ActivityIndicator during first render
  - Hide once map onDidFinishLoadingMap fires
  - Show progress indicator if tiles take >2s to load
- [ ] Test error scenarios thoroughly
  - Airplane mode (no network)
  - Invalid tile URL (404 errors)
  - Permission denied on first launch
  - GPS disabled in device settings
  - Low accuracy GPS signal
- [ ] Configure app icon and splash screen
  - Replace default Expo icon in `assets/icon.png`
  - Update adaptive icon for Android
  - Configure splash screen in app.json
- [ ] Test dark mode (optional P1)
  - Check if Liberty style works in dark mode
  - OR add style toggle (Liberty vs Positron dark)
  - Ensure controls remain visible in dark mode
- [ ] Add attribution display
  - Show OSM/MapLibre credits (required by license)
  - Position in bottom-left corner
  - Make non-intrusive but readable
- [ ] Commit changes
  ```bash
  git add .
  git commit -m "feat: polish UI and add error/loading states"
  ```

### Phase 6: Testing & Performance Validation (3-4 hours)

- [ ] Test on iOS devices
  - iPhone physical device (test real location)
  - iPad (verify tablet layout)
  - iOS Simulator (verify map rendering)
- [ ] Test on Android devices
  - Physical device (test real location)
  - Emulator (verify map rendering)
  - Test on low-end device if available (<2GB RAM)
- [ ] Measure performance metrics
  - Time to initial map render (<2s target)
  - Frame rate during pan/zoom (60fps target)
  - Memory usage (<100MB target)
- [ ] Test edge cases
  - Airplane mode (cached tiles should still render)
  - Permission denial (app should handle gracefully)
  - Slow network (tiles should load progressively)
  - Map rotation and tilt gestures
- [ ] Test accessibility
  - Ensure buttons are tappable (48pt minimum)
  - Test with system font scaling (iOS Dynamic Type)
  - Verify color contrast (controls visible on map)
- [ ] If performance targets not met, apply optimizations:
  - Set maxZoom to 18 in map config
  - Reduce tile quality
  - Implement tile caching
- [ ] Document any issues or limitations in README
- [ ] Commit test results and any fixes
  ```bash
  git add .
  git commit -m "test: validate performance and edge cases"
  ```

### Phase 7: Documentation (1-2 hours)

- [ ] Create `README.md` at project root
  - Project overview and purpose
  - Tech stack (Expo, MapLibre, OpenFreeMap)
  - Setup instructions (npm install, run iOS/Android)
  - Location permission requirements
  - Known issues and limitations
- [ ] Document map configuration in code comments
  - Explain styleURL choices
  - Document viewport calculations
  - Comment permission requirements
- [ ] Add inline JSDoc comments to key functions
  - MapView component props
  - Location request handlers
  - Error handling logic
- [ ] Create `.env.example` if adding any config
  - Document map style URL (even though it's free)
  - Note: no API keys needed for OpenFreeMap
- [ ] Update `package.json` scripts section
  - Add helpful scripts (ios, android, start)
  - Document what each script does
- [ ] Commit documentation
  ```bash
  git add .
  git commit -m "docs: add README and code documentation"
  ```

### Phase 8: Final Validation & Handoff (1-2 hours)

- [ ] Clean install test
  ```bash
  rm -rf node_modules
  npm install
  npx expo prebuild --clean
  npx expo run:ios
  ```
- [ ] Verify all P0 requirements are met
  - [ ] Expo app runs on iOS and Android
  - [ ] MapLibre map renders world view
  - [ ] OpenFreeMap tiles load correctly
  - [ ] User can pan, zoom, rotate map
  - [ ] Location permissions prompt on first launch
  - [ ] Location button centers map on user
- [ ] Verify P1 requirements (if time permits)
  - [ ] Dark mode support
  - [ ] Compass control
  - [ ] Attribution display
- [ ] Create GitHub repository (if not done)
  ```bash
  git remote add origin <repo-url>
  git push -u origin main
  ```
- [ ] Tag release
  ```bash
  git tag -a v0.1.0 -m "MVP: React Native app with MapLibre world map"
  git push origin v0.1.0
  ```
- [ ] Create handoff document
  - Current state of implementation
  - Next steps (backend integration, markers, etc.)
  - Outstanding issues or tech debt
  - Future optimization opportunities
- [ ] Final commit
  ```bash
  git add .
  git commit -m "chore: v0.1.0 release - MapLibre base app"
  ```

## Time Estimates

- Phase 0 (Technical Validation Spike): 2-4 hours **[NEW - CRITICAL]**
- Phase 1 (Project Initialization): 2-3 hours
- Phase 2 (MapLibre Configuration): 3-4 hours
- Phase 3 (Map Component): 4-5 hours
- Phase 4 (Controls & Location): 3-4 hours
- Phase 5 (Polish & Error Handling): 3-4 hours **[UPDATED - was 2-3 hours]**
- Phase 6 (Testing & Performance): 4-5 hours **[UPDATED - was 3-4 hours]**
- Phase 7 (Documentation): 1-2 hours
- Phase 8 (Final Validation): 2-3 hours **[UPDATED - was 1-2 hours]**

**Total**: 24-37 hours (~3-5 days for solo developer, ~7-10 days accounting for learning curve, troubleshooting, and dependency stability issues)

**Critical note**: Original estimate was 19-27 hours (5-7 days). Updated to reflect:
- Added Phase 0 validation spike (2-4 hours) to catch issues early
- Increased Phase 5 for comprehensive error handling (3-4 hours)
- Increased Phase 6 for thorough testing of edge cases (4-5 hours)
- Increased Phase 8 for clean install validation (2-3 hours)
- Using stable v10 (not v11 alpha) reduces debugging time but still expect issues with new architecture disabled
- expo-location has known bugs that may require workarounds
- OpenFreeMap GZIP issues may require troubleshooting on real devices

**Risk buffer**: Plan for 7-10 days. If Phase 0 validation reveals critical issues, may need to pivot to react-native-maps (would save 2-3 days overall).

## Risk Mitigation During Implementation

**If MapLibre v10 + new architecture disabled has compatibility issues**:
- Phase 0 validation spike should catch this early
- Try enabling new architecture (`newArchEnabled: true`) and accept v10 interop layer issues
- Last resort: Pivot to react-native-maps for simpler, more stable solution
- Escalate to stakeholders for react-native-maps vs MapLibre decision

**If Expo config plugin fails**:
- Check MapLibre docs for updated plugin configuration
- Try running `npx expo prebuild --clean` to regenerate native code
- Verify `newArchEnabled: false` is in app.json
- Last resort: eject to bare workflow (more complex but viable)

**If OpenFreeMap tiles are slow/unavailable/have GZIP errors**:
- Phase 0 validation should test this on real devices
- Switch to MapTiler free tier (14k loads/month): change styleUrl to `https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY`
- Try alternative OpenFreeMap mirror or style (Positron instead of Liberty)
- Self-host tiles using OpenMapTiles (advanced, defer unless necessary)

**If expo-location has bugs (Android crashes, iOS background location issues)**:
- Phase 0 validation should catch Android crashes early
- Only use foreground location for MVP (iOS background location has known bug in SDK 52)
- Try locking to specific patch version: `expo-location@18.0.0` or `18.0.1`
- Last resort: Switch to `react-native-geolocation-service` (more manual setup)

**If performance is poor**:
- Reduce maxZoom to 16 or 18 (fewer tiles to load)
- Disable rotation/tilt gestures (less rendering complexity)
- Simplify map style (use basic OSM style instead of Liberty)
- Profile with React Native DevTools to identify bottlenecks
- Consider react-native-maps if MapLibre performance is unacceptable

**If new architecture disabled causes other package issues**:
- Most Expo packages support both architectures via interop layer
- Check package documentation for new architecture compatibility
- May need to disable new architecture for entire app (acceptable tradeoff for stability)

## Success Criteria

- [ ] App builds and runs on both iOS and Android without errors
- [ ] Map renders within 2 seconds on mid-range devices
- [ ] Pan/zoom interactions feel smooth (no jank)
- [ ] Location button successfully centers map on user location
- [ ] All code is type-safe (no TypeScript `any` types)
- [ ] README explains how to run the app clearly
- [ ] Can demo app to stakeholders on physical device

## Next Steps (Post-MVP)

These are out of scope for this spec but documented for future reference:

1. **Backend Integration**
   - Connect to waonder-backend API
   - Fetch contexts based on map viewport
   - Render markers/annotations on map

2. **H3 Hexagon Rendering**
   - Port H3 patterns from web playground
   - Render hexagons on map
   - Show context density heatmap

3. **Story Viewing**
   - Tap marker to view story
   - Sliding panel UI for story content
   - Link to full storytelling experience

4. **Offline Support**
   - Download map tiles for offline use
   - Cache API responses
   - Background sync when online

5. **Production Deployment**
   - EAS Build configuration
   - TestFlight beta testing
   - App Store/Play Store submission

---

## Implementation Plan Updates (2025-01-16)

**Critical changes from original plan**:
- **Added Phase 0 validation spike**: 2-4 hours to test assumptions before committing to full implementation
- **MapLibre version downgrade**: v10.1.6 stable (was v11.0.0-alpha.5) to avoid alpha instability
- **New architecture disabled**: `newArchEnabled: false` required for MapLibre v10 compatibility
- **expo-location locked**: 18.0.x (was ^18.0.0) to avoid known Android/iOS bugs
- **Timeline extended**: 7-10 days (was 5-7) to account for dependency stability concerns
- **Error handling expanded**: Phase 5 now includes comprehensive error handling strategy
- **Testing extended**: Phase 6 increased to 4-5 hours for thorough edge case testing

**Why these changes**:
- MapLibre v11 alpha has documented crashes, rendering bugs, breaking changes
- Expo SDK 52+ enables new architecture by default, but MapLibre v10 has compatibility issues
- expo-location has active bug reports (Android crashes, iOS background location broken)
- OpenFreeMap has GZIP compression issues on mobile (needs real device testing)
- Original timeline was optimistic - realistic estimate needed for stable foundation

**Implementation priorities**:
1. **Run Phase 0 first** - validate all assumptions before building
2. **Test on real devices early** - simulators don't catch GZIP tile errors or expo-location bugs
3. **Focus on stability over features** - P0 only, defer P1 to future iterations
4. **Have react-native-maps as fallback** - if MapLibre proves too problematic in Phase 0

---

**Implementation Notes**:

- **CRITICAL**: Run Phase 0 validation spike first - do not skip this step
- Commit frequently (after each major milestone)
- Test on both platforms regularly (don't wait until the end)
- Test on physical devices, not just simulators (GZIP errors won't show in simulators)
- Document decisions as you go (don't rely on memory)
- If stuck >1 hour on MapLibre issues, consider react-native-maps fallback
- Prioritize P0 over P1 - ship the foundation first
- New architecture is disabled - document this in README for future maintainers
