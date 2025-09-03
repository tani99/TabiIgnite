import { colors as colorsLight } from "./colors"
import { colors as colorsDark } from "./colorsDark"
import { elevation, elevationDark } from "./elevation"
import { spacing as spacingLight } from "./spacing"
import { spacing as spacingDark } from "./spacingDark"
import { timing } from "./timing"
import type { Theme } from "./types"
import { typography } from "./typography"

// Here we define our themes.
export const lightTheme: Theme = {
  colors: colorsLight,
  spacing: spacingLight,
  elevation,
  typography,
  timing,
  isDark: false,
}
export const darkTheme: Theme = {
  colors: colorsDark,
  spacing: spacingDark,
  elevation: elevationDark,
  typography,
  timing,
  isDark: true,
}
