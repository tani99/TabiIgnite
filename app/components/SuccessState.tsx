import React, { useEffect, useRef } from "react"
import { Animated, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { FeedbackAnimations } from "@/utils/animations"

import { Button } from "./Button"
import { Icon, IconTypes } from "./Icon"
import { Text } from "./Text"

export interface SuccessStateProps {
  /**
   * Success title
   */
  title?: string
  /**
   * Translation key for title
   */
  titleTx?: string
  /**
   * Success message
   */
  message?: string
  /**
   * Translation key for message
   */
  messageTx?: string
  /**
   * Icon to display
   */
  icon?: IconTypes
  /**
   * Primary action text
   */
  buttonText?: string
  /**
   * Translation key for button text
   */
  buttonTx?: string
  /**
   * Primary action callback
   */
  onButtonPress?: () => void
  /**
   * Secondary action text
   */
  secondaryText?: string
  /**
   * Translation key for secondary action
   */
  secondaryTx?: string
  /**
   * Secondary action callback
   */
  onSecondaryAction?: () => void
  /**
   * Success preset for different success types
   */
  preset?: "default" | "saved" | "sent" | "completed" | "verified"
  /**
   * Whether to show the success animation
   */
  animated?: boolean
  /**
   * Auto-dismiss after timeout (in milliseconds)
   */
  autoDismiss?: number
  /**
   * Auto-dismiss callback
   */
  onAutoDismiss?: () => void
  /**
   * Style override
   */
  style?: ViewStyle
}

/**
 * SuccessState component for displaying positive feedback
 * Provides clear confirmation and next action guidance
 */
export function SuccessState({
  title,
  titleTx,
  message,
  messageTx,
  icon,
  buttonText,
  buttonTx,
  onButtonPress,
  secondaryText,
  secondaryTx,
  onSecondaryAction,
  preset = "default",
  animated = true,
  autoDismiss,
  onAutoDismiss,
  style,
}: SuccessStateProps) {
  const { themed } = useAppTheme()
  const scaleAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(1)).current

  const presetConfig = SUCCESS_PRESETS[preset]
  const finalIcon = icon || presetConfig.icon
  const finalTitle = title || presetConfig.title
  const finalMessage = message || presetConfig.message

  useEffect(() => {
    if (animated) {
      FeedbackAnimations.success(scaleAnim).start()
    }
  }, [animated, scaleAnim])

  useEffect(() => {
    if (autoDismiss && onAutoDismiss) {
      const timer = setTimeout(() => {
        // Fade out animation
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onAutoDismiss()
        })
      }, autoDismiss)

      return () => clearTimeout(timer)
    }
  }, [autoDismiss, onAutoDismiss, fadeAnim])

  return (
    <Animated.View
      style={[
        themed($container),
        {
          opacity: fadeAnim,
          transform: [{ scale: animated ? scaleAnim : 1 }],
        },
        style,
      ]}
    >
      {/* Success Icon */}
      <View style={themed($iconContainer)}>
        <Icon
          icon={finalIcon}
          size="xl"
          state="active"
          style={themed($successIcon)}
        />
      </View>

      {/* Success Content */}
      <View style={themed($contentContainer)}>
        <Text
          text={title || finalTitle}
          tx={titleTx}
          preset="heading"
          size="lg"
          weight="semiBold"
          style={themed($title)}
        />

        <Text
          text={message || finalMessage}
          tx={messageTx}
          preset="default"
          size="md"
          style={themed($message)}
        />
      </View>

      {/* Actions */}
      {(onButtonPress || onSecondaryAction) && (
        <View style={themed($actionsContainer)}>
          {onButtonPress && (
            <Button
              text={buttonText || presetConfig.buttonText}
              tx={buttonTx}
              preset="primary"
              size="lg"
              onPress={onButtonPress}
              style={themed($primaryButton)}
            />
          )}

          {onSecondaryAction && (
            <Button
              text={secondaryText || presetConfig.secondaryText}
              tx={secondaryTx}
              preset="ghost"
              size="md"
              onPress={onSecondaryAction}
              style={themed($secondaryButton)}
            />
          )}
        </View>
      )}
    </Animated.View>
  )
}

// Success State Presets
const SUCCESS_PRESETS = {
  default: {
    icon: "check" as IconTypes,
    title: "Success!",
    message: "Your action was completed successfully.",
    buttonText: "Continue",
    secondaryText: "Done",
  },
  saved: {
    icon: "check" as IconTypes,
    title: "Saved Successfully",
    message: "Your changes have been saved.",
    buttonText: "Continue Editing",
    secondaryText: "Close",
  },
  sent: {
    icon: "check" as IconTypes,
    title: "Message Sent",
    message: "Your message has been delivered successfully.",
    buttonText: "Send Another",
    secondaryText: "Back to Inbox",
  },
  completed: {
    icon: "check" as IconTypes,
    title: "Task Completed",
    message: "Great job! You've successfully completed this task.",
    buttonText: "View Results",
    secondaryText: "Next Task",
  },
  verified: {
    icon: "check" as IconTypes,
    title: "Verification Complete",
    message: "Your account has been successfully verified.",
    buttonText: "Get Started",
    secondaryText: "Learn More",
  },
} as const

// Modern Success State Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xl,
  backgroundColor: colors.successBackground,
  borderRadius: spacing.md,
  margin: spacing.md,
})

const $iconContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: colors.success + "20", // 20% opacity
  alignItems: "center",
  justifyContent: "center",
  marginBottom: spacing.lg,
})

const $successIcon: ThemedStyle<ViewStyle> = ({ colors }) => ({
  tintColor: colors.success,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.xl,
  maxWidth: 300,
})

const $title: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  textAlign: "center",
  color: colors.success,
  marginBottom: spacing.sm,
})

const $message: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  textAlign: "center",
  color: colors.text,
  lineHeight: 24,
})

const $actionsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  gap: spacing.md,
})

const $primaryButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  minWidth: 160,
})

const $secondaryButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  minWidth: 120,
})

/**
 * Pre-built success state components for common success scenarios
 */
export const SuccessStatePresets = {
  /**
   * Generic success
   */
  Success: (props: Partial<SuccessStateProps>) => (
    <SuccessState preset="default" {...props} />
  ),

  /**
   * Data saved successfully
   */
  Saved: (props: Partial<SuccessStateProps>) => (
    <SuccessState preset="saved" {...props} />
  ),

  /**
   * Message sent successfully
   */
  Sent: (props: Partial<SuccessStateProps>) => (
    <SuccessState preset="sent" {...props} />
  ),

  /**
   * Task completed
   */
  Completed: (props: Partial<SuccessStateProps>) => (
    <SuccessState preset="completed" {...props} />
  ),

  /**
   * Account verified
   */
  Verified: (props: Partial<SuccessStateProps>) => (
    <SuccessState preset="verified" {...props} />
  ),

  /**
   * Auto-dismissing toast-style success
   */
  Toast: (props: Partial<SuccessStateProps>) => (
    <SuccessState
      preset="default"
      animated={true}
      autoDismiss={3000}
      {...props}
    />
  ),
}
