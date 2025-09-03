import { ComponentType } from "react"
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { IconTypes, Icon } from "./Icon"
import { Text, TextProps } from "./Text"

export interface TabBarProps {
  /**
   * Array of tab items to display
   */
  tabs: TabBarItemProps[]
  /**
   * Currently active tab index
   */
  activeIndex: number
  /**
   * Callback when tab is pressed
   */
  onTabPress: (index: number) => void
  /**
   * Optional style override for the container
   */
  style?: StyleProp<ViewStyle>
  /**
   * Optional style override for individual tabs
   */
  tabStyle?: StyleProp<ViewStyle>
  /**
   * Show floating style with rounded corners and shadow
   */
  floating?: boolean
}

export interface TabBarItemProps {
  /**
   * Tab label text
   */
  label?: TextProps["text"]
  /**
   * Tab label text which is looked up via i18n
   */
  labelTx?: TextProps["tx"]
  /**
   * Icon to display
   */
  icon?: IconTypes
  /**
   * Badge count to display
   */
  badge?: number
  /**
   * Custom component to render instead of icon
   */
  IconComponent?: ComponentType<{ active: boolean; color: string }>
  /**
   * Additional props for the tab touchable
   */
  touchableProps?: TouchableOpacityProps
}

/**
 * Modern TabBar component with floating indicators and smooth animations.
 * Perfect for bottom navigation with clean, contemporary styling.
 * 
 * @param {TabBarProps} props - The props for the `TabBar` component.
 * @returns {JSX.Element} The rendered `TabBar` component.
 */
export function TabBar(props: TabBarProps) {
  const {
    tabs,
    activeIndex,
    onTabPress,
    style: $styleOverride,
    tabStyle: $tabStyleOverride,
    floating = true,
  } = props

  const { themed } = useAppTheme()

  return (
    <View style={[
      themed(floating ? $containerFloating : $containerDefault),
      $styleOverride
    ]}>
      {tabs.map((tab, index) => (
        <TabBarItem
          key={index}
          {...tab}
          active={index === activeIndex}
          onPress={() => onTabPress(index)}
          style={$tabStyleOverride}
        />
      ))}
    </View>
  )
}

interface TabBarItemInternalProps extends TabBarItemProps {
  active: boolean
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

/**
 * Individual tab item with modern styling and smooth state transitions.
 */
function TabBarItem(props: TabBarItemInternalProps) {
  const {
    label,
    labelTx,
    icon,
    badge,
    IconComponent,
    active,
    onPress,
    style: $styleOverride,
    touchableProps,
  } = props

  const { themed, theme: { colors } } = useAppTheme()

  const iconColor = active ? colors.tint : colors.textSubtle
  const textColor = active ? colors.tint : colors.textSubtle

  return (
    <TouchableOpacity
      style={[
        themed($tabItem),
        active && themed($tabItemActive),
        $styleOverride
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      {...touchableProps}
    >
      {/* Icon with badge */}
      <View style={themed($iconContainer)}>
        {IconComponent ? (
          <IconComponent active={active} color={iconColor} />
        ) : icon ? (
          <Icon
            icon={icon}
            size={24}
            color={iconColor}
          />
        ) : null}
        
        {badge && badge > 0 && (
          <View style={themed($badge)}>
            <Text
              style={themed($badgeText)}
              text={badge > 99 ? "99+" : badge.toString()}
            />
          </View>
        )}
      </View>

      {/* Label */}
      {(label || labelTx) && (
        <Text
          tx={labelTx}
          text={label}
          style={[
            themed($tabLabel),
            { color: textColor }
          ]}
        />
      )}

      {/* Active Indicator */}
      {active && (
        <View style={themed($activeIndicator)} />
      )}
    </TouchableOpacity>
  )
}

// Modern TabBar Styles

// Container Styles
const $containerDefault: ThemedStyle<ViewStyle> = ({ colors, spacing, elevation }) => ({
  flexDirection: "row",
  backgroundColor: colors.background,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  ...elevation.level1,
})

const $containerFloating: ThemedStyle<ViewStyle> = ({ colors, spacing, elevation }) => ({
  flexDirection: "row",
  backgroundColor: colors.background,
  marginHorizontal: spacing.md,
  marginBottom: spacing.md,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  borderRadius: spacing.lg, // Rounded floating appearance
  ...elevation.level3, // More prominent shadow for floating
})

// Tab Item Styles
const $tabItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.xs,
  minHeight: 60,
  position: "relative",
})

const $tabItemActive: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary50, // Subtle background tint
  borderRadius: spacing.sm,
})

// Icon Container
const $iconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  marginBottom: spacing.xxxs,
  position: "relative",
})

// Badge Styles
const $badge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: "absolute",
  top: -4,
  right: -8,
  backgroundColor: colors.error,
  borderRadius: 10,
  minWidth: 20,
  height: 20,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: spacing.xxxs,
})

const $badgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  fontSize: 12,
  fontWeight: "600",
  lineHeight: 16,
})

// Label Styles
const $tabLabel: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontWeight: "500",
  lineHeight: 16,
  textAlign: "center",
})

// Active Indicator
const $activeIndicator: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: "absolute",
  bottom: spacing.xxxs,
  width: 32,
  height: 3,
  backgroundColor: colors.tint,
  borderRadius: 2,
})
