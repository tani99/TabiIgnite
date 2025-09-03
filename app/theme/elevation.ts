import { Platform, ViewStyle } from "react-native"

/**
 * Modern Elevation & Shadow System
 * 
 * Provides 6 levels of elevation (0-5) with soft, modern shadows
 * that include subtle color tints for enhanced depth perception.
 * 
 * Follows Material Design 3 principles with custom refinements:
 * - Level 0: No elevation (flat)
 * - Level 1: Subtle lift (buttons, cards)
 * - Level 2: Raised elements (floating buttons)
 * - Level 3: Overlays (modals, dropdowns)
 * - Level 4: Navigation (app bars, bottom sheets)
 * - Level 5: Maximum elevation (tooltips, snackbars)
 */

// Shadow color tints for enhanced depth perception
const shadowColors = {
  light: {
    // Subtle blue-gray tint for light mode shadows
    primary: "rgba(15, 23, 42, 0.12)",     // Slate-900 with opacity
    secondary: "rgba(15, 23, 42, 0.08)",   // Lighter secondary shadow
  },
  dark: {
    // Lighter shadows for dark mode with subtle warm tint
    primary: "rgba(0, 0, 0, 0.24)",        // Pure black for contrast
    secondary: "rgba(0, 0, 0, 0.16)",      // Lighter secondary shadow
  },
}

/**
 * Light theme elevation system
 */
export const elevation = {
  /**
   * Level 0: No elevation - flat surface
   */
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0, // Android
  } as ViewStyle,

  /**
   * Level 1: Subtle lift - buttons, cards at rest
   * Gentle shadow for minimal elevation
   */
  level1: Platform.select({
    ios: {
      shadowColor: shadowColors.light.primary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  }) as ViewStyle,

  /**
   * Level 2: Raised elements - floating action buttons, raised cards
   * More pronounced shadow for clear elevation
   */
  level2: Platform.select({
    ios: {
      shadowColor: shadowColors.light.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }) as ViewStyle,

  /**
   * Level 3: Overlays - modals, dropdowns, tooltips
   * Strong shadow for floating elements
   */
  level3: Platform.select({
    ios: {
      shadowColor: shadowColors.light.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    android: {
      elevation: 8,
    },
  }) as ViewStyle,

  /**
   * Level 4: Navigation - app bars, bottom sheets
   * Prominent shadow for navigation elements
   */
  level4: Platform.select({
    ios: {
      shadowColor: shadowColors.light.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 16,
    },
    android: {
      elevation: 12,
    },
  }) as ViewStyle,

  /**
   * Level 5: Maximum elevation - snackbars, alerts
   * Strongest shadow for highest priority elements
   */
  level5: Platform.select({
    ios: {
      shadowColor: shadowColors.light.primary,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1,
      shadowRadius: 24,
    },
    android: {
      elevation: 16,
    },
  }) as ViewStyle,
} as const

/**
 * Dark theme elevation system
 * Uses stronger shadows for better visibility on dark backgrounds
 */
export const elevationDark = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  level1: Platform.select({
    ios: {
      shadowColor: shadowColors.dark.primary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 3, // Slightly larger for dark mode
    },
    android: {
      elevation: 3,
    },
  }) as ViewStyle,

  level2: Platform.select({
    ios: {
      shadowColor: shadowColors.dark.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 6,
    },
    android: {
      elevation: 6,
    },
  }) as ViewStyle,

  level3: Platform.select({
    ios: {
      shadowColor: shadowColors.dark.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
    },
    android: {
      elevation: 12,
    },
  }) as ViewStyle,

  level4: Platform.select({
    ios: {
      shadowColor: shadowColors.dark.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 20,
    },
    android: {
      elevation: 16,
    },
  }) as ViewStyle,

  level5: Platform.select({
    ios: {
      shadowColor: shadowColors.dark.primary,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1,
      shadowRadius: 28,
    },
    android: {
      elevation: 20,
    },
  }) as ViewStyle,
} as const

/**
 * Semantic elevation presets for common use cases
 * Provides consistent elevation patterns across components
 */
export const semanticElevation = {
  // Card elevations
  card: elevation.level1,
  cardHover: elevation.level2,
  cardPressed: elevation.none,

  // Button elevations
  button: elevation.level1,
  buttonHover: elevation.level2,
  buttonPressed: elevation.none,
  buttonFloating: elevation.level3,

  // Navigation elevations
  header: elevation.level2,
  tabBar: elevation.level2,
  drawer: elevation.level4,

  // Overlay elevations
  modal: elevation.level4,
  dropdown: elevation.level3,
  tooltip: elevation.level5,
  snackbar: elevation.level5,

  // Input elevations
  input: elevation.none,
  inputFocused: elevation.level1,
} as const

/**
 * Dark theme semantic elevation presets
 */
export const semanticElevationDark = {
  card: elevationDark.level1,
  cardHover: elevationDark.level2,
  cardPressed: elevationDark.none,

  button: elevationDark.level1,
  buttonHover: elevationDark.level2,
  buttonPressed: elevationDark.none,
  buttonFloating: elevationDark.level3,

  header: elevationDark.level2,
  tabBar: elevationDark.level2,
  drawer: elevationDark.level4,

  modal: elevationDark.level4,
  dropdown: elevationDark.level3,
  tooltip: elevationDark.level5,
  snackbar: elevationDark.level5,

  input: elevationDark.none,
  inputFocused: elevationDark.level1,
} as const

/**
 * Backdrop blur effects for overlays
 * Note: React Native doesn't support backdrop-filter natively,
 * but these styles can be used with libraries like react-native-blur
 */
export const backdropBlur = {
  none: {
    // No blur effect
  },
  light: {
    // Light blur for subtle overlays
    blurType: "light" as const,
    blurAmount: 10,
  },
  regular: {
    // Regular blur for modals
    blurType: "regular" as const,
    blurAmount: 20,
  },
  strong: {
    // Strong blur for focus states
    blurType: "dark" as const,
    blurAmount: 30,
  },
} as const

/**
 * Combined elevation and blur for overlay components
 */
export const overlayStyles = {
  modal: {
    ...elevation.level4,
    ...backdropBlur.regular,
  },
  dropdown: {
    ...elevation.level3,
    ...backdropBlur.light,
  },
  tooltip: {
    ...elevation.level5,
    ...backdropBlur.light,
  },
} as const
