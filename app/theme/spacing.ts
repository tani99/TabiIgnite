/**
 * Modern Spacing System with Golden Ratio Progression
 * 
 * Uses mathematical progression for harmonious visual rhythm:
 * - Micro spacing: 1px, 2px for fine details (borders, dividers)
 * - Base scale: 4px foundation with golden ratio progression
 * - Macro spacing: 80px, 120px, 160px for major layout sections
 * 
 * Golden ratio (~1.618) creates natural, pleasing proportional relationships
 */
export const spacing = {
  // Micro spacing for fine details
  micro: 1,      // 1px - hairline borders, fine adjustments
  nano: 2,       // 2px - thin borders, subtle separators
  
  // Core spacing scale with golden ratio progression
  xxxs: 4,       // 4px - tight spacing, small gaps
  xxs: 6,        // 6px - compact elements
  xs: 8,         // 8px - small padding, close elements
  sm: 12,        // 12px - comfortable small spacing
  md: 16,        // 16px - standard spacing (base unit)
  lg: 24,        // 24px - comfortable large spacing (16 × 1.5)
  xl: 32,        // 32px - section spacing (16 × 2)
  xxl: 48,       // 48px - major spacing (16 × 3)
  xxxl: 64,      // 64px - large section spacing (16 × 4)
  
  // Macro spacing for major layout sections
  macro: 80,     // 80px - major page sections (16 × 5)
  ultra: 120,    // 120px - hero sections, major breaks (16 × 7.5)
  mega: 160,     // 160px - maximum spacing for large screens (16 × 10)
} as const

/**
 * Semantic spacing for common component use cases
 * Provides consistent spacing patterns across the app
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


