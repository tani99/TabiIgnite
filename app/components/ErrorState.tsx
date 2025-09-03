import React, { useEffect, useRef } from "react"
import { Animated, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { FeedbackAnimations } from "@/utils/animations"

import { Button } from "./Button"
import { Icon, IconTypes } from "./Icon"
import { Text } from "./Text"

export interface ErrorStateProps {
  /**
   * Error title
   */
  title?: string
  /**
   * Translation key for title
   */
  titleTx?: string
  /**
   * Error message
   */
  message?: string
  /**
   * Translation key for message
   */
  messageTx?: string
  /**
   * Error code or type
   */
  errorCode?: string
  /**
   * Icon to display
   */
  icon?: IconTypes
  /**
   * Primary recovery action text
   */
  retryText?: string
  /**
   * Translation key for retry text
   */
  retryTx?: string
  /**
   * Retry callback
   */
  onRetry?: () => void
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
   * Error preset for different error types
   */
  preset?: "network" | "server" | "auth" | "validation" | "generic"
  /**
   * Whether to show the error shake animation
   */
  animated?: boolean
  /**
   * Style override
   */
  style?: ViewStyle
}

/**
 * ErrorState component for displaying friendly error messages
 * Provides clear recovery actions and helpful information
 */
export function ErrorState({
  title,
  titleTx,
  message,
  messageTx,
  errorCode,
  icon,
  retryText,
  retryTx,
  onRetry,
  secondaryText,
  secondaryTx,
  onSecondaryAction,
  preset = "generic",
  animated = true,
  style,
}: ErrorStateProps) {
  const { themed } = useAppTheme()
  const shakeAnim = useRef(new Animated.Value(0)).current

  const presetConfig = ERROR_PRESETS[preset]
  const finalIcon = icon || presetConfig.icon
  const finalTitle = title || presetConfig.title
  const finalMessage = message || presetConfig.message

  useEffect(() => {
    if (animated) {
      FeedbackAnimations.error(shakeAnim).start()
    }
  }, [animated, shakeAnim])

  return (
    <Animated.View
      style={[
        themed($container),
        animated && { transform: [{ translateX: shakeAnim }] },
        style,
      ]}
    >
      {/* Error Icon */}
      <View style={themed($iconContainer)}>
        <Icon
          icon={finalIcon}
          size="xl"
          state="inactive"
          style={themed($errorIcon)}
        />
      </View>

      {/* Error Content */}
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

        {errorCode && (
          <Text
            text={`Error Code: ${errorCode}`}
            preset="default"
            size="sm"
            style={themed($errorCode)}
          />
        )}
      </View>

      {/* Recovery Actions */}
      <View style={themed($actionsContainer)}>
        {onRetry && (
          <Button
            text={retryText || presetConfig.retryText}
            tx={retryTx}
            preset="primary"
            size="lg"
            onPress={onRetry}
            style={themed($retryButton)}
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
    </Animated.View>
  )
}

// Error State Presets
const ERROR_PRESETS = {
  network: {
    icon: "bell" as IconTypes,
    title: "Connection Problem",
    message: "Please check your internet connection and try again.",
    retryText: "Retry",
    secondaryText: "Go Offline",
  },
  server: {
    icon: "settings" as IconTypes,
    title: "Server Error",
    message: "Our servers are experiencing issues. Please try again later.",
    retryText: "Try Again",
    secondaryText: "Report Issue",
  },
  auth: {
    icon: "lock" as IconTypes,
    title: "Authentication Required",
    message: "Please sign in to access this content.",
    retryText: "Sign In",
    secondaryText: "Go Back",
  },
  validation: {
    icon: "x" as IconTypes,
    title: "Invalid Input",
    message: "Please check your input and try again.",
    retryText: "Fix Input",
    secondaryText: "Reset Form",
  },
  generic: {
    icon: "x" as IconTypes,
    title: "Something Went Wrong",
    message: "We encountered an unexpected error. Please try again.",
    retryText: "Try Again",
    secondaryText: "Go Back",
  },
} as const

// Modern Error State Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xl,
  backgroundColor: colors.errorBackground,
  borderRadius: spacing.md,
  margin: spacing.md,
})

const $iconContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: colors.error + "20", // 20% opacity
  alignItems: "center",
  justifyContent: "center",
  marginBottom: spacing.lg,
})

const $errorIcon: ThemedStyle<ViewStyle> = ({ colors }) => ({
  tintColor: colors.error,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.xl,
  maxWidth: 300,
})

const $title: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  textAlign: "center",
  color: colors.error,
  marginBottom: spacing.sm,
})

const $message: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  textAlign: "center",
  color: colors.text,
  lineHeight: 24,
  marginBottom: spacing.sm,
})

const $errorCode: ThemedStyle<ViewStyle> = ({ colors }) => ({
  textAlign: "center",
  color: colors.textSubtle,
  fontFamily: "monospace",
})

const $actionsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  gap: spacing.md,
})

const $retryButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  minWidth: 160,
})

const $secondaryButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  minWidth: 120,
})

/**
 * Pre-built error state components for common error scenarios
 */
export const ErrorStatePresets = {
  /**
   * Network connection error
   */
  NetworkError: (props: Partial<ErrorStateProps>) => (
    <ErrorState preset="network" {...props} />
  ),

  /**
   * Server error (5xx)
   */
  ServerError: (props: Partial<ErrorStateProps>) => (
    <ErrorState preset="server" {...props} />
  ),

  /**
   * Authentication error
   */
  AuthError: (props: Partial<ErrorStateProps>) => (
    <ErrorState preset="auth" {...props} />
  ),

  /**
   * Form validation error
   */
  ValidationError: (props: Partial<ErrorStateProps>) => (
    <ErrorState preset="validation" {...props} />
  ),

  /**
   * Generic error
   */
  GenericError: (props: Partial<ErrorStateProps>) => (
    <ErrorState preset="generic" {...props} />
  ),
}
