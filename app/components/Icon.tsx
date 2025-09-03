import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export type IconTypes = keyof typeof iconRegistry

// Modern icon sizing system
export type IconSizes = "xs" | "sm" | "md" | "lg" | "xl"

// Icon states for navigation and interactions
export type IconStates = "default" | "active" | "inactive" | "disabled"

type BaseIconProps = {
  /**
   * The name of the icon
   */
  icon: IconTypes

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * Modern size presets for consistent icon sizing
   * xs: 16px, sm: 20px, md: 24px, lg: 32px, xl: 40px
   */
  size?: IconSizes | number

  /**
   * Icon state for different interaction states
   */
  state?: IconStates

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * Whether to apply modern outline styling
   */
  outline?: boolean
}

type PressableIconProps = Omit<TouchableOpacityProps, "style"> & BaseIconProps
type IconProps = Omit<ViewProps, "style"> & BaseIconProps

// Modern icon size constants
const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
} as const

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity />
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Icon/}
 * @param {PressableIconProps} props - The props for the `PressableIcon` component.
 * @returns {JSX.Element} The rendered `PressableIcon` component.
 */
export function PressableIcon(props: PressableIconProps) {
  const {
    icon,
    color,
    size = "md",
    state = "default",
    outline = false,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...pressableProps
  } = props

  const { themed, theme } = useAppTheme()

  // Calculate icon size
  const iconSize = typeof size === "string" ? ICON_SIZES[size] : size

  // Get color based on state
  const getIconColor = () => {
    if (color) return color

    switch (state) {
      case "active":
        return theme.colors.tint
      case "inactive":
        return theme.colors.tintInactive
      case "disabled":
        return theme.colors.textDim
      default:
        return theme.colors.text
    }
  }

  const $imageStyle: StyleProp<ImageStyle> = [
    $imageStyleBase,
    { tintColor: getIconColor() },
    iconSize ? { width: iconSize, height: iconSize } : {},
    outline && themed($outlineStyle),
    state === "disabled" && { opacity: 0.5 },
    $imageStyleOverride,
  ]

  const $containerStyle: StyleProp<ViewStyle> = [
    themed($pressableContainerBase),
    outline && themed($outlineContainer),
    $containerStyleOverride,
  ]

  return (
    <TouchableOpacity 
      {...pressableProps} 
      style={$containerStyle}
      disabled={state === "disabled"}
    >
      <Image style={$imageStyle} source={iconRegistry[icon]} />
    </TouchableOpacity>
  )
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <View />, use `PressableIcon` if you want to react to input
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Icon/}
 * @param {IconProps} props - The props for the `Icon` component.
 * @returns {JSX.Element} The rendered `Icon` component.
 */
export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size = "md",
    state = "default",
    outline = false,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...viewProps
  } = props

  const { themed, theme } = useAppTheme()

  // Calculate icon size
  const iconSize = typeof size === "string" ? ICON_SIZES[size] : size

  // Get color based on state
  const getIconColor = () => {
    if (color) return color

    switch (state) {
      case "active":
        return theme.colors.tint
      case "inactive":
        return theme.colors.tintInactive
      case "disabled":
        return theme.colors.textDim
      default:
        return theme.colors.text
    }
  }

  const $imageStyle: StyleProp<ImageStyle> = [
    $imageStyleBase,
    { tintColor: getIconColor() },
    iconSize ? { width: iconSize, height: iconSize } : {},
    outline && themed($outlineStyle),
    state === "disabled" && { opacity: 0.5 },
    $imageStyleOverride,
  ]

  const $containerStyle: StyleProp<ViewStyle> = [
    themed($containerBase),
    outline && themed($outlineContainer),
    $containerStyleOverride,
  ]

  return (
    <View {...viewProps} style={$containerStyle}>
      <Image style={$imageStyle} source={iconRegistry[icon]} />
    </View>
  )
}

export const iconRegistry = {
  // Navigation & Actions
  back: require("@assets/icons/back.png"),
  caretLeft: require("@assets/icons/caretLeft.png"),
  caretRight: require("@assets/icons/caretRight.png"),
  menu: require("@assets/icons/menu.png"),
  more: require("@assets/icons/more.png"),
  x: require("@assets/icons/x.png"),
  
  // Interface & Controls
  check: require("@assets/icons/check.png"),
  settings: require("@assets/icons/settings.png"),
  bell: require("@assets/icons/bell.png"),
  view: require("@assets/icons/view.png"),
  hidden: require("@assets/icons/hidden.png"),
  lock: require("@assets/icons/lock.png"),
  
  // Demo & Social
  clap: require("@assets/icons/demo/clap.png"),
  community: require("@assets/icons/demo/community.png"),
  components: require("@assets/icons/demo/components.png"),
  debug: require("@assets/icons/demo/debug.png"),
  github: require("@assets/icons/demo/github.png"),
  heart: require("@assets/icons/demo/heart.png"),
  pin: require("@assets/icons/demo/pin.png"),
  podcast: require("@assets/icons/demo/podcast.png"),
  slack: require("@assets/icons/demo/slack.png"),
  ladybug: require("@assets/icons/ladybug.png"),
}

// Modern Icon Styles
const $imageStyleBase: ImageStyle = {
  resizeMode: "contain",
}

// Container styles
const $containerBase: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
})

const $pressableContainerBase: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44, // Minimum touch target
  minWidth: 44,
  padding: spacing.xs,
})

// Outline styling for modern icons
const $outlineStyle: ThemedStyle<ImageStyle> = ({ colors }) => ({
  // Modern outline effect using shadow/border
  shadowColor: colors.text,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.1,
  shadowRadius: 1,
})

const $outlineContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderWidth: 1,
  borderColor: colors.borderSubtle,
  borderRadius: spacing.sm,
  padding: spacing.xs,
})

/**
 * Utility functions for the modern icon system
 */
export const IconUtils = {
  /**
   * Get all available icon names
   */
  getAllIcons: (): IconTypes[] => Object.keys(iconRegistry) as IconTypes[],

  /**
   * Get all available sizes
   */
  getAllSizes: (): IconSizes[] => Object.keys(ICON_SIZES) as IconSizes[],

  /**
   * Get pixel size for a size name
   */
  getSizeValue: (size: IconSizes): number => ICON_SIZES[size],

  /**
   * Check if an icon exists
   */
  hasIcon: (iconName: string): iconName is IconTypes => iconName in iconRegistry,
}

/**
 * Icon presets for common use cases
 */
export const IconPresets = {
  /**
   * Navigation icons with consistent sizing
   */
  Navigation: {
    back: { icon: "back" as const, size: "md" as const, state: "default" as const },
    menu: { icon: "menu" as const, size: "md" as const, state: "default" as const },
    close: { icon: "x" as const, size: "md" as const, state: "default" as const },
    more: { icon: "more" as const, size: "md" as const, state: "default" as const },
  },

  /**
   * Action icons for buttons and interactions
   */
  Actions: {
    confirm: { icon: "check" as const, size: "sm" as const, state: "active" as const },
    settings: { icon: "settings" as const, size: "md" as const, state: "default" as const },
    notification: { icon: "bell" as const, size: "sm" as const, state: "default" as const },
  },

  /**
   * Social and demo icons
   */
  Social: {
    github: { icon: "github" as const, size: "md" as const, state: "default" as const },
    community: { icon: "community" as const, size: "md" as const, state: "default" as const },
    heart: { icon: "heart" as const, size: "sm" as const, state: "active" as const },
  },
}
