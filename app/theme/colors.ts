const palette = {
  // Modern Slate Gray Scale
  neutral50: "#F8FAFC",
  neutral100: "#F1F5F9",
  neutral200: "#E2E8F0",
  neutral300: "#CBD5E1",
  neutral400: "#94A3B8",
  neutral500: "#64748B",
  neutral600: "#475569",
  neutral700: "#334155",
  neutral800: "#1E293B",
  neutral900: "#0F172A",

  // Modern Primary: Indigo to Violet Gradient System
  primary50: "#EEF2FF",
  primary100: "#E0E7FF",
  primary200: "#C7D2FE",
  primary300: "#A5B4FC",
  primary400: "#818CF8",
  primary500: "#6366F1", // Main primary
  primary600: "#4F46E5",
  primary700: "#4338CA",
  primary800: "#3730A3",
  primary900: "#312E81",

  // Violet accent for gradients
  violet50: "#F5F3FF",
  violet100: "#EDE9FE",
  violet200: "#DDD6FE",
  violet300: "#C4B5FD",
  violet400: "#A78BFA",
  violet500: "#8B5CF6", // Secondary primary for gradients
  violet600: "#7C3AED",
  violet700: "#6D28D9",
  violet800: "#5B21B6",
  violet900: "#4C1D95",

  // Secondary: Cyan to Emerald System
  secondary50: "#F0FDFA",
  secondary100: "#CCFBF1",
  secondary200: "#99F6E4",
  secondary300: "#5EEAD4",
  secondary400: "#2DD4BF",
  secondary500: "#14B8A6", // Teal-500 as intermediate
  secondary600: "#0D9488",
  secondary700: "#0F766E",
  secondary800: "#115E59",
  secondary900: "#134E4A",

  // Emerald accent
  emerald50: "#ECFDF5",
  emerald100: "#D1FAE5",
  emerald200: "#A7F3D0",
  emerald300: "#6EE7B7",
  emerald400: "#34D399",
  emerald500: "#10B981", // Secondary accent
  emerald600: "#059669",
  emerald700: "#047857",
  emerald800: "#065F46",
  emerald900: "#064E3B",

  // Semantic Colors
  // Success - Emerald
  success50: "#ECFDF5",
  success100: "#D1FAE5",
  success500: "#10B981",
  success600: "#059669",
  success900: "#064E3B",

  // Warning - Amber
  warning50: "#FFFBEB",
  warning100: "#FEF3C7",
  warning500: "#F59E0B",
  warning600: "#D97706",
  warning900: "#92400E",

  // Error - Red
  error50: "#FEF2F2",
  error100: "#FEE2E2",
  error500: "#EF4444",
  error600: "#DC2626",
  error900: "#7F1D1D",

  // Info - Blue
  info50: "#EFF6FF",
  info100: "#DBEAFE",
  info500: "#3B82F6",
  info600: "#2563EB",
  info900: "#1E3A8A",

  // Modern overlays
  overlay20: "rgba(15, 23, 42, 0.2)",
  overlay50: "rgba(15, 23, 42, 0.5)",
  overlay80: "rgba(15, 23, 42, 0.8)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * Subtle text for less important information.
   */
  textSubtle: palette.neutral500,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral50,
  /**
   * Secondary background color for cards and surfaces.
   */
  backgroundSecondary: palette.neutral100,
  /**
   * The default border color.
   */
  border: palette.neutral300,
  /**
   * Subtle border color for less prominent elements.
   */
  borderSubtle: palette.neutral200,
  /**
   * The main tinting color - Modern Indigo.
   */
  tint: palette.primary500,
  /**
   * Secondary tint for gradients - Violet.
   */
  tintSecondary: palette.violet500,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral400,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral200,
  /**
   * Success color - Emerald.
   */
  success: palette.success500,
  /**
   * Success background.
   */
  successBackground: palette.success50,
  /**
   * Warning color - Amber.
   */
  warning: palette.warning500,
  /**
   * Warning background.
   */
  warningBackground: palette.warning50,
  /**
   * Error color - Red.
   */
  error: palette.error500,
  /**
   * Error background.
   */
  errorBackground: palette.error50,
  /**
   * Info color - Blue.
   */
  info: palette.info500,
  /**
   * Info background.
   */
  infoBackground: palette.info50,
} as const
