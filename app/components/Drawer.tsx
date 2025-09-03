import { ReactElement, ReactNode } from "react"
import {
  Modal,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  Animated,
  Dimensions,
  TextStyle,
} from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

import { IconTypes, Icon } from "./Icon"
import { Text, TextProps } from "./Text"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

export interface DrawerProps {
  /**
   * Whether the drawer is visible
   */
  visible: boolean
  /**
   * Callback when drawer should be closed
   */
  onClose: () => void
  /**
   * Drawer content
   */
  children: ReactNode
  /**
   * Drawer width as percentage of screen width
   */
  width?: number
  /**
   * Position of the drawer
   */
  position?: "left" | "right"
  /**
   * Optional style override for the drawer container
   */
  style?: StyleProp<ViewStyle>
  /**
   * Enable blur backdrop effect
   */
  blurBackdrop?: boolean
}

export interface DrawerItemProps {
  /**
   * Item label text
   */
  label?: TextProps["text"]
  /**
   * Item label text which is looked up via i18n
   */
  labelTx?: TextProps["tx"]
  /**
   * Icon to display
   */
  icon?: IconTypes
  /**
   * Callback when item is pressed
   */
  onPress?: () => void
  /**
   * Whether the item is active/selected
   */
  active?: boolean
  /**
   * Custom icon component
   */
  IconComponent?: ReactElement
  /**
   * Optional style override
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Modern Drawer component with blur backdrop and smooth slide animations.
 * Perfect for navigation menus with contemporary styling.
 * 
 * @param {DrawerProps} props - The props for the `Drawer` component.
 * @returns {JSX.Element} The rendered `Drawer` component.
 */
export function Drawer(props: DrawerProps) {
  const {
    visible,
    onClose,
    children,
    width = 80, // 80% of screen width
    position = "left",
    style: $styleOverride,
    blurBackdrop = true,
  } = props

  const { themed } = useAppTheme()
  const $containerInsets = useSafeAreaInsetsStyle(["top", "bottom"])

  const drawerWidth = (SCREEN_WIDTH * width) / 100

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={themed(blurBackdrop ? $backdropBlur : $backdrop)} />
      </TouchableWithoutFeedback>

      {/* Drawer Container */}
      <View style={[
        themed($drawerContainer),
        {
          width: drawerWidth,
          [position]: 0,
        },
        $containerInsets,
        $styleOverride
      ]}>
        {children}
      </View>
    </Modal>
  )
}

/**
 * Modern drawer item with clean styling and hover effects.
 * Use within Drawer component for consistent navigation items.
 */
export function DrawerItem(props: DrawerItemProps) {
  const {
    label,
    labelTx,
    icon,
    onPress,
    active = false,
    IconComponent,
    style: $styleOverride,
  } = props

  const { themed, theme: { colors } } = useAppTheme()

  const iconColor = active ? colors.tint : colors.textDim
  const textColor = active ? colors.tint : colors.text

  return (
    <TouchableOpacity
      style={[
        themed($drawerItem),
        active && themed($drawerItemActive),
        $styleOverride
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={themed($itemIconContainer)}>
        {IconComponent || (icon && (
          <Icon
            icon={icon}
            size={24}
            color={iconColor}
          />
        ))}
      </View>

      {/* Label */}
      {(label || labelTx) && (
        <Text
          tx={labelTx}
          text={label}
          style={[
            themed($itemLabel),
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

/**
 * Drawer section header for grouping items.
 */
export function DrawerSection({ title, children }: { title: string; children: ReactNode }) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($section)}>
      <Text
        text={title}
        style={themed($sectionTitle)}
      />
      {children}
    </View>
  )
}

// Modern Drawer Styles

// Backdrop Styles
const $backdrop: ThemedStyle<ViewStyle> = () => ({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
})

const $backdropBlur: ThemedStyle<ViewStyle> = () => ({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0, 0, 0, 0.3)", // Lighter for blur effect
  // Note: Actual blur would require react-native-blur or similar
})

// Drawer Container
const $drawerContainer: ThemedStyle<ViewStyle> = ({ colors, elevation }) => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  backgroundColor: colors.background,
  ...elevation.level4, // Prominent shadow
})

// Drawer Item Styles
const $drawerItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  marginHorizontal: spacing.xs,
  borderRadius: spacing.sm,
  minHeight: 48, // Minimum touch target
  position: "relative",
})

const $drawerItemActive: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary50, // Subtle active background
})

// Icon Container
const $itemIconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 32,
  alignItems: "center",
  justifyContent: "center",
  marginEnd: spacing.sm,
})

// Label Styles
const $itemLabel: ThemedStyle<TextStyle> = () => ({
  flex: 1,
  fontSize: 16,
  fontWeight: "500",
  lineHeight: 24,
})

// Active Indicator
const $activeIndicator: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: "absolute",
  left: 0,
  top: "50%",
  marginTop: -12,
  width: 3,
  height: 24,
  backgroundColor: colors.tint,
  borderTopRightRadius: spacing.xxxs,
  borderBottomRightRadius: spacing.xxxs,
})

// Section Styles
const $section: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 14,
  fontWeight: "600",
  color: colors.textSubtle,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  marginBottom: spacing.xs,
  marginHorizontal: spacing.md,
})


