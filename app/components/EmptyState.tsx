import React from "react"
import { Image, ImageStyle, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Button } from "./Button"
import { Icon, IconTypes } from "./Icon"
import { Text } from "./Text"

export interface EmptyStateProps {
  /**
   * Title for the empty state
   */
  title?: string
  /**
   * Translation key for the title
   */
  titleTx?: string
  /**
   * Description text for the empty state
   */
  description?: string
  /**
   * Translation key for the description
   */
  descriptionTx?: string
  /**
   * Icon to display
   */
  icon?: IconTypes
  /**
   * Custom image to display instead of icon
   */
  image?: any
  /**
   * Primary action button text
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
   * Secondary action button text
   */
  secondaryButtonText?: string
  /**
   * Translation key for secondary button
   */
  secondaryButtonTx?: string
  /**
   * Secondary action callback
   */
  onSecondaryButtonPress?: () => void
  /**
   * Preset style for different contexts
   */
  preset?: "default" | "search" | "error" | "offline" | "maintenance"
  /**
   * Style override for the container
   */
  style?: ViewStyle
}

/**
 * EmptyState component for displaying helpful empty states
 * Provides engaging feedback when content is not available
 */
export function EmptyState({
  title,
  titleTx,
  description,
  descriptionTx,
  icon,
  image,
  buttonText,
  buttonTx,
  onButtonPress,
  secondaryButtonText,
  secondaryButtonTx,
  onSecondaryButtonPress,
  preset = "default",
  style,
}: EmptyStateProps) {
  const { themed } = useAppTheme()

  const presetConfig = EMPTY_STATE_PRESETS[preset]
  const finalIcon = icon || presetConfig.icon
  const finalTitle = title || titleTx || presetConfig.title
  const finalDescription = description || descriptionTx || presetConfig.description

  return (
    <View style={[themed($container), style]}>
      {/* Illustration */}
      <View style={themed($illustrationContainer)}>
        {image ? (
          <Image source={image} style={themed($image)} resizeMode="contain" />
        ) : finalIcon ? (
          <View style={themed($iconContainer)}>
            <Icon 
              icon={finalIcon} 
              size="xl" 
              state={presetConfig.iconState}

            />
          </View>
        ) : null}
      </View>

      {/* Content */}
      <View style={themed($contentContainer)}>
        {finalTitle && (
          <Text
            text={title || presetConfig.title}
            preset="heading"
            size="lg"
            weight="semiBold"
            style={[themed($title), { textAlign: "center" }]}
          />
        )}

        {finalDescription && (
          <Text
            text={description || presetConfig.description}
            preset="default"
            size="md"
            style={[themed($description), { textAlign: "center", lineHeight: 24 }]}
          />
        )}
      </View>

      {/* Actions */}
      {(onButtonPress || onSecondaryButtonPress) && (
        <View style={themed($actionsContainer)}>
          {onButtonPress && (
            <Button
              text={buttonText || presetConfig.buttonText}
              preset="primary"
              size="lg"
              onPress={onButtonPress}
              style={themed($primaryButton)}
            />
          )}

          {onSecondaryButtonPress && (
            <Button
              text={secondaryButtonText || presetConfig.secondaryButtonText || "Secondary"}
              preset="secondary"
              size="md"
              onPress={onSecondaryButtonPress}
              style={themed($secondaryButton)}
            />
          )}
        </View>
      )}
    </View>
  )
}

// Empty State Presets for different contexts
const EMPTY_STATE_PRESETS = {
  default: {
    icon: "components" as IconTypes,
    iconState: "inactive" as const,
    title: "Nothing here yet",
    description: "Content will appear here when available",
    buttonText: "Refresh",
    secondaryButtonText: "Go Back",
  },
  search: {
    icon: "view" as IconTypes,
    iconState: "inactive" as const,
    title: "No results found",
    description: "Try adjusting your search terms or filters",
    buttonText: "Clear Search",
    secondaryButtonText: "Browse All",
  },
  error: {
    icon: "x" as IconTypes,
    iconState: "inactive" as const,
    title: "Something went wrong",
    description: "We encountered an error while loading this content",
    buttonText: "Try Again",
    secondaryButtonText: "Go Back",
  },
  offline: {
    icon: "bell" as IconTypes,
    iconState: "inactive" as const,
    title: "You're offline",
    description: "Check your internet connection and try again",
    buttonText: "Retry",
    secondaryButtonText: "Go Back",
  },
  maintenance: {
    icon: "settings" as IconTypes,
    iconState: "inactive" as const,
    title: "Under maintenance",
    description: "We're making improvements. Please check back later",
    buttonText: "Check Status",
    secondaryButtonText: "Go Back",
  },
} as const

// Modern Empty State Styles
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xxxl,
})

const $illustrationContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
  alignItems: "center",
})

const $iconContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: colors.backgroundSecondary,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: spacing.md,
})



const $image: ThemedStyle<ImageStyle> = () => ({
  width: 120,
  height: 120,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.xl,
  maxWidth: 300,
})

const $title: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $description: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $actionsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  gap: spacing.md,
})

const $primaryButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  minWidth: 160,
  marginBottom: spacing.xs,
})

const $secondaryButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  minWidth: 140,
})

/**
 * Pre-built empty state components for common scenarios
 */
export const EmptyStatePresets = {
  /**
   * No search results
   */
  NoSearchResults: (props: Partial<EmptyStateProps>) => (
    <EmptyState preset="search" {...props} />
  ),

  /**
   * Network error
   */
  NetworkError: (props: Partial<EmptyStateProps>) => (
    <EmptyState preset="error" {...props} />
  ),

  /**
   * Offline state
   */
  Offline: (props: Partial<EmptyStateProps>) => (
    <EmptyState preset="offline" {...props} />
  ),

  /**
   * Maintenance mode
   */
  Maintenance: (props: Partial<EmptyStateProps>) => (
    <EmptyState preset="maintenance" {...props} />
  ),

  /**
   * Generic empty content
   */
  EmptyContent: (props: Partial<EmptyStateProps>) => (
    <EmptyState preset="default" {...props} />
  ),
}