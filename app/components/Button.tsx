import { ComponentType, useRef } from "react"
import {
  ActivityIndicator,
  Animated,
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native"

import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { MicroAnimations } from "@/utils/animations"

import { Text, TextProps } from "./Text"

type Presets = "primary" | "secondary" | "ghost" | "icon" | "floating" | "default" | "filled" | "reversed"

type Sizes = "sm" | "md" | "lg" | "xl"

export interface ButtonAccessoryProps {
  style: StyleProp<any>
  pressableState: PressableStateCallbackType
  disabled?: boolean
}

export interface ButtonProps extends PressableProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps["tx"]
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps["text"]
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps["txOptions"]
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  /**
   * An optional style override for the "pressed" state.
   */
  pressedStyle?: StyleProp<ViewStyle>
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "pressed" state.
   */
  pressedTextStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "disabled" state.
   */
  disabledTextStyle?: StyleProp<TextStyle>
  /**
   * One of the different types of button presets.
   */
  preset?: Presets
  /**
   * Size variant for the button.
   */
  size?: Sizes
  /**
   * Show loading state with spinner.
   */
  loading?: boolean
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * Children components.
   */
  children?: React.ReactNode
  /**
   * disabled prop, accessed directly for declarative styling reasons.
   * https://reactnative.dev/docs/pressable#disabled
   */
  disabled?: boolean
  /**
   * An optional style override for the disabled state
   */
  disabledStyle?: StyleProp<ViewStyle>
}

/**
 * A component that allows users to take actions and make choices.
 * Wraps the Text component with a Pressable component.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Button/}
 * @param {ButtonProps} props - The props for the `Button` component.
 * @returns {JSX.Element} The rendered `Button` component.
 * @example
 * <Button
 *   tx="common:ok"
 *   style={styles.button}
 *   textStyle={styles.buttonText}
 *   onPress={handleButtonPress}
 * />
 */
export function Button(props: ButtonProps) {
  const {
    tx,
    text,
    txOptions,
    style: $viewStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    disabledTextStyle: $disabledTextStyleOverride,
    children,
    RightAccessory,
    LeftAccessory,
    disabled,
    disabledStyle: $disabledViewStyleOverride,
    loading = false,
    ...rest
  } = props

  // Animation for micro-interactions
  const scaleAnim = useRef(new Animated.Value(1)).current

  const { themed } = useAppTheme()

  const preset: Presets = props.preset ?? "primary"
  const size: Sizes = props.size ?? "md"
  const isDisabled = disabled || loading
  /**
   * @param {PressableStateCallbackType} root0 - The root object containing the pressed state.
   * @param {boolean} root0.pressed - The pressed state.
   * @returns {StyleProp<ViewStyle>} The view style based on the pressed state.
   */
  function $viewStyle({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> {
    return [
      themed($viewPresets[preset]),
      themed($sizePresets[size]),
      $viewStyleOverride,
      !!pressed && themed([$pressedViewPresets[preset], $pressedViewStyleOverride]),
      !!isDisabled && themed($disabledViewPresets[preset]),
      !!isDisabled && $disabledViewStyleOverride,
    ]
  }
  /**
   * @param {PressableStateCallbackType} root0 - The root object containing the pressed state.
   * @param {boolean} root0.pressed - The pressed state.
   * @returns {StyleProp<TextStyle>} The text style based on the pressed state.
   */
  function $textStyle({ pressed }: PressableStateCallbackType): StyleProp<TextStyle> {
    return [
      themed($textPresets[preset]),
      themed($textSizePresets[size]),
      $textStyleOverride,
      !!pressed && themed([$pressedTextPresets[preset], $pressedTextStyleOverride]),
      !!isDisabled && themed($disabledTextPresets[preset]),
      !!isDisabled && $disabledTextStyleOverride,
    ]
  }

  const handlePressIn = (event: any) => {
    if (!isDisabled) {
      MicroAnimations.buttonPress(scaleAnim).start()
    }
    rest.onPressIn?.(event)
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={$viewStyle}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!isDisabled }}
        {...rest}
        onPressIn={handlePressIn}
        disabled={isDisabled}
      >
      {(state) => (
        <>
          {loading && (
            <ActivityIndicator
              size="small"
              color={themed(({ colors }) => 
                preset === "primary" || preset === "reversed" ? colors.palette.neutral100 : colors.tint
              )}
              style={$loadingStyle}
            />
          )}
          
          {!loading && !!LeftAccessory && (
            <LeftAccessory style={$leftAccessoryStyle} pressableState={state} disabled={isDisabled} />
          )}

          {!loading && (
            <Text tx={tx} text={text} txOptions={txOptions} style={$textStyle(state)}>
              {children}
            </Text>
          )}

          {!loading && !!RightAccessory && (
            <RightAccessory
              style={$rightAccessoryStyle}
              pressableState={state}
              disabled={isDisabled}
            />
          )}
        </>
      )}
    </Pressable>
    </Animated.View>
  )
}

// Modern Base Styles with new design system
const $baseViewStyle: ThemedStyle<ViewStyle> = ({ spacing, elevation }) => ({
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  ...elevation.level1, // Default subtle shadow
})

const $baseTextStyle: ThemedStyle<TextStyle> = ({ typography }) => ({
  ...typography.presets.button,
  textAlign: "center",
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 2,
})

// Loading spinner style
const $loadingStyle: ViewStyle = {
  zIndex: 3,
}

// Accessory styles with better spacing
const $rightAccessoryStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginStart: spacing.xs,
  zIndex: 1,
})
const $leftAccessoryStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginEnd: spacing.xs,
  zIndex: 1,
})

// Size Presets - Modern scaling
const $sizePresets: Record<Sizes, ThemedStyle<ViewStyle>> = {
  sm: ({ spacing }) => ({
    minHeight: 36,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.xs,
  }),
  md: ({ spacing }) => ({
    minHeight: 44,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
  }),
  lg: ({ spacing }) => ({
    minHeight: 52,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.sm,
  }),
  xl: ({ spacing }) => ({
    minHeight: 60,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: spacing.md,
  }),
}

// Text Size Presets
const $textSizePresets: Record<Sizes, ThemedStyle<TextStyle>> = {
  sm: ({ typography }) => typography.presets.buttonSmall,
  md: ({ typography }) => typography.presets.button,
  lg: ({ typography }) => ({
    ...typography.presets.button,
    fontSize: 18,
    lineHeight: 28,
  }),
  xl: ({ typography }) => ({
    ...typography.presets.button,
    fontSize: 20,
    lineHeight: 30,
  }),
}

// Modern View Presets
const $viewPresets: Record<Presets, ThemedStyleArray<ViewStyle>> = {
  // Primary: Modern gradient background with rounded corners
  primary: [
    $styles.row,
    $baseViewStyle,
    ({ colors, elevation }) => ({
      backgroundColor: colors.tint,
      ...elevation.level1,
    }),
  ],
  
  // Secondary: Outlined with modern borders and hover states
  secondary: [
    $styles.row,
    $baseViewStyle,
    ({ colors }) => ({
      borderWidth: 1.5,
      borderColor: colors.tint,
      backgroundColor: colors.transparent,
    }),
  ],
  
  // Ghost: Transparent with subtle hover effects
  ghost: [
    $styles.row,
    $baseViewStyle,
    ({ colors, elevation }) => ({
      backgroundColor: colors.transparent,
      ...elevation.none,
    }),
  ],
  
  // Icon: Circular icon buttons
  icon: [
    $baseViewStyle,
    ({ spacing, elevation }) => ({
      width: 44,
      height: 44,
      borderRadius: 22,
      paddingVertical: 0,
      paddingHorizontal: 0,
      ...elevation.level1,
    }),
  ],
  
  // Floating: FAB-style buttons with elevation
  floating: [
    $baseViewStyle,
    ({ colors, spacing, elevation }) => ({
      width: 56,
      height: 56,
      borderRadius: 28,
      paddingVertical: 0,
      paddingHorizontal: 0,
      backgroundColor: colors.tint,
      ...elevation.level3,
    }),
  ],
  
  // Legacy presets for backward compatibility
  default: [
    $styles.row,
    $baseViewStyle,
    ({ colors }) => ({
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundSecondary,
    }),
  ],
  filled: [
    $styles.row,
    $baseViewStyle,
    ({ colors }) => ({ backgroundColor: colors.tint }),
  ],
  reversed: [
    $styles.row,
    $baseViewStyle,
    ({ colors }) => ({ backgroundColor: colors.text }),
  ],
}

// Modern Text Presets
const $textPresets: Record<Presets, ThemedStyleArray<TextStyle>> = {
  primary: [$baseTextStyle, ({ colors }) => ({ color: colors.palette.neutral100 })],
  secondary: [$baseTextStyle, ({ colors }) => ({ color: colors.tint })],
  ghost: [$baseTextStyle, ({ colors }) => ({ color: colors.tint })],
  icon: [$baseTextStyle, ({ colors }) => ({ color: colors.palette.neutral100 })],
  floating: [$baseTextStyle, ({ colors }) => ({ color: colors.palette.neutral100 })],
  
  // Legacy
  default: [$baseTextStyle, ({ colors }) => ({ color: colors.text })],
  filled: [$baseTextStyle, ({ colors }) => ({ color: colors.palette.neutral100 })],
  reversed: [$baseTextStyle, ({ colors }) => ({ color: colors.background })],
}

// Modern Pressed States with subtle animations
const $pressedViewPresets: Record<Presets, ThemedStyle<ViewStyle>> = {
  primary: ({ colors, elevation }) => ({ 
    backgroundColor: colors.palette.primary600,
    ...elevation.level2,
    transform: [{ scale: 0.98 }],
  }),
  secondary: ({ colors }) => ({ 
    backgroundColor: colors.palette.primary50,
    borderColor: colors.palette.primary600,
    transform: [{ scale: 0.98 }],
  }),
  ghost: ({ colors }) => ({ 
    backgroundColor: colors.palette.primary50,
    transform: [{ scale: 0.98 }],
  }),
  icon: ({ colors, elevation }) => ({ 
    backgroundColor: colors.palette.primary600,
    ...elevation.level2,
    transform: [{ scale: 0.95 }],
  }),
  floating: ({ colors, elevation }) => ({ 
    backgroundColor: colors.palette.primary600,
    ...elevation.level4,
    transform: [{ scale: 0.95 }],
  }),
  
  // Legacy
  default: ({ colors }) => ({ backgroundColor: colors.palette.neutral200 }),
  filled: ({ colors }) => ({ backgroundColor: colors.palette.primary600 }),
  reversed: ({ colors }) => ({ backgroundColor: colors.palette.neutral700 }),
}

// Text pressed states
const $pressedTextPresets: Record<Presets, ThemedStyle<TextStyle>> = {
  primary: () => ({ opacity: 0.9 }),
  secondary: ({ colors }) => ({ color: colors.palette.primary600 }),
  ghost: ({ colors }) => ({ color: colors.palette.primary600 }),
  icon: () => ({ opacity: 0.9 }),
  floating: () => ({ opacity: 0.9 }),
  
  // Legacy
  default: () => ({ opacity: 0.9 }),
  filled: () => ({ opacity: 0.9 }),
  reversed: () => ({ opacity: 0.9 }),
}

// Modern Disabled States
const $disabledViewPresets: Record<Presets, ThemedStyle<ViewStyle>> = {
  primary: ({ colors, elevation }) => ({ 
    backgroundColor: colors.palette.neutral300,
    ...elevation.none,
  }),
  secondary: ({ colors }) => ({ 
    borderColor: colors.palette.neutral300,
    backgroundColor: colors.transparent,
  }),
  ghost: ({ colors }) => ({ 
    backgroundColor: colors.transparent,
  }),
  icon: ({ colors, elevation }) => ({ 
    backgroundColor: colors.palette.neutral300,
    ...elevation.none,
  }),
  floating: ({ colors, elevation }) => ({ 
    backgroundColor: colors.palette.neutral300,
    ...elevation.level1,
  }),
  
  // Legacy
  default: ({ colors }) => ({ backgroundColor: colors.palette.neutral200 }),
  filled: ({ colors }) => ({ backgroundColor: colors.palette.neutral300 }),
  reversed: ({ colors }) => ({ backgroundColor: colors.palette.neutral400 }),
}

// Disabled text states
const $disabledTextPresets: Record<Presets, ThemedStyle<TextStyle>> = {
  primary: ({ colors }) => ({ color: colors.palette.neutral500 }),
  secondary: ({ colors }) => ({ color: colors.palette.neutral400 }),
  ghost: ({ colors }) => ({ color: colors.palette.neutral400 }),
  icon: ({ colors }) => ({ color: colors.palette.neutral500 }),
  floating: ({ colors }) => ({ color: colors.palette.neutral500 }),
  
  // Legacy
  default: ({ colors }) => ({ color: colors.palette.neutral500 }),
  filled: ({ colors }) => ({ color: colors.palette.neutral500 }),
  reversed: ({ colors }) => ({ color: colors.palette.neutral400 }),
}
