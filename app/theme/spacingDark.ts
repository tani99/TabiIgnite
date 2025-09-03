const SPACING_MULTIPLIER = 1.0

/**
 * Dark Theme Spacing System
 * 
 * Uses the same spacing values as light theme for consistency.
 * The multiplier allows for future customization if needed
 * (e.g., slightly larger spacing for better dark mode readability).
 */
export const spacing = {
  // Micro spacing for fine details
  micro: 1 * SPACING_MULTIPLIER,      // 1px - hairline borders, fine adjustments
  nano: 2 * SPACING_MULTIPLIER,       // 2px - thin borders, subtle separators
  
  // Core spacing scale with golden ratio progression
  xxxs: 4 * SPACING_MULTIPLIER,       // 4px - tight spacing, small gaps
  xxs: 6 * SPACING_MULTIPLIER,        // 6px - compact elements
  xs: 8 * SPACING_MULTIPLIER,         // 8px - small padding, close elements
  sm: 12 * SPACING_MULTIPLIER,        // 12px - comfortable small spacing
  md: 16 * SPACING_MULTIPLIER,        // 16px - standard spacing (base unit)
  lg: 24 * SPACING_MULTIPLIER,        // 24px - comfortable large spacing
  xl: 32 * SPACING_MULTIPLIER,        // 32px - section spacing
  xxl: 48 * SPACING_MULTIPLIER,       // 48px - major spacing
  xxxl: 64 * SPACING_MULTIPLIER,      // 64px - large section spacing
  
  // Macro spacing for major layout sections
  macro: 80 * SPACING_MULTIPLIER,     // 80px - major page sections
  ultra: 120 * SPACING_MULTIPLIER,    // 120px - hero sections, major breaks
  mega: 160 * SPACING_MULTIPLIER,     // 160px - maximum spacing for large screens
} as const

/**
 * Semantic spacing for common component use cases in dark theme
 * Maintains consistency with light theme spacing patterns
 */
export const componentSpacing = {
  // Button internal spacing
  button: {
    paddingHorizontal: spacing.md,    // 16px
    paddingVertical: spacing.sm,      // 12px
    gap: spacing.xs,                  // 8px between icon and text
  },
  buttonSmall: {
    paddingHorizontal: spacing.sm,    // 12px
    paddingVertical: spacing.xs,      // 8px
    gap: spacing.xxs,                 // 6px between icon and text
  },
  buttonLarge: {
    paddingHorizontal: spacing.lg,    // 24px
    paddingVertical: spacing.md,      // 16px
    gap: spacing.sm,                  // 12px between icon and text
  },

  // Card spacing
  card: {
    padding: spacing.md,              // 16px internal padding
    margin: spacing.sm,               // 12px external margin
    gap: spacing.sm,                  // 12px between card elements
    borderRadius: spacing.sm,         // 12px rounded corners
  },
  cardLarge: {
    padding: spacing.lg,              // 24px internal padding
    margin: spacing.md,               // 16px external margin
    gap: spacing.md,                  // 16px between card elements
    borderRadius: spacing.md,         // 16px rounded corners
  },

  // Input field spacing
  input: {
    paddingHorizontal: spacing.md,    // 16px horizontal padding
    paddingVertical: spacing.sm,      // 12px vertical padding
    marginVertical: spacing.xs,       // 8px margin between inputs
    borderRadius: spacing.xs,         // 8px rounded corners
  },

  // List item spacing
  listItem: {
    paddingHorizontal: spacing.md,    // 16px horizontal padding
    paddingVertical: spacing.sm,      // 12px vertical padding
    gap: spacing.sm,                  // 12px between elements
    marginVertical: spacing.nano,     // 2px between items
  },

  // Screen layout spacing
  screen: {
    paddingHorizontal: spacing.md,    // 16px screen edge padding
    paddingVertical: spacing.lg,      // 24px top/bottom padding
    sectionGap: spacing.xl,           // 32px between major sections
    headerMargin: spacing.lg,         // 24px below headers
  },

  // Header spacing
  header: {
    paddingHorizontal: spacing.md,    // 16px horizontal padding
    paddingVertical: spacing.sm,      // 12px vertical padding
    titleMargin: spacing.xs,          // 8px around title
    buttonGap: spacing.sm,            // 12px between header buttons
  },
} as const


