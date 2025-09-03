import React, { ComponentType, forwardRef, Ref, useImperativeHandle, useRef, useState } from "react"
import {
  Animated,
  ImageStyle,
  StyleProp,
  // eslint-disable-next-line no-restricted-imports
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"

import { isRTL } from "@/i18n"
import { translate } from "@/i18n/translate"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { MicroAnimations } from "@/utils/animations"

import { Text, TextProps } from "./Text"

type Variants = "filled" | "outlined" | "borderless"

type Sizes = "sm" | "md" | "lg"

export interface TextFieldAccessoryProps {
  style: StyleProp<ViewStyle | TextStyle | ImageStyle>
  status: TextFieldProps["status"]
  multiline: boolean
  editable: boolean
}

export interface TextFieldProps extends Omit<TextInputProps, "ref"> {
  /**
   * A style modifier for different input states.
   */
  status?: "error" | "disabled" | "success"
  /**
   * Input field variant style.
   */
  variant?: Variants
  /**
   * Size variant for the input field.
   */
  size?: Sizes
  /**
   * Enable floating label animation.
   */
  floatingLabel?: boolean
  /**
   * The label text to display if not using `labelTx`.
   */
  label?: TextProps["text"]
  /**
   * Label text which is looked up via i18n.
   */
  labelTx?: TextProps["tx"]
  /**
   * Optional label options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  labelTxOptions?: TextProps["txOptions"]
  /**
   * Pass any additional props directly to the label Text component.
   */
  LabelTextProps?: TextProps
  /**
   * The helper text to display if not using `helperTx`.
   */
  helper?: TextProps["text"]
  /**
   * Helper text which is looked up via i18n.
   */
  helperTx?: TextProps["tx"]
  /**
   * Optional helper options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  helperTxOptions?: TextProps["txOptions"]
  /**
   * Pass any additional props directly to the helper Text component.
   */
  HelperTextProps?: TextProps
  /**
   * The placeholder text to display if not using `placeholderTx`.
   */
  placeholder?: TextProps["text"]
  /**
   * Placeholder text which is looked up via i18n.
   */
  placeholderTx?: TextProps["tx"]
  /**
   * Optional placeholder options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  placeholderTxOptions?: TextProps["txOptions"]
  /**
   * Optional input style override.
   */
  style?: StyleProp<TextStyle>
  /**
   * Style overrides for the container
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * Style overrides for the input wrapper
   */
  inputWrapperStyle?: StyleProp<ViewStyle>
  /**
   * An optional component to render on the right side of the input.
   * Example: `RightAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  RightAccessory?: ComponentType<TextFieldAccessoryProps>
  /**
   * An optional component to render on the left side of the input.
   * Example: `LeftAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  LeftAccessory?: ComponentType<TextFieldAccessoryProps>
}

/**
 * A component that allows for the entering and editing of text.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/TextField/}
 * @param {TextFieldProps} props - The props for the `TextField` component.
 * @returns {JSX.Element} The rendered `TextField` component.
 */
export const TextField = forwardRef(function TextField(props: TextFieldProps, ref: Ref<TextInput>) {
  const {
    labelTx,
    label,
    labelTxOptions,
    placeholderTx,
    placeholder,
    placeholderTxOptions,
    helper,
    helperTx,
    helperTxOptions,
    status,
    variant = "filled",
    size = "md",
    floatingLabel = false,
    RightAccessory,
    LeftAccessory,
    HelperTextProps,
    LabelTextProps,
    style: $inputStyleOverride,
    containerStyle: $containerStyleOverride,
    inputWrapperStyle: $inputWrapperStyleOverride,
    ...TextInputProps
  } = props
  const input = useRef<TextInput>(null)
  
  // State for floating label animation and focus
  const [isFocused, setIsFocused] = useState(false)
  const labelAnimation = useRef(new Animated.Value(0)).current
  const scaleAnimation = useRef(new Animated.Value(1)).current

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const disabled = TextInputProps.editable === false || status === "disabled"
  
  // Dynamic hasValue calculation that updates with current value
  const hasValue = !!(TextInputProps.value || TextInputProps.defaultValue)

  const placeholderContent = placeholderTx
    ? translate(placeholderTx, placeholderTxOptions)
    : placeholder

  // Initialize animation based on current value - only on mount
  React.useEffect(() => {
    if (floatingLabel && hasValue) {
      labelAnimation.setValue(1)
    }
  }, []) // Only run on mount to avoid re-renders

  // Floating label animation
  const animateLabel = (toValue: number) => {
    Animated.timing(labelAnimation, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  const handleFocus = (e: any) => {
    setIsFocused(true)
    if (floatingLabel) {
      animateLabel(1)
    }
    // Add subtle focus animation
    MicroAnimations.inputFocus(scaleAnimation).start()
    // Call the original onFocus handler if it exists
    if (TextInputProps.onFocus) {
      TextInputProps.onFocus(e)
    }
  }

  const handleBlur = (e: any) => {
    setIsFocused(false)
    if (floatingLabel && !hasValue) {
      animateLabel(0)
    }
    // Return to normal scale
    MicroAnimations.inputBlur(scaleAnimation).start()
    // Call the original onBlur handler if it exists
    if (TextInputProps.onBlur) {
      TextInputProps.onBlur(e)
    }
  }

  const $containerStyles = [$containerStyleOverride]

  const $labelStyles = [
    themed($labelStyle),
    !floatingLabel && themed($labelStaticStyle),
    LabelTextProps?.style,
  ]

  const $floatingLabelStyles = floatingLabel ? [
    themed($floatingLabelStyle),
    {
      transform: [
        {
          translateY: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [16, -8],
          }),
        },
        {
          scale: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.85],
          }),
        },
      ],
    },
  ] : []

  const $floatingLabelTextStyles = floatingLabel ? [
    isFocused && themed($floatingLabelFocusedStyle),
    status === "error" && { color: colors.error },
    status === "success" && { color: colors.success },
  ] : []

  const $inputWrapperStyles = [
    $styles.row,
    themed($inputWrapperVariants[variant]),
    themed($inputWrapperSizes[size]),
    isFocused && themed($inputWrapperFocusedVariants[variant]),
    status === "error" && themed($inputWrapperErrorVariants[variant]),
    status === "success" && themed($inputWrapperSuccessVariants[variant]),
    disabled && themed($inputWrapperDisabledStyle),
    TextInputProps.multiline && { minHeight: 112 },
    LeftAccessory && { paddingStart: 0 },
    RightAccessory && { paddingEnd: 0 },
    $inputWrapperStyleOverride,
  ]

  const $inputStyles: ThemedStyleArray<TextStyle> = [
    themed($inputStyle),
    themed($inputSizes[size]),
    floatingLabel && themed($inputFloatingStyle),
    disabled && { color: colors.textDim },
    isRTL && { textAlign: "right" as TextStyle["textAlign"] },
    TextInputProps.multiline && { height: "auto" },
    $inputStyleOverride,
  ]

  const $helperStyles = [
    themed($helperStyle),
    status === "error" && { color: colors.error },
    status === "success" && { color: colors.success },
    HelperTextProps?.style,
  ]



  useImperativeHandle(ref, () => input.current as TextInput)

  return (
    <View style={$containerStyles}>
      {/* Static Label (traditional) */}
      {!floatingLabel && !!(label || labelTx) && (
        <Text
          preset="formLabel"
          text={label}
          tx={labelTx}
          txOptions={labelTxOptions}
          {...LabelTextProps}
          style={$labelStyles}
        />
      )}

      <Animated.View style={[
        themed($inputWrapperStyles),
        { transform: [{ scale: scaleAnimation }] }
      ]}>
        {/* Floating Label */}
        {floatingLabel && !!(label || labelTx) && (
          <Animated.View style={$floatingLabelStyles} pointerEvents="none">
            <Text
              preset="formLabel"
              text={label}
              tx={labelTx}
              txOptions={labelTxOptions}
              {...LabelTextProps}
              style={$floatingLabelTextStyles}
            />
          </Animated.View>
        )}

        {!!LeftAccessory && (
          <LeftAccessory
            style={themed($leftAccessoryStyle)}
            status={status}
            editable={!disabled}
            multiline={TextInputProps.multiline ?? false}
          />
        )}

        <TextInput
          ref={input}
          underlineColorAndroid={colors.transparent}
          textAlignVertical="top"
          placeholder={floatingLabel ? undefined : placeholderContent}
          placeholderTextColor={colors.textSubtle}
          {...TextInputProps}
          onFocus={floatingLabel ? handleFocus : TextInputProps.onFocus}
          onBlur={floatingLabel ? handleBlur : TextInputProps.onBlur}
          editable={!disabled}
          style={themed($inputStyles)}
        />

        {!!RightAccessory && (
          <RightAccessory
            style={themed($rightAccessoryStyle)}
            status={status}
            editable={!disabled}
            multiline={TextInputProps.multiline ?? false}
          />
        )}
      </Animated.View>

      {!!(helper || helperTx) && (
        <Text
          preset="formHelper"
          text={helper}
          tx={helperTx}
          txOptions={helperTxOptions}
          {...HelperTextProps}
          style={$helperStyles}
        />
      )}
    </View>
  )
})

// Modern TextField Styles

// Static Label Styles
const $labelStyle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $labelStaticStyle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

// Floating Label Styles
const $floatingLabelStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  left: spacing.sm,
  zIndex: 1,
  backgroundColor: "transparent",
})

const $floatingLabelFocusedStyle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
})

// Input Wrapper Variants
const $inputWrapperVariants: Record<Variants, ThemedStyle<ViewStyle>> = {
  filled: ({ colors, elevation }) => ({
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 0,
    ...elevation.none,
  }),
  outlined: ({ colors, elevation }) => ({
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...elevation.none,
  }),
  borderless: ({ colors, elevation }) => ({
    backgroundColor: colors.transparent,
    borderWidth: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    borderRadius: 0,
    ...elevation.none,
  }),
}

// Input Wrapper Sizes
const $inputWrapperSizes: Record<Sizes, ThemedStyle<ViewStyle>> = {
  sm: ({ spacing }) => ({
    borderRadius: spacing.xs,
    minHeight: 40,
    paddingHorizontal: spacing.sm,
  }),
  md: ({ spacing }) => ({
    borderRadius: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  }),
  lg: ({ spacing }) => ({
    borderRadius: spacing.sm,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
  }),
}

// Focus States for Each Variant
const $inputWrapperFocusedVariants: Record<Variants, ThemedStyle<ViewStyle>> = {
  filled: ({ colors, elevation }) => ({
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.tint,
    ...elevation.level1,
  }),
  outlined: ({ colors }) => ({
    borderColor: colors.tint,
    borderWidth: 2,
  }),
  borderless: ({ colors }) => ({
    borderBottomColor: colors.tint,
    borderBottomWidth: 2,
  }),
}

// Error States
const $inputWrapperErrorVariants: Record<Variants, ThemedStyle<ViewStyle>> = {
  filled: ({ colors }) => ({
    borderWidth: 1.5,
    borderColor: colors.error,
    backgroundColor: colors.errorBackground,
  }),
  outlined: ({ colors }) => ({
    borderColor: colors.error,
  }),
  borderless: ({ colors }) => ({
    borderBottomColor: colors.error,
  }),
}

// Success States
const $inputWrapperSuccessVariants: Record<Variants, ThemedStyle<ViewStyle>> = {
  filled: ({ colors }) => ({
    borderWidth: 1.5,
    borderColor: colors.success,
    backgroundColor: colors.successBackground,
  }),
  outlined: ({ colors }) => ({
    borderColor: colors.success,
  }),
  borderless: ({ colors }) => ({
    borderBottomColor: colors.success,
  }),
}

// Disabled State
const $inputWrapperDisabledStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral200,
  borderColor: colors.palette.neutral300,
  opacity: 0.6,
})

// Input Text Styles
const $inputStyle: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  flex: 1,
  alignSelf: "stretch",
  ...typography.presets.body,
  color: colors.text,
  // https://github.com/facebook/react-native/issues/21720#issuecomment-532642093
  paddingVertical: 0,
  paddingHorizontal: 0,
})

// Input Sizes
const $inputSizes: Record<Sizes, ThemedStyle<TextStyle>> = {
  sm: ({ spacing }) => ({
    paddingVertical: spacing.xs,
    fontSize: 14,
    lineHeight: 20,
  }),
  md: ({ spacing }) => ({
    paddingVertical: spacing.sm,
    fontSize: 16,
    lineHeight: 24,
  }),
  lg: ({ spacing }) => ({
    paddingVertical: spacing.md,
    fontSize: 18,
    lineHeight: 28,
  }),
}

// Floating Label Input Style
const $inputFloatingStyle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.sm, // Space for floating label
})

// Helper Text Style
const $helperStyle: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.xs,
  color: colors.textSubtle,
  fontSize: 12,
  lineHeight: 16,
})

// Modern Accessory Styles
const $rightAccessoryStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginStart: spacing.xs,
  justifyContent: "center",
  alignItems: "center",
  minHeight: 24,
})

const $leftAccessoryStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginEnd: spacing.xs,
  justifyContent: "center",
  alignItems: "center",
  minHeight: 24,
})
