const palette = {
  // Modern Dark Slate Gray Scale (inverted for dark mode)
  neutral50: "#0F172A",
  neutral100: "#1E293B",
  neutral200: "#334155",
  neutral300: "#475569",
  neutral400: "#64748B",
  neutral500: "#94A3B8",
  neutral600: "#CBD5E1",
  neutral700: "#E2E8F0",
  neutral800: "#F1F5F9",
  neutral900: "#F8FAFC",

  // Modern Primary: Indigo to Violet Gradient System (brighter for dark mode)
  primary50: "#312E81",
  primary100: "#3730A3",
  primary200: "#4338CA",
  primary300: "#4F46E5",
  primary400: "#6366F1",
  primary500: "#818CF8", // Brighter primary for dark mode
  primary600: "#A5B4FC",
  primary700: "#C7D2FE",
  primary800: "#E0E7FF",
  primary900: "#EEF2FF",

  // Violet accent for gradients (brighter for dark mode)
  violet50: "#4C1D95",
  violet100: "#5B21B6",
  violet200: "#6D28D9",
  violet300: "#7C3AED",
  violet400: "#8B5CF6",
  violet500: "#A78BFA", // Brighter secondary primary for gradients
  violet600: "#C4B5FD",
  violet700: "#DDD6FE",
  violet800: "#EDE9FE",
  violet900: "#F5F3FF",

  // Secondary: Teal to Emerald System (brighter for dark mode)
  secondary50: "#134E4A",
  secondary100: "#115E59",
  secondary200: "#0F766E",
  secondary300: "#0D9488",
  secondary400: "#14B8A6",
  secondary500: "#2DD4BF", // Brighter for dark mode
  secondary600: "#5EEAD4",
  secondary700: "#99F6E4",
  secondary800: "#CCFBF1",
  secondary900: "#F0FDFA",

  // Emerald accent (brighter for dark mode)
  emerald50: "#064E3B",
  emerald100: "#065F46",
  emerald200: "#047857",
  emerald300: "#059669",
  emerald400: "#10B981",
  emerald500: "#34D399", // Brighter secondary accent
  emerald600: "#6EE7B7",
  emerald700: "#A7F3D0",
  emerald800: "#D1FAE5",
  emerald900: "#ECFDF5",

  // Semantic Colors (brighter for dark mode)
  // Success - Emerald
  success50: "#064E3B",
  success100: "#065F46",
  success500: "#34D399",
  success600: "#6EE7B7",
  success900: "#ECFDF5",

  // Warning - Amber
  warning50: "#92400E",
  warning100: "#B45309",
  warning500: "#FBBF24",
  warning600: "#FCD34D",
  warning900: "#FFFBEB",

  // Error - Red
  error50: "#7F1D1D",
  error100: "#991B1B",
  error500: "#F87171",
  error600: "#FCA5A5",
  error900: "#FEF2F2",

  // Info - Blue
  info50: "#1E3A8A",
  info100: "#1E40AF",
  info500: "#60A5FA",
  info600: "#93C5FD",
  info900: "#EFF6FF",

  // Modern overlays for dark mode
  overlay20: "rgba(248, 250, 252, 0.1)",
  overlay50: "rgba(248, 250, 252, 0.2)",
  overlay80: "rgba(248, 250, 252, 0.3)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral800,
  textDim: palette.neutral600,
  textSubtle: palette.neutral500,
  background: palette.neutral50,
  backgroundSecondary: palette.neutral100,
  border: palette.neutral300,
  borderSubtle: palette.neutral200,
  tint: palette.primary500,
  tintSecondary: palette.violet500,
  tintInactive: palette.neutral400,
  separator: palette.neutral200,
  success: palette.success500,
  successBackground: palette.success50,
  warning: palette.warning500,
  warningBackground: palette.warning50,
  error: palette.error500,
  errorBackground: palette.error50,
  info: palette.info500,
  infoBackground: palette.info50,
} as const
