// TODO: write documentation about fonts and typography along with guides on how to add custom fonts in own
// markdown file and add links from here

import { Platform } from "react-native"
import {
  SpaceGrotesk_300Light as spaceGroteskLight,
  SpaceGrotesk_400Regular as spaceGroteskRegular,
  SpaceGrotesk_500Medium as spaceGroteskMedium,
  SpaceGrotesk_600SemiBold as spaceGroteskSemiBold,
  SpaceGrotesk_700Bold as spaceGroteskBold,
} from "@expo-google-fonts/space-grotesk"

export const customFontsToLoad = {
  spaceGroteskLight,
  spaceGroteskRegular,
  spaceGroteskMedium,
  spaceGroteskSemiBold,
  spaceGroteskBold,
}

const fonts = {
  spaceGrotesk: {
    // Cross-platform Google font.
    light: "spaceGroteskLight",
    normal: "spaceGroteskRegular",
    medium: "spaceGroteskMedium",
    semiBold: "spaceGroteskSemiBold",
    bold: "spaceGroteskBold",
  },
  helveticaNeue: {
    // iOS only font.
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    // iOS only font.
    normal: "Courier",
  },
  sansSerif: {
    // Android only font.
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    // Android only font.
    normal: "monospace",
  },
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.spaceGrotesk,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),

  /**
   * Modern Typography Scale - 8 levels for clear visual hierarchy
   * Based on modular scale with optimized line heights and letter spacing
   */
  sizes: {
    xs: {
      fontSize: 12,
      lineHeight: 16, // 1.33 ratio
      letterSpacing: 0,
    },
    sm: {
      fontSize: 14,
      lineHeight: 20, // 1.43 ratio
      letterSpacing: 0,
    },
    md: {
      fontSize: 16,
      lineHeight: 24, // 1.5 ratio
      letterSpacing: 0,
    },
    lg: {
      fontSize: 18,
      lineHeight: 28, // 1.56 ratio
      letterSpacing: 0,
    },
    xl: {
      fontSize: 20,
      lineHeight: 30, // 1.5 ratio
      letterSpacing: -0.01,
    },
    xxl: {
      fontSize: 24,
      lineHeight: 36, // 1.5 ratio
      letterSpacing: -0.02,
    },
    xxxl: {
      fontSize: 32,
      lineHeight: 44, // 1.375 ratio
      letterSpacing: -0.03,
    },
    display: {
      fontSize: 48,
      lineHeight: 64, // 1.33 ratio
      letterSpacing: -0.04,
    },
  },

  /**
   * Font weights utilizing full Space Grotesk range
   */
  weights: {
    light: "300" as const,
    normal: "400" as const,
    medium: "500" as const,
    semiBold: "600" as const,
    bold: "700" as const,
  },

  /**
   * Semantic typography presets for common use cases
   */
  presets: {
    // Display text - for hero sections and major headings
    display: {
      fontFamily: fonts.spaceGrotesk.bold,
      fontSize: 48,
      lineHeight: 64,
      letterSpacing: -0.04,
      fontWeight: "700" as const,
    },
    
    // Headings
    h1: {
      fontFamily: fonts.spaceGrotesk.bold,
      fontSize: 32,
      lineHeight: 44,
      letterSpacing: -0.03,
      fontWeight: "700" as const,
    },
    h2: {
      fontFamily: fonts.spaceGrotesk.semiBold,
      fontSize: 24,
      lineHeight: 36,
      letterSpacing: -0.02,
      fontWeight: "600" as const,
    },
    h3: {
      fontFamily: fonts.spaceGrotesk.semiBold,
      fontSize: 20,
      lineHeight: 30,
      letterSpacing: -0.01,
      fontWeight: "600" as const,
    },
    h4: {
      fontFamily: fonts.spaceGrotesk.medium,
      fontSize: 18,
      lineHeight: 28,
      letterSpacing: 0,
      fontWeight: "500" as const,
    },

    // Body text
    body: {
      fontFamily: fonts.spaceGrotesk.normal,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
      fontWeight: "400" as const,
    },
    bodySmall: {
      fontFamily: fonts.spaceGrotesk.normal,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: "400" as const,
    },

    // Labels and captions
    label: {
      fontFamily: fonts.spaceGrotesk.medium,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: "500" as const,
    },
    labelSmall: {
      fontFamily: fonts.spaceGrotesk.medium,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0,
      fontWeight: "500" as const,
    },
    caption: {
      fontFamily: fonts.spaceGrotesk.normal,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0,
      fontWeight: "400" as const,
    },

    // Button text
    button: {
      fontFamily: fonts.spaceGrotesk.medium,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
      fontWeight: "500" as const,
    },
    buttonSmall: {
      fontFamily: fonts.spaceGrotesk.medium,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: "500" as const,
    },

    // Code and monospace
    code: {
      fontFamily: Platform.select({ ios: fonts.courier.normal, android: fonts.monospace.normal }),
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: "400" as const,
    },
  },
}
